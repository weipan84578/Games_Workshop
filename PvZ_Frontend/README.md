# Garden Defenders Frontend

Plants-vs-Zombies style browser game built with HTML, CSS, and vanilla JavaScript.

## Run

Open `index.html` directly in a browser. No build step or dev server is required.

## File Structure

```text
PvZ_Frontend/
├─ index.html
├─ css/
│  └─ styles.css
├─ js/
│  ├─ data.js
│  ├─ save-system.js
│  ├─ audio.js
│  ├─ state.js
│  ├─ ui.js
│  ├─ game-systems.js
│  └─ main.js
├─ PvZ_Frontend_Spec.md
└─ README.md
```

## Responsibilities

### `index.html`

Contains the static DOM structure only:

- Main menu
- Plant selection screen
- Game HUD and lawn board container
- Pause, result, settings, and encyclopedia overlays
- CSS and JavaScript file references

### `css/styles.css`

Contains all visual styling and responsive layout rules:

- Menu, plant selection, HUD, board, entities, overlays, encyclopedia
- Plant, zombie, projectile, sun, mower, and animation styles
- Mobile and landscape RWD rules

### `js/data.js`

Contains static game data and generated level data:

- Global constants: rows, columns, max level, save key
- `PlantDefs`: 30 plant definitions
- `ZombieDefs`: 20 zombie/enemy definitions
- 50-level wave generator
- Day/night level metadata through generated level behavior

### `js/save-system.js`

Owns persistence through `localStorage`:

- Default save data
- Load/save helpers
- High score recording
- Formal progression unlocks

Practice mode does not record score or unlock formal progression.

### `js/audio.js`

Owns Web Audio API behavior:

- Audio graph setup
- Master/music/SFX volume control
- Procedural sound effects
- Menu and battle music loops

### `js/state.js`

Owns shared runtime state and common helpers:

- `State`
- DOM references
- Current phase, selected level, selected plants, entities, timers
- Day/night helpers
- Level selection helpers
- Common UI helpers such as toast, vibration, and time formatting

### `js/ui.js`

Owns UI construction and player interaction:

- Board construction
- Plant selection list and selected slots
- Encyclopedia rendering
- HUD plant cards
- Auto-sun toggle display
- Plant placement and shovel removal
- Sun collection
- Wave spawn scheduling
- Zombie/projectile creation helpers

### `js/game-systems.js`

Owns the game simulation and rendering:

- Main update pipeline
- Plant behavior
- Zombie behavior
- Projectile collision
- Sun lifetime and optional auto-collection
- Lawnmower behavior
- Win/lose checks
- DOM rendering for plants, zombies, projectiles, suns, and mowers

### `js/main.js`

Owns startup and event wiring:

- `requestAnimationFrame` game loop
- Main menu buttons
- Practice mode entry
- Plant selection navigation
- Shovel and auto-sun controls
- Pause/result/settings overlays
- Initial board, plant selection, and first render setup

## Script Load Order

The scripts are classic browser scripts and depend on load order:

1. `data.js`
2. `save-system.js`
3. `audio.js`
4. `state.js`
5. `ui.js`
6. `game-systems.js`
7. `main.js`

Keep this order in `index.html` unless the code is converted to ES modules.
