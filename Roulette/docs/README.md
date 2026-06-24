# Roulette Web Game

This project implements the `roulette-spec.md` requirements as a zero-dependency, pure frontend roulette game.

## Run

Open `index.html` directly in a modern browser. No build step or package install is required.

## Implemented

- Canvas roulette wheel with European and American wheel orders
- Interactive SVG betting board
- Player betting, clearing, payout calculation, history, and game-over checks
- AI opponent with easy, normal, and hard betting strategies
- Web Audio API generated BGM and SFX
- Local settings and game save through `localStorage`
- Traditional Chinese, English, and Japanese UI
- Five visual themes and responsive layouts
- Help tabs with bet explanations and a payout calculator

## Notes

The JavaScript is intentionally bundled into `js/main.js` as an IIFE so the game works when opened through `file://`. Splitting into ES modules can be done later if the project moves behind a local or hosted web server.
