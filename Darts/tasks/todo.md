# 2026-07-06_darts_web_game

## Goal
Build the web Darts game described in `darts-game-spec.md` as a static, offline-capable frontend that can be opened directly from `index.html`.

## Acceptance Criteria
- [x] `index.html` opens without Node.js, npm, bundler, server, CDN, or backend API.
- [x] Main menu supports start, continue, instructions, settings, and visible saved-game state.
- [x] Gameplay supports 501, 301, Cricket, and Around the Clock with 1 to 4 players.
- [x] Dartboard is rendered in-browser with hit detection for singles, doubles, triples, bull, outer bull, and misses.
- [x] Pointer/touch interaction supports aim, charge, release, and visible dart hit markers.
- [x] Settings persist to `localStorage`: language, theme, BGM/SFX, volumes, animation, player count, start score.
- [x] Instructions use tabs and cover throw controls, board areas, scoring, modes, and accessibility.
- [x] i18n supports Traditional Chinese, English, and Japanese for user-facing UI.
- [x] Layout is responsive for mobile, tablet, desktop, and wide desktop.
- [x] Audio is available without external assets and respects mute/volume settings.
- [x] README documents how to run, feature scope, and verification.

## Risk & Rollback
- Risk level: medium, because this is a full new interactive app with broad UI/gameplay behavior.
- Affected components: new static HTML/CSS/JS assets and documentation.
- Rollback strategy: revert the new files/directories from this task; no migrations or external state beyond browser `localStorage`.
- Monitoring signals: manual browser console errors, gameplay state consistency, responsive layout checks.

## Dependencies & Environment
- Runtime: modern desktop/mobile browsers with HTML5, CSS3, ES6-capable JavaScript, SVG, and Web Audio API.
- Required services: none.
- External dependencies: none.
- Storage: browser `localStorage`.

## Plan
- [x] Restate goal + acceptance criteria
- [x] Locate existing implementation / patterns
- [x] Design: minimal approach + key decisions
- [x] Implement smallest safe slice
- [x] Add/adjust tests or deterministic checks
- [x] Run verification (static checks/manual repro)
- [x] Summarize changes + verification story
- [x] Record lessons (if any)

## Working Notes
- The repository currently contains only `darts-game-spec.md`; there is no existing app framework or package manifest.
- The spec requires direct `index.html` launch, so implementation must avoid module imports that can be blocked under `file://`.
- Use classic scripts and relative paths to keep offline/file launch reliable.
- Use SVG for the dartboard so hit zones, labels, and markers scale cleanly across viewports.
- Use Web Audio synthesis for BGM/SFX so the game remains self-contained without external media assets.

## Results
- Implemented a static Darts web game with `index.html`, layered CSS, classic JS modules, SVG dartboard rendering, Web Audio synthesis, i18n, settings, persistence, and README documentation.
- Verification passed:
  - `node --check` for all files under `js/`
  - static search for `type="module"`, external URLs, `cdn`, and `npm` returned no matches
  - Node scoring/hit-detection checks covered X01 bust restore, Double Out win, Cricket close/win, Around the Clock win, bull, double 20, and miss detection
  - Playwright headless opened `index.html` over `file://`, started a game, rendered the board, threw a dart, rendered a marker, and wrote a game log entry
  - Playwright screenshots checked desktop/mobile menu and desktop/mobile gameplay layouts
