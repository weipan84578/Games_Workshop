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
- Prevention rule: for game screens, verify desktop, tablet, phone portrait, mid-width, and short landscape layout behavior before declaring done, including CSS cascade order.
- Tripwire: inspect `css/layout/rwd.css`, `css/components/board.css`, and `css/components/hud.css` together whenever game controls or board layout changes, and assert `rwd.css` loads after component CSS in `index.html`.

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

## 2026-07-08 RWD cascade regression

- Mistake class: missing verification.
- Failure mode: responsive rules existed, but `rwd.css` loaded before component styles. Later component selectors overrode the mobile media-query rules, leaving the phone layout in a desktop two-column state.
- Detection signal: user provided a screenshot where the HUD consumed the left side and the board was squeezed into a thin right strip.
- Prevention rule: responsive override files must load after the component CSS they override, or use a clearly stronger override layer.
- Tripwire: run a CSS order check that confirms `css/layout/rwd.css` appears after `css/components/board.css`, `css/components/hud.css`, `css/components/buttons.css`, and `css/animations/animations.css` in `index.html`.

## 2026-07-08 empty-directory cleanup mistake

- Mistake class: unsafe change scope / missing verification.
- Failure mode: the first empty-directory cleanup attempted to remove the protected `.agents` directory repeatedly, then timed out. The follow-up exclusion regex was malformed and produced parse errors.
- Detection signal: PowerShell reported repeated access-denied errors for `.agents`, followed by regex parse errors.
- Prevention rule: before deleting empty directories, enumerate candidates first, exclude dot/tool directories by path segments instead of fragile regex, and stop the cleanup loop when no directory is successfully removed.
- Tripwire: use a read-only candidate list before `Remove-Item`, and explicitly exclude `.git`, `.agents`, and `.codex`.
