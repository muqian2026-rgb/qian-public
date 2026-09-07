#!/usr/bin/env python3
"""阶段 7：简读版交付前的硬门禁。

只查在实践里真出过问题的事，每一条都对应一次返工：

Markdown
  1. 主标题是 `# `，且只有一个（用 `##` 会让 HTML 标题变「未命名章节」）
  2. 二级段名与 abridged.json 的 chapterSections 逐字一致、顺序一致
     （首版 6 章写成 `###`、4 章段名带「（沿原书小节完整展开）」这类写作指令，
      旧版用子串匹配全部放行）
  3. 标题不跳级，段下有正文（避免只剩骨架的空段）
  4. 没有 TODO / 待补充 / 未命名 这类占位残留
  5. 相对链接指向真实存在的文件（首版导航页链到 ./14-*.md，实际在 章节/ 下）
  6. 篇幅在区间内：导航页不膨胀成第二份正文，章节不被压成提纲
  7. 原书每个编号小节都在简读稿里出现（覆盖率，不靠感觉）

HTML
  8. 无占位符、无占位文字、无重复 id
  9. 目录与正文条目一一对应，目录名与正文标题一致
 10. 站内锚点都能跳到真实存在的篇；不残留 .md 链接
 11. 脑图片段的分组标题够短，不在卡片里折行

段名、篇幅阈值都来自配置，脚本里不写死任何一本书的结构。

用法：
    python3 qa-abridged.py <简读版目录> [--source <原文.md>]
"""
from __future__ import annotations

import argparse
import html as html_lib
import json
import re
import sys
from pathlib import Path

# 占位残留。只收纯占位词——「同上」「见上文」这类在中文正文里是正常表述
# （「人同上帝的关系」曾被误判），放进来会把 QA 变成噪音源。
FILLER = re.compile(
    r"TODO|FIXME|XXX|lorem|待补充|待完善|待定|此处省略|略去不表|未命名|"
    r"（略）|\(略\)|【[^】]*填[^】]*】"
)
# 标题里夹带的写作指令，例如「理论应对（沿原书小节完整展开）」「主要问题 list」
HEADING_NOISE = re.compile(r"（[^）]*(展开|顺序|原书|保留|不少于)[^）]*）|\blist\b", re.I)
HEADING = re.compile(r"^(#{1,4})\s+(.+?)\s*$", re.M)
MD_LINK = re.compile(r"\[[^\]]*\]\(([^)#][^)]*\.md)\)")

DEFAULT_LIMITS = {
    "guideBytes": [6000, 11000],      # 分组导航页：导航而已，膨胀就是第二份正文
    "bookendBytes": [6000, 25000],    # 导读与全书总结：要收全书，天然比导航长
    "chapterMinBytes": 8000,
    "chapterMaxBytes": 60000,
    "groupTitleChars": 12,
}


def headings(text: str) -> list[tuple[int, str]]:
    return [(len(h), t) for h, t in HEADING.findall(text)]


def check_sections(name: str, heads: list[tuple[int, str]], sections: list[str],
                   field: str, out: list[str]) -> None:
    h2 = [t for level, t in heads if level == 2]
    if h2 == sections:
        return
    extra = [t for t in h2 if t not in sections]
    missing = [t for t in sections if t not in h2]
    detail = []
    if missing:
        detail.append(f"缺 {'、'.join(missing)}")
    if extra:
        detail.append(f"多出或写法不一致 {'、'.join(extra)}")
    if not detail:
        detail.append(f"顺序应为 {'→'.join(sections)}")
    out.append(f"{name}：二级段名与 {field} 不符（{'；'.join(detail)}）")


def check_headings(name: str, text: str, sections: list[str], out: list[str]) -> None:
    heads = headings(text)
    h1 = [t for level, t in heads if level == 1]
    if not text.startswith("# "):
        out.append(f"{name}：主标题不是一级标题，HTML 会显示「未命名章节」")
    if len(h1) != 1:
        out.append(f"{name}：应有且只有一个一级标题，实际 {len(h1)} 个")

    if sections:
        check_sections(name, heads, sections, "chapterSections", out)

    for level, title in heads:
        if HEADING_NOISE.search(title):
            out.append(f"{name}：标题夹带写作指令「{title}」")

    previous = 0
    for level, title in heads:
        if previous and level > previous + 1:
            out.append(f"{name}：标题跳级，h{previous} 之后直接出现 h{level}「{title}」")
        previous = level


def check_empty_sections(name: str, text: str, out: list[str]) -> None:
    """标题下面必须有东西：要么是正文，要么是更深一级的小节。

    `## 代表人物` 紧跟 `### 泰勒斯` 是容器，不是空段——按「下一个标题更深」放行，
    只有同级或更浅的标题紧随其后（或到文件末尾）才是真的没写。
    """
    marks = [(m.start(), m.end(), len(m.group(1)), m.group(2)) for m in HEADING.finditer(text)]
    for index, (_, end, level, title) in enumerate(marks):
        following = marks[index + 1] if index + 1 < len(marks) else None
        if following and following[2] > level:
            continue
        stop = following[0] if following else len(text)
        if not text[end:stop].strip():
            out.append(f"{name}：「{title}」下面没有正文")


def check_links(path: Path, root: Path, text: str, out: list[str]) -> None:
    for target in MD_LINK.findall(text):
        if (path.parent / target).exists():
            continue
        elsewhere = next(
            (c for c in root.rglob(Path(target).name) if c.is_file()), None
        )
        hint = f"，实际在 {elsewhere.relative_to(root)}" if elsewhere else ""
        out.append(f"{path.name}：链接失效 {target}{hint}")


def check_filler(name: str, text: str, out: list[str]) -> None:
    hits = sorted(set(FILLER.findall(text)))
    if hits:
        out.append(f"{name}：残留占位文字 {'、'.join(hits)}")


def check_html(root: Path, config: dict, limits: dict, out: list[str]) -> Path | None:
    path = root / config["output"]
    if not path.exists():
        out.append(f"未找到产出 HTML：{config['output']}")
        return None
    html = path.read_text(encoding="utf-8")

    leftover = sorted(set(re.findall(r"__[A-Z_]{2,}__", html)))
    if leftover:
        out.append(f"HTML 模板占位未替换：{'、'.join(leftover)}")
    check_filler("HTML", html, out)

    dead = sorted(set(re.findall(r'href="([^"]*\.md)"', html)))
    if dead:
        out.append(f"HTML 残留 .md 链接（点击会跳空）：{'、'.join(dead)}")

    ids = re.findall(r'<article id="([^"]+)"', html)
    duplicated = sorted({i for i in ids if ids.count(i) > 1})
    if duplicated:
        out.append(f"HTML 有重复的篇 id：{'、'.join(duplicated)}")

    articles = dict(
        re.findall(r'<article id="([^"]+)" class="reader-section" data-title="([^"]+)">', html)
    )
    nav = dict(
        re.findall(r'<a href="#([^"]+)" data-target="\1" class="nav-link \w+">([^<]+)</a>', html)
    )
    if set(articles) != set(nav):
        only_nav = sorted(set(nav) - set(articles))
        only_art = sorted(set(articles) - set(nav))
        out.append(f"HTML 目录与正文条目不一致（目录多 {only_nav}；正文多 {only_art}）")
    for sid, title in articles.items():
        if sid.startswith("chapter-"):
            # 与 build-reader.py 的 nav_label 同一规则，改一处必须改两处
            plain = html_lib.unescape(title)
            expected = (
                re.sub(r"^第(\d+)章\s*", r"\1. ", plain)
                if re.match(r"^第\d+章\s*", plain)
                else f"{int(sid.rsplit('-', 1)[1])}. {plain}"
            )
            if html_lib.unescape(nav.get(sid, "")) != expected:
                out.append(f"HTML 目录名与正文标题不一致：{sid}")

    for anchor in sorted(set(re.findall(r'href="#([^"]+)"', html))):
        if anchor.startswith(("chapter-", "guide-", "introduction", "conclusion")) and anchor not in articles:
            out.append(f"HTML 锚点指向不存在的篇：#{anchor}")

    for fragment in sorted((root / "片段").glob("*.html")):
        body = fragment.read_text(encoding="utf-8")
        check_filler(f"片段/{fragment.name}", body, out)
        for title in re.findall(r"<h3[^>]*>([^<]+)</h3>", body):
            if len(title.strip()) > limits["groupTitleChars"]:
                out.append(
                    f"片段/{fragment.name}：脑图标题「{title.strip()}」超过 "
                    f"{limits['groupTitleChars']} 字，卡片里会折行"
                )
    return path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("root", type=Path)
    parser.add_argument("--source", type=Path, help="原书全文，用于核对小节覆盖率")
    args = parser.parse_args()
    root = args.root.resolve()

    config = json.loads((root / "abridged.json").read_text(encoding="utf-8"))
    sections = config.get("chapterSections")
    if not sections:
        raise SystemExit(
            "abridged.json 缺少 chapterSections。"
            "先按阶段 1 摸清本书的叙述结构再来验收，不要沿用别的书的骨架。"
        )
    limits = {**DEFAULT_LIMITS, **config.get("qaLimits", {})}
    failures: list[str] = []

    chapters = sorted((root / "章节").glob("*.md"))
    if not chapters:
        raise SystemExit("章节目录为空")

    for path in chapters:
        text = path.read_text(encoding="utf-8")
        check_headings(path.name, text, sections, failures)
        check_empty_sections(path.name, text, failures)
        check_filler(path.name, text, failures)
        check_links(path, root, text, failures)
        size = path.stat().st_size
        if size < limits["chapterMinBytes"]:
            failures.append(f"{path.name}：只有 {size} 字节，疑似压成了提纲")
        if size > limits["chapterMaxBytes"]:
            failures.append(f"{path.name}：{size} 字节，超出简读版篇幅上限")

    guide_sections = config.get("guideSections") or []
    nav_pages = {
        name
        for group in config.get("groups", [])
        if group.get("chapters")
        for name in group.get("guides", [])
    }
    bookends = {"00", "60"}
    for path in sorted(root.glob("[0-9]*.md")):
        text = path.read_text(encoding="utf-8")
        check_empty_sections(path.name, text, failures)
        check_filler(path.name, text, failures)
        check_links(path, root, text, failures)
        if guide_sections and path.name in nav_pages:
            check_sections(path.name, headings(text), guide_sections, "guideSections", failures)
        low, high = limits["bookendBytes" if path.name[:2] in bookends else "guideBytes"]
        size = path.stat().st_size
        if not low <= size <= high:
            role = "膨胀成第二份正文" if size > high else "内容过少"
            failures.append(f"{path.name}：{size} 字节，不在 {low}–{high} 区间，{role}")

    if args.source:
        source = args.source.read_text(encoding="utf-8")
        for path in chapters:
            number = int(re.match(r"(\d+)-", path.name).group(1))
            numbered = re.findall(rf"^###\s+({number}\.\d+)\s+", source, re.M)
            text = path.read_text(encoding="utf-8")
            lost = [s for s in numbered if s not in text]
            if lost:
                failures.append(f"{path.name}：未覆盖原书小节 {'、'.join(lost)}")

    html_path = check_html(root, config, limits, failures)

    if failures:
        print(f"QA 未通过 · {len(failures)} 项：")
        for item in failures:
            print(f"  - {item}")
        sys.exit(1)

    print(f"QA 通过 · {len(chapters)} 章 · HTML {html_path.name}")


if __name__ == "__main__":
    main()
