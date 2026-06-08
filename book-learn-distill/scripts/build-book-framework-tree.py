#!/usr/bin/env python3
"""Extract §-level TOC from book raw md → framework tree JSON."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

CHAPTER_TITLES = {
    "1": "什么是产品经理",
    "2": "企业、用户、产品",
    "3": "交易",
    "4": "决策",
    "5": "产品经理的选拔与成长",
}

CHAPTER_SUMMARIES = {
    "1": "定义互联网 PM、历史演变，以及用户模型与交易模型两条能力线。",
    "2": "企业—用户—产品价值交换；用户/产品/企业/组织/制度的全景理解。",
    "3": "经济学基础：效用、边际、成本、供需、相对价格；交易与交易成本。",
    "4": "理性决策三要素、常见误区、落地与出行等权衡案例。",
    "5": "PM 选拔标准、培养路径、认知迭代与团队建设。",
}


def parse_sections(text: str) -> list[dict]:
    lines = text.splitlines()
    sections: list[dict] = []
    i = 0
    sec_num_re = re.compile(r"^(\d+)\.(\d+)(?:\.(\d+))?\s*$")
    chap_re = re.compile(r"^?(\d+)\.\s+(.+)$")

    while i < len(lines):
        line = lines[i].strip()
        i += 1
        m = sec_num_re.match(line)
        if m:
            ch, sec, sub = m.group(1), m.group(2), m.group(3)
            ref = f"§{ch}.{sec}" + (f".{sub}" if sub else "")
            title_parts = []
            while i < len(lines):
                nxt = lines[i].strip()
                if not nxt or nxt.startswith(""):
                    i += 1
                    continue
                if sec_num_re.match(nxt) or chap_re.match(nxt):
                    break
                if re.match(r"^\d{3}$", nxt):
                    i += 1
                    break
                if len(nxt) < 80 and not re.match(r"^[0-9.]+\s*$", nxt):
                    title_parts.append(nxt)
                i += 1
                if len(title_parts) >= 2:
                    break
            title = " ".join(title_parts[:1]) or ref
            title = re.sub(r"\s+", " ", title)
            if len(title) > 60:
                title = title[:57] + "…"
            sections.append({"ref": ref, "ch": ch, "title": title})
            continue
    return sections


def build_tree(sections: list[dict]) -> list[dict]:
    chapters: dict[str, dict] = {}
    for s in sections:
        ch = s["ch"]
        if ch not in chapters:
            chapters[ch] = {
                "label": f"第{ch}章 {CHAPTER_TITLES.get(ch, '')}",
                "sectionRef": f"§{ch}",
                "summary": CHAPTER_SUMMARIES.get(ch, ""),
                "bookSearchTerms": [CHAPTER_TITLES.get(ch, "")],
                "children": [],
            }
        parts = s["ref"].replace("§", "").split(".")
        if len(parts) == 2:
            chapters[ch]["children"].append(
                {
                    "label": f"{s['ref']} {s['title']}",
                    "sectionRef": s["ref"],
                    "summary": "",
                    "bookSearchTerms": [s["title"][:20]],
                    "children": [],
                }
            )
        elif len(parts) == 3:
            sec_key = f"{parts[0]}.{parts[1]}"
            parent = None
            for c in chapters[ch]["children"]:
                if c.get("sectionRef", "").startswith(f"§{sec_key}"):
                    parent = c
                    break
            if parent is None:
                parent = {
                    "label": f"§{sec_key}",
                    "sectionRef": f"§{sec_key}",
                    "children": [],
                }
                chapters[ch]["children"].append(parent)
            parent.setdefault("children", []).append(
                {
                    "label": f"{s['ref']} {s['title']}",
                    "sectionRef": s["ref"],
                    "bookSearchTerms": [s["title"][:24]],
                }
            )

    return [
        {
            "label": "俞军产品方法论",
            "summary": "全书结构：PM 定义 → 企业/用户/产品 → 交易经济学 → 决策 → 选拔成长。",
            "children": [chapters[k] for k in sorted(chapters.keys(), key=int)],
        }
    ]


def main() -> int:
    if len(sys.argv) < 3:
        print("usage: build-book-framework-tree.py <raw.md> <out.json>", file=sys.stderr)
        return 1
    src = Path(sys.argv[1])
    out = Path(sys.argv[2])
    text = src.read_text(encoding="utf-8")
    sections = parse_sections(text)
    tree = build_tree(sections)
    out.write_text(
        json.dumps({"sections": len(sections), "frameworkTree": tree}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Wrote {out} ({len(sections)} sections, {len(tree[0]['children'])} chapters)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
