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


def split_chunks(text: str, max_len: int = 1800) -> list[dict]:
    lines = text.splitlines()
    chunks: list[dict] = []
    current_title = "前言与推荐"
    current_section_ref = ""
    current_chapter_num = ""
    current_lines: list[str] = []
    chap_re = re.compile(
        r"^(?:\f)?([0-9]+)\.\s*(.+)$|^(?:\f)?([0-9]+\.[0-9]+(?:\.[0-9]+)?)\s*$"
    )
    sec_title_re = re.compile(r"^([0-9]+\.[0-9]+(?:\.[0-9]+)?)\s+(.+)$")

    def emit(title: str, body: str, part: int | None = None) -> None:
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
        if len(body) < 80:
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

    for line in lines:
        m = chap_re.match(line.strip())
        if m:
            flush()
            if m.group(1):
                current_chapter_num = m.group(1)
                current_section_ref = f"§{m.group(1)}"
                current_title = f"第{m.group(1)}章 {m.group(2).strip()}"
            else:
                current_section_ref = f"§{m.group(3)}"
                if not current_chapter_num:
                    current_chapter_num = m.group(3).split(".")[0]
                current_title = current_section_ref
            current_lines.append(line)
            continue
        m2 = sec_title_re.match(line.strip())
        if m2 and len(line.strip()) < 80:
            flush()
            current_section_ref = f"§{m2.group(1)}"
            current_chapter_num = m2.group(1).split(".")[0]
            current_title = f"§{m2.group(1)} {m2.group(2).strip()}"
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
