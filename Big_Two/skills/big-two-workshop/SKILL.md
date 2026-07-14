---
name: big-two-workshop
description: Implement and maintain this repository's pure front-end Big Two game from spec.md. Use for requests to build or change game rules, AI, storage, i18n, audio, themes, settings, dialogs, card and table layout, responsive behavior, accessibility, screenshot-based visual review, or app versioning while retaining direct file:// execution.
---

# Big Two Workshop

Work from the project root containing `spec.md`, `index.html`, `js/`, and `css/`.

## Route the task

- Read `spec.md` before broad implementation, rule changes, or ambiguous behavior changes.
- Read [references/project-map.md](references/project-map.md) before changing unfamiliar subsystems.
- Read [references/visual-guardrails.md](references/visual-guardrails.md) for themes, cards, table layout, settings, dialogs, or RWD work.
- Inspect the relevant source and current rendered UI before deciding the cause of a visual defect.

## Preserve project invariants

- Keep the app runnable by opening `index.html` directly with `file://`.
- Do not add a build step, server dependency, module loader, `fetch`, CDN, or remote runtime asset.
- Do not create a README or unrelated documentation.
- Preserve unrelated user edits and use focused patches.
- Keep table-play cards and the human hand as separate visual systems. Never fix one with a broad selector that silently changes the other.
- Keep all visible text translatable through the existing i18n dictionaries.
- Maintain keyboard focus, touch targets, safe-area spacing, reduced motion, and readable contrast.

## Execute changes

1. Locate the owning file with `rg` and inspect every later CSS rule that can override it.
2. Reproduce visual defects at the reported viewport and theme when screenshots are authorized.
3. Identify the structural cause before changing dimensions. Prefer fixing container math or selector scope over stacking overrides.
4. Implement the smallest coherent change with `apply_patch`.
5. For card work, explicitly classify the target as `.table-center .table-cards` or `.human-hand`; check rank, corner suit, center suit, overflow, overlap, and centering separately.
6. For a requested version update, change only `BigTwo.Config.APP_VERSION`. If no value is supplied, increment its major version. Do not change `SCHEMA_VERSION` unless persisted data actually changes.
7. Follow the user's validation scope. If the user says not to run tests, do not run the test suite. Use screenshots only when authorized.
8. Delete every temporary screenshot and Chrome profile after visual inspection. Verify the resolved deletion target remains inside the project.

## Capture visual states

Use the bundled script when a visual comparison is useful:

```powershell
node skills/big-two-workshop/scripts/capture-ui.js --root . --output .visual-check --screen game --theme midnight --viewports 1440x900,390x844,844x390 --table-demo diamonds
```

Use `--screen home`, `settings`, or `dialog` for those states. `--table-demo diamonds` injects visual-only table cards after normal rendering; never treat that fixture as a gameplay test.

After inspection, remove `.visual-check` with a path-contained cleanup command.

## Validate and report

- Run only validation authorized by the user and proportional to the change.
- When tests are allowed, prefer the existing `file://` browser test page for integrated checks.
- Report the changed behavior, the resulting app version, validation actually performed, and temporary-artifact cleanup.
- Never claim a visual issue is fixed until the relevant desktop and RWD states have been inspected when the task concerns both.
