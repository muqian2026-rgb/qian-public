#!/usr/bin/env python3
"""init-persona-from-skill.py

从作者 AI Skill 文件（~/.claude/skills/<author>.md）一键起 book-persona.json 初稿。

用法:
  python3 init-persona-from-skill.py --skill ~/.claude/skills/yujun.md --out learn/yujun-product-methodology/book-persona.json
  python3 init-persona-from-skill.py --skill <path> --out <path> --name "俞军" --tagline "前百度产品总监"

逻辑:
  1) 读 skill markdown 文件
  2) 抽 yaml frontmatter → persona.name / tagline / intro
  3) 用一组启发式正则识别"核心模型"小节（### 核心模型 / Core Model / Layer 0/1/2/3）
  4) 每个小节提取标题做 model.title，提取关键 bullet 做 keywords/principles
  5) 输出 JSON 初稿，留 TODO 注释提示人工调优
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


HEADING_RE = re.compile(r"^(#{2,4})\s+(.+?)\s*$")
MODEL_HINT_RE = re.compile(r"(核心模型|核心理论|Core\s+Model|Framework|理论|模型)", re.I)
KEYWORD_HINT_RE = re.compile(r"(口头禅|常见问题|关键词|Keywords|追问)", re.I)


def parse_frontmatter(text: str) -> tuple[dict, str]:
    if not text.startswith("---"):
        return {}, text
    end = text.find("\n---", 3)
    if end < 0:
        return {}, text
    fm_raw = text[3:end].strip()
    fm = {}
    for line in fm_raw.splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            fm[k.strip()] = v.strip().strip('"').strip(">").strip()
    body = text[end + 4:]
    return fm, body


def split_sections(body: str) -> list[dict]:
    """按 ## / ### 标题切分章节。"""
    lines = body.splitlines()
    sections = []
    cur = None
    for line in lines:
        m = HEADING_RE.match(line)
        if m:
            if cur:
                sections.append(cur)
            cur = {"level": len(m.group(1)), "title": m.group(2).strip(), "body": []}
        elif cur:
            cur["body"].append(line)
    if cur:
        sections.append(cur)
    return sections


def extract_bullets(body_lines: list[str]) -> list[str]:
    bullets = []
    for ln in body_lines:
        s = ln.strip()
        if s.startswith(("- ", "* ", "+ ", "1.", "2.", "3.", "4.", "5.")):
            t = re.sub(r"^[\-*+]\s+|^\d+\.\s+", "", s).strip()
            t = re.sub(r"\*\*([^*]+)\*\*", r"\1", t)
            if t:
                bullets.append(t)
    return bullets


def extract_quotes(body_lines: list[str]) -> list[str]:
    quotes = []
    for ln in body_lines:
        s = ln.strip()
        m = re.match(r"^[「\"](.+?)[」\"]\s*$", s)
        if m:
            quotes.append(m.group(1))
    return quotes


def make_id(title: str, idx: int) -> str:
    slug = re.sub(r"[^\w\u4e00-\u9fff]+", "-", title.lower()).strip("-")
    slug = re.sub(r"[\u4e00-\u9fff]+", "model", slug) or f"model-{idx}"
    return slug[:40] or f"model-{idx}"


def heuristic_keywords(title: str, body_lines: list[str]) -> list[str]:
    """从标题 + 头几行 + 引号短语提取候选 keywords。"""
    kw = set()
    # 标题词
    for w in re.findall(r"[\u4e00-\u9fff]{2,6}|[A-Za-z]{2,}", title):
        kw.add(w)
    # 头 10 行的加粗词
    head = "\n".join(body_lines[:20])
    for m in re.findall(r"\*\*([^*]{2,12})\*\*", head):
        kw.add(m.strip())
    return sorted(kw, key=lambda x: -len(x))[:10]


def build_persona(skill_path: Path, name_override: str = "", tagline_override: str = "") -> dict:
    text = skill_path.read_text(encoding="utf-8")
    fm, body = parse_frontmatter(text)
    sections = split_sections(body)

    # Persona meta
    desc = fm.get("description", "")
    intro = desc
    name = name_override or fm.get("name", skill_path.stem).split("-")[-1].title()
    tagline = tagline_override or (desc.split("，")[0] if desc else "")

    principles = []
    for s in sections:
        if "Layer 0" in s["title"] or "性格" in s["title"]:
            principles = extract_bullets(s["body"])[:7]
            break

    # Models
    models = []
    for i, s in enumerate(sections):
        if not MODEL_HINT_RE.search(s["title"]):
            continue
        if s["level"] not in (3, 4):
            continue
        title = re.sub(r"^(核心模型[一二三四五六七八九十]+[：:]?\s*)", "", s["title"]).strip()
        title = re.sub(r"^Core\s+Model\s+\d+:?\s*", "", title, flags=re.I).strip()
        if not title:
            continue
        body_lines = s["body"]
        bullets = extract_bullets(body_lines)
        quotes = extract_quotes(body_lines)
        core_lines = [ln for ln in body_lines[:8] if ln.strip() and not ln.strip().startswith(("-", "*", "#", "|", ">"))]
        core = " ".join(l.strip() for l in core_lines).strip()[:280]
        if not core and bullets:
            core = "；".join(bullets[:3])
        models.append({
            "id": make_id(title, i),
            "title": title,
            "keywords": heuristic_keywords(title, body_lines),
            "core": core or "（请人工补充核心论述）",
            "callout": quotes[0] if quotes else "",
            "questions": bullets[:4] if bullets else ["（请补充作者会反问的问题）"],
            "bookSearchTerms": [title],
            "sectionRefs": []
        })

    return {
        "_note": "从 AI Skill 自动生成的 persona 初稿。请人工调优：keywords 命中率 / core 字数 / sectionRefs 章节号。",
        "_source": str(skill_path),
        "persona": {
            "name": name,
            "tagline": tagline,
            "intro": intro,
            "principles": principles
        },
        "models": models
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--skill", required=True, help="作者 AI Skill 路径，如 ~/.claude/skills/yujun.md")
    ap.add_argument("--out", required=True, help="输出 book-persona.json 路径")
    ap.add_argument("--name", default="", help="作者名（覆盖自动提取）")
    ap.add_argument("--tagline", default="", help="作者 tagline（覆盖自动提取）")
    args = ap.parse_args()

    skill_path = Path(args.skill).expanduser()
    if not skill_path.is_file():
        print(f"❌ Skill file not found: {skill_path}", file=sys.stderr)
        sys.exit(1)

    persona = build_persona(skill_path, args.name, args.tagline)
    out_path = Path(args.out).expanduser()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(persona, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✓ Wrote {out_path}")
    print(f"  persona.name = {persona['persona']['name']}")
    print(f"  {len(persona['models'])} models extracted")
    print(f"  Next: 1) 调 keywords 覆盖白话提问句  2) 补 sectionRefs 章节号  3) 跑命中自测 10 题")


if __name__ == "__main__":
    main()
