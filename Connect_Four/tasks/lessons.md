# Lessons

## 2026-07-07 file_protocol_module_entry

- Mistake class: incorrect assumption about repo behavior / browser runtime behavior.
- Failure mode: the app entry script used `type="module"` even though the product requirement is direct `file://` execution by double-clicking `index.html`.
- Detection signal: user opened `index.html` and saw only the static background board, meaning CSS loaded but the JavaScript app did not render.
- Prevention rule: for strict zero-build `file://` apps, use classic script tags unless `file://` ES module loading is manually verified in the target browser. If the code does not use `import/export`, do not mark it as a module.
- Tripwire: before marking a double-click app done, grep `index.html` for `type="module"` and confirm whether it is required.

## 2026-07-07 result_modal_rwd

- Mistake class: missing verification / UI responsiveness oversight.
- Failure mode: the win/loss result dialog reused the generic modal layout, so the settlement UI did not have dedicated sizing, button flow, or short-height handling.
- Detection signal: user reported that victory/defeat RWD was not properly handled.
- Prevention rule: result, confirmation, and settlement dialogs need content-specific responsive rules, not only shared modal defaults.
- Tripwire: before finishing UI work, inspect modal variants at narrow phone width and short landscape height, and verify action buttons do not overflow or crowd the content.
