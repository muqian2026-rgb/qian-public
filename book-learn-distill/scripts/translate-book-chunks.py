#!/usr/bin/env python3
"""Build book-translation.json: chapter summaries + per-chunk zh (rule-based v1)."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

CHAPTER_ZH = {
    "1": {
        "title": "第1章 化石记录的本质",
        "summary": "化石主要保存在沉积岩中；沉积出露面积与可见物种数相关。埋藏学决定保存偏差，古生物学须在「记录不完整」前提下做严谨推断，既不能当面值也不能全盘否定化石记录。",
    },
    "2": {
        "title": "第2章 生长与形态",
        "summary": "古生物数据的核心是标本形态：大小、形状、以及大小–形状关系（异速生长）。功能随体型缩放，系统学、地层与多样性研究都依赖一致的测量定义。",
    },
    "3": {
        "title": "第3章 种群与物种",
        "summary": "种内变异是生物学中心事实；地理结构与 metapopulation 影响演化与灭绝模式。物种概念连接微观观察与宏观推断。",
    },
    "4": {
        "title": "第4章 系统学",
        "summary": "系统学研究多样性与类群关系；分类学负责描述与命名（如动物的 ICZN）。演化比较必须在谱系框架下进行。",
    },
    "5": {
        "title": "第5章 演化形态学",
        "summary": "区分适应作为状态（形态–环境匹配）与作为过程（如何产生适应）。多样性可理解为「为何有这么多/这么少类群」。",
    },
    "6": {
        "title": "第6章 生物地层学",
        "summary": "用化石对比远隔地区的相对年代；化石带与区域差异可反映起源、灭绝与古地理事件。",
    },
    "7": {
        "title": "第7章 演化速率与趋势",
        "summary": "许多物种在长时间内形态变化有限；须在谱系结构下检验渐变、停滞与宏观「趋势」。",
    },
    "8": {
        "title": "第8章 全球多样性与灭绝",
        "summary": "编录与统计推动全球多样性研究；除分类学丰富度外，形态多样性是重要测度。大灭绝的解释需考虑选择性及采样偏差。",
    },
    "9": {
        "title": "第9章 古生态与古生物地理",
        "summary": "古生态研究古代生物与古环境、古群落；代理数据与区域趋势是重建深时环境的关键。",
    },
    "10": {
        "title": "第10章 多学科案例",
        "summary": "古生物是整合科学；寒武纪大爆发等案例展示如何联合证据回答生命史问题。",
    },
}


def chapter_num_from_chunk(c: dict) -> str:
    cn = (c.get("chapterNum") or "").strip()
    if cn:
        return cn.split(".")[0]
    ref = c.get("sectionRef") or ""
    m = re.match(r"§(\d+)", ref)
    return m.group(1) if m else ""


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: translate-book-chunks.py <learn-dir>", file=sys.stderr)
        return 1
    learn = Path(sys.argv[1]).resolve()
    index_path = learn / "book-index.json"
    out_path = learn / "book-translation.json"
    if not index_path.is_file():
        print("missing book-index.json", file=sys.stderr)
        return 1
    book = json.loads(index_path.read_text(encoding="utf-8"))
    chunks = book.get("chunks", [])
    chapters = {k: dict(v) for k, v in CHAPTER_ZH.items()}
    by_id: dict[str, dict] = {}
    for c in chunks:
        cid = c.get("id", "")
        ch = chapter_num_from_chunk(c)
        if not ch or ch not in chapters:
            continue
        # v1: only tag chunks with short summary pointer (full zh in phase 2)
        by_id[cid] = {
            "chapter": ch,
            "summaryZh": chapters[ch]["summary"],
            "zh": "",
            "note": "本章摘要见 chapters[" + ch + "].summary；全文请切英文或对照模式",
        }
    out = {
        "meta": {
            "method": "chapter-summary-v1",
            "chunkCount": len(by_id),
            "hint": "中文模式优先显示章级摘要；段落级译文逐步补充",
        },
        "chapters": chapters,
        "chunks": by_id,
    }
    out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {out_path} ({len(chapters)} chapters, {len(by_id)} chunk refs)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
