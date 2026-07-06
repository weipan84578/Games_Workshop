# Darts Web Game

Static, offline-capable darts game built from `darts-game-spec.md`.

## Run

Open `index.html` directly in a modern browser. No Node.js, npm, server, bundler, CDN, backend API, or install step is required.

## Features

- Modes: 501, 301, Cricket, Around the Clock.
- Opponents: 0 to 3 AI players, selected after pressing Start game.
- AI difficulty: Easy, Normal, Hard.
- Dartboard: SVG-rendered board with single, double, triple, outer bull, bullseye, and miss detection.
- Throw controls: pointer/touch press-and-release on the board, plus keyboard arrows and Space/Enter on desktop.
- Throw behavior: darts animate along an arc and land with realistic scatter based on release power and AI difficulty.
- Scoring: Double Out for 501/301, bust handling, Cricket marks/scoring, and Around the Clock progression.
- Settings: language, theme, BGM/SFX toggles, volume, and save management.
- Persistence: settings and the active match are saved with `localStorage`.
- Languages: Traditional Chinese, English, Japanese.
- Themes: classic board, neon arcade, sakura, dark steel.
- Audio: self-contained Web Audio synthesis for BGM and SFX.

## Verification

Recommended local checks:

```powershell
node --check .\js\core\storageManager.js
node --check .\js\i18n\translations.js
node --check .\js\i18n\i18nApply.js
node --check .\js\audio\audioManager.js
node --check .\js\game\scoringEngine.js
node --check .\js\game\dartboardRenderer.js
node --check .\js\main.js
```

Manual browser checks:

- Open `index.html` by double-clicking it.
- Press Start game, choose a mode, AI count, and AI difficulty, then start the match.
- Start each mode once and throw at single, double, triple, bull, and outside-board areas.
- Confirm 501/301 bust restores the score from the start of the turn.
- Confirm AI turns throw automatically and the dart flight curves before landing.
- Confirm settings persist after reload.
- Confirm the layout remains usable on narrow mobile width and desktop width.
