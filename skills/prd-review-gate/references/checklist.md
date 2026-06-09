# PRD Review Checklist

Use during **stage 4 · second review (95% gate)**.

## 1 · Document shape

- [ ] Single master PRD (no competing versions)
- [ ] Version/date in header matches QA matrix
- [ ] Revision log present if team uses one
- [ ] Stable section numbering for cross-references

## 2 · Numbers & business logic

- [ ] Thresholds, days, counts, prices updated everywhere they appear
- [ ] Logic switches (e.g. entitlement order) reflected in flows + copy + API notes
- [ ] Different product types use correct fields/copy (not one generic label)

## 3 · Forward & reverse flows

- [ ] Network: offline, weak network, toast vs full-screen
- [ ] Failure & retry: API fail, upload fail, max retries, fallback page
- [ ] Back navigation: payment/login/sheet return targets
- [ ] Session vs network errors: distinct copy and UI
- [ ] Permissions: camera/album/notification denied paths
- [ ] Long flows: local-only vs must-online stages
- [ ] Interrupt priority when multiple errors could stack

## 4 · Interaction

- [ ] Hit areas for primary CTA and nav icons
- [ ] States: default, pressed, disabled, loading, selected
- [ ] Transitions: full-page vs sheet; exceptions documented
- [ ] Blocking (alert) vs non-blocking (toast) per trigger

## 5 · Visual & assets

- [ ] Tokens / design file referenced
- [ ] Light/dark/immersive backgrounds if they vary by screen
- [ ] Asset paths, naming, @2x/@3x; single source for shared assets
- [ ] Accessibility called out where needed

## 6 · Copy & brand

- [ ] Terminology consistent (product name, button labels)
- [ ] English baseline or length limits for key strings
- [ ] Aligned with team copy guide if exists

## 7 · Scope & compliance

- [ ] **Out of scope** marked for design elements not shipping this release
- [ ] Store/legal: subscriptions, payments, first-run consent in dedicated section

## 8 · Acceptance

- [ ] Given–When–Then or scenario table for global rules
- [ ] Resource map: page ID ↔ design frame ↔ asset row
- [ ] Version ID matches release/QA docs

## Common failure patterns (quick scan)

1. Global rule says route A but old text still says route B → full-text search paths
2. Entitlement rules patched multiple times → split into phases early
3. New global rule not linked to design frames / asset rows
4. Filename, repo title, and test matrix version drift
