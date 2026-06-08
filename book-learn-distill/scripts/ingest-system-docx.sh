#!/usr/bin/env bash
# Ingest internal DOCX from meta.sourceRoot into wiki raw + learn raw mirror
set -euo pipefail
SLUG="${1:?usage: ingest-system-docx.sh <slug>}"
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
LEARN="$ROOT/learn/$SLUG"
META="$LEARN/meta.json"
python3 - "$META" "$ROOT" "$SLUG" << 'PY'
import json, subprocess, sys
from pathlib import Path

meta_path, root, slug = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3]
meta = json.loads(meta_path.read_text(encoding="utf-8"))
source_root = root / meta.get("sourceRoot", "")
if not source_root.is_dir():
    sys.exit(f"Missing sourceRoot: {source_root}")

wiki_out = root / "wiki-knowledge-base/raw/systems" / slug
learn_raw = Path(meta_path).parent / "raw"
wiki_out.mkdir(parents=True, exist_ok=True)
learn_raw.mkdir(parents=True, exist_ok=True)

for mod in meta.get("modules") or []:
    src_name = mod.get("sourceFile") or ""
    if not src_name:
        continue
    src = source_root / src_name
    if not src.is_file():
        print(f"SKIP missing: {src}")
        continue
    mid = mod.get("id") or "module"
    out_md = wiki_out / f"{mid}.md"
    learn_md = learn_raw / f"{mid}.md"
    subprocess.run(
        ["pandoc", "-f", "docx", "-t", "markdown", "-o", str(out_md), str(src)],
        check=True,
    )
    learn_md.write_text(out_md.read_text(encoding="utf-8"), encoding="utf-8")
    print(f"OK {mid} -> {out_md} ({out_md.stat().st_size:,} bytes)")

manifest = {
    "slug": slug,
    "sourceRoot": str(meta.get("sourceRoot")),
    "modules": [
        {"id": m.get("id"), "title": m.get("title"), "raw": f"{m.get('id')}.md"}
        for m in meta.get("modules") or []
    ],
}
(wiki_out / "manifest.json").write_text(
    json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)
print(f"Wrote {wiki_out / 'manifest.json'}")
PY
