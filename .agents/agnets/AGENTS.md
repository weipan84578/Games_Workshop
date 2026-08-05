# Bowling Repository Agent Instructions

## Mandatory browser-validation safety

Do not use shell-driven browser automation for this project when it requires
PowerShell to launch or remotely control Chrome or Edge.

The following methods are prohibited:

- Launching Chrome or Edge from PowerShell with `--remote-debugging-port`,
  `--headless`, or a temporary `--user-data-dir` for automated validation.
- Connecting to Chrome DevTools Protocol endpoints such as `/json/list`.
- Using `ClientWebSocket`, WebSocket commands, `Runtime.evaluate`, or injected
  CDP scripts to drive a browser.
- Retrying a blocked command through encoding, obfuscation, another shell, or
  a slightly modified remote-debugging technique.

If antivirus or the shell blocks a validation command, stop immediately,
report what was blocked, and do not retry that technique.

## Approved validation workflow

Use deterministic checks first:

```powershell
npm test
Get-ChildItem -Path js -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
git diff --check
```

Prefer unit tests and static structure tests. For visual, responsive, audio, or
canvas interaction checks that cannot be covered safely, provide the user with
a short manual checklist or use an approved product-integrated browser tool
that does not require shell-launched remote debugging.

## Preserve user-managed agent files

Treat both `Games_Workshop/.agents` and `Games_Workshop/Bowling/.agents` as
user-managed, version-controlled content. Do not delete, move, replace, or
clean up either directory or its skills unless the user explicitly requests
that exact action.
