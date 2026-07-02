# Lessons

## 2026-07-02 commit_message_encoding

- Failure mode: A multilingual commit message written through PowerShell stdin to `git commit -F -` corrupted Japanese and Traditional Chinese text into question marks.
- Detection signal: `git show -s --format=%B HEAD` showed the English section correctly, but the Japanese and Traditional Chinese sections appeared as `???`.
- Prevention rule: For multilingual commit messages, write the message to a UTF-8 file first and commit with `git commit -F <file>`, then verify the stored message with `git show -s --format=%B HEAD`.
- Tripwire: Before considering a multilingual commit done, grep or visually inspect the latest commit body for the required section headers: `English:`, `日本語:`, and `繁體中文:`.

## 2026-07-02 unclear_settings_and_stalling_puck

- Failure mode: Settings used generic labels (`遊戲規則`, unlabeled low/medium/high controls, and operation settings) that did not match user-facing intent, and puck friction allowed rallies to stall.
- Detection signal: User reported that the settings names were unclear/unneeded and that a stopped puck caused AI to stop engaging.
- Prevention rule: Every settings control group needs an explicit domain label that names the actual value being changed, and arcade sports physics needs a minimum active speed or autonomous serve/recovery behavior.
- Tripwire: Before finalizing game settings, inspect the page with labels only and verify each control answers "what does this change?" without extra explanation.

## 2026-07-02 landscape_rwd_scroll

- Failure mode: The main menu used centered grid layout inside a non-scrolling app shell, so short landscape viewports could clip menu controls; the landscape orientation prompt applied only to the game screen.
- Detection signal: User reported that RWD was incomplete, the main screen needs a scrollbar, and the game should be landscape-oriented.
- Prevention rule: For landscape-first games, orientation enforcement must be global for mobile/tablet portrait, and every full-screen menu must have an overflow path for short landscape heights.
- Tripwire: Test or inspect mobile landscape at low heights and confirm the first screen can scroll without clipping primary actions.

## 2026-07-02 hud_icon_preservation

- Failure mode: HUD button layout work can accidentally replace or hide familiar control icons when adding text labels.
- Detection signal: User explicitly clarified that the original icons should not be changed.
- Prevention rule: When converting icon-only controls into icon-plus-text controls, preserve the existing icon glyphs and add labels around them instead of replacing the symbols.
- Tripwire: Before finalizing HUD changes, grep the HTML for the expected glyphs (`Ⅱ` and `♪`) and verify each appears exactly once.
