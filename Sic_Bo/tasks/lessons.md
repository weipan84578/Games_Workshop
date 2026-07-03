# Lessons

## 2026-07-03 - i18n generated markup selector scope
- Mistake class: missing verification / incorrect DOM selector assumption.
- Failure mode: a broad `.help-card p` selector in generated help markup could target the first step card instead of the betting-map card after dynamic cards were inserted.
- Detection signal: local code review while checking i18n coverage found that the selector no longer pointed at the intended element after DOM mutation.
- Prevention rule: when generating nested dynamic UI, assign stable purpose-specific classes or references before inserting sibling dynamic content; avoid broad descendant selectors for later updates.
- Tripwire: grep for `querySelector(".help-card` or similar generic selectors before finalizing generated modal/card UI.

## 2026-07-03 - Temp directory evidence scope
- Mistake class: misunderstanding requirements.
- Failure mode: placed Playwright helper scripts and notes in `Temp/` after the user intended that directory to contain screenshots only.
- Detection signal: user correction explicitly said `Temp` is only for images and other files must be deleted.
- Prevention rule: when a user designates an evidence/output directory for a specific artifact type, keep only that artifact type there; put code changes in normal source files and keep transient automation inline or outside the restricted evidence folder.
- Tripwire: before writing to `Temp/`, check the file extension is an image type (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`).

## 2026-07-03 - Screenshot review must drive UI fixes
- Mistake class: missing verification.
- Failure mode: captured UI screenshots showed clipped help content, an unsuitable help-page map graphic, and inaccessible right-side game content, but the audit was treated as acceptable before those visible defects were fixed.
- Detection signal: user pointed to `Temp/fix` screenshots and listed the unresolved visual defects.
- Prevention rule: after Playwright captures, inspect the relevant screenshots manually and compare them against the spec before calling the UI compliant.
- Tripwire: for each user-reported screenshot defect, keep a matching before/after screenshot name and verify the fixed viewport with a concrete DOM visibility or bounding-box check.
