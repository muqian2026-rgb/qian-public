---
name: prd-review-gate
description: >-
  PRD completeness gate before dev: boundary → module breakdown → 95% review checklist.
  Triggers on "PRD review", "review this PRD", "PRD gate", "acceptance criteria check".
user-invocable: true
---

# PRD Review Gate

> Run a **95% completeness gate** before engineering starts.  
> Source: distilled from a B2C mobile app PRD iteration process (de-identified).

## When to use

- Before marking an Epic/Issue **Ready for dev**
- After PRD draft, before full design lock
- When QA keeps asking "what about edge case X?"

## Five-stage production flow

| # | Stage | Output |
|---|-------|--------|
| 1 | **Boundary** | Scope in/out/deferred + user value + key assumptions; design sketch optional |
| 2 | **Module breakdown** | Tech modules (pages, APIs, data, permissions); enables parallel issues |
| 3 | **Write by module** | Single master PRD; one section per module |
| 4 | **Second review (gate)** | Checklist → target **~95% completeness** before dev |
| 5 | **Acceptance** | Given–When–Then / scenario table aligned with QA matrix |

**95% means**: dev/QA rarely ask "this isn't written" — not word count.

## Agent workflow

1. Read the PRD (or section) the user points to.
2. Walk [references/checklist.md](./references/checklist.md) section by section.
3. Output:
   - **Pass / Block** with reason
   - Missing items as a numbered list
   - Suggested AC additions (draft bullets)
4. Do **not** rewrite the whole PRD unless asked.

## Document principles

| Principle | Rule |
|-----------|------|
| Single master PRD | One source of truth; no parallel PRD forks |
| Revision log | Optional footer: version, date, summary |
| Stable sections | Global rules → pages/scenarios → assets/API → acceptance |

## Negative constraints

- Do not invent business numbers without source
- Do not replace TL architecture decisions
- Flag "out of scope" items explicitly if design shows them

## Reference

Full checklist: [references/checklist.md](./references/checklist.md)
