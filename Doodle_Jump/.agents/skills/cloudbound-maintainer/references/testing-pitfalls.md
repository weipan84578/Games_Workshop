# Testing and known pitfalls

## Contents

- [Test runner](#test-runner)
- [Test placement](#test-placement)
- [Validation sequence](#validation-sequence)
- [Regression lessons](#regression-lessons)
- [Direct-file browser traps](#direct-file-browser-traps)
- [Handoff checklist](#handoff-checklist)

## Test runner

Open `tests/test-runner.html` directly. It loads production modules, registers unit and integration tests, then runs them sequentially through a Promise-aware harness. The page exposes total/pass/fail counts and module filtering.

The current baseline contains 64 declarations. Do not hard-code that count into maintenance scripts: require a positive total, zero failures, and passed equal total so new tests do not break the verifier.

The runner intentionally loads `core/app.js` to test `Game.AppClass` but has no `#app-shell`. Preserve the production autostart guard.

## Test placement

| Change | Minimum useful coverage |
|---|---|
| Math/physics/collision | Focused unit tests with boundary and direction cases |
| Platform/item/enemy | Lifecycle/effect tests, including string IDs and inactive state |
| Difficulty/generator | Formula monotonicity, many-seed observed ratios, type coverage, fairness invariants |
| Score | No double count, combo cap/break, one-time milestone |
| Save/storage | Valid round trip, nested corruption, old optional fields, write failure, caps |
| Input/settings | Final scaled state and conflict handling, not only sanitization |
| Audio | Gain math, gesture-pending state, auto track, idempotent selection |
| Rendering/performance | DPR/quality/reduced motion and downgrade/recovery hysteresis |
| RWD | Computed styles from actual production CSS in `srcdoc` viewports |
| App lifecycle | State transition, route mapping, pause/confirmation cancellation, BGM environment sync |
| Cross-module gameplay | Save/restore deterministic digest and long fixed-step finite/cap checks |

Return Promises from asynchronous tests. `DJTest.run` must await each callback in registration order and record rejection without aborting later tests.

## Validation sequence

During implementation:

1. Run `node --check` on edited JavaScript files.
2. Run the relevant browser module using the test-runner filter when practical.
3. Inspect the exact mutated state or computed style, not a duplicated approximation.

Before handoff:

1. Run `scripts/verify-project.ps1` from this skill.
2. Confirm all JavaScript passes syntax checking.
3. Confirm `git diff --check` succeeds.
4. Confirm the complete Edge direct-file test suite has no failures.
5. Confirm production `index.html` renders an active home page, the runtime version, and no generic JS error markers.
6. Inspect `git status --short` and remove only verifier-created temporary profiles.

For documentation-only work, validate links, anchors, listed paths, language order, and diff scope instead of rerunning unrelated gameplay tests.

## Regression lessons

These bugs have occurred or were specifically guarded against:

- **Vanishing platform:** A timer clamped to zero could fade out permanently. Use a signed out/in timer and reset touch state after fade-in.
- **Stored-but-inert settings:** Tilt sensitivity, reduced motion, shake, and quality controls once existed without reaching runtime consumers. Test the final effect.
- **Magnet/lucky:** Buff timers alone do nothing. Magnet must move eligible items; lucky must alter item selection probability.
- **Combo:** Incrementing combo without a fall-based break creates an endless combo. Track `comboPeakY` and reset after a screen of drop.
- **Generator fairness:** Independent high hazards can stack, and consecutive brittle/cloud platforms can remove the only route. Allow at most one hazard per main platform and keep rhythm metadata.
- **Item drought:** Raising average probability still permits long random gaps. Use the three-platform history guarantee.
- **Storage fallback:** After a persistent write throws, reads must prefer the in-memory copy over stale `localStorage`.
- **Nested save validation:** Top-level checks still accept `platforms: [null]` or broken buffs. Validate every nested element before restore.
- **Autosave snapshot order:** Mark the checkpoint before cloning so the saved snapshot contains it; roll back if the write fails.
- **Camera smoothing:** A lerp followed by unconditional assignment is still a snap. Assign only when within epsilon.
- **BGM auto selection:** Calling `setTrack` every fixed step must not reset the melody when the index is unchanged.
- **Nickname lifecycle:** Store the last valid name separately and restore it both at app startup and game-over form display.
- **Navigation bypass:** Brand/home links must use confirmation and the state machine; direct router calls can abandon active play.
- **Async harness:** A synchronous runner can report success before a Promise test finishes. Chain and await tests.
- **RWD tests:** Testing copied breakpoint equations proves the copy, not CSS. Load real styles into viewport-sized `srcdoc` iframes and inspect computed styles.

## Direct-file browser traps

- Never validate with `--allow-file-access-from-files`; passing only with that flag violates the product contract.
- A full application iframe loaded from another `file://` document has opaque-origin restrictions. Test App lifecycle through exported class methods and test CSS with `srcdoc` rather than depending on cross-file iframe access.
- Keep test resource paths relative to `tests/test-runner.html` and `srcdoc` fixtures.
- `app.js` must not instantiate on the runner page.
- Browser audio may remain suspended in headless mode; test state transitions with a fake context rather than audible output.
- Create a unique Edge user-data directory for headless checks, then remove only a verified profile under the system temp directory.
- Edge can emit harmless sync or network diagnostics on stderr after a successful DOM dump. Windows PowerShell may promote that native stderr to error records under `ErrorActionPreference = Stop`; suppress it locally, then judge the explicit exit code and dumped DOM.
- On PowerShell, `${env:ProgramFiles(x86)}` needs braces, and a single pipeline result must be wrapped with `@(...)` before indexing.

## Handoff checklist

- Lead with the observable outcome.
- List the main changed files and why they changed.
- Report targeted and complete verification counts.
- Disclose skipped browser/manual checks.
- State that no commit or push occurred unless the user requested one.
- Do not touch pre-existing `.agents` folders, user changes, or unrelated files.
- Do not claim a feature from `DOODLE_JUMP_GAME_SPEC.md` unless source/tests confirm it.
