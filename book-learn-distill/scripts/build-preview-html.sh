#!/usr/bin/env bash
# Build 作业输出/<slug>_知识图谱.html (split delivery: small HTML + external index + app JS)
# Optional: BUNDLE=1 for single-file (large, editors may fail to open)
set -euo pipefail
SLUG="${1:?usage: build-preview-html.sh <slug>}"
BUNDLE="${BUNDLE:-0}"
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LEARN="$ROOT/learn/$SLUG"
OUT_DIR="$ROOT/作业输出"
OUT="$OUT_DIR/${SLUG}_知识图谱.html"
JSON="$LEARN/06-graph-data.json"
INDEX="$LEARN/book-index.json"
TPL="$ROOT/skills/book-learn-distill/templates/knowledge-graph.html"
JS_MAIN="$ROOT/skills/book-learn-distill/templates/knowledge-graph.js"
JS_SCIENCE="$ROOT/skills/book-learn-distill/templates/knowledge-graph-science.js"
JS_COURSE="$ROOT/skills/book-learn-distill/templates/knowledge-graph-course.js"
JS_APP="$OUT_DIR/${SLUG}_app.js"
JS_INDEX="$OUT_DIR/${SLUG}_book-index.js"
ASSETS_OUT="$OUT_DIR/${SLUG}_assets"
# paleontology legacy folder name
[[ "$SLUG" == "paleontology" ]] && ASSETS_OUT="$OUT_DIR/paleontology_assets"

INLINE_THRESHOLD="${INLINE_THRESHOLD:-200000}"

# 1) Merge application JS
if [[ -f "$JS_COURSE" ]]; then
  cat "$JS_MAIN" "$JS_SCIENCE" "$JS_COURSE" > "$JS_APP"
else
  cat "$JS_MAIN" "$JS_SCIENCE" > "$JS_APP"
fi
cp "$JS_APP" "$LEARN/knowledge-graph.js"
echo "App JS -> ${JS_APP} ($(wc -c < "$JS_APP" | tr -d ' ') bytes)"

# 2) External book-index.js (default — keeps HTML openable in editors)
if [[ -f "$INDEX" ]]; then
  python3 - "$INDEX" "$JS_INDEX" << 'PY'
import json, sys
from pathlib import Path
book = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
body = "window.BOOK_INDEX = " + json.dumps(book, ensure_ascii=False) + ";\n"
body = body.replace("</script>", r"<\/script>")
Path(sys.argv[2]).write_text(body, encoding="utf-8")
print(f"Wrote book-index JS ({Path(sys.argv[2]).stat().st_size:,} bytes, {book.get('meta',{}).get('chunkCount','?')} chunks)")
PY
  cp "$JS_INDEX" "$LEARN/book-index.js" 2>/dev/null || true
fi

# 3) Build HTML
python3 - "$JSON" "$TPL" "$OUT" "$LEARN" "$JS_APP" "$JS_INDEX" "$SLUG" "$BUNDLE" "$INLINE_THRESHOLD" << 'PY'
import json, sys
from pathlib import Path
json_path, tpl_path, out_path, learn_dir, js_app, js_index, slug, bundle, thresh_s = sys.argv[1:10]
bundle = bundle == "1"
thresh = int(thresh_s)
learn = Path(learn_dir)
out_dir = Path(out_path).parent
data = json.loads(Path(json_path).read_text(encoding="utf-8"))
html = Path(tpl_path).read_text(encoding="utf-8")
inline = (
    "<script>\nwindow.GRAPH_DATA = "
    + json.dumps(data, ensure_ascii=False, indent=2)
    + ";\n</script>\n"
)

def first_existing(*names):
    for n in names:
        p = learn / n
        if p.is_file():
            return p
    return None

def write_external_js(var_name: str, payload: dict, basename: str) -> str:
    path = out_dir / basename
    body = f"window.{var_name} = " + json.dumps(payload, ensure_ascii=False) + ";\n"
    body = body.replace("</script>", r"<\/script>")
    path.write_text(body, encoding="utf-8")
    return path.name

for var_name, filenames in [
    ("PERSONA", ["book-persona.json", "author-persona.json", "yujun-persona.json"]),
    ("COMPLIANCE", ["book-compliance.json", "compliance.json"]),
    ("GEOTIME", ["book-geotime.json"]),
    ("PHYLOGENY", ["book-phylogeny.json"]),
    ("TAXA", ["book-taxa.json"]),
    ("BOOK_TRANSLATION", ["book-translation.json"]),
    ("CURRICULUM", ["book-curriculum.json"]),
]:
    f = first_existing(*filenames)
    if not f:
        continue
    payload = json.loads(f.read_text(encoding="utf-8"))
    raw = json.dumps(payload, ensure_ascii=False)
    if bundle or len(raw) <= thresh:
        inline += f"<script>\nwindow.{var_name} = {raw};\n</script>\n"
        print(f"Inlined {var_name} from {f.name} ({len(raw):,} chars)")
    else:
        fname = write_external_js(var_name, payload, f"{slug}_{f.stem.replace('book-', '')}.js")
        inline += f'<script src="{fname}"></script>\n'
        print(f"External {var_name} -> {fname} ({len(raw):,} chars)")

idx_file = Path(js_index)
index_script_name = idx_file.name if idx_file.is_file() else f"{slug}_book-index.js"
if idx_file.is_file():
    if bundle:
        src = learn / "book-index.json"
        book = json.loads(src.read_text(encoding="utf-8"))
        inline += (
            "<script>\nwindow.BOOK_INDEX = "
            + json.dumps(book, ensure_ascii=False)
            + ";\n</script>\n"
        )
        print("Inlined BOOK_INDEX (bundle mode)")
    else:
        inline += (
            f'<script>window.__BOOK_INDEX_SCRIPT="{index_script_name}";</script>\n'
        )
        print(f"Deferred BOOK_INDEX -> {index_script_name} (app loads async)")

js_file = Path(js_app)
if not js_file.is_file():
    raise SystemExit(f"Missing app JS: {js_app}")
if bundle:
    js_body = js_file.read_text(encoding="utf-8").replace("</script>", r"<\/script>")
    inline += f"<script>\n{js_body}\n</script>\n"
    print(f"Inlined app JS ({js_file.stat().st_size:,} bytes, bundle mode)")
else:
    inline += f'<script src="{js_file.name}"></script>\n'
    print(f"Linked app JS -> {js_file.name}")

out = html.replace('<script src="knowledge-graph.js"></script>', inline)
Path(out_path).write_text(out, encoding="utf-8")
print(f"Wrote {out_path} ({Path(out_path).stat().st_size:,} bytes)")
PY

# 4) Copy assets
if [[ -d "$LEARN/assets" ]]; then
  rm -rf "$ASSETS_OUT"
  cp -R "$LEARN/assets" "$ASSETS_OUT"
  echo "Copied assets -> ${ASSETS_OUT}/"
fi

# 5) 打开说明
README="$OUT_DIR/${SLUG}_打开说明.txt"
cat > "$README" << EOF
古生物 / 知识图谱 — 打开方式
================================

请用浏览器（Chrome / Safari）打开本目录下的：

  ${SLUG}_知识图谱.html

【重要】以下文件必须在同一文件夹，不要只拷贝 HTML：
  - ${SLUG}_知识图谱.html   （主页面，约几百 KB）
  - ${SLUG}_book-index.js   （书内全文索引，较大）
  - ${SLUG}_app.js          （交互逻辑）
  - ${SLUG}_assets/ 或 paleontology_assets/  （简笔画等资源，若有）

若页面一直显示「正在加载」或空白：
  1. 确认上面几个文件都在同一目录
  2. 需要联网加载 D3 与 Wikimedia 课程配图
  3. 勿用 Cursor 内置预览打开 3MB+ 单文件；用系统浏览器

重新生成：bash skills/book-learn-distill/scripts/build-preview-html.sh ${SLUG}
EOF
echo "Wrote $README"

cp "$JS_APP" "$LEARN/knowledge-graph.js"
[[ -f "$JS_INDEX" ]] && cp "$JS_INDEX" "$LEARN/book-index.js"
# learn/ 使用通用脚本名，避免 paleontology_* 路径找不到
sed -e "s|${SLUG}_book-index.js|book-index.js|g" \
    -e "s|${SLUG}_app.js|knowledge-graph.js|g" \
    "$OUT" > "$LEARN/knowledge-graph.html"

echo "Synced -> learn/${SLUG}/ (book-index.js + knowledge-graph.js)"

echo ""
echo "=== QA gate ==="
python3 "$SCRIPT_DIR/qa-verify-html.py" "$SLUG" "$OUT" "$LEARN" "$JS_APP"
