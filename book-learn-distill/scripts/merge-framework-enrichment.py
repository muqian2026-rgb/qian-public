#!/usr/bin/env python3
"""Merge book-framework-enrichment.json into theory.frameworkTree by sectionRef."""

from __future__ import annotations

import json
import sys
from pathlib import Path


def walk(nodes, by_ref):
    for n in nodes or []:
        ref = n.get("sectionRef")
        if ref and ref in by_ref:
            patch = by_ref[ref]
            if "keyPoints" in patch:
                n["keyPoints"] = patch["keyPoints"]
            if "summary" in patch and patch["summary"]:
                n["summary"] = patch["summary"]
        if n.get("children"):
            walk(n["children"], by_ref)


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: merge-framework-enrichment.py <learn-dir>", file=sys.stderr)
        return 1
    learn = Path(sys.argv[1]).resolve()
    graph_path = learn / "06-graph-data.json"
    enr_path = learn / "book-framework-enrichment.json"
    if not graph_path.is_file() or not enr_path.is_file():
        print("missing graph or framework enrichment", file=sys.stderr)
        return 1
    data = json.loads(graph_path.read_text(encoding="utf-8"))
    enr = json.loads(enr_path.read_text(encoding="utf-8"))
    by_ref = enr.get("_chapters", {})
    tree = data.get("theory", {}).get("frameworkTree", [])
    walk(tree, by_ref)
    graph_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Enriched {len(by_ref)} sections in framework tree")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
