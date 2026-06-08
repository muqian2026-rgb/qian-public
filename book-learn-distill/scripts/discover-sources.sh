#!/usr/bin/env bash
# 生成 01b-source-discovery.md 骨架并打印 Tier 检查清单
set -euo pipefail
SLUG="${1:?usage: discover-sources.sh <slug>}"
REPO="$(cd "$(dirname "$0")/../../.." && pwd)"
OUT="$REPO/learn/$SLUG/01b-source-discovery.md"
mkdir -p "$REPO/learn/$SLUG"
if [[ -f "$OUT" ]]; then
  echo "exists: $OUT"
  head -20 "$OUT"
  exit 0
fi
cat > "$OUT" << EOF
# 电子书源 · ${SLUG}

检索日：$(date +%Y-%m-%d)

> 按 prompts/source-discovery.md 填写。Agent 须完成：作者官网、出版社、GitHub syllabus（不用 Tier X 镜像）。

## 书目 1

| 章节/范围 | Tier | URL | ingest |
|-----------|------|-----|--------|

## GitHub 检索结论

- 全书镜像：未发现 / 发现（标 X，不用）

## 门禁

请确认 ingest 范围。
EOF
echo "created: $OUT"
echo "--- Tier checklist ---"
echo "A=官方免费  B=课程链接/讲义  C=正版自有  D=仅购书  X=禁止"
