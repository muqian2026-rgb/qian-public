#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
exec python3 "$ROOT/skills/docling-ingest/scripts/docling_convert.py" --file "$1"
