#!/usr/bin/env bash
# Build 作业输出/<slug>_知识图谱.html for pipeline=system (local KG template + flows)
set -euo pipefail
SLUG="${1:?usage: build-system-preview-html.sh <slug>}"
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
LEARN="$ROOT/learn/$SLUG"
OUT="$ROOT/作业输出/${SLUG}_知识图谱.html"
OUT_JS="$ROOT/作业输出/${SLUG}_knowledge-graph.js"
TPL_HTML="$LEARN/knowledge-graph.html"
TPL_JS="$LEARN/knowledge-graph.js"
GRAPH="$LEARN/06-graph-data.json"
FLOWS="$LEARN/06-flows.json"

[[ -f "$GRAPH" ]] || { echo "Missing $GRAPH"; exit 1; }
[[ -f "$TPL_HTML" ]] || { echo "Missing $TPL_HTML"; exit 1; }
[[ -f "$TPL_JS" ]] || { echo "Missing $TPL_JS"; exit 1; }

python3 - "$GRAPH" "$FLOWS" "$TPL_HTML" "$TPL_JS" "$OUT" "$OUT_JS" "$LEARN" << 'PY'
import json, shutil, sys
from pathlib import Path

graph_p, flows_p, tpl_html, tpl_js, out_html, out_js, learn = map(Path, sys.argv[1:8])
data = json.loads(graph_p.read_text(encoding="utf-8"))
flows = {}
if flows_p.is_file():
    flows = json.loads(flows_p.read_text(encoding="utf-8"))

inline = (
    "<script>\nwindow.GRAPH_DATA = "
    + json.dumps(data, ensure_ascii=False)
    + ";\nwindow.FLOWS_DATA = "
    + json.dumps(flows, ensure_ascii=False)
    + ";\n</script>\n"
)

html = tpl_html.read_text(encoding="utf-8")
html = html.replace("<!-- INLINE_DATA -->", inline)
html = html.replace('<script src="knowledge-graph.js"></script>', f'<script src="{out_js.name}"></script>')
out_html.write_text(html, encoding="utf-8")
shutil.copy2(tpl_js, out_js)
shutil.copy2(out_html, learn / "knowledge-graph.built.html")
shutil.copy2(out_js, learn / "knowledge-graph.built.js")
print(f"Wrote {out_html} ({out_html.stat().st_size:,} bytes)")
print(f"Wrote {out_js}")
PY

cp "$OUT" "$LEARN/knowledge-graph.html.bak" 2>/dev/null || true
echo "Done: open 作业输出/${SLUG}_知识图谱.html in browser"
