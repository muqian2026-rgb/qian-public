#!/usr/bin/env python3
"""阶段 3 后的机械修正：把并行任务写歪的标题层级和段名扳回来。

并行写章一定会出现三类偏差，每一类都是机械可修的，不需要重写内容：

1. 整章层级下移——段名写成 `###`，子节写成 `####`（首版 4 章如此）
2. 段名夹带写作指令——「理论应对（沿原书小节完整展开）」「主要问题 list」
3. 层级跳级——`## 代表人物` 下面直接跟 `#### 人名`

修法：先把段名还原成 chapterSections 里的写法，再按标题的**嵌套深度**重排层级
（用栈算深度，天然消除跳级，也保住同级兄弟仍然同级）。
另外把指向章节文件的相对链接补上 `章节/` 前缀。

默认只报不改，确认无误再加 --write。

用法：
    python3 normalize-headings.py <简读版目录> [--write]
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

HEADING = re.compile(r"^(#{1,6})\s+(.+?)\s*$", re.M)
# 段名后面括号里的写作指令，以及「list」这类抄自配置的残留
NOISE = re.compile(r"\s*（[^）]*(展开|顺序|原书|保留|不少于)[^）]*）\s*|\s*\blist\b\s*", re.I)
ORDINAL = re.compile(r"^[一二三四五六七八九十]+、\s*|^\d+[.、]\s*")
MD_LINK = re.compile(r"(\]\()([^)#][^)]*\.md)(\))")


def canonical(title: str, sections: list[str]) -> str:
    stripped = NOISE.sub("", title).strip()
    return stripped if stripped in sections else title


def relevel(
    lines: list[str], sections: list[str], positional: list[str] | None = None
) -> tuple[list[str], list[str]]:
    """按嵌套深度重排标题层级，同时还原段名。

    positional 用于导航页：这类页面段数固定、顺序固定，但各篇的写法会飘
    （「关键问题」/「本时代关键问题」、「三、理论应对与接续」/「理论应对的接续」），
    彼此既非子串也无共同词根，只能按位置对齐。调用方须先确认段数一致。
    """
    out: list[str] = []
    notes: list[str] = []
    stack: list[int] = []
    seen_h2 = 0
    for line in lines:
        match = HEADING.match(line)
        if not match:
            out.append(line)
            continue
        level, title = len(match.group(1)), match.group(2)
        while stack and stack[-1] >= level:
            stack.pop()
        stack.append(level)
        depth = len(stack)

        fixed = canonical(NOISE.sub("", title).strip() or title, sections)
        if positional and depth == 2:
            fixed = positional[seen_h2]
            seen_h2 += 1

        if depth != level or fixed != title:
            notes.append(f"h{level}「{title}」→ h{depth}「{fixed}」")
        out.append(f"{'#' * depth} {fixed}")
    return out, notes


def group_nav_pages(config: dict) -> set[str]:
    """只有「带章节的分组」的导航页才受 guideSections 约束。

    导读和全书总结也是 guides，但它们收的是全书、各有各的结构，
    拿分组导航的段名去套会把它们改坏。
    """
    return {
        name
        for group in config.get("groups", [])
        if group.get("chapters")
        for name in group.get("guides", [])
    }


def fix_links(text: str, root: Path, path: Path) -> tuple[str, list[str]]:
    notes: list[str] = []

    def replace(match: re.Match[str]) -> str:
        target = match.group(2)
        if (path.parent / target).exists():
            return match.group(0)
        found = next((c for c in root.rglob(Path(target).name) if c.is_file()), None)
        if not found:
            return match.group(0)
        fixed = "./" + found.relative_to(path.parent).as_posix()
        notes.append(f"{target} → {fixed}")
        return f"{match.group(1)}{fixed}{match.group(3)}"

    return MD_LINK.sub(replace, text), notes


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("root", type=Path)
    parser.add_argument("--write", action="store_true", help="真的写回文件")
    args = parser.parse_args()
    root = args.root.resolve()

    config = json.loads((root / "abridged.json").read_text(encoding="utf-8"))
    sections = config.get("chapterSections")
    if not sections:
        raise SystemExit("abridged.json 缺少 chapterSections，先定本书的骨架")
    guide_sections = config.get("guideSections") or []
    nav_pages = group_nav_pages(config)

    touched = 0
    blocked: list[str] = []
    for path in sorted((root / "章节").glob("*.md")) + sorted(root.glob("[0-9]*.md")):
        original = path.read_text(encoding="utf-8")
        is_chapter = path.parent.name == "章节"
        is_nav = path.name in nav_pages and bool(guide_sections)

        positional = None
        if is_nav:
            current = [t for h, t in HEADING.findall(original) if len(h) == 2]
            if len(current) == len(guide_sections):
                positional = guide_sections
            elif current != guide_sections:
                blocked.append(
                    f"{path.name}：{len(current)} 段，guideSections 是 "
                    f"{len(guide_sections)} 段，段数对不上不能按位置改"
                )
                continue

        lines, notes = relevel(
            original.splitlines(), sections if is_chapter else [], positional
        )
        text = "\n".join(lines).rstrip() + "\n"
        text, link_notes = fix_links(text, root, path)
        notes += link_notes
        if not notes:
            continue

        if is_chapter:
            h2 = [t for h, t in HEADING.findall(text) if len(h) == 2]
            if h2 != sections:
                blocked.append(f"{path.name}：修完仍是 {h2}，需要人工看内容")
                continue

        touched += 1
        print(f"\n{path.name}")
        for note in notes:
            print(f"  {note}")
        if args.write:
            path.write_text(text, encoding="utf-8")

    for item in blocked:
        print(f"\n[跳过] {item}")

    if not touched and not blocked:
        print("没有需要修正的标题或链接")
    elif not args.write:
        print(f"\n以上为预演，{touched} 个文件待修。确认后加 --write 执行")
    else:
        print(f"\n已修正 {touched} 个文件")


if __name__ == "__main__":
    main()
