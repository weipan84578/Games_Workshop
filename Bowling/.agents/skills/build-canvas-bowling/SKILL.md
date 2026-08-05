---
name: build-canvas-bowling
description: Build, refine, and debug deterministic responsive bowling games with Vanilla JavaScript and Canvas. Use for angle/power physics, collision-timed pin animation and audio, ten-frame scoring, direct-file fallback parity, transient-state resets, Web Audio, RWD controls, themes, persistence, and focused tests in this Bowling project or similar zero-build games.
---

# Build Canvas Bowling

Apply these implementation patterns when building or repairing the Bowling
game. Keep gameplay deterministic, keep rendering synchronized with physics,
and keep the ES Module and direct-file paths behaviorally equivalent.

## Start from clear ownership

- Keep scoring rules in a pure `scoring` module.
- Keep trajectory, collision order, and animation phases in a pure `physics`
  module.
- Let the game page coordinate input, audio, persistence, and settled results;
  do not duplicate domain rules in the UI.
- Let the renderer consume physics state. Do not let drawing code decide the
  score or invent a different trajectory.
- Organize the classic direct-file fallback into named sections and mirror the
  same constants and state transitions used by the module implementation.

## Model a throw deterministically

1. Clamp normalized direction and power at the input boundary.
2. Snapshot direction, power, and duration when the throw begins.
3. Disable or ignore aim and power changes while the ball is rolling.
4. Use direction to calculate the lateral path.
5. Use power to calculate travel duration, collision reach, and potential
   knockdown count without introducing random path movement.
6. Keep a centered full-power throw strong but not automatically perfect;
   reward a small pocket angle with a better collision chain.
7. Return impacted pin IDs in physical arrival order, not array order.

Use one lateral scale for all of the following:

- the live ball path;
- the aim guide;
- pin proximity calculations;
- the direct-file fallback renderer.

If these values differ, the guide can point to one location while the ball
travels to another.

## Synchronize contact, animation, and feedback

- Derive each pin's impact progress from its lane depth and the ball's eased
  forward travel.
- Keep every pin upright until the ball reaches that impact progress.
- Start fall rotation and drift from a local post-impact progress value.
- Detect the transition from upright to fallen in the update loop.
- Trigger pin-hit audio, particles, camera shake, and optional vibration at
  that transition rather than when the roll settles.
- Reserve strike and spare sounds for the scoring result after settlement.

This ordering keeps the visual event causal:

```text
launch -> rolling ball -> physical contact -> impact feedback -> pin fall -> scoring
```

## Reset transient state deliberately

Treat ready, rolling, paused, and settled values as different categories from
saved scoring data.

- Reset the ball to the approach and set visual progress to `0` after every
  settled roll.
- Reset impact-order and played-impact flags before the next throw.
- Reset transient physics when entering through Continue; restore rolls and
  frame context, not a stale ball position.
- Preserve an active physics state only for an intentional pause/settings
  round trip.
- Redraw ready-state control previews with progress `0`. A slider change must
  not reuse the previous throw's final progress.
- Clear transient state on restart and when abandoning an unfinished throw.

When a ball jumps toward the pin deck while adjusting power, inspect stale
visual progress before changing the trajectory formula.

## Build the Canvas scene for realism and RWD

- Use normalized lane coordinates and a single perspective conversion for the
  ball, pins, and guide.
- Cache static scenery; draw the moving ball, pins, trail, and particles each
  frame.
- Cap device pixel ratio to protect mobile performance.
- Resize on viewport and orientation changes.
- Use a real local bowling-alley image with a procedural fallback so missing
  or loading imagery never blocks play.
- Keep mobile controls in a safe-area-aware dock and reserve enough stage
  space so controls do not cover the pin deck.
- Apply theme palettes to live Canvas objects as well as DOM controls.
- Check high-contrast action text explicitly in dark themes.

## Keep audio usable offline

- Unlock Web Audio from the first genuine user interaction.
- Serialize BGM starts so screen transitions cannot overlap tracks.
- Synthesize melodies and short effects when packaged audio assets are not
  guaranteed.
- Separate BGM and SFX gain controls and apply a safety cap.
- Tie sounds to domain events: button, roll start, pin contact, strike, and
  spare.

## Maintain direct-file parity

When the project supports both ES Modules and a classic fallback, apply each
gameplay change to both paths in the same task.

Verify parity for:

- angle and power formulas;
- launch-parameter snapshots;
- control locking;
- ball reset and Continue behavior;
- impact timing and audio;
- scoring and save keys;
- languages, themes, and responsive controls.

Do not copy a large unstructured block merely to achieve parity. Keep named
sections, helper functions, and comments around non-obvious state transitions.

## Test the rules instead of frame timing

Add focused tests for invariant behavior:

- ready state contains one ball and ten upright pins;
- predictions stay between zero and ten;
- power changes travel time without changing a fixed direction's endpoint;
- pins remain upright during early travel;
- a roll settles with the expected result;
- a rolling throw cannot be replaced by another launch;
- perfect, spare, gutter, pending-bonus, and tenth-frame scoring is correct;
- corrupt saves are rejected and settings are normalized;
- both render paths reference the same scene and gameplay features;
- ready-state redraws use progress `0` and aim-guide constants match the path.

Run the project tests and JavaScript syntax checks after changes. Add a
regression test for every state bug that can be represented without a visual
browser assertion.

## Debug in this order

1. Reproduce the issue and identify the current phase: ready, rolling, paused,
   or settled.
2. Inspect stale transient state before changing physics constants.
3. Confirm launch inputs are snapshotted and controls are locked.
4. Compare aim, path, proximity, and fallback constants.
5. Confirm collision feedback is triggered by a newly hit pin.
6. Confirm settled scoring uses the legal remaining-pin context.
7. Add a focused regression test.
8. Apply the equivalent fix to the second runtime path.

## Definition of done

- The ball remains at the approach while adjusting ready-state controls.
- A fixed direction produces a smooth, monotonic path at every power.
- Direction and power visibly affect the result without random movement.
- Pins stay upright until contact and impact feedback occurs at contact.
- Continue and the next roll always begin from a clean transient state.
- Desktop and mobile controls remain usable without covering gameplay.
- Audio, localization, themes, persistence, and both startup paths remain in
  sync.
- Relevant tests and syntax checks pass.
