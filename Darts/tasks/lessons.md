# Lessons

## 2026-07-06 UI contrast check

- Class: accessibility/UX oversight.
- Failure mode: Header text used the default panel text color while sitting directly on a dark page background, producing low contrast on the menu and gameplay screens.
- Detection signal: Playwright screenshots showed the `Darts` logo text and game header were hard to read before the contrast fix.
- Prevention rule: For every UI screen with text outside a panel/card, verify screenshot contrast for desktop and mobile, and define explicit foreground tokens for page-level hero/header text.

## 2026-07-06 Screenshot cleanup

- Class: missing cleanup after verification.
- Failure mode: Temporary Playwright screenshots were created for visual checks and not immediately removed after inspection.
- Detection signal: User reminded that generated screenshots should not be left behind.
- Prevention rule: Put screenshot-based verification images under `TEMP/`, delete the generated screenshot files once inspection is complete unless the user asks to keep them, then run a targeted temp-file check to confirm cleanup.
