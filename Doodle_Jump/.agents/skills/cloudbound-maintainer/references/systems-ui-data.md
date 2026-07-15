# UI, data, and supporting systems

## Contents

- [Persistence](#persistence)
- [Settings and runtime consumers](#settings-and-runtime-consumers)
- [Input](#input)
- [Navigation and lifecycle](#navigation-and-lifecycle)
- [Audio](#audio)
- [Localization](#localization)
- [Responsive and accessibility behavior](#responsive-and-accessibility-behavior)
- [Performance and failure handling](#performance-and-failure-handling)

## Persistence

Storage keys:

| Key | Content |
|---|---|
| `djgame.settings.v1` | Sanitized settings object |
| `djgame.save.v1` | Validated continue snapshot |
| `djgame.leaderboard.v1` | Sorted, validated top-20 array |
| `djgame.player.v1` | Last valid nickname |

`Storage` probes `localStorage` once. If unavailable or a later write throws, write to the in-memory map and give that map read precedence. A successful persistent write deletes the memory override. Never let storage failure terminate play.

Save rules:

- Snapshot plain JSON and persist `rngState`; discard particles.
- Validate player, buffs, camera, score, each platform/item/enemy, allowed types, finite numbers, booleans, IDs, and array caps before restore.
- Normalize optional old fields in `GameState.fromSnapshot` (`comboPeakY`, checkpoint timestamps, track index, `itemType`, `hazardType`).
- Reset `over` and `reason` on restore.
- Auto-save at each new 100 m checkpoint, with at least 5000 ms between successful writes.
- Mark checkpoint metadata before snapshot so it is persisted, but roll the metadata back if snapshot/write fails.
- Pause, tab hiding, and confirmed home return save active play. Game over clears the continue save.

Leaderboard rules:

- Accept names of 1–12 Unicode code points after trim/control-character cleaning; use localized fallback only for a blank submission.
- Rank by score, then height, then earlier date; keep at most 20.
- Deduplicate submission IDs and use DOM `textContent` for names.
- Remember the last valid name separately.

## Settings and runtime consumers

Defaults are declared in `settings-store.js`:

- Audio: master 70, BGM 55, SFX 75, unmuted, automatic track.
- Controls: arrows, Escape, touch not swapped, tilt off, sensitivity 3.
- Accessibility: no forced high contrast, system reduced motion, medium particles, shake on.
- Language `zh-TW`, theme `pastel-sky`; first launch may replace language through browser detection.

Every setting needs a full chain:

1. `index.html` control with `data-setting` or `data-control`.
2. `SettingsScreen` read/change/render behavior.
3. `SettingsStore.sanitize` default and allowed range/value.
4. `App.applySettings` or another runtime consumer.
5. A regression test proving the effect, not only the stored value.

Key mappings must remain unique. Volume values are clamped 0–100 and converted to squared gain curves. Reduced motion uses `system`, `on`, or `off`; the explicit `off` class overrides the OS media query.

## Input

- `KeyboardInput` ignores form fields/content-editable targets and resets on window blur.
- Configured left/right/pause keys always retain `A`, `D`, and `P` as alternatives.
- `PointerInput` uses pointer capture when available, supports multiple pointers, and can swap logical directions.
- `TiltInput` asks permission only when enabled, low-pass filters `gamma`, applies a sensitivity-dependent dead zone/divisor, and falls back cleanly when denied.
- `InputManager` merges sources and cancels opposing directions.

Do not put touch controls inside Canvas; they must remain real buttons for hit area, safe-area placement, focus, and accessibility.

## Navigation and lifecycle

- `Router.go` hides all non-active pages, toggles `is-active`, updates `aria-hidden`, resets scroll, and focuses the destination heading unless `noFocus` is set.
- Use the application state machine before routing. Invalid transitions must return without mutating pages.
- Opening settings from pause records `returnToPause`; Back restores the pause overlay rather than starting play or going home.
- Brand/home navigation during active play pauses, confirms, saves on acceptance, and resumes on cancellation.
- Starting a new run with a continue save confirms before clearing it.
- Hiding the tab pauses active gameplay and audio; returning does not silently resume the session.
- A global runtime error stops the loop, freezes active play on the pause overlay, pauses BGM, and shows a localized warning.

## Audio

The Web Audio graph is:

```text
BGM oscillator → note envelope → fixed 10× boost → user BGM gain → limiter ┐
SFX oscillator → effect envelope → user SFX gain ───────────────────────────┤→ master gain → destination
```

- The dynamics compressor uses a near-brick-wall ratio to contain the fixed boost.
- Browser gesture unlock may be asynchronous. Keep `pendingBgm` until the context actually runs.
- Three eight-note BGM sequences are synthesized every 260 ms; SFX uses ten named frequencies with an eight-voice cap and short per-name debounce.
- `auto` track follows environment: morning/sky 0, sunset 1, night 2.
- `BgmPlayer.setTrack` must be idempotent. Reset the note only when the track changes; otherwise a fixed-step setter would replay the first note forever.
- Visibility pause lowers/stops BGM and restores it only after prior audio unlock.
- Treat unsupported Web Audio as a silent fallback, not a fatal error.

## Localization

- Supported locales: `zh-TW`, `en-US`, `ja-JP`; fallback is `zh-TW`.
- `I18n.apply` updates `[data-i18n]`, placeholders, ARIA labels, `<html lang>`, and document title.
- Keep dictionaries structurally identical; run the key-set parity test after adding keys.
- Interpolation returns text, and UI rendering must continue to use `textContent`.
- Localize numbers/dates through `Intl` with string fallback.

## Responsive and accessibility behavior

Breakpoints:

- Above 900 px: desktop game stage and sidebars; touch controls hidden.
- 900 px and below: sidebars hidden, touch controls displayed below the Canvas.
- 720 px and below: one-column documents/settings and compact HUD.
- 480 px and below: narrow home/actions, smaller Canvas chrome, two-column catalogs.
- Landscape at 520 px height or less: Canvas centered with touch buttons positioned at its sides.

Keep body minimum width 320 px and safe-area insets for touch/toast placement. Validate actual computed production CSS with `srcdoc` fixtures; do not duplicate breakpoint logic in JavaScript tests.

Accessibility features include semantic buttons/forms, visible focus, route heading focus, modal focus trapping/Escape, ARIA status/live regions, high contrast, OS-aware reduced motion, particle selection, and optional shake. Reduced motion must also reach Canvas parallax/particles/shake, not only CSS animation durations.

## Performance and failure handling

- Clean world entities to the camera band and slice to caps.
- Limit particle creation and disable it for reduced motion, low particle setting, or low quality.
- Low quality sets Canvas DPR to 1, removes item shadow, reduces background detail, particles, and shake.
- Keep three seconds of poor FPS before downgrade and 15 seconds of recovery before upgrade to prevent oscillation.
- Avoid allocations and DOM writes inside fixed steps unless necessary; HUD updates are render-side.
- Preserve playable fallbacks for Canvas/audio/storage errors and surface concise localized status through toast/live region.
