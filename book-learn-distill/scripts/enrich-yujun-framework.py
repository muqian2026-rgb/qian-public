#!/usr/bin/env python3
"""Dedupe + enrich framework tree; merge into 06-graph-data.json."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
LEARN = ROOT / "learn/yujun-product-methodology"
TREE_PATH = LEARN / "book-framework-tree.json"
GRAPH_PATH = LEARN / "06-graph-data.json"

SUMMARIES = {
    "§1.1": "品牌 PM、项目 PM 到软件 PM 的演变；互联网 PM 是其中一类。",
    "§1.2": "信息复制成本低、快速迭代与 AB、体验设计价值上升——互联网 PM 的三特性。",
    "§1.3": "四大职能；用户模型（合格线）与交易模型（进阶）；好产品三属性。",
    "§1.3.3": "用户是需求的集合；五属性；系统1/2；微观情境。",
    "§1.3.4": "以交易为单位；可持续互惠；每次交互都是交易。",
    "§2.1": "企业以产品为媒介与用户价值交换；用户价值与商业价值可统一。",
    "§2.2": "用户非自然人；异质性、情境性、可塑性、自利性、有限理性。",
    "§2.3": "产品是价值交换媒介；用户价值=新体验−旧体验−替换成本。",
    "§2.4": "企业本质：发现市场获利机会 + 生产效率高于市场；组织、文化、权威与共同知识。",
    "§2.4.1": "获利途径：洞察、试错、偶然性（BAT 案例）；阿罗信息悖论。",
    "§2.4.2": "科斯：企业用权威降低交易成本；显性/默会知识；共同知识是效率本源。",
    "§2.4.3": "组织=共同目标+理念+知识+运行机制；使命愿景价值观；激励制度优先。",
    "§2.4.4": "发展 vs 生存两条腿；发展可试错，生存不能有短板。",
    "§2.5": "用「交易」视角优化价值交换；广义的支付与成本。",
    "§3.1": "交易模型；多方价值判断；货币价格为零也是交易。",
    "§3.4.6": "市场型交易成本：搜寻/度量、寻价/决策、实施/保障；搜寻/体验/信任品。",
    "§4.1": "理性信念、理性目标、理性行动；用户价值公式在决策中的应用。",
    "§4.2": "常见决策方法与误区（含数据、AB、竞品参照等）。",
    "§4.4": "公平/效率、定价、排队、动态调价等权衡举例。",
    "§5.1": "选拔：天赋、逻辑、同理心；面试与潜力判断。",
    "§5.2": "培养：认知迭代、理论求解、团队与组织建设。",
}

NODE_MAP = {
    "§1.3.3": "user-model",
    "§1.3.4": "transaction-model",
    "§2.3": "user-value",
    "§2.1": "enterprise-user-product",
    "§2.4": "enterprise-org",
    "§2.4.3": "organization-efficiency",
    "§3.4.6": "transaction-cost",
    "§4.1": "rational-decision",
    "§3.1": "transaction-model",
}

CHAPTER_KEY_POINTS = {
    "§1": [
        "互联网 PM：迭代、体验、数据",
        "用户模型 = 合格线；交易模型 = 进阶",
    ],
    "§2": [
        "价值交换非对立",
        "理解企业=组织、权威、共同知识、激励",
        "用户价值公式",
    ],
    "§3": [
        "效用、边际、成本、供需",
        "降交易成本创造新用户",
    ],
    "§4": [
        "理性三要素",
        "能落地才有价值",
        "出行类公平/效率权衡",
    ],
    "§5": [
        "选拔看潜力与思维",
        "培养靠认知迭代",
    ],
}


def dedupe_children(nodes: list[dict]) -> list[dict]:
    seen = set()
    out = []
    for n in nodes:
        ref = n.get("sectionRef") or n.get("label")
        if ref in seen:
            continue
        seen.add(ref)
        if n.get("children"):
            n["children"] = dedupe_children(n["children"])
        out.append(n)
    return out


def enrich_node(n: dict) -> None:
    ref = n.get("sectionRef", "")
    if ref in SUMMARIES and not n.get("summary"):
        n["summary"] = SUMMARIES[ref]
    if ref in NODE_MAP:
        n["nodeId"] = NODE_MAP[ref]
    if ref in CHAPTER_KEY_POINTS:
        n["keyPoints"] = CHAPTER_KEY_POINTS[ref]
    if ref and not n.get("bookSearchTerms"):
        n["bookSearchTerms"] = [n["label"].replace(ref, "").strip()[:30]]
    for c in n.get("children") or []:
        enrich_node(c)


def main() -> None:
    tree_doc = json.loads(TREE_PATH.read_text(encoding="utf-8"))
    tree = tree_doc["frameworkTree"]
    root = tree[0]
    root["children"] = dedupe_children(root.get("children") or [])
    for ch in root["children"]:
        ch["children"] = dedupe_children(ch.get("children") or [])
        enrich_node(ch)
    enrich_node(root)

    graph = json.loads(GRAPH_PATH.read_text(encoding="utf-8"))
    graph["theory"]["frameworkTree"] = tree
    graph["theory"]["skeletonPillars"] = [
        {
            "name": ch["label"],
            "claim": ch.get("summary", ""),
            "confidence": "high",
            "source": ch.get("sectionRef", ""),
            "graphNodeIds": [ch["nodeId"]] if ch.get("nodeId") else [],
            "sectionRef": ch.get("sectionRef"),
        }
        for ch in root["children"]
    ]
    graph["meta"]["version"] = 2
    GRAPH_PATH.write_text(json.dumps(graph, ensure_ascii=False, indent=2), encoding="utf-8")
    TREE_PATH.write_text(
        json.dumps({"sections": tree_doc["sections"], "frameworkTree": tree}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Updated {GRAPH_PATH} and {TREE_PATH}")


if __name__ == "__main__":
    main()
