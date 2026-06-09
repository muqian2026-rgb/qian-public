---
name: diagnose-apply-split
description: >-
  Split a methodology book into two Cursor skills: diagnose (analyze) and apply (produce).
  Template only — no copyrighted book content. Use with book-learn-distill Equip stage.
user-invocable: true
---

# Diagnose / Apply Split

> For **complex methodology books** where one Skill is too broad.  
> **Template only** — fill with your own learn/<slug> outputs; never paste copyrighted excerpts.

## When to split

| Signal | Action |
|--------|--------|
| Method has numbered steps **and** analysis frameworks | Consider split |
| Users ask both "review my plan" and "write the deliverable" | Split |
| Book is mostly reference / Q&A | Single Skill or HTML only |

## Two skills

| Skill | Job | Example triggers |
|-------|-----|------------------|
| **diagnose** | Analyze current state with book's **questions/frameworks** | "review this PRD", "what's wrong with our funnel" |
| **apply** | **Produce** structured output with book's steps/templates | "draft the spec", "fill the template" |

## Fictional example (not a real book)

**Book**: *Product Decision Patterns* (fictional)

| | diagnose | apply |
|---|----------|-------|
| **Trigger** | "evaluate this feature idea" | "write the one-pager" |
| **Input** | Problem statement + constraints | Approved direction from diagnose |
| **Output** | Gap list + risks + questions for stakeholders | Filled one-pager markdown |
| **Must not** | Write full spec | Re-run full market analysis |

## Agent workflow

1. User finishing [book-learn-distill](../../book-learn-distill/) Equip for a complex book
2. Read learn/<slug> framework + steps (user's private repo)
3. Copy [references/template.md](./references/template.md)
4. Draft two SKILL.md files: `skills/<slug>/diagnose/` and `skills/<slug>/apply/`
5. Run [skill-activation-test](../skill-activation-test/SKILL.md) on each

## Negative constraints

- Do not embed book excerpts in public copies
- Do not use real author personas without rights
- diagnose must not silently do apply's deliverable

## Reference

Blank split template: [references/template.md](./references/template.md)
