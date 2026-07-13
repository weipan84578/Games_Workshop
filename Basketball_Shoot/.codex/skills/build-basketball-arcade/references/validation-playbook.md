# Validation and Documentation Playbook

## Contents

1. Test ladder
2. Playwright workflow
3. Visual assertions
4. Known test pitfalls
5. Documentation contract
6. Cleanup and handoff

## Test ladder

Run the cheapest checks first:

```powershell
$files = rg --files -g "*.js"
foreach ($file in $files) { node --check $file }
node tests/node-verify.js
```

Then run browser tests through `tests/test-runner.html`. The expected count can grow; trust the runner and update Playwright's expected summary when adding cases.

Current coverage includes:

- Gravity, trajectory, reflection, and circular rim bounce.
- Flick direction, distance scaling, and power cap.
- Five-ball count and return duration.
- Stage targets and hoop-speed progression.
- Final-ten-second double scoring.
- State transitions and save-version fallback.
- Language key equality and fallback.
- Audio 10x raw gain and hard cap.
- Leaderboard sorting, Top 10, and XSS escaping.
- Settings boundary repair.
- Forgiving hoop-opening geometry.

## Playwright workflow

The project does not keep Playwright as a runtime dependency. Install it temporarily when needed:

```powershell
npm install --prefix "$env:TEMP\bb-playwright" playwright-core@latest --no-save --no-package-lock
$env:PLAYWRIGHT_CORE="$env:TEMP\bb-playwright\node_modules\playwright-core"
$env:CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
node tests/playwright-visual-test.js
```

The test script writes screenshots under the operating-system temporary directory, verifies them, and deletes them in `finally`.

Afterward, safely remove the temporary dependency after confirming its resolved path remains under `$env:TEMP`.

## Visual assertions

Validate at least:

- Audio gate and main-menu BGM start after a gesture.
- Main-menu leaderboard opens and renders an actual row.
- Five balls initialize on the rack.
- Two or more balls can fly independently.
- A ball remains `returning` mid-path and becomes `rack` after the full duration.
- Downward hoop crossing scores.
- Final-ten-second scoring gains at least the doubled base value.
- Side-cage boundary reverses outward horizontal velocity.
- Stage 1 advances only after target; Stage 2 moves; Stage 3 is faster.
- Browser unit-test summary matches the current count.
- Desktop, phone portrait, phone landscape, and tablet have no horizontal document overflow.
- Canvas stays proportional and centered in its playable area.

Use viewport screenshots for fixed dialogs. Use full-page screenshots for static pages and test reports.

## Known test pitfalls

### Animated buttons appear unstable

Playwright may refuse to click a continuously pulsing element. Use `{ force: true }` only after confirming the locator uniquely identifies the intended control.

### Canvas screenshot tearing

The render loop may clear the Canvas while a screenshot is captured. Pause the engine, capture, then resume.

### Fixed Modal appears blurred

Wait for the Modal's pop animation to finish, then take a viewport screenshot instead of `fullPage: true`.

### Synthetic score is disturbed by other balls

Return all other balls to rack state before injecting a deterministic crossing. Advance `updateFlyingBall` with a fixed delta while paused.

### Landscape centering false positive

When controls occupy the right column, compare Canvas center to the left playable column center, not the full viewport center.

### OneDrive restores deleted screenshots

Do not store Playwright screenshots inside the synced repository. Use `os.tmpdir()` and verify no `.png`, `.jpg`, or `.jpeg` remains in the workspace.

## Documentation contract

When updating `README.md`:

- Keep complete English, Japanese, and Traditional Chinese sections.
- Default section order: English -> Japanese -> Traditional Chinese.
- Preserve explicit HTML anchors for reliable navigation.
- Update gameplay, constants, stages, tests, and file maps when implementation changes.
- Use concise tables, icons, code blocks, and a top quick-navigation matrix.
- Explain that runtime needs no installation; separate optional test dependencies clearly.
- Keep test counts synchronized with actual results.

## Cleanup and handoff

Before completion:

```powershell
$images = @(rg --files -g "*.png" -g "*.jpg" -g "*.jpeg")
```

- Require zero test screenshots in the repository.
- Require no project-local temporary `node_modules`.
- Confirm `README.md` anchors and language order when edited.
- Report syntax result, unit-test count, Playwright coverage, screenshot deletion, and dependency cleanup.

