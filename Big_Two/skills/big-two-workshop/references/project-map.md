# Project map

## Runtime contract

- Entry point: `index.html`
- Specification: `spec.md`
- Runtime model: ordered classic scripts attached to `window.BigTwo`
- Supported launch: direct `file://`; no server or build required
- App version: `BigTwo.Config.APP_VERSION` in `js/config/constants.js`
- Save schema: `BigTwo.Config.SCHEMA_VERSION`; change only for persisted-data migrations

## JavaScript ownership

| Area | Primary files |
| --- | --- |
| Constants and themes | `js/config/constants.js`, `js/config/themes.js` |
| Helpers and validation | `js/utils/` |
| Rules and comparison | `js/core/` |
| Game state and turns | `js/game/` |
| AI difficulty behavior | `js/ai/` |
| Persistence | `js/storage/`, `js/game/save-controller.js` |
| Music and sound effects | `js/audio/` |
| Translation dictionaries | `js/i18n/` |
| Shared rendering | `js/ui/` |
| Screen composition | `js/screens/` |
| Application coordination | `js/app.js` |

Important public namespaces include `BigTwo.Rules`, `BigTwo.Game`, `BigTwo.AI`, `BigTwo.Storage`, `BigTwo.UI`, `BigTwo.Screens`, and `BigTwo.App`.

## CSS cascade order

`index.html` loads styles in this order:

1. `css/base/`
2. `css/components/`
3. `css/screens/`
4. `css/themes/`
5. `css/responsive/desktop.css`
6. `css/responsive/tablet.css`
7. `css/responsive/mobile.css`
8. `css/responsive/landscape.css`

Always inspect later theme and responsive rules before concluding that an earlier declaration is active.

## Key UI selectors

| Element | Selectors |
| --- | --- |
| Game header | `.game-status-bar`, `.game-status-bar__details` |
| Table shell | `.game-table-wrap`, `.game-table` |
| AI seat | `.player-seat`, `[data-seat="left|top|right"]` |
| Current player | `.player-seat.is-current`, `[aria-current="true"]` |
| Central play stage | `.table-center`, `.table-center__status` |
| Cards on table | `.table-center .table-cards`, `.table-center .card` |
| Human hand | `.human-zone`, `.human-hand-wrap`, `.human-hand` |
| Action controls | `.action-bar` |
| Dialog | `dialog.modal`, `.modal__panel`, `.modal__close` |
| Settings row | `.setting-row` |
| Volume input | `.range-control input[type="range"]` |

## Responsive tiers

- Desktop: `min-width: 1024px`
- Tablet: `768px` through `1023px`
- Mobile: `max-width: 767px`
- Small mobile: `max-width: 479px`
- Short landscape: landscape with `max-height: 700px`

The fixed action bar consumes vertical space through `--action-bar-height`; account for it rather than placing content beneath it.

## Existing validation surface

- Browser runner: `tests/index.html`
- Specs: `tests/specs/`
- Test framework: `tests/framework/test-runner.js`

Respect an explicit request not to run tests. Screenshot inspection is not permission to run the test suite.
