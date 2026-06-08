#!/usr/bin/env python3
"""PDF/DOCX/... → Markdown via Docling, output to knowledge-base/raw/."""

from __future__ import annotations

import argparse
import re
import sys
from datetime import date
from pathlib import Path


def repo_root() -> Path:
    # skills/docling-ingest/scripts/ -> repo root
    return Path(__file__).resolve().parents[3]


def slugify(name: str) -> str:
    s = Path(name).stem
    s = re.sub(r"[^\w\u4e00-\u9fff\-]+", "-", s, flags=re.UNICODE)
    return re.sub(r"-+", "-", s).strip("-")[:80] or "document"


def main() -> int:
    parser = argparse.ArgumentParser(description="Docling → wiki raw markdown")
    parser.add_argument("--file", required=True, help="Source document path")
    parser.add_argument(
        "--out-dir",
        default=None,
        help="Output directory (default: knowledge-base/raw)",
    )
    args = parser.parse_args()

    src = Path(args.file).expanduser().resolve()
    if not src.is_file():
        print(f"文件不存在: {src}", file=sys.stderr)
        return 1

    out_dir = Path(args.out_dir) if args.out_dir else repo_root() / "knowledge-base" / "raw"
    out_dir.mkdir(parents=True, exist_ok=True)

    try:
        from docling.document_converter import DocumentConverter
    except ImportError:
        print(
            "未安装 docling。请执行: pip install docling  (需 Python 3.10+)\n"
            "文档: https://github.com/docling-project/docling",
            file=sys.stderr,
        )
        return 1

    converter = DocumentConverter()
    result = converter.convert(str(src))
    md = result.document.export_to_markdown()

    prefix = date.today().isoformat()
    out_name = f"{prefix}-{slugify(src.name)}.md"
    out_path = out_dir / out_name
    header = f"<!-- docling-source: {src} -->\n<!-- generated: {prefix} -->\n\n"
    out_path.write_text(header + md, encoding="utf-8")

    print(str(out_path))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
