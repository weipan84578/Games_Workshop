# 2026-07-03 sicbo_static_game

## Goal + Acceptance Criteria
- Build the pure static Sic Bo game described in `SicBo_spec.md`.
- `index.html` must open directly by double click / `file://` without npm, build tools, CDN, server, or `fetch()` for local data.
- Implement main menu, gameplay screen, help screen, settings screen, i18n for zh-TW/en/ja, LocalStorage save/continue, five themes, responsive desktop/tablet/mobile layouts, and correct Sic Bo payout rules.
- Keep project structured exactly by spec: `css/base`, `css/layout`, `css/components`, `css/themes`, `css/responsive`, `js/core`, `js/ui`, `js/audio`, `js/i18n`, `js/settings`, `js/storage`, `assets`, `docs-assets`.
- Do not create `README.md`.

## Risk & Rollback
- Risk level: low to medium. This is a new static app with no production backend, but broad surface area.
- Affected components: new HTML/CSS/JS/static asset files in this workspace.
- Rollback strategy: delete the generated app files or revert the workspace changes.
- Rollout plan: open `index.html` locally and test core flows before use.
- Monitoring signals: browser console errors, layout overlap at mobile/desktop widths, incorrect payout results.

## Dependencies & Environment
- Runtime: modern browser only. No Node/npm/build step.
- Required services: none.
- Storage: browser LocalStorage key `sicbo.save.v1`.
- Audio: generated Web Audio tones, no external audio files required for core functionality.
- Data loading: all dictionaries and bet metadata are JS globals, no local `fetch()`.

## Checklist
- [x] Restate goal + acceptance criteria
- [x] Locate existing implementation / patterns
- [x] Design: minimal approach + key decisions
- [x] Implement file structure and `index.html`
- [x] Implement i18n dictionaries and manager
- [x] Implement bet metadata, dice roller, payout calculator, betting logic, and game engine
- [x] Implement save/settings/theme/audio managers
- [x] Implement menu, board, modal, and animation controllers
- [x] Implement responsive CSS, themes, dice/chips/table styling, settings/help UI
- [x] Run verification: no npm/build, direct static file checks, browser console/manual smoke test where possible
- [x] Summarize changes + verification story
- [x] Record lessons if any correction or mistake occurs

## Working Notes
- `SicBo_spec.md` was read successfully as UTF-8.
- Workspace initially contained only `SicBo_spec.md`; no existing app patterns or tests were present.
- Must avoid ES modules to keep `file://` behavior reliable across browsers.
- Must avoid `fetch()` for local JSON; all app data goes into plain script-loaded JS globals.
- Subagents are not used because current tool policy only permits them when explicitly requested by the user.

## Results
- Built the static Sic Bo app from `SicBo_spec.md` with `index.html`, modular CSS/JS, i18n, gameplay, settings, storage, generated Web Audio, responsive layout, help content, and SVG betting map.
- Verification passed:
  - `node --check` over all `js/**/*.js`
  - deterministic payout checks for big/small/odd/total/single/double/any triple/specific triple/combo
  - `index.html` relative reference existence check
  - script load-order smoke test for all 20 scripts
  - no `fetch()` usage, no `type="module"`, no `README.md`
  - required folder structure exists
- Browser headless automation was attempted with Chrome and Edge against `file://` but the local headless environment did not produce DOM/screenshots; Chrome reported GPU/headless process errors and Edge returned only update-registry warnings. Manual browser opening remains the final visual smoke check.
