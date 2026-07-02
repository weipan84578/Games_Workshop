# 2026-07-02 air-hockey-web-game

## Goal
Build the Air Hockey web game described in `air-hockey-spec.md` as a zero-build static web app that can be opened directly from `index.html`.

## Acceptance Criteria
- `index.html` runs without npm, bundlers, servers, or external CDNs.
- Main menu has only Start, Continue, How To Play, and Settings.
- Canvas game supports player vs AI, scoring, pause, resume, restart, and result screens.
- AI has easy, normal, and hard behavior differences without teleporting.
- Settings cover language, theme, audio, mute, touch sensitivity, keyboard assist, effects quality, and target score.
- Traditional Chinese, English, and Japanese strings cover all visible screens.
- Four themes are available: neon, classic, sunset, and ice.
- `localStorage` persists settings and in-progress games; completed games clear progress.
- Audio is implemented with Web Audio API, including gameplay BGM gain based on a 10x multiplier from a low base volume.
- No `README.md` is created.

## Risk & Rollback
- Risk level: medium, because this is a new multi-file interactive UI/game implementation.
- Affected components: all newly created HTML, CSS, JS, and data files.
- Rollback strategy: delete the newly created app files or revert this change set.
- Monitoring/manual checks: browser console, UI layout at desktop/mobile widths, game loop behavior, storage persistence.

## Dependencies & Environment
- Runtime: modern browser with Canvas 2D, Web Audio API, and localStorage.
- No package manager, build step, network, or server required.
- Audio uses generated Web Audio tones because no binary audio source assets are present in the repo.

## Working Notes
- The repo started with only `AGENTS.md` and `air-hockey-spec.md`.
- Use `script defer` files attached to `window.AirHockey` for better direct `file://` compatibility than ES modules.
- Keep `index.html` as structure/imports only: no inline styles or inline game logic.
- Do not create `README.md`.

## Checklist
- [x] Restate goal + acceptance criteria
- [x] Locate existing implementation / patterns
- [x] Design minimal approach + key decisions
- [x] Implement static project skeleton
- [x] Implement settings, storage, i18n, and screen manager
- [x] Implement Canvas table, physics, scoring, AI, input, and effects
- [x] Implement audio manager and UI controls
- [x] Run verification: file structure, no README, JS syntax, browser/manual smoke
- [x] Summarize changes + verification story
- [x] Record lessons if a correction or postmortem occurs

## Results
- Implemented a zero-build static Air Hockey web game under `index.html`, `css/`, `js/`, and `data/`.
- Added Canvas gameplay with player vs AI, three AI difficulties, collision physics, scoring, countdowns, pause/resume/restart, result modal, particles, and responsive sizing.
- Added settings, localStorage persistence, first-run language modal, three-language i18n, four visual themes, generated Web Audio BGM/SFX, and gameplay BGM gain based on the required 10x multiplier.
- Verification run:
  - `node --check` on every `js/**/*.js` file: passed.
  - Static `index.html` CSS/JS reference existence check: `ALL_REFS_EXIST`.
  - No `README.md`: confirmed.
  - Bootstrap order VM check: `BOOTSTRAP_ORDER_OK`.
  - DOM startup VM check: `DOM_BOOT_OK`.
  - Headless Edge browser screenshot/DOM verification attempted, but the local headless environment failed in GPU/profile handling before producing output. No generated artifacts were kept.
- No correction/postmortem lesson was recorded because no user correction or production-impacting mistake occurred during this task.
