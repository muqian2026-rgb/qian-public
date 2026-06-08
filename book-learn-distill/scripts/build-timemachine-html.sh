#!/usr/bin/env bash
# Build paleontology static Time Machine HTML (timeline + deep dives, no book index)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
LEARN="$ROOT/learn/paleontology"
TPL="$LEARN/templates/timemachine.html"
CSS_SRC="$LEARN/templates/timemachine.css"
JS_SRC="$LEARN/templates/timemachine.js"
OUT_DIR="$ROOT/作业输出"
OUT_HTML="$OUT_DIR/paleontology_timemachine.html"
OUT_CSS="$OUT_DIR/paleontology_timemachine.css"
OUT_JS="$OUT_DIR/paleontology_timemachine.js"
LEARN_HTML="$LEARN/timemachine.html"

python3 - "$LEARN" "$TPL" "$OUT_HTML" "$OUT_CSS" "$OUT_JS" "$LEARN_HTML" << 'PY'
import json, re, sys
from pathlib import Path

learn, tpl_path, out_html, out_css, out_js, learn_html = map(Path, sys.argv[1:7])
sys.path.insert(0, str(learn / "scripts"))
from format_geologic_time import format_geologic_time, format_obj_strings

def parse_table_rows(md_text):
    """Parse markdown table rows from 01-geologic-timescale.md into dict by id."""
    rows = {}
    for line in md_text.splitlines():
        if "`" not in line or not line.strip().startswith("|") or "---" in line:
            continue
        parts = [p.strip() for p in line.split("|")[1:-1]]
        if len(parts) < 7 or parts[0] == "级别":
            continue
        pid = parts[1].strip("`")
        fields = parts[6].split("·")[0].replace("[深读]", "").strip()
        rows[pid] = {
            "level": parts[0],
            "nameZh": parts[2],
            "timeRange": format_geologic_time(parts[3]),
            "iconic": format_geologic_time(parts[4]),
            "event": format_geologic_time(parts[5]),
            "fields": fields,
        }
    return rows

def wrap_images(html):
    def repl(m):
        cap, url = m.group(1), m.group(2)
        return (
            f'<figure data-lightbox="{url}"><img src="{url}" alt="{cap}" loading="lazy" '
            f'referrerpolicy="no-referrer"/><figcaption>{cap}</figcaption></figure>'
        )
    html = re.sub(
        r'<p><img alt="([^"]*)" src="([^"]+)"[^>]*/></p>',
        lambda m: repl(m),
        html,
    )
    html = re.sub(
        r'<img alt="([^"]*)" src="([^"]+)"[^>]*/>',
        lambda m: repl(m),
        html,
    )
    return html

def md_to_html(md):
    try:
        import markdown
        html = markdown.markdown(md, extensions=["tables", "nl2br", "sane_lists"])
        return wrap_images(html)
    except ImportError:
        pass
    # minimal fallback
    html = []
    in_table = False
    for line in md.splitlines():
        if line.startswith("!["):
            m = re.match(r"!\[([^\]]*)\]\(([^)]+)\)", line)
            if m:
                cap, url = m.group(1), m.group(2)
                html.append(f'<figure data-lightbox="{url}"><img src="{url}" alt="{cap}" loading="lazy" referrerpolicy="no-referrer"/><figcaption>{cap}</figcaption></figure>')
            continue
        if line.startswith("### "):
            html.append(f"<h2>{line[4:]}</h2>")
            continue
        if line.startswith("## "):
            continue  # skip title levels handled separately
        if line.startswith("|") and "---" not in line:
            if not in_table:
                html.append("<table>")
                in_table = True
            cells = [c.strip() for c in line.split("|")[1:-1]]
            tag = "th" if in_table and html[-1] == "<table>" else "td"
            html.append("<tr>" + "".join(f"<{tag}>{c}</{tag}>" for c in cells) + "</tr>")
            continue
        else:
            if in_table:
                html.append("</table>")
                in_table = False
        if line.startswith("- "):
            if html and html[-1] != "<ul>":
                html.append("<ul>")
            html.append(f"<li>{inline_md(line[2:])}</li>")
            continue
        if line.strip() == "":
            if html and html[-1] == "<ul>":
                html.append("</ul>")
            continue
        if line.startswith(">"):
            continue
        if line.strip() and not line.startswith("---") and not line.startswith("←"):
            if html and html[-1] == "<ul>":
                html.append("</ul>")
            html.append(f"<p>{inline_md(line)}</p>")
    if in_table:
        html.append("</table>")
    return "\n".join(html)

def inline_md(s):
    s = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2" target="_blank" rel="noopener">\1</a>', s)
    return s

def build_deep_html(path):
    text = path.read_text(encoding="utf-8")
    # extract skim table
    skim = ""
    skim_m = re.search(r"## 速览\s*\n\n(\|.+\|.+\n)+", text, re.S)
    if skim_m:
        table_md = skim_m.group(1)
        rows = []
        for line in table_md.strip().splitlines()[2:]:
            if re.match(r"^\|\s*[-:]+", line):
                continue
            cells = [c.strip() for c in line.split("|")[1:-1]]
            if len(cells) >= 2 and not all(re.match(r"^-+$", c) for c in cells):
                rows.append((cells[0], cells[1]))
        if rows:
            skim = '<dl class="tm-skim">' + "".join(f"<dt>{k}</dt><dd>{v}</dd>" for k, v in rows) + "</dl>"
    body = re.sub(r"^#.+?\n", "", text)
    body = re.sub(r">.+?\n\n", "", body, count=1)
    body = re.sub(r"## 速览\s*\n\n(\|.+\|.+\n)+", "", body, count=1)
    body = re.sub(r"^---\s*$", "", body, flags=re.M)
    body = re.sub(r"←.+$", "", body, flags=re.M)
    body = re.sub(r"## \d+ · 配图\s*\n\n(?:### .+\n\n)?(?:!\[.+?\n\n\*[^*]+\*\n\n)+", "", body)
    html_body = md_to_html(body.strip())
    title_m = re.match(r"# 深读 · (.+)", text)
    title = title_m.group(1) if title_m else path.stem
    links_m = re.search(r"## \d+ · 延伸链接\s*\n\n((?:- .+\n?)+)", text)
    links = ""
    if links_m:
        links = '<div class="tm-links">' + md_to_html(links_m.group(1)) + "</div>"
    return format_geologic_time(f"<h1>{title}</h1>{skim}{html_body}{links}")

def build_compact_deep(pid, en, row):
    name = row.get("nameZh") or pid
    detail = en.get("extendedDetail") or ""
    terms = en.get("keyTerms") or []
    refs = en.get("refs") or {}
    iconic = row.get("iconic") or ""
    event = row.get("event") or ""
    time_r = row.get("timeRange") or ""
    skim = (
        '<dl class="tm-skim">'
        f"<dt>时间</dt><dd>{time_r}</dd>"
        f"<dt>标志性生物</dt><dd>{iconic}</dd>"
        f"<dt>历史大事件</dt><dd>{event}</dd>"
        "</dl>"
    )
    terms_html = ""
    if terms:
        terms_html = (
            "<h2>关键词</h2><div class=\"tm-keyterms\">"
            + "".join(f"<span>{t}</span>" for t in terms)
            + "</div>"
        )
    links = []
    for key, url in refs.items():
        if url:
            label = "维基百科" if "wikipedia" in key else key
            links.append(f'<a href="{url}" target="_blank" rel="noopener">{label}</a>')
    links_html = (
        '<div class="tm-links"><h2>延伸链接</h2><p>'
        + " ".join(links)
        + "</p></div>"
        if links
        else ""
    )
    body = f"<h2>本章概要</h2><p>{detail}</p>{terms_html}"
    return format_geologic_time(f"<h1>深读 · {name}</h1>{skim}{body}{links_html}")

enrich = format_obj_strings(
    json.loads((learn / "timescale-enrichment.json").read_text(encoding="utf-8"))
)
milestones_cfg = format_obj_strings(
    json.loads((learn / "timeline-milestones.json").read_text(encoding="utf-8"))
)
narrative_path = learn / "narrative-videos.json"
narrative_cfg = (
    format_obj_strings(json.loads(narrative_path.read_text(encoding="utf-8")))
    if narrative_path.is_file()
    else {}
)
table_md = (learn / "01-geologic-timescale.md").read_text(encoding="utf-8")
table_rows = parse_table_rows(table_md)
entries = enrich.get("entries") or {}

deep_html = {}
deep_dir = learn / "deepdives"
for p in sorted(deep_dir.glob("*.md")):
    if p.name.lower() == "readme.md":
        continue
    deep_html[p.stem] = build_deep_html(p)

milestone_ids = [m["id"] for m in milestones_cfg.get("milestones", [])]
for pid in milestone_ids:
    if pid in deep_html:
        continue
    en = entries.get(pid) or {}
    row = table_rows.get(pid) or {}
    if en.get("extendedDetail") or row:
        deep_html[pid] = build_compact_deep(pid, en, row)

inline = (
    "<script>\nwindow.TIMESCALE_ENRICHMENT = "
    + json.dumps(enrich, ensure_ascii=False)
    + ";\nwindow.TIMELINE_TABLE = "
    + json.dumps(table_rows, ensure_ascii=False)
    + ";\nwindow.TIMELINE_MILESTONES = "
    + json.dumps(milestones_cfg, ensure_ascii=False)
    + ";\nwindow.NARRATIVE_VIDEOS = "
    + json.dumps(narrative_cfg, ensure_ascii=False)
    + ";\nwindow.DEEP_DIVE_HTML = "
    + json.dumps(deep_html, ensure_ascii=False)
    + ";\n</script>\n"
)

html = tpl_path.read_text(encoding="utf-8")
html = html.replace("<!-- INLINE_DATA -->", inline)
html = html.replace('<link rel="stylesheet" href="timemachine.css" />', '<link rel="stylesheet" href="paleontology_timemachine.css" />')
html = html.replace('<script src="timemachine.js"></script>', '<script src="paleontology_timemachine.js"></script>')

out_html.write_text(html, encoding="utf-8")
out_css.write_text((learn / "templates/timemachine.css").read_text(encoding="utf-8"), encoding="utf-8")
js_body = (learn / "templates/timemachine.js").read_text(encoding="utf-8")
out_js.write_text(js_body, encoding="utf-8")

# learn copy with local asset names
learn_html.write_text(
    html.replace("paleontology_timemachine.css", "timemachine.css").replace(
        "paleontology_timemachine.js", "timemachine.js"
    ),
    encoding="utf-8",
)
(learn / "timemachine.css").write_text(out_css.read_text(encoding="utf-8"), encoding="utf-8")
(learn / "timemachine.js").write_text(out_js.read_text(encoding="utf-8"), encoding="utf-8")

import shutil
assets_src = learn / "assets"
assets_out = out_html.parent / "assets"
if assets_src.is_dir():
    if assets_out.exists():
        shutil.rmtree(assets_out)
    shutil.copytree(assets_src, assets_out)
    print(f"Copied assets -> {assets_out}")
videos_src = learn / "assets" / "videos"
videos_out = assets_out / "videos" if assets_out.is_dir() else out_html.parent / "assets" / "videos"
if videos_src.is_dir():
    videos_out.mkdir(parents=True, exist_ok=True)
    for f in videos_src.glob("*.mp4"):
        shutil.copy2(f, videos_out / f.name)
    for f in videos_src.glob("*.jpg"):
        shutil.copy2(f, videos_out / f.name)
    print(f"Copied videos -> {videos_out}")

print(f"Wrote {out_html} ({out_html.stat().st_size:,} bytes)")
print(f"Wrote {out_css}, {out_js}")
print(f"Synced -> {learn_html}")
PY

# QA: size check
python3 - "$OUT_HTML" << 'PY'
import sys
from pathlib import Path
p = Path(sys.argv[1])
t = p.read_text(encoding="utf-8")
assert "TIMESCALE_ENRICHMENT" in t
assert "DEEP_DIVE_HTML" in t
assert "cambrian" in t and "devonian" in t
assert "TIMELINE_MILESTONES" in t and "transformNodes" in t and "lifeTreeBranches" in t
assert "NARRATIVE_VIDEOS" in t
assert "树根" in t and "lifeTreeBranches" in t and "树顶新芽" in t
assert '"cambrian":' in t and "K-Pg" in t and p.stat().st_size > 30000
for pid in ("cambrian", "devonian", "cretaceous", "permian", "jurassic", "ediacaran"):
    assert pid in t
print(f"QA OK: {p.stat().st_size:,} bytes, geologic tree + transform nodes")
PY
