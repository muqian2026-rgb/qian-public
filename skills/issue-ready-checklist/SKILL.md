---
name: issue-ready-checklist
description: >-
  Definition of Ready for GitHub Issues: AC, design link, no architecture blockers.
  Triggers on "issue ready", "ready for dev", "definition of ready", "check this issue".
user-invocable: true
---

# Issue Ready Checklist

> **Ready for dev** = AC complete + design linked + TL sign-off on architecture blockers.

Pairs with [issue-prd-architecture-workflow](../../docs/issue-prd-architecture-workflow.md) for full end-to-end flow.

## When to use

- Before moving an Issue to "In Progress"
- Product marks **Ready for dev**
- Sprint planning or async gate before IC picks up work

## Minimum Ready criteria

| # | Item | Required |
|---|------|----------|
| 1 | **Context / Goal** | Why this issue exists |
| 2 | **Acceptance Criteria (AC)** | Testable bullets; Given–When–Then OK |
| 3 | **Design link** | Frame or export path tied to this issue |
| 4 | **Architecture** | No open **blocker** from TL (comment or checkbox) |
| 5 | **Dependencies** | Linked issues or "none" stated |

## Recommended flow (short)

```
Epic → Issues with AC draft → TL feasibility / arch sketch → Design by issue → Ready gate → PR
```

**Key order**: architecture sketch **after** issue breakdown, **before** full design lock.

## Agent workflow

1. Read Issue body + comments.
2. Score each Ready row: ✅ / ⚠️ / ❌
3. If any ❌ on AC, design, or blocker → **Not Ready** + fix list
4. Suggest AC additions if vague ("works well" → concrete checks)

## Three things to adopt first (MVP switch)

1. Every large request: **Epic + child Issues + AC each** — no AC, no dev  
2. Ready gate: **AC + design link + TL no blocker**  
3. Before release: master PRD revision log aligns with merged PRs  

## Negative constraints

- Do not approve Ready if AC is empty or "TBD"
- Do not skip arch review because PRD is long
- Do not treat meeting verbal OK as Ready without Issue update

## Reference

Detailed checklist: [references/checklist.md](./references/checklist.md)
