#!/usr/bin/env python3
"""Wash epub/mobi markdown: drop TOC/copyright/calibre tags, normalize 第N章."""

from __future__ import annotations

import re
import sys
from pathlib import Path

HEADING_RE = re.compile(r"^(#{1,3})\s+(.+)$")
CN_CHAP_RE = re.compile(r"^第\s*([0-9]+|[一二三四五六七八九十]+)\s*章")

JUNK_EXACT = {
    "版权信息",
    "版权页",
    "目录",
    "目录 CONTENTS",
    "各方赞誉",
    "内容简介",
    "作者简介",
    "致谢",
    "关于作者",
    "重要词汇",
    "延伸阅读",
    "译者跋",
    "译者后记",
    "译者手记",
    "出版后记",
    "术语表",
    "参考文献",
    "麦克卢汉著作一览",
    "关键词",
    "注释",
}

JUNK_PREFIX = ("献词", "目录")

CN_NUM = {}
_digits = "一二三四五六七八九"
for i, c in enumerate(_digits, 1):
    CN_NUM[c] = str(i)
CN_NUM["十"] = "10"
for i, c in enumerate(_digits, 1):
    CN_NUM["十" + c] = str(10 + i)
CN_NUM["二十"] = "20"
for i, c in enumerate(_digits, 1):
    CN_NUM["二十" + c] = str(20 + i)
CN_NUM["三十"] = "30"
for i, c in enumerate(_digits[:3], 1):
    CN_NUM["三十" + c] = str(30 + i)


def cn_to_arabic(token: str) -> str:
    if token.isdigit():
        return token
    return CN_NUM.get(token, token)


def is_junk_title(title: str) -> bool:
    t = title.strip()
    if t in JUNK_EXACT:
        return True
    return any(t.startswith(p) for p in JUNK_PREFIX)


def is_book_title(title: str) -> bool:
    if CN_CHAP_RE.match(title):
        return False
    if title.startswith(("前言", "序", "导读", "引言", "附录", "中文版序", "译者", "理解麦克卢汉", "增订评注", "作者第")):
        return False
    if title.startswith("致") and "读者" in title:
        return False
    return True


def normalize_chap_heading(hashes: str, title: str) -> str:
    m = CN_CHAP_RE.match(title)
    if not m:
        return f"{hashes} {title}"
    n = cn_to_arabic(m.group(1))
    rest = title[m.end() :].strip()
    return f"{hashes} 第{n}章 {rest}".rstrip()


def strip_inline_junk(text: str) -> str:
    text = re.sub(r"\[([^\]]*)\]\(#part[^)]+\)", r"\1", text)
    text = re.sub(r"\[\^?\[[^\]]*\]\^?\]\([^)]+\)", "", text)
    text = re.sub(r"\[\]\([^)]+\)", "", text)
    text = re.sub(r"\{#part[^}]+\}", "", text)
    text = re.sub(r"\(#part[^)]+\)", "", text)
    return text


def wash(text: str) -> str:
    text = strip_inline_junk(text)
    lines = text.splitlines()
    out: list[str] = []
    skip_until_level: int | None = None
    for line in lines:
        stripped = line.strip()
        if skip_until_level is not None:
            hm = HEADING_RE.match(stripped)
            if hm and len(hm.group(1)) <= skip_until_level:
                skip_until_level = None
            else:
                continue
        if stripped.startswith(":::") or stripped == ":::":
            continue
        if stripped.startswith("▲"):
            continue
        hm = HEADING_RE.match(stripped)
        if hm:
            hashes, title = hm.group(1), hm.group(2).strip()
            level = len(hashes)
            # 书名 / 第×部分：只丢标题行，绝不能连后面的章一起吞掉
            if re.match(r"^第.+(部分|部)\b", title) or (level == 1 and is_book_title(title)):
                continue
            if is_junk_title(title):
                skip_until_level = level
                continue
            out.append(normalize_chap_heading(hashes, title))
            continue
        out.append(line)
    cleaned = "\n".join(out)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned.strip() + "\n"


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: wash-book-raw.py <raw.md> [raw.md...]", file=sys.stderr)
        return 1
    for arg in sys.argv[1:]:
        path = Path(arg)
        raw = path.read_text(encoding="utf-8")
        new = wash(raw)
        if len(raw) > 20000 and len(new) < max(2000, len(raw) // 5):
            print(
                f"REFUSE {path.name}: {len(raw)} -> {len(new)} (would wipe body)",
                file=sys.stderr,
            )
            return 2
        path.write_text(new, encoding="utf-8")
        print(f"washed {path.name} {len(raw)} -> {len(new)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
