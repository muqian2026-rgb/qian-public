#!/usr/bin/env bash
set -euo pipefail
SLUG="${1:-}"
KEYWORD="${2:-$SLUG}"
REPO="$(cd "$(dirname "$0")/../../.." && pwd)"
CLAUDE_SKILLS="${HOME}/.claude/skills"
CURSOR_SKILLS="${HOME}/.cursor/skills"
echo "=== find-existing · slug=$SLUG keyword=$KEYWORD ==="
echo "repo: $REPO"
[[ -n "$SLUG" ]] && for p in \
  "$REPO/learn/$SLUG" "$REPO/skills/$SLUG" \
  "$REPO/wiki-knowledge-base/wiki/concepts/${SLUG}.md" \
  "$REPO/wiki-knowledge-base/wiki/synthesis/${SLUG}-from-books.md" \
  "$CLAUDE_SKILLS/$SLUG" "$CURSOR_SKILLS/$SLUG"; do
  [[ -e "$p" ]] && echo "HIT: $p"
done
if command -v rg >/dev/null 2>&1 && [[ -n "$KEYWORD" ]]; then
  rg -l -i "$KEYWORD" "$REPO/learn" "$REPO/skills" "$REPO/wiki-knowledge-base/wiki" "$REPO/历史的skill" 2>/dev/null | head -30 || true
fi
echo "Done."
