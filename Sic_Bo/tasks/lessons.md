# Lessons

## 2026-07-03 - i18n generated markup selector scope
- Mistake class: missing verification / incorrect DOM selector assumption.
- Failure mode: a broad `.help-card p` selector in generated help markup could target the first step card instead of the betting-map card after dynamic cards were inserted.
- Detection signal: local code review while checking i18n coverage found that the selector no longer pointed at the intended element after DOM mutation.
- Prevention rule: when generating nested dynamic UI, assign stable purpose-specific classes or references before inserting sibling dynamic content; avoid broad descendant selectors for later updates.
- Tripwire: grep for `querySelector(".help-card` or similar generic selectors before finalizing generated modal/card UI.
