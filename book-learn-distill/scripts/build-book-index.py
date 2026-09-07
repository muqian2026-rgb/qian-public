#!/usr/bin/env python3
"""Chunk book raw markdown into book-index.json for in-browser search."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


def repo_root() -> Path:
    return Path(__file__).resolve().parents[3]


def clean_text(s: str) -> str:
    s = re.sub(r"\f", "\n", s)
    s = re.sub(r"[ \t]+\n", "\n", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()


CHAP_LINE_RE = re.compile(r"^(?:\f)?([1-5])\.\s+(.+)$")
SEC_NUM_ONLY_RE = re.compile(r"^([1-5]\.[0-9]+(?:\.[0-9]+)?)\s*$")
SEC_TITLE_SAME_LINE_RE = re.compile(r"^([1-5]\.[0-9]+(?:\.[0-9]+)?)\s+(.+)$")
PAGE_NUM_RE = re.compile(r"^\d{1,3}$")
CJK_RE = re.compile(r"[\u4e00-\u9fff]")
MD_HEADING_RE = re.compile(r"^(#{1,3})\s+(.+)$")
CN_CHAP_RE = re.compile(r"^第\s*([0-9]+|[一二三四五六七八九十]+)\s*章")
CN_PART_RE = re.compile(r"^第\s*[0-9一二三四五六七八九十]+\s*部(分)?$")
JUNK_CHAP_RE = re.compile(
    r"^(版权信息|版权页|目录|各方赞誉|内容简介|作者简介|致谢|关于作者|"
    r"重要词汇|延伸阅读|译者跋|译者后记|译者手记|出版后记|术语表|"
    r"参考文献|麦克卢汉著作一览|关键词|注释|前言与推荐)"
)
CN_NUM: dict[str, str] = {}
_digits = "一二三四五六七八九"
for _i, _c in enumerate(_digits, 1):
    CN_NUM[_c] = str(_i)
CN_NUM["十"] = "10"
for _i, _c in enumerate(_digits, 1):
    CN_NUM["十" + _c] = str(10 + _i)
CN_NUM["二十"] = "20"
for _i, _c in enumerate(_digits, 1):
    CN_NUM["二十" + _c] = str(20 + _i)
CN_NUM["三十"] = "30"
for _i, _c in enumerate(_digits[:3], 1):
    CN_NUM["三十" + _c] = str(30 + _i)


def _cn_to_arabic(token: str) -> str:
    if token.isdigit():
        return token
    return CN_NUM.get(token, token)


def _next_nonempty(lines: list[str], start: int) -> int:
    j = start + 1
    while j < len(lines) and not lines[j].strip():
        j += 1
    return j


def _is_toc_section(lines: list[str], idx: int) -> bool:
    """TOC: section number -> title -> page number (003). Body: title -> paragraph."""
    j = _next_nonempty(lines, idx)
    if j >= len(lines):
        return True
    title = lines[j].strip()
    if not title or PAGE_NUM_RE.match(title) or SEC_NUM_ONLY_RE.match(title):
        return True
    if not CJK_RE.search(title):
        return True
    k = _next_nonempty(lines, j)
    if k < len(lines) and PAGE_NUM_RE.match(lines[k].strip()):
        return True
    return False


def _is_ordered_list_line(lines: list[str], idx: int) -> bool:
    """正文编号列表（如「1. 自省」）勿当作章标题。"""
    stripped = lines[idx].strip()
    if not re.match(r"^\d+\.\s+", stripped):
        return False
    j = idx - 1
    while j >= 0 and not lines[j].strip():
        j -= 1
    if j < 0:
        return False
    prev = lines[j].strip()
    if prev.endswith("：") or prev.endswith("；"):
        return True
    if re.match(r"^\d+\.\s+", prev):
        return True
    return False


def _parse_cn_chapter_heading(stripped: str) -> tuple[str, str, str] | None:
    """Recognize markdown 第N章 / 引言 / 前言 / 导读 / 附录 / 序. Skip 第X部分."""
    m = MD_HEADING_RE.match(stripped)
    if not m:
        return None
    title = m.group(2).strip()
    if JUNK_CHAP_RE.match(title) or title.startswith("献词"):
        return None
    if CN_PART_RE.match(title):
        return None
    if title.startswith("引言"):
        return "§0", "0", title
    if title.startswith("导读"):
        return "§G", "G", title
    if title.startswith("附录"):
        extra = ""
        if title.startswith("附录一") or title.startswith("附录 一"):
            extra = "1"
        elif title.startswith("附录二") or title.startswith("附录 二"):
            extra = "2"
        return f"§A{extra}", f"A{extra}", title
    preface = (
        title.startswith("前言")
        or title.startswith("序言")
        or title in {"序"}
        or title.startswith("中文版序")
        or title.startswith("译者序")
        or title.startswith("第八版译者序")
        or title.startswith("第七版译者序")
        or title.startswith("增订评注")
        or title.startswith("理解麦克卢汉")
        or title.startswith("作者第一版序")
        or title.startswith("作者第二版序")
        or (title.startswith("致") and "读者" in title)
    )
    if preface:
        if title.startswith("前言") or title.startswith("序言") or title == "序":
            return "§P", "P", title
        slug = re.sub(r"[^\w\u4e00-\u9fff]+", "", title)[:12] or "front"
        return f"§P-{slug}", f"P-{slug}", title
    cm = CN_CHAP_RE.match(title)
    if not cm:
        return None
    n = _cn_to_arabic(cm.group(1))
    rest = title[cm.end() :].strip()
    return f"§{n}", n, f"第{n}章 {rest}".rstrip()


def _parse_section_header(lines: list[str], idx: int) -> tuple[str, str] | None:
    stripped = lines[idx].strip()
    m_same = SEC_TITLE_SAME_LINE_RE.match(stripped)
    if m_same and len(stripped) < 80:
        num = m_same.group(1)
        title = m_same.group(2).strip()
        return f"§{num}", f"§{num} {title}"

    m_num = SEC_NUM_ONLY_RE.match(stripped)
    if not m_num:
        return None
    num = m_num.group(1)
    if _is_toc_section(lines, idx):
        return None
    j = _next_nonempty(lines, idx)
    title = ""
    if j < len(lines):
        t = lines[j].strip()
        if t and CJK_RE.search(t) and len(t) < 80 and not PAGE_NUM_RE.match(t):
            title = t
    label = f"§{num} {title}".strip() if title else f"§{num}"
    return f"§{num}", label


def split_chunks(text: str, max_len: int = 1800) -> list[dict]:
    lines = text.splitlines()
    chunks: list[dict] = []
    current_title = ""
    current_section_ref = ""
    current_chapter_num = ""
    current_lines: list[str] = []
    in_body = False
    cn_markdown_mode = False

    def emit(title: str, body: str, part: int | None = None) -> None:
        if not title:
            return
        label = f"{title} ({part})" if part else title
        chunks.append(
            {
                "chapter": label,
                "sectionRef": current_section_ref,
                "chapterNum": current_chapter_num,
                "text": body,
            }
        )

    def flush():
        nonlocal current_lines, current_title
        body = clean_text("\n".join(current_lines))
        if not current_title or len(body) < 80:
            current_lines = []
            return
        if len(body) <= max_len:
            emit(current_title, body)
        else:
            paras = [p.strip() for p in body.split("\n\n") if p.strip()]
            buf: list[str] = []
            part = 1
            for p in paras:
                if sum(len(x) for x in buf) + len(p) > max_len and buf:
                    emit(current_title, "\n\n".join(buf), part)
                    buf = [p]
                    part += 1
                else:
                    buf.append(p)
            if buf:
                emit(current_title, "\n\n".join(buf), part)
        current_lines = []

    def set_section(ref: str, title: str) -> None:
        nonlocal current_section_ref, current_chapter_num, current_title
        current_section_ref = ref
        current_chapter_num = ref.replace("§", "").split(".")[0]
        current_title = title

    for i, line in enumerate(lines):
        stripped = line.strip()

        m_chap = CHAP_LINE_RE.match(stripped)
        if m_chap and not cn_markdown_mode:
            chap_num = m_chap.group(1)
            # PDF 页眉/页脚会重复出现「5. 第×章标题」，勿当作新章切开
            if in_body and current_chapter_num == chap_num:
                current_lines.append(line)
                continue
            # 正文列表项「1. 自省」等勿误切章
            if in_body and _is_ordered_list_line(lines, i):
                current_lines.append(line)
                continue
            flush()
            in_body = True
            current_chapter_num = chap_num
            current_section_ref = f"§{chap_num}"
            current_title = f"第{chap_num}章 {m_chap.group(2).strip()}"
            current_lines.append(line)
            continue

        cn = _parse_cn_chapter_heading(stripped)
        if cn:
            ref, num, title = cn
            if in_body and current_chapter_num == num:
                current_lines.append(line)
                continue
            flush()
            in_body = True
            cn_markdown_mode = True
            current_chapter_num = num
            current_section_ref = ref
            current_title = title
            current_lines.append(line)
            continue

        # 中文章标题模式下，正文「1.1 小节」不当新章名（否则 E 区会变成 §1.4）
        if in_body and not cn_markdown_mode:
            parsed = _parse_section_header(lines, i)
            if parsed:
                flush()
                set_section(parsed[0], parsed[1])
                current_lines.append(line)
                continue

        current_lines.append(line)
    flush()
    return chunks


def tokenize(s: str) -> set[str]:
    s = s.lower()
    tokens = set(re.findall(r"[\u4e00-\u9fff]{2,}|[a-z0-9]{2,}", s))
    return tokens


def main() -> int:
    if len(sys.argv) < 3:
        print("usage: build-book-index.py <raw.md> <out.json>", file=sys.stderr)
        return 1
    src = Path(sys.argv[1]).resolve()
    out = Path(sys.argv[2]).resolve()
    text = src.read_text(encoding="utf-8")
    # skip yaml header comments at top
    if text.startswith("# "):
        text = re.sub(r"^<!--.*?-->\s*", "", text, flags=re.S)
    raw_chunks = split_chunks(text)
    index = []
    for i, c in enumerate(raw_chunks):
        index.append(
            {
                "id": f"c{i:04d}",
                "chapter": c["chapter"],
                "sectionRef": c.get("sectionRef", ""),
                "chapterNum": c.get("chapterNum", ""),
                "text": c["text"][:12000],
                "tokens": list(tokenize(c["chapter"] + " " + c["text"]))[:200],
            }
        )
    meta = {
        "source": str(src),
        "chunkCount": len(index),
        "searchHint": "输入关键词检索全书段落；结果可展开阅读原文。",
    }
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(
        json.dumps({"meta": meta, "chunks": index}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Wrote {out} ({len(index)} chunks)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
