# Basketball Arcade Project Contract

## Contents

1. Runtime constraints
2. Current gameplay rules
3. Physics and geometry
4. Architecture and ownership
5. Persistence and i18n
6. Audio and responsive layout

## Runtime constraints

- Entry point: `index.html`.
- Runtime: direct `file://`, no local server required.
- Stack: HTML5, CSS3, JavaScript ES6+, Canvas 2D, Web Audio API, localStorage, Pointer Events.
- Loading model: ordered traditional scripts using `window.BB`, avoiding `file://` ES Module CORS failures.
- Runtime dependencies: none.

## Current gameplay rules

### Five-ball lifecycle

Each of five balls follows:

```text
rack -> held -> flying -> returning -> rack
```

- All balls are independent and may fly simultaneously.
- Flying balls collide with one another.
- Scored or missed balls follow a cubic side-return path for about 1.65 seconds.
- A stage transition returns all five balls safely to the rack.

### Input

- Select only a ball in `rack` state near the pointer.
- Track the selected ball in `held` state while dragging.
- Ignore gestures shorter than about 35 Canvas units, downward gestures, or overly horizontal gestures.
- Scale power continuously with distance and cap it at 1950.
- Use the same Pointer Events path for mouse and touch.

### Stages

| Stage | Cumulative target | Time | Hoop speed | Range |
|---|---:|---:|---:|---:|
| 1 | 12 | 35s | 0 | 0 |
| 2 | 30 | 35s | 0.9 | 105 |
| 3 | 52 | 35s | 1.75 | 145 |

- Freeze timer and input during the stage-intro overlay.
- At Stage 1 or 2 timeout, advance only when the cumulative target is met.
- End the game after Stage 3 timeout or a failed target.

### Scoring

| Result | Base points |
|---|---:|
| Clean swish | 3 |
| Rim basket | 2 |

| Combo | Multiplier |
|---|---:|
| 0-1 | 1.0 |
| 2-3 | 1.2 |
| 4-5 | 1.5 |
| 6+ | 2.0 |

Each stage's final 10 seconds multiply the complete shot score by 2:

```text
round(base * comboMultiplier * doubleMultiplier)
```

## Physics and geometry

Current baseline values live in `js/utils/constants.js`:

| Constant | Baseline |
|---|---:|
| Canvas | 900 x 1120 |
| Gravity | 1800 |
| Air drag | 0.035 |
| Ball radius | 40 |
| Ball count | 5 |
| Hoop width | 190 |
| Rim collision radius | 5 |
| Rim restitution | 0.64 |
| Ball return duration | 1.65s |
| Double time | 10s |

Playable center opening:

```text
hoopWidth - 2 * (ballRadius + rimCollisionRadius)
```

The baseline yields 100px. Add a regression test whenever changing ball, rim, or hoop geometry.

Collision expectations:

- Integrate drag and gravity with a capped delta time.
- Reflect rim collisions using the circle-to-point normal.
- Transfer a fraction of moving-hoop horizontal velocity after contact.
- Apply cooldown after rim contact to avoid repeated same-frame jitter.
- Rebound from side cage and ceiling with energy loss.
- Separate overlapping flying balls, then exchange normal momentum.
- Score only on a downward center crossing inside the opening.

## Architecture and ownership

| Concern | Owner |
|---|---|
| DOM orchestration and routing | `js/main.js` |
| Main loop, five balls, scoring, stages, Canvas | `js/core/game-engine.js` |
| Trajectory, reflection, gesture velocity | `js/core/physics.js` |
| App states | `js/core/state-manager.js` |
| Versioned progress | `js/core/save-manager.js` |
| Pointer input | `js/ui/touch-controls.js` |
| AudioContext, BGM, SFX | `js/audio/audio-manager.js` |
| Melodic arrangements | `js/audio/sound-library.js` |
| Translation engine | `js/i18n/i18n-manager.js` |
| Language dictionaries | `js/i18n/lang-zh.js`, `lang-en.js`, `lang-ja.js` |
| Leaderboard safety and sorting | `js/data/leaderboard-manager.js` |
| Settings validation | `js/data/settings-schema.js` |
| Shared constants | `js/utils/constants.js` |
| Base visual layout | `css/pages/app.css` |
| Arcade presentation and RWD overrides | `css/pages/arcade.css` |
| Shared components | `css/components/ui.css` |
| Breakpoints | `css/layout/rwd.css` |

Keep the engine's domain logic out of `main.js`. Keep constants in one place and tests aligned with them.

## Persistence and i18n

| localStorage key | Content |
|---|---|
| `bb_shoot_settings` | Theme, volumes, trajectory, skin, language |
| `bb_shoot_save` | Versioned score, combo, time, and level |
| `bb_shoot_leaderboard` | Sanitized local Top 10 |

- Increment `SAVE_VERSION` for incompatible progress changes.
- Continue restores progress but resets physical balls to safe rack states.
- Escape nickname markup and cap length before storing or rendering.
- Keep all three language dictionaries key-identical.

## Audio and responsive layout

Audio:

- `TOUCH TO START` unlocks the AudioContext.
- Use menu, game, and victory modes.
- Preserve `BGM_VOLUME_MULTIPLIER = 10`, `GAIN_HARD_CAP = 3`, and compressor safety.

Responsive baseline:

| Viewport | Expected layout |
|---|---|
| 390 x 844 | Portrait HUD/control full width; proportional centered gameplay crop |
| 844 x 390 | HUD top; Canvas centered in left playable column; controls right |
| 820 x 1180 | Full tablet cabinet |
| 1180 x 900 | Full desktop cabinet scaled by height |

Never let CSS borders consume Canvas content dimensions. Preserve round balls by keeping the rendered Canvas ratio near `900/1120`.

