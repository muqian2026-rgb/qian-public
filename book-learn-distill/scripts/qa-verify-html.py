#!/usr/bin/env python3
"""
Post-build QA gate for book-learn-distill HTML deliverables.
Aligned with qa.md: risk-priority checks, fail-fast, machine-readable report.
"""
from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


@dataclass
class CheckResult:
    id: str
    level: str  # P0 | P1 | P2
    passed: bool
    message: str


@dataclass
class QaReport:
    slug: str
    html_path: str
    results: list[CheckResult] = field(default_factory=list)

    def add(self, cid: str, level: str, passed: bool, message: str) -> None:
        self.results.append(CheckResult(cid, level, passed, message))

    @property
    def p0_failed(self) -> list[CheckResult]:
        return [r for r in self.results if r.level == "P0" and not r.passed]

    def to_dict(self) -> dict[str, Any]:
        return {
            "slug": self.slug,
            "html": self.html_path,
            "passed": len(self.p0_failed) == 0,
            "summary": {
                "total": len(self.results),
                "passed": sum(1 for r in self.results if r.passed),
                "failed": sum(1 for r in self.results if not r.passed),
                "p0_failed": len(self.p0_failed),
            },
            "checks": [
                {"id": r.id, "level": r.level, "passed": r.passed, "message": r.message}
                for r in self.results
            ],
        }


def extract_script_block(html: str, var_name: str) -> str | None:
    marker = f"window.{var_name} = "
    idx = html.find(marker)
    if idx < 0:
        return None
    start = idx + len(marker)
    depth = 0
    i = start
    if i >= len(html):
        return None
    opener = html[i]
    if opener not in "{[":
        return None
    closer = "}" if opener == "{" else "]"
    depth = 1
    i += 1
    in_str = False
    esc = False
    quote = ""
    while i < len(html) and depth > 0:
        ch = html[i]
        if in_str:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == quote:
                in_str = False
        else:
            if ch in ('"', "'"):
                in_str = True
                quote = ch
            elif ch == opener:
                depth += 1
            elif ch == closer:
                depth -= 1
        i += 1
    return html[start:i]


def run_qa(slug: str, html_path: Path, learn_dir: Path, js_path: Path | None) -> QaReport:
    report = QaReport(slug=slug, html_path=str(html_path))

    if not html_path.is_file():
        report.add("file_exists", "P0", False, f"HTML 不存在: {html_path}")
        return report
    report.add("file_exists", "P0", True, "HTML 文件存在")

    size = html_path.stat().st_size
    if size < 10_000:
        report.add("min_size", "P0", False, f"文件过小 ({size} B)，可能为空或未写完")
    else:
        report.add("min_size", "P0", True, f"文件大小 {size:,} B")

    html = html_path.read_text(encoding="utf-8")

    for tag in ("<!DOCTYPE html>", "<html", "<body", "</html>"):
        ok = tag.lower() in html.lower()
        report.add(f"html_{tag.replace('<', '').replace('>', '')}", "P0", ok, f"含 {tag}" if ok else f"缺少 {tag}")

    required_ids = [
        "hdrTitle",
        "navLinks",
        "overview",
        "theory",
        "graph-svg",
        "readingPath",
        "bookQaPanel",
        "glossaryList",
    ]
    for dom_id in required_ids:
        ok = f'id="{dom_id}"' in html or f"id='{dom_id}'" in html
        report.add(f"dom_{dom_id}", "P0", ok, f"DOM #{dom_id}" + ("" if ok else " 缺失"))

    graph_raw = extract_script_block(html, "GRAPH_DATA")
    if not graph_raw:
        report.add("graph_data_inline", "P0", False, "未内联 window.GRAPH_DATA")
    else:
        try:
            graph = json.loads(graph_raw)
            report.add("graph_data_inline", "P0", True, "GRAPH_DATA 可解析")
            nodes = graph.get("nodes") or []
            edges = graph.get("edges") or []
            report.add(
                "graph_nodes",
                "P0",
                len(nodes) >= 3,
                f"节点 {len(nodes)} 个",
            )
            report.add(
                "graph_edges",
                "P1",
                len(edges) >= 1,
                f"边 {len(edges)} 条",
            )
            profile = (graph.get("meta") or {}).get("bookProfile", "")
            if profile == "natural-science":
                for var in ("GEOTIME", "PHYLOGENY", "TAXA"):
                    ok = f"window.{var} =" in html
                    report.add(f"science_{var.lower()}", "P0", ok, f"内联 {var}")
                ok = "window.CURRICULUM =" in html or not (learn_dir / "book-curriculum.json").is_file()
                if (learn_dir / "book-curriculum.json").is_file():
                    report.add("science_curriculum", "P0", "window.CURRICULUM =" in html, "内联 CURRICULUM")
                report.add(
                    "science_no_gh",
                    "P1",
                    'id="existing"' not in html or 'profile-business-only' in html,
                    "G/H 区已标 business-only 或移除",
                )
                for dom_id in ("courseRoot", "courseModeBar", "geotimePanel", "explorerRail"):
                    ok = f'id="{dom_id}"' in html
                    report.add(f"science_dom_{dom_id}", "P1", ok, f"自然科学 DOM #{dom_id}")
        except json.JSONDecodeError as e:
            report.add("graph_data_inline", "P0", False, f"GRAPH_DATA JSON 损坏: {e}")

    if "window.BOOK_INDEX =" in html:
        idx_raw = extract_script_block(html, "BOOK_INDEX")
        if idx_raw:
            try:
                book = json.loads(idx_raw)
                n = len(book.get("chunks") or [])
                report.add("book_index", "P0", n > 0, f"BOOK_INDEX {n} chunks")
            except json.JSONDecodeError:
                report.add("book_index", "P0", False, "BOOK_INDEX JSON 损坏")
    else:
        report.add("book_index", "P1", True, "无 BOOK_INDEX（可接受）")

    has_inline_js = "function setupScienceMode" in html or (
        "function loadData" in html and '<script src="' not in html
    )
    has_external_app = bool(re.search(rf'<script\s+src="{re.escape(slug)}_app\.js"', html))
    has_external_index = bool(re.search(rf'<script\s+src="{re.escape(slug)}_book-index\.js"', html))
    has_deferred_index = f'__BOOK_INDEX_SCRIPT' in html and f'"{slug}_book-index.js"' in html
    js_ok = False
    index_path = html_path.parent / f"{slug}_book-index.js"
    app_file = js_path if js_path and js_path.is_file() else html_path.parent / f"{slug}_app.js"

    if has_inline_js and "BOOK_INDEX" in html and html.count("window.BOOK_INDEX") > 0:
        js_ok = True
        report.add("delivery_mode", "P0", True, "单文件 bundle 模式")
        report.add("html_editor_size", "P1", size < 2_000_000, f"HTML {size:,} B（过大时编辑器可能显示为空）")
    elif has_external_app and app_file.is_file() and app_file.stat().st_size > 5_000:
        js_ok = True
        report.add("js_app_external", "P0", True, f"外部 app: {app_file.name} ({app_file.stat().st_size:,} B)")
        if has_deferred_index and index_path.is_file() and index_path.stat().st_size > 1_000:
            report.add("js_index_external", "P0", True, f"异步索引: {index_path.name} ({index_path.stat().st_size:,} B)")
        elif index_path.is_file() and index_path.stat().st_size > 1_000:
            report.add("js_index_external", "P0", True, f"外部索引: {index_path.name} ({index_path.stat().st_size:,} B)")
            report.add(
                "html_editor_size",
                "P0",
                size < 800_000,
                f"HTML {size:,} B（split 模式，可在编辑器中打开）",
            )
        elif "window.BOOK_INDEX" in html:
            report.add("js_index_external", "P0", True, "BOOK_INDEX 内联在 HTML")
        else:
            report.add("js_index_external", "P0", False, f"缺少 {index_path.name}")
    else:
        report.add("js_present", "P0", False, "缺少应用 JS（*_app.js）或未在 HTML 中引用")

    # Broken </script> inside GRAPH_DATA
    gd_start = html.find("window.GRAPH_DATA = ")
    if gd_start >= 0:
        gd_end = html.find("</script>", gd_start)
        inner = html[gd_start:gd_end]
        if "</script>" in inner[20:]:
            report.add("script_tag_safety", "P0", False, "GRAPH_DATA 内含 </script>，会破坏 HTML")
        else:
            report.add("script_tag_safety", "P0", True, "GRAPH_DATA 无嵌套 </script>")

    cur_file = learn_dir / "book-curriculum.json"
    if cur_file.is_file():
        cur = json.loads(cur_file.read_text(encoding="utf-8"))
        nch = len(cur.get("chapters") or [])
        report.add("curriculum_chapters", "P0", nch >= 8, f"课程 {nch} 章")
        tpl = (cur.get("meta") or {}).get("templatePageId", "")
        if tpl:
            ok = tpl in html
            report.add("curriculum_template_page", "P1", ok, f"样板页 {tpl} 已写入 HTML")

    assets = learn_dir / "assets"
    assets_out = html_path.parent / f"{slug}_assets"
    if assets.is_dir():
        target = assets_out if assets_out.is_dir() else assets
        n = len(list(target.rglob("*")))
        report.add("assets_dir", "P1", n > 0, f"静态资源 {n} 个文件 @ {target.name}")

    if "d3.v7.min.js" in html:
        report.add("d3_cdn", "P2", True, "D3 来自 CDN（离线图谱需联网）")

    return report


def write_report(report: QaReport, out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    jpath = out_dir / f"{report.slug}-qa-report.json"
    mpath = out_dir / f"{report.slug}-qa-report.md"
    jpath.write_text(json.dumps(report.to_dict(), ensure_ascii=False, indent=2), encoding="utf-8")

    lines = [
        f"# QA 报告 · {report.slug}",
        "",
        f"- HTML: `{report.html_path}`",
        f"- 结果: **{'通过' if report.to_dict()['passed'] else '未通过'}**",
        f"- 检查: {report.to_dict()['summary']['passed']}/{report.to_dict()['summary']['total']} 通过",
        "",
        "| 级别 | ID | 状态 | 说明 |",
        "|------|-----|------|------|",
    ]
    for r in report.results:
        status = "✓" if r.passed else "✗"
        lines.append(f"| {r.level} | {r.id} | {status} | {r.message} |")
    if report.p0_failed:
        lines.extend(["", "## P0 未通过（须修复后重新 build）", ""])
        for r in report.p0_failed:
            lines.append(f"- **{r.id}**: {r.message}")
    mpath.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"QA report: {jpath}")
    print(f"QA report: {mpath}")


def main() -> int:
    if len(sys.argv) < 3:
        print("usage: qa-verify-html.py <slug> <html-path> [learn-dir] [js-path]", file=sys.stderr)
        return 2
    slug = sys.argv[1]
    html_path = Path(sys.argv[2]).resolve()
    learn_dir = Path(sys.argv[3]).resolve() if len(sys.argv) > 3 else html_path.parent.parent / "learn" / slug
    js_path = Path(sys.argv[4]).resolve() if len(sys.argv) > 4 else html_path.parent / f"{slug}_知识图谱.js"

    report = run_qa(slug, html_path, learn_dir, js_path)
    write_report(report, html_path.parent)

    failed = report.p0_failed
    if failed:
        print("\n❌ QA 未通过 (P0):", file=sys.stderr)
        for r in failed:
            print(f"  - {r.id}: {r.message}", file=sys.stderr)
        return 1
    print(f"\n✅ QA 通过 · {report.to_dict()['summary']['passed']}/{report.to_dict()['summary']['total']} 项")
    return 0


if __name__ == "__main__":
    sys.exit(main())
