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
