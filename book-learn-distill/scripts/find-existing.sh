#!/usr/bin/env bash
set -euo pipefail
SLUG="${1:-}"
KEYWORD="${2:-$SLUG}"
REPO="$(cd "$(dirname "$0")/../../.." && pwd)"
LIBRARY="${BOOK_LIBRARY_ROOT:-图书馆}"
CLAUDE_SKILLS="${HOME}/.claude/skills"
CURSOR_SKILLS="${HOME}/.cursor/skills"
echo "=== find-existing · slug=$SLUG keyword=$KEYWORD ==="
echo "repo: $REPO"
[[ -n "$SLUG" ]] && for p in \
  "$LIBRARY/方法论/$SLUG" "$LIBRARY/经典/$SLUG" "$LIBRARY/学科/$SLUG" \
  "$REPO/skills/$SLUG" \
  "$REPO/wiki/wiki/concepts/${SLUG}.md" \
  "$REPO/wiki/wiki/synthesis/${SLUG}-from-books.md" \
  "$CLAUDE_SKILLS/$SLUG" "$CURSOR_SKILLS/$SLUG"; do
  [[ -e "$p" ]] && echo "HIT: $p"
done
if command -v rg >/dev/null 2>&1 && [[ -n "$KEYWORD" ]]; then
  rg -l -i "$KEYWORD" "$LIBRARY" "$REPO/skills" "$REPO/wiki/wiki" "$REPO/skills/_archive" 2>/dev/null | head -30 || true
fi
echo "Done."
