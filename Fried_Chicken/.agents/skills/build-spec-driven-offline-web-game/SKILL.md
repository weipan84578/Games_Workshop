---
name: build-spec-driven-offline-web-game
description: Build complete, responsive, offline browser games from detailed product or implementation specifications. Use when Codex must turn a spec.md or similar requirements document into a file://-ready HTML/CSS/JavaScript game with zero-build architecture, deterministic game rules, touch/mouse/keyboard input, local persistence, localization, Web Audio, accessibility, responsive layouts, and source-grounded tests; also use when auditing or finishing an existing spec-driven offline game.
---

# Build Spec-Driven Offline Web Games

## Overview

Turn a written game specification into a complete browser game that runs by opening `index.html` directly. Preserve the specification's intent while making the implementation deterministic, testable, responsive, accessible, and honest about limitations.

Read [references/implementation-checklist.md](references/implementation-checklist.md) before changing the project. Use it as the acceptance ledger throughout implementation.

## Workflow

### 1. Inspect the repository and decode the specification

- Inspect the worktree before editing and preserve unrelated user changes.
- Find the specification, existing entry points, source files, assets, tests, and repository-specific instructions.
- Read UTF-8 explicitly when a Windows shell displays mojibake. Do not reinterpret corrupted terminal output as source content.
- Separate requirements into must-have, should-have, explicitly excluded, and acceptance-test categories.
- Record contradictions, missing details, and implementation assumptions. Resolve them conservatively and never silently drift from the spec.

### 2. Establish the offline runtime contract

- Prefer plain HTML, CSS, and classic JavaScript when direct `file://` launch is required.
- Avoid ES modules, `fetch()`, CDNs, remote fonts, and runtime network dependencies.
- Load scripts in an explicit dependency order and expose one intentional application namespace.
- Keep assets local and verify every referenced path with the same casing used on disk.
- Do not introduce a package manager or build step unless the specification allows it. Development-only test tooling must not be required to play.

### 3. Build data and rules before presentation

- Model levels, recipes, upgrades, scoring, quality bands, timers, and unlocks as data.
- Keep rule calculations pure: provide inputs, return results, and avoid DOM or storage access.
- Make randomness injectable or seedable when tests must reproduce outcomes.
- Define boundary behavior explicitly, especially timer expiry, simultaneous events, and threshold inclusivity.
- Export pure modules for Node tests while also attaching them safely to `globalThis` for classic browser scripts.

### 4. Deliver a playable vertical slice

- Implement one complete loop first: start, prepare, cook, assemble, serve, score, and advance or fail.
- Confirm state transitions and reset behavior before multiplying content.
- Add remaining days, recipes, difficulty, upgrades, tutorials, and summaries through data-driven extension.
- Keep rendering separate from game-state mutation so rerenders do not change the rules.

### 5. Unify timing, input, and lifecycle

- Drive gameplay from one authoritative `requestAnimationFrame` clock.
- Pause timers, orders, animation, and sound coherently for dialogs, hidden tabs, window blur, and explicit pause states.
- Treat pointer, touch, mouse, and keyboard as first-class inputs; do not bolt one mode onto another afterward.
- Avoid replacing the active pointer-capture element during a gesture.
- Suppress synthetic clicks after touch holds and stop selected-item clicks from bubbling into destination drop zones.
- Cancel active drags when orientation or layout changes invalidate coordinates.

### 6. Add resilient platform services

- Probe `localStorage`, version saved data, sanitize every loaded field, and degrade gracefully when storage is unavailable.
- Disable or explain unavailable continuation flows instead of letting them fail later.
- Keep every locale dictionary at exact key parity, use translation keys for data-driven labels, and rerender immediately after language changes.
- Start or resume Web Audio only from a user gesture. If music was selected before an `AudioContext` existed, start its scheduler after the first valid gesture.
- Centralize fullscreen, visibility, audio, persistence, and lifecycle behavior behind small service boundaries.

### 7. Finish responsive and accessible behavior

- Test all specified viewport families, including landscape mobile and narrow desktop windows.
- Maintain readable type, adequate touch targets, visible focus, keyboard reachability, and non-color status cues.
- Ensure dialogs clean up every listener regardless of whether they close by button, backdrop, or Escape, then restore focus.
- Respect reduced-motion preferences and avoid animation that hides state changes.

### 8. Verify against the contract

- Write deterministic tests for rule boundaries, scoring, progression, storage sanitization, and failure states.
- Add structural tests for local paths, classic-script order, forbidden online dependencies, localization parity, and required files.
- Run `scripts/validate_offline_game.ps1` against the project root.
- Use only repository-approved browser validation. If automation is prohibited or risky, use deterministic tests plus a documented manual browser checklist.
- Re-read the specification after implementation and close every acceptance-ledger item with evidence.

### 9. Hand off truthfully

- Report what was implemented, how to launch it, and exactly which checks passed.
- Distinguish automated verification from manual inspection.
- Name any unresolved limitation or intentional deviation and connect it to the relevant requirement.
- Do not claim browser, audio, touch, fullscreen, or persistence behavior that was not actually exercised.

## Guardrails

- Do not let a late input mutate state after the session has finished; define whether input exactly on the deadline is accepted.
- Do not scatter independent timers across UI components.
- Do not trust persisted objects merely because JSON parsing succeeded.
- Do not encode translated display text as game logic identifiers.
- Do not use color as the only signal for heat, quality, errors, or selection.
- Do not hide balance contradictions by changing formulas without documenting the decision.
- Do not reformat or overwrite unrelated user work while implementing the game.

## Resources

- `references/implementation-checklist.md`: Read before implementation and revisit during final acceptance review.
- `scripts/validate_offline_game.ps1`: Run after structural changes and before handoff to check the offline contract, local references, JavaScript syntax, and Node tests.
