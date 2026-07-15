# Cloudbound architecture

## Contents

- [Runtime constraints](#runtime-constraints)
- [Folder ownership](#folder-ownership)
- [Bootstrap and dependency order](#bootstrap-and-dependency-order)
- [Runtime flow](#runtime-flow)
- [Application states](#application-states)
- [Simulation and rendering](#simulation-and-rendering)
- [Extension rules](#extension-rules)

## Runtime constraints

- Entry point: `index.html`.
- Technology: semantic HTML, layered CSS, classic deferred JavaScript, Canvas 2D, Web Audio, `localStorage`.
- No package manifest, build step, module loader, backend, fetch path, external image, font, or audio asset.
- Primary launch mode: direct `file://`. A static server is optional, never required.
- Shared namespace: `window.DJGame`; current version is declared in `js/core/namespace.js`.
- Logical game size: 420 × 720. Canvas DPR is capped at 2 and falls to 1 in low quality.

Do not introduce an ES-module/CORS requirement, asynchronous remote dependency, or generated bundle unless the user explicitly changes the product constraints.

## Folder ownership

| Path | Owner |
|---|---|
| `js/core/` | App composition, constants, event bus, state machine, fixed-step loop |
| `js/game/` | Mutable game state and deterministic rules |
| `js/rendering/` | Canvas/HUD projection of state; no gameplay mutation |
| `js/input/` | Keyboard, pointer, tilt, combined directional state |
| `js/audio/` | Web Audio graph, BGM sequencer, synthesized SFX |
| `js/data/` | Storage adapter, sanitizers, validators, persistence stores |
| `js/i18n/` | Locale engine and equal-key dictionaries |
| `js/ui/` | Router, screen controllers, modal, toast, DOM rendering |
| `js/utils/` | Math, PRNG, validation, performance monitoring |
| `css/` | Tokens → reset/base/layout → components/pages/themes/utilities → `main.css` |
| `tests/unit/` | Isolated rules and browser/CSS behavior |
| `tests/integration/` | Determinism, long-run limits, App lifecycle |

## Bootstrap and dependency order

`index.html` is the dependency manifest. Preserve this broad order:

1. Namespace and constants.
2. Event bus and utilities.
3. Storage and data stores.
4. I18n engine, then `zh-TW`, `en-US`, and `ja-JP` dictionaries.
5. State machine and game loop.
6. Game rule modules; load entity primitives before generator/session consumers.
7. Rendering modules; load Canvas/background/particles/sprites before renderer.
8. Input primitives before `input-manager.js`.
9. BGM/SFX primitives before `audio-manager.js`.
10. UI primitives/screens before `core/app.js`.

Mirror relevant source additions in `tests/test-runner.html`. The runner deliberately has no `#app-shell`, and `app.js` must retain that autostart guard so tests can load `Game.AppClass` without constructing the production app.

## Runtime flow

1. `DOMContentLoaded` constructs `App` only when `#app-shell` exists.
2. `App` loads sanitized settings, selects locale, binds pages/events, creates session/audio/rendering/input, applies settings, and routes home.
3. `GameLoop` uses `requestAnimationFrame`, accumulates elapsed time, and calls `step(1/120)` up to eight times per frame.
4. `GameSession.update` mutates player/world/score, emits events, extends and cleans the world.
5. `Renderer.render` interpolates player position and draws background/entities/particles; `HudRenderer` updates HTML statistics and buff chips.
6. The event bus maps land/collect/damage/milestone/pause/over events to SFX, particles, shake, announcements, saves, and screens.

Keep this direction of dependency: UI/App orchestrates; game modules do not query pages, storage, or audio.

## Application states

`Game.AppTransitions` is the authority:

| State | Allowed next states |
|---|---|
| `HOME` | `PLAYING`, `HELP`, `SETTINGS`, `LEADERBOARD` |
| `PLAYING` | `PAUSED`, `GAME_OVER` |
| `PAUSED` | `PLAYING`, `SETTINGS`, `HOME` |
| `HELP` | `HOME` |
| `SETTINGS` | `HOME`, `PAUSED` |
| `LEADERBOARD` | `HOME`, `PLAYING` |
| `GAME_OVER` | `HOME`, `PLAYING`, `LEADERBOARD` |

Route names are lowercase (`home`, `game`, `help`, `settings`, `leaderboard`); state names are uppercase. Use `App.transitionTo` before route mutation. Settings opened from pause must return to pause. A confirmation shown during active play must pause first and resume on cancellation.

## Simulation and rendering

Core constants in `js/core/constants.js`:

- Fixed step `1/120`, accumulator cap `0.25`, maximum eight simulation steps per frame.
- Gravity `1850`, base jump velocity `-780`, horizontal acceleration `1800`, horizontal speed cap `270`.
- Player 34 × 42, platform height 16, camera trigger Y 274, death line 784.
- Runtime caps: 40 platforms, 12 enemies, 15 items, 200 particles.

`Physics.update` owns previous/current position, gravity/rocket flight, directional acceleration, wind, drag, speed clamp, movement, and horizontal wrapping. `Camera.update` only follows upward and lerps toward the target. Mutate neither score nor generator state from rendering.

The performance monitor changes to low quality after more than three seconds below 45 FPS and restores high quality after more than 15 seconds above 56 FPS. Low quality sets Canvas DPR to 1 and reduces costly background/item effects; reduced motion also disables parallax, particles, and shake.

## Extension rules

- Add entity state through factory functions so snapshots contain plain JSON data.
- Keep methods stateless when possible; freeze exported service objects.
- Add new events to `Game.Events` and use payload objects with stable fields.
- Keep App setters idempotent when called each fixed step, especially BGM track and renderer quality selection.
- Update snapshot validation and old-save normalization with any persisted field.
- Add locale keys to all dictionaries and verify key-set parity.
- Update both entry HTML files for new classic scripts.
- Preserve object cleanup and caps for every new generated collection.
