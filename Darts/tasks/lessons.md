# Lessons

## 2026-07-06 UI contrast check

- Class: accessibility/UX oversight.
- Failure mode: Header text used the default panel text color while sitting directly on a dark page background, producing low contrast on the menu and gameplay screens.
- Detection signal: Playwright screenshots showed the `Darts` logo text and game header were hard to read before the contrast fix.
- Prevention rule: For every UI screen with text outside a panel/card, verify screenshot contrast for desktop and mobile, and define explicit foreground tokens for page-level hero/header text.
