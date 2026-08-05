---
name: safe-browser-validation
description: Validate this Bowling project with low-risk tests and manual browser checks. Use whenever browser verification or browser automation is considered; prohibit the PowerShell/CDP/WebSocket method previously flagged by antivirus.
---

# Safe Browser Validation

## Mandatory safety reminder

Do not use the previously flagged browser-automation method in this project.

Never launch Chrome or Edge from PowerShell for automated validation with any of
the following patterns:

- `--remote-debugging-port` or a Chrome DevTools Protocol endpoint
- `ClientWebSocket`, WebSocket control, or requests to `/json/list`
- injected `Runtime.evaluate`/CDP scripts
- a PowerShell script that starts a headless browser and drives it remotely

Do not retry a security-blocked command by obfuscating it, changing shells, or
trying a similar remote-debugging variant. Stop and report the block instead.

## Safe validation workflow

1. Run the repository's deterministic checks first:

   ```powershell
   npm test
   Get-ChildItem -Path js -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
   git diff --check
   ```

2. Prefer unit tests and static structure tests for behavior that can be
   observed without a browser. Add a focused test rather than automating a
   browser just to inspect DOM state.

3. For visual or interaction checks that cannot be covered safely by tests,
   provide a short manual checklist and ask the user to open the local page in
   their own browser. Do not start a browser, remote-debugging endpoint, or
   WebSocket controller from the shell on the user's behalf.

4. If an approved browser connector or an existing product-integrated browser
   tool is available, use it only when it does not require shell-launched
   remote debugging. Otherwise stop at the deterministic checks and explain
   what remains for manual verification.

## Handling security warnings

If antivirus or the shell blocks a validation command:

- Treat the warning as authoritative and do not retry the same technique.
- State exactly which command category was blocked and whether it reached
  execution.
- Check for leftover processes or temporary files with read-only commands.
- Do not delete broad directories. Only remove a specifically identified,
  disposable artifact after confirming its absolute path and scope; if the
  shell safety policy rejects cleanup, leave it in place and tell the user.
- Continue with `npm test`, syntax checks, static inspection, and manual steps.

## Project-specific alternatives

For this zero-build Bowling app, use these checks instead of browser CDP
automation:

- Test physics, scoring, storage, audio definitions, and UI structure with
  `npm test`.
- Use `node --check` on every JavaScript file after edits.
- Inspect `git diff --check` and the changed files directly.
- Use manual browser verification for Continue/reset state, responsive layout,
  audio playback, and canvas animation. Tell the user the exact actions and
  expected result rather than automating those actions from PowerShell.
