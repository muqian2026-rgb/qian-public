---
name: skill-activation-test
description: >-
  Test whether a Cursor skill triggers correctly: 5 positive prompts, 3 negative,
  metadata audit. Use after writing or updating any SKILL.md. Pairs with book-learn-distill.
user-invocable: true
---

# Skill Activation Test

> QA gate for **your own** Agent Skills — not for third-party installs.

## When to use

- After Equip stage in [book-learn-distill](../../book-learn-distill/)
- After editing `description` or trigger phrases in any Skill
- Before publishing a Skill copy to a public repo

## Test protocol

### 1 · Positive triggers (5 phrases → should activate)

| # | User says | Activated? |
|---|-----------|------------|
| 1 | | ☐ |
| 2 | | ☐ |
| 3 | | ☐ |
| 4 | | ☐ |
| 5 | | ☐ |

Use varied wording — not copy-paste of `description`.

### 2 · Negative triggers (3 adjacent tasks → should NOT activate)

| # | User says | Should route to | False positive? |
|---|-----------|-----------------|-----------------|
| 1 | | | ☐ |
| 2 | | | ☐ |
| 3 | | | ☐ |

### 3 · Self-check question

Ask Agent: **"When would you use this skill?"**

Compare answer to intended triggers in SKILL.md.

### 4 · Metadata audit

- [ ] `description` contains clear trigger phrases
- [ ] Negative constraints in SKILL.md body
- [ ] Boundary vs similar Skills documented

### 5 · Verdict

- **Pass** → record date in project `meta.json` (`skillTestedAt`) if applicable
- **Fail** → revise SKILL.md; log in [references/template.md](./references/template.md)

## Agent instructions

When user says "run skill activation test for X":

1. Read `skills/<slug>/SKILL.md` (or path given)
2. Propose 5 positive + 3 negative test phrases **before** user runs them
3. After user reports results, output pass/fail table + fix list for description/triggers

## Reference

Blank template: [references/template.md](./references/template.md)
