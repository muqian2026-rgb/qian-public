#!/usr/bin/env python3
"""阶段 6：把简读版 Markdown 编译成单文件离线阅读器 HTML。

读取简读版目录下的 abridged.json 作为装配说明，套用
templates/reader-template.html，产出带标注、批注、章节总结、
读书笔记导出的单文件 HTML。

用法：
    python3 build-reader.py <简读版目录>
"""
from __future__ import annotations

import argparse
import html as html_lib
import json
import re
from pathlib import Path

import markdown

TEMPLATE = Path(__file__).resolve().parent.parent / "templates" / "reader-template.html"
CJK = re.compile(r"[\u3400-\u9fff]")
CHARS_PER_MINUTE = 230


def read_config(root: Path) -> dict:
    config_path = root / "abridged.json"
    if not config_path.exists():
        raise SystemExit(f"缺少装配说明：{config_path}（字段见 references/pipeline.md）")
    return json.loads(config_path.read_text(encoding="utf-8"))


def prefix_number(name: str) -> int:
    """取文件名开头的编号。章数过百时前缀是三位，不能按固定宽度切。"""
    match = re.match(r"(\d+)-", name)
    if not match:
        raise SystemExit(f"文件名缺少编号前缀：{name}")
    return int(match.group(1))


def nav_label(title: str, number: int) -> str:
    """目录里的短标签。

    `第N章 标题` 压成 `N. 标题`；文集的篇名本身没有编号，补上篇号，
    否则 200 多条目录全是长句、扫不动。qa-abridged.py 用同一规则校验，
    改这里必须同步改那边。
    """
    if re.match(r"^第\d+章\s*", title):
        return re.sub(r"^第(\d+)章\s*", r"\1. ", title)
    return f"{number}. {title}"


def chapter_path(root: Path, number: int) -> Path:
    matches = [
        p for p in sorted((root / "章节").glob("*.md")) if prefix_number(p.name) == number
    ]
    if not matches:
        raise SystemExit(f"找不到第 {number} 章的简读稿")
    return matches[0]


def title_of(text: str, path: Path) -> str:
    match = re.search(r"^#\s+(.+)$", text, re.M)
    if not match:
        raise SystemExit(f"{path.name} 缺少一级标题，简读稿主标题必须是 `# `")
    return match.group(1).strip()


def section_id(path: Path, root: Path) -> str:
    if path.parent.name == "章节":
        return f"chapter-{prefix_number(path.name):03d}"
    if path.name.startswith("00-"):
        return "introduction"
    if path.name.startswith("60-"):
        return "conclusion"
    return f"era-{prefix_number(path.name)}"


def rewrite_links(body: str, id_map: dict[str, str]) -> str:
    """把篇之间的 .md 相对链接改写成站内锚点。

    只认文件名，不认路径前缀——原稿里同一个文件会写成 `./章节/14-x.md`、
    `./14-x.md`、`14-x.md` 三种形式，按前缀匹配会漏掉后两种，
    编译出的 HTML 里就留下点了跳空的死链。
    """

    def replace(match: re.Match[str]) -> str:
        raw = html_lib.unescape(match.group(1))
        target = id_map.get(Path(raw).name)
        return f'href="#{target}"' if target else match.group(0)

    return re.sub(r'href="([^"#]+\.md)"', replace, body)


def render(text: str) -> str:
    return markdown.markdown(
        text,
        extensions=["extra", "sane_lists", "smarty", "toc"],
        output_format="html5",
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("root", type=Path, help="简读版目录，例如 .../v2.0-原书简读版")
    args = parser.parse_args()
    root = args.root.resolve()
    config = read_config(root)

    plan: list[tuple[str, list[Path]]] = []
    for group in config["groups"]:
        files = [root / name for name in group.get("guides", [])]
        files += [chapter_path(root, n) for n in group.get("chapters", [])]
        plan.append((group["name"], files))

    all_files = [path for _, files in plan for path in files]
    id_map = {path.name: section_id(path, root) for path in all_files}
    # 分组的性质随书而变（时代/部/阶段/主题），标签因此走配置
    labels = config.get("kindLabels", {})
    chapter_label = labels.get("chapter", "逐章正文")
    guide_label = labels.get("guide", "分组导航")

    navigation: list[str] = []
    articles: list[str] = []
    total_cjk = 0
    chapter_count = 0

    for group_name, files in plan:
        links = []
        for path in files:
            text = path.read_text(encoding="utf-8")
            title = title_of(text, path)
            sid = id_map[path.name]
            body = rewrite_links(render(text), id_map)
            is_chapter = path.parent.name == "章节"
            chapter_count += is_chapter
            total_cjk += len(CJK.findall(text))
            label = nav_label(title, prefix_number(path.name)) if is_chapter else title
            kind = "chapter" if is_chapter else "guide"
            links.append(
                f'<a href="#{sid}" data-target="{sid}" class="nav-link {kind}">'
                f"{html_lib.escape(label)}</a>"
            )
            fragment = ""
            fragment_path = root / "片段" / f"{path.stem}.html"
            if fragment_path.exists():
                fragment = fragment_path.read_text(encoding="utf-8")
            articles.append(
                f'<article id="{sid}" class="reader-section" '
                f'data-title="{html_lib.escape(title)}">'
                f'<div class="article-kind">{chapter_label if is_chapter else guide_label}</div>'
                f"{body}{fragment}</article>"
            )
        navigation.append(
            '<section class="nav-group"><button class="nav-group-title" aria-expanded="true">'
            f"<span>{html_lib.escape(group_name)}</span><span>⌄</span></button>"
            f'<div class="nav-group-links">{"".join(links)}</div></section>'
        )

    version = config["versionLabel"]
    replacements = {
        "__BOOK_TITLE__": config["bookTitle"],
        "__BOOK_SHORT_TITLE__": config["shortTitle"],
        "__BOOK_META__": config["bookMeta"],
        "__DESCRIPTION__": config.get(
            "description", f'{config["bookMeta"]} {version}'
        ),
        "__NOTES_TITLE__": config.get(
            "notesTitle", f'{config["shortTitle"]} · {version} 读书笔记'
        ),
        "__VERSION_LABEL__": version,
        # 改 storageKey 会让读者已存的标注失联，续版沿用旧值
        "__SLUG__": config.get("storageKey", config["slug"]),
        "__WORD_COUNT__": f"{total_cjk:,}",
        "__READING_HOURS__": str(round(total_cjk / CHARS_PER_MINUTE / 60)),
        "__SECTION_COUNT__": str(len(all_files)),
        "__CHAPTER_COUNT__": str(chapter_count),
        "__FIRST_TITLE__": html_lib.escape(plan[0][0]),
        "__GROUP_ORDER__": json.dumps([name for name, _ in plan], ensure_ascii=False),
        "__NOTES_FILENAME__": config["notesFilename"],
        "__BACKUP_FILENAME__": config["backupFilename"],
        "__NAV__": "".join(navigation),
        "__ARTICLES__": "".join(articles),
    }

    output = TEMPLATE.read_text(encoding="utf-8")
    for token, value in replacements.items():
        output = output.replace(token, value)
    leftover = sorted(set(re.findall(r"__[A-Z_]+__", output)))
    if leftover:
        raise SystemExit(f"模板占位未替换：{leftover}")

    target = root / config["output"]
    target.write_text(output, encoding="utf-8")
    print(f"{target}")
    print(f"{len(all_files)} 篇 · {chapter_count} 章 · {total_cjk:,} 汉字 · {target.stat().st_size} bytes")


if __name__ == "__main__":
    main()
