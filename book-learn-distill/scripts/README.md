# scripts · 读书蒸馏

实现期将以下脚本保存为 `.sh` 并 `chmod +x`（当前 plan 模式仅落盘 md，内容见下）。

## find-existing.sh

```bash
#!/usr/bin/env bash
set -euo pipefail
SLUG="${1:-}"
KEYWORD="${2:-$SLUG}"
REPO="$(cd "$(dirname "$0")/../../.." && pwd)"
echo "=== find-existing · slug=$SLUG ==="
for p in "$REPO/learn/$SLUG" "$REPO/skills/$SLUG" \
  "$REPO/wiki-knowledge-base/wiki/concepts/${SLUG}.md"; do
  [[ -e "$p" ]] && echo "HIT: $p"
done
command -v rg >/dev/null && rg -l -i "$KEYWORD" "$REPO/learn" "$REPO/skills" "$REPO/wiki-knowledge-base/wiki" 2>/dev/null | head -30
```

## sync-global-skills.sh

```bash
#!/usr/bin/env bash
set -euo pipefail
REPO="$(cd "$(dirname "$0")/../../.." && pwd)"
SLUG="${1:-}"
link_one() {
  local src="$1" name; name="$(basename "$src")"
  for D in "${HOME}/.cursor/skills" "${HOME}/.claude/skills"; do
    mkdir -p "$D"
    [[ -e "$D/$name" ]] || ln -s "$src" "$D/$name"
  done
}
if [[ -n "$SLUG" ]]; then link_one "$REPO/skills/$SLUG"
else for d in "$REPO"/skills/*/; do
  [[ "$(basename "$d")" == book-learn-distill ]] && continue
  link_one "$d"
done; fi
```

也可在 Agent 模式下运行：`bash scripts/link-skills-to-cursor.sh`（链全部 `skills/*`）。
