---
name: card-experience-economy
description: Maintain Starry Sprouts' five-star card experience economy, including same-name feeding across board and bench, star-up thresholds, star-scaled card prices, highest-star purchase offers, save compatibility, UI labels, localization, and regression tests. Use when changing card EXP, duplicate feeding, star progression, unit prices, shop economy, or related documentation in this project.
---

# Card Experience Economy

## Purpose

Use this skill to change or review the progression economy without breaking the
relationship between unit data, board feeding, shop purchases, UI labels,
localization, saves, and tests.

Treat the following rules as the current project baseline. If a user changes a
rule, update the implementation, specification, translations, and tests
together.

## Canonical Rules

### Card progression

- Keep the maximum at five stars.
- Group duplicates by `typeId`, not by star, across both `state.board` and
  `state.bench`.
- Keep the highest-star unit; break ties with higher current EXP, then prefer a
  board unit. Consume the other same-name units into the keeper.
- Each consumed unit grants exactly 1 card EXP.
- Use these EXP requirements: `1★→2★: 2`, `2★→3★: 3`,
  `3★→4★: 4`, and `4★→5★: 5`.
- Reset EXP to zero after a star-up. A 5★ unit has `MAX` progress and must not
  consume additional duplicates that cannot provide value.
- Preserve the existing strength coefficients:
  `1★=1.0`, `2★=1.8`, `3★=3.2`, `4★=4.8`, `5★=6.8`.

### Prices

- Keep `units.js` `cost` as the base rarity cost used to build shop pools.
- Calculate the current card price with `app.UnitData.price(typeId, star)`.
- Apply star multipliers `{ 1: 1, 2: 2, 3: 4, 4: 7, 5: 11 }` to the base cost.
- Make both `ShopSystem.buy` and `ShopUI` use the calculated 1★ price for
  shop offers. Show the current calculated price on owned-card displays and
  tooltips when the UI exposes a unit's value.

### Global card EXP purchase

`EconomySystem.getCardExperienceOffer(state)` must use the highest owned star
across board and bench. Keep this offer ladder:

| Highest owned star | Gold cost | EXP granted to every owned unit |
| --- | ---: | ---: |
| 1★ | 4 | 4 |
| 2★ | 6 | 3 |
| 3★ | 8 | 2 |
| 4★ | 10 | 1 |
| 5★ | 12 | 1 |

The purchase must deduct the offer cost, call
`BoardSystem.addExperienceToAll(state, offer.amount)`, then call
`BoardSystem.autoMerge(state)` so purchased EXP and duplicate feeding resolve
in one action. Do not confuse card EXP with player level EXP; player level EXP
still comes from round settlement.

## Change Workflow

1. Inspect `js/data/units.js`, `js/core/boardSystem.js`,
   `js/core/economySystem.js`, `js/core/shopSystem.js`, `js/core/gameState.js`,
   and the relevant UI and language files before changing a rule.
2. Keep formulas centralized. Add or adjust data helpers in `UnitData`, offer
   calculations in `EconomySystem`, feeding in `BoardSystem`, and purchase
   validation in `ShopSystem`; avoid duplicating numeric constants in UI code.
3. Update `js/ui/gameUI.js`, `js/ui/shopUI.js`, and `index.html` whenever a
   price or EXP offer changes. Dynamic purchase controls must show both
   `{cost}` and `{amount}` and disable from the calculated cost, not a stale
   hard-coded value.
4. Update all three dictionaries: `lang-zh-TW.js`, `lang-en.js`, and
   `lang-ja.js`. Keep help text and the in-game offer label consistent with the
   formula.
5. Update `auto-battler-spec.md` with the new rule and preserve save
   normalization in `gameState.js` when the unit shape changes.
6. Add focused tests in `tests/core.test.js` for star thresholds, price
   multipliers, cross-area feeding, offer tiers, and insufficient-gold paths.

## Project-Specific Pitfalls

- `index.html` loads `economySystem.js` before `boardSystem.js`; lazy calls to
  `app.BoardSystem` are safe, but top-level calls during module initialization
  are not.
- `BoardSystem.autoMerge` returns an Array for existing callers and attaches
  `events` and `totalExperience` properties for UI feedback. Preserve both
  interfaces when changing it.
- Tests load browser scripts in a VM. Objects created inside the VM can fail
  Node `assert.deepStrictEqual` because their prototypes are from another
  realm; assert scalar fields instead.
- Existing saves can contain units without `experience`. Normalize missing
  values to zero, clamp star and EXP ranges, and exercise the Continue path
  when changing migration behavior.
- Never infer that a 5★ duplicate should disappear. Preserve it unless a new
  explicit overflow rule is designed and tested.

## Validation

Run from the project root:

```powershell
npm test
Get-ChildItem -Path js -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
git diff --check
```

Also perform a lightweight static check for all `index.html` script references,
the three language hooks, `data-buy-xp-cost`, `UnitData.price`, and
`getCardExperienceOffer`.

For manual browser verification, open `index.html` locally and confirm:

- A same-name unit on the board and bench feeds into one card regardless of
  star.
- Card price badges rise at 1★, 2★, 3★, 4★, and 5★.
- The purchase control changes through `4💰/+4 EXP`, `6/+3`, `8/+2`,
  `10/+1`, and `12/+1` as the highest owned star changes.
- The control disables at the calculated cost and all board/bench cards move
  together when an offer is purchased.
- English, Japanese, and Traditional Chinese show the same numeric rules.
