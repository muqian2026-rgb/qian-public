#!/usr/bin/env python3
"""Merge book-glossary.json + book-misconceptions.json into 06-graph-data.json."""

from __future__ import annotations

import json
import sys
from pathlib import Path


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: merge-book-supplement.py <learn-slug-dir>", file=sys.stderr)
        return 1
    learn = Path(sys.argv[1]).resolve()
    graph_path = learn / "06-graph-data.json"
    gloss_path = learn / "book-glossary.json"
    misc_path = learn / "book-misconceptions.json"
    for p in (graph_path, gloss_path, misc_path):
        if not p.is_file():
            print(f"missing: {p}", file=sys.stderr)
            return 1
    data = json.loads(graph_path.read_text(encoding="utf-8"))
    data["glossary"] = json.loads(gloss_path.read_text(encoding="utf-8"))
    data["misconceptions"] = json.loads(misc_path.read_text(encoding="utf-8"))
    graph_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(
        f"Merged {len(data['glossary'])} glossary + {len(data['misconceptions'])} misconceptions -> {graph_path}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
