#!/usr/bin/env python3
"""阶段 2：把原文机械拆成逐章文件，供后续逐章压缩。

不做任何改写，只按章标题切分。拆分是后面所有并行任务的前提：
一次性把整本书丢给单个任务会静默失败。

用法：
    python3 split-chapters.py <原文.md> <输出目录> [--pattern ...] [--expect N]

默认识别 `## 第N章 标题`，两个捕获组：章号、章名。
文集类的书（毛选、论文集、随笔集）篇名没有编号，用**单捕获组**的正则即可，
脚本按出现顺序自动编号：

    --pattern '^#\\s+(.+)$'
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path

CN_NUMBERS = {
    "一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8,
    "九": 9, "十": 10, "十一": 11, "十二": 12, "十三": 13, "十四": 14,
    "十五": 15, "十六": 16, "十七": 17, "十八": 18, "十九": 19, "二十": 20,
    "二十一": 21, "二十二": 22, "二十三": 23, "二十四": 24, "二十五": 25,
}


def chapter_number(raw: str) -> int:
    return int(raw) if raw.isdigit() else CN_NUMBERS[raw]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("outdir", type=Path)
    parser.add_argument("--pattern", default=r"^##\s+第([0-9一二三四五六七八九十]+)章\s+(.+?)\s*$")
    parser.add_argument("--expect", type=int, default=0, help="预期章数，用于卡住漏切")
    args = parser.parse_args()

    heading = re.compile(args.pattern)
    chapters: list[tuple[int, str, list[str]]] = []
    current: tuple[int, str, list[str]] | None = None

    numbered = heading.groups >= 2
    for line in args.source.read_text(encoding="utf-8").splitlines():
        match = heading.match(line)
        if match:
            # 单捕获组 = 篇名无编号（文集），按出现顺序编号
            number = chapter_number(match.group(1)) if numbered else len(chapters) + 1
            title = match.group(2 if numbered else 1).strip()
            current = (number, title, [line])
            chapters.append(current)
        elif current is not None:
            current[2].append(line)

    if not chapters:
        raise SystemExit("没有匹配到任何章标题，先用 rg 确认原文的章标题层级再调 --pattern")
    if args.expect and len(chapters) != args.expect:
        raise SystemExit(f"预期 {args.expect} 章，实际切出 {len(chapters)} 章")

    args.outdir.mkdir(parents=True, exist_ok=True)
    width = max(2, len(str(max(n for n, _, _ in chapters))))
    for number, title, lines in chapters:
        # 文件名前缀要等宽，否则 sorted() 会把第 10 篇排到第 2 篇前面
        safe = title.replace("/", "／")
        path = args.outdir / f"{number:0{width}d}-{safe}.md"
        path.write_text("\n".join(lines).strip() + "\n", encoding="utf-8")
        print(f"{path.name}\t{path.stat().st_size} bytes")

    print(f"\n共 {len(chapters)} 章 → {args.outdir}")


if __name__ == "__main__":
    main()
