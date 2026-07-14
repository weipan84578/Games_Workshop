# Visual guardrails

## Diagnose before styling

Check computed ownership in this order:

1. DOM class emitted by the renderer
2. Base component style
3. Screen-specific override
4. Theme override
5. Active responsive override
6. Content dimensions and overflow

A screenshot can show the symptom but not which layer owns it.

## Table shell and center stage

- Never combine `width: 100%` with additional horizontal margins on `.game-table`; it overflows and makes every child appear off-center.
- On desktop, subtract intentional gutters from the width and use `margin-inline: auto`.
- Keep the outer table frame symmetric and thinner than the central content boundary.
- Center `.table-center` against the actual table content box, not the viewport.
- Keep enough internal width for five fully visible cards at every supported viewport.

## Cards played on the table

Treat table cards independently from the human hand.

- Renderer container: `.table-center .table-cards`
- Do not attach `.playing-cards` to this container.
- Use `justify-content: center`, a positive `gap`, and zero adjacent-card margin.
- Do not use the human-hand negative overlap margin.
- Size central rank and suit glyphs for `--table-card-width`, not the browser width alone.
- Ensure diamond, heart, club, and spade glyphs stay entirely inside the card's content box.
- Prefer a two-row central-card grid: compact rank plus a centered main suit. Hide redundant corner suit glyphs when vertical space is constrained.
- Keep the visual fixture in `capture-ui.js` separate from game state.

## Human hand

- Preserve horizontal scrolling and the minimum visible/clickable portion of every card.
- Negative overlap is allowed only here.
- Give `.human-hand .card__corner` an explicit gap and `line-height: 1` so rank and corner suit do not touch.
- Scale rank, corner suit, and center suit separately for tablet, mobile, and short landscape.
- Keep selected-card vertical translation within the hand's top padding or it will be clipped by `overflow-y: hidden`.
- Do not reuse central-card typography rules for the human hand.

## AI seats and turn state

- Use the highlighted border and `aria-current` to indicate the active AI.
- Do not add a repeated visible "turn of X" line or arrow inside the seat.
- Keep name and remaining-card count visible while the seat is active.
- Render PASS as a small edge badge, not a centered overlay that hides player information.

## Midnight theme

- Explicitly style native `select` and `option` foreground/background colors.
- Give header status chips, player seats, and central status text high-contrast surfaces.
- Give `.modal__close` a theme-specific foreground, fill, border, and focus-visible contrast.
- Verify closed selects and the expanded native option list separately when possible.

## Range controls

WebKit track fill uses `--range-progress`. Initialize it from `(value - min) / (max - min)` and update it on every `input` event. Firefox uses `::-moz-range-progress`.

## Dialogs

- Center `dialog.modal` with fixed positioning and a transform or equivalent robust centering.
- Keep the panel within safe-area and dynamic-viewport limits.
- Use a single-character close icon with a translated `aria-label`.
- Maintain clear space between the title and close control at every viewport.

## Screenshot review

Recommended states:

- Desktop: `1440x900`
- Mobile portrait: `390x844`
- Short mobile: `320x568`
- Mobile landscape: `844x390`
- Short web window: `1440x650`

Inspect outer-frame symmetry, central-card completeness, hand readability, fixed controls, dialog centering, native-control contrast, and horizontal overflow. Delete screenshots and browser profiles after review.
