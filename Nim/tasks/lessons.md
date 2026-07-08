# Lessons

## 2026-07-08 UI and BGM correction pass

- Mistake class: misunderstanding requirements / missing UX verification.
- Failure mode: the first build kept extra convenience UI that the user did not want, including duplicate language controls, a header status label, and a Settings back button.
- Detection signal: user requested removal after reviewing the game.
- Prevention rule: before finishing UI work, scan first-screen and Settings text/buttons against the requested visible controls, and remove duplicate paths unless the user explicitly asked for them.
- Tripwire: run `rg "header-status|language-select|settings-back|menu-version"` after this correction class to catch removed controls returning.

- Mistake class: missing verification.
- Failure mode: BGM start logic was not idempotent, so screen switches and New Round could restart and briefly overlap scheduled Web Audio tones.
- Detection signal: user heard overlapping BGM during screen changes and New Round.
- Prevention rule: audio screen-transition APIs must be reentrant; same-mode transitions should sync volume only, and mode changes should cancel old timers and scheduled sources before scheduling new audio.
- Tripwire: include a VM audio-manager test that asserts one BGM timer across repeated `enterGameScreen()` / `leaveGameScreen()` calls.

- Mistake class: incorrect assumption about expected audio behavior.
- Failure mode: menu BGM used base volume while game BGM used 10x gain, but the user wanted menu volume to match game volume with game behavior as the source of truth.
- Detection signal: user requested main menu volume equal to game volume.
- Prevention rule: when a user says one screen's behavior is canonical, encode the shared behavior in one path instead of branching by screen.
- Tripwire: test that menu and game BGM gain values are equal for the same BGM volume setting.

## 2026-07-08 gameplay polish correction pass

- Mistake class: missing UX/RWD verification.
- Failure mode: the game screen layout worked functionally but did not look polished enough across responsive widths.
- Detection signal: user reported that in-game RWD was not good-looking.
- Prevention rule: for game screens, verify desktop, tablet, phone portrait, mid-width, and short landscape layout behavior before declaring done.
- Tripwire: inspect `css/layout/rwd.css`, `css/components/board.css`, and `css/components/hud.css` together whenever game controls or board layout changes.

- Mistake class: missing interaction feedback.
- Failure mode: pressing New Round immediately reset the board without a clear confirmation, and repeated feedback patterns risked stacked messages.
- Detection signal: user requested a prompt and explicitly called out stacked prompt risk.
- Prevention rule: destructive or state-resetting game actions need one clear reusable confirmation surface, not repeated inline messages.
- Tripwire: New Round must route through `ModalController.confirm()` or another singleton prompt path.

- Mistake class: incorrect assumption about generated audio acceptability.
- Failure mode: generated BGM loops were too short and became repetitive.
- Detection signal: user reported the main/game BGM felt too short and boring.
- Prevention rule: generated BGM needs phrase lengths long enough to avoid obvious short-loop fatigue; prefer 20+ note phrases and loop intervals of at least several seconds.
- Tripwire: test BGM phrase lengths and loop duration when changing `audio-config.js` or `audio-manager.js`.
