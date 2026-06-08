#!/usr/bin/env python3
"""Merge book-node-enrichment.json fields into 06-graph-data.json nodes."""

from __future__ import annotations

import json
import sys
from pathlib import Path


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: merge-node-enrichment.py <learn-dir>", file=sys.stderr)
        return 1
    learn = Path(sys.argv[1]).resolve()
    graph_path = learn / "06-graph-data.json"
    enrich_path = learn / "book-node-enrichment.json"
    if not graph_path.is_file() or not enrich_path.is_file():
        print("missing graph or enrichment file", file=sys.stderr)
        return 1
    data = json.loads(graph_path.read_text(encoding="utf-8"))
    enrich = json.loads(enrich_path.read_text(encoding="utf-8"))
    merged = 0
    for node in data.get("nodes", []):
        nid = node.get("id")
        if nid not in enrich:
            continue
        patch = enrich[nid]
        for key, val in patch.items():
            if key == "bookSearchTerms":
                existing = set(node.get("bookSearchTerms") or [])
                existing.update(val)
                node["bookSearchTerms"] = list(existing)
            elif val:
                node[key] = val
        merged += 1
    graph_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Enriched {merged} nodes in {graph_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
