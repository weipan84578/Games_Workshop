# Spec-Driven Offline Game Implementation Checklist

Use this checklist as a requirement ledger. Mark each item with evidence from a file, test, or manual check; do not mark an item complete from memory.

## 1. Discovery and specification

- [ ] Inspect repository instructions, skill files, worktree status, and existing user changes.
- [ ] Locate the canonical specification and identify whether mockups or reference images are normative.
- [ ] Read the specification with explicit UTF-8 decoding if terminal output is corrupted.
- [ ] List must-have behavior, should-have behavior, exclusions, and acceptance criteria.
- [ ] Map every requirement to a target module, asset, style, or test.
- [ ] Record contradictions and choose a conservative interpretation with rationale.
- [ ] Separate existing implementation facts from requested future behavior.

## 2. Direct-launch architecture

- [ ] Confirm `index.html` opens through `file://` without a server.
- [ ] Use classic scripts with an intentional dependency order.
- [ ] Avoid `type="module"`, dynamic imports, `fetch()`, XHR, CDNs, remote fonts, and runtime APIs that require HTTP.
- [ ] Keep all runtime images, icons, audio definitions, fonts, and styles local.
- [ ] Verify case-sensitive paths even when developing on Windows.
- [ ] Keep package installation and build commands out of the player launch path.
- [ ] Provide a clear fallback message if an unsupported browser feature is essential.

## 3. State and domain model

- [ ] Define one authoritative application state and explicit screen/session transitions.
- [ ] Store recipes, levels, thresholds, unlocks, upgrades, and tutorial content as data.
- [ ] Isolate pure calculations from DOM, audio, storage, and wall-clock access.
- [ ] Inject current time and randomness where deterministic tests need control.
- [ ] Define inclusive/exclusive boundaries for time, quality bands, score thresholds, and fail conditions.
- [ ] Prevent mutation after completion, failure, cancellation, or navigation away.
- [ ] Reset transient gesture and selection state on every relevant transition.

## 4. Core gameplay loop

- [ ] The player can start or continue from a valid state.
- [ ] Every preparation step has clear input, feedback, and completion criteria.
- [ ] Cooking progress uses the authoritative clock and remains stable across frame-rate changes.
- [ ] Assembly validates ingredients and ordering without relying on translated labels.
- [ ] Serving computes quality, score, rewards, and progression once.
- [ ] Success and failure summaries explain the result.
- [ ] Restart, next-day, home, and resume paths preserve only intended state.
- [ ] Content progression cannot enter an unwinnable state through malformed saved data.

## 5. Timing and lifecycle

- [ ] Use one `requestAnimationFrame` loop or one clearly owned scheduler.
- [ ] Derive countdowns from elapsed timestamps rather than decrementing arbitrary intervals.
- [ ] Pause or reconcile time on modal open, visibility change, blur, fullscreen transitions, and app suspension.
- [ ] Resume without double-starting loops, orders, music, or animation.
- [ ] Decide and test the exact event ordering at the deadline.
- [ ] Cancel stale callbacks when a session or screen is replaced.

## 6. Input safety

- [ ] Mouse, touch, pointer, and keyboard paths reach equivalent gameplay outcomes.
- [ ] Touch targets meet the specification's minimum size.
- [ ] Active gestures keep a stable pointer-capture target until release or cancellation.
- [ ] Touch hold does not trigger a later synthetic click action.
- [ ] Child selection controls do not bubble into parent drop zones unexpectedly.
- [ ] Drag coordinates are recalculated or cancelled after rotation and responsive layout changes.
- [ ] Keyboard focus order, activation keys, Escape handling, and focus restoration are explicit.
- [ ] Repeated keys and multi-touch cannot duplicate irreversible actions.

## 7. Persistence

- [ ] Probe storage availability before showing save-dependent controls.
- [ ] Wrap reads and writes in error handling.
- [ ] Include a schema version and migration or reset strategy.
- [ ] Sanitize types, ranges, enum values, arrays, and nested objects after parsing.
- [ ] Reject impossible progression and upgrade combinations.
- [ ] Separate permanent progress from current-session state.
- [ ] Offer a deliberate reset flow and avoid accidental destructive writes.

## 8. Localization

- [ ] Locale dictionaries have exact key parity.
- [ ] Missing keys fall back predictably and are detectable in tests.
- [ ] Gameplay data stores stable identifiers, not rendered translations.
- [ ] Dynamic values use placeholders or formatters rather than sentence concatenation.
- [ ] Language changes update the entire visible screen immediately.
- [ ] Document language metadata and `lang` attributes update correctly.
- [ ] Layout survives the longest supported translations.

## 9. Audio and feedback

- [ ] Audio initializes only after a valid user gesture.
- [ ] A preselected music track starts its scheduler after context creation or resume.
- [ ] Music and sound preferences persist independently if required.
- [ ] Pausing, hiding, and resuming do not create duplicate sources.
- [ ] Sound is supplemental; every important event also has visible feedback.
- [ ] Audio failures degrade silently without blocking gameplay.

## 10. Responsive UI and accessibility

- [ ] Test each specified desktop, tablet, portrait mobile, and landscape mobile layout.
- [ ] Main actions remain visible without overlap or unreachable scrolling.
- [ ] Body text and critical labels meet the specified minimum size.
- [ ] Focus indicators remain visible in every theme.
- [ ] Heat, quality, selection, validation, and errors use text, shape, icon, or pattern in addition to color.
- [ ] Reduced-motion mode removes nonessential movement without hiding state transitions.
- [ ] Dialogs trap focus when appropriate, remove all listeners on every close path, and restore focus.
- [ ] Accessible names remain meaningful after language and state changes.

## 11. Test coverage

- [ ] Unit tests cover formulas, thresholds, boundary times, progression, upgrades, and storage sanitization.
- [ ] Tests cover malformed, absent, old-version, and unavailable persisted data.
- [ ] Structural tests verify required files and all local references.
- [ ] Structural tests reject modules, network dependencies, and forbidden loading patterns.
- [ ] Tests verify script dependency order where classic globals depend on earlier files.
- [ ] Tests verify exact localization-key parity.
- [ ] JavaScript syntax checks pass for every source and test file.
- [ ] The complete automated suite passes from a clean process.

## 12. Manual acceptance

- [ ] Open the game by double-clicking `index.html`.
- [ ] Complete at least one full success path and one failure path.
- [ ] Exercise mouse, touch or device emulation, and keyboard input where available.
- [ ] Check pause/resume through modal, blur, and visibility changes.
- [ ] Check save, reload, continue, settings persistence, and reset.
- [ ] Switch every language and theme on multiple viewport sizes.
- [ ] Check audio unlock, mute, resume, and repeated navigation.
- [ ] Record which checks were actually manual and which remain unverified.

## 13. Handoff

- [ ] Re-read the canonical specification and reconcile the ledger.
- [ ] Run `scripts/validate_offline_game.ps1` from this skill.
- [ ] Report the direct launch method and optional test command.
- [ ] Summarize implemented features with source-backed wording.
- [ ] Report test counts and results without inflating coverage.
- [ ] Disclose assumptions, deviations, and limitations.
- [ ] Preserve unrelated work and show the final changed-file scope.
