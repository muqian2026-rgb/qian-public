#!/usr/bin/env bash
set -euo pipefail
REPO="$(cd "$(dirname "$0")/../../.." && pwd)"
SLUG="${1:-}"
link_one() {
  local src="$1" name; name="$(basename "$src")"
  for D in "${HOME}/.cursor/skills" "${HOME}/.claude/skills"; do
    mkdir -p "$D"
    local t="$D/$name"
    if [[ -L "$t" ]] || [[ -e "$t" ]]; then echo "skip: $t"; else ln -s "$src" "$t" && echo "linked: $t"; fi
  done
}
if [[ -n "$SLUG" ]]; then
  [[ -d "$REPO/skills/$SLUG" ]] || { echo "missing $REPO/skills/$SLUG" >&2; exit 1; }
  link_one "$REPO/skills/$SLUG"
else
  for d in "$REPO"/skills/*/; do
    [[ "$(basename "$d")" == "book-learn-distill" ]] && continue
    link_one "$d"
  done
fi
echo "Done."
