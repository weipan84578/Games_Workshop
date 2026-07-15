# Gameplay and balance reference

## Contents

- [Core movement and collision](#core-movement-and-collision)
- [Platforms](#platforms)
- [Items and buffs](#items-and-buffs)
- [Enemies and hazards](#enemies-and-hazards)
- [Scoring and progression](#scoring-and-progression)
- [Difficulty curves](#difficulty-curves)
- [Generation safety](#generation-safety)
- [Balance workflow](#balance-workflow)

## Core movement and collision

- The player jumps automatically on landing; input controls horizontal movement only.
- Left/right screen edges wrap. Simultaneous left and right cancel.
- Land only while descending (`vy > 0`), crossing a platform top between previous/current frames, with at least 20% player-width overlap.
- Normal landing uses `JUMP_VELOCITY`; spring platforms multiply it by 1.45; spring shoes multiply the resulting next three jumps by 1.25.
- Rocket sets vertical velocity to `-520` while active and blocks damage.
- The camera follows upward only. Falling below `camera.y + DEATH_LINE` ends the run.
- Slow motion uses factor `0.65` for gravity/wind, platform timers/movement, and enemies.

Keep collision rules in `collision.js`, entity reactions in their entity modules, and orchestration in `session.js`.

## Platforms

| Type | Rule |
|---|---|
| `normal` | Stable |
| `moving` | Horizontal sinusoidal motion, amplitude 52, clamped on screen |
| `brittle` | Becomes inactive 0.18 s after first touch |
| `spring` | Landing multiplier 1.45 |
| `vanishing` | Signed two-second fade out and two-second fade in, then resets |
| `cloud` | Becomes inactive 0.22 s after touch |
| `spike` | Hazard platform; excluded from landing and main-path selection |

Main-path platform state also records optional `itemType` and `hazardType`. These fields preserve generator rhythm across saves and must default to `null` for old snapshots.

## Items and buffs

| Type | Score | Runtime effect |
|---|---:|---|
| `star` | 50 | None |
| `spring` | 25 | At least three stronger jumps |
| `rocket` | 25 | At least 2.8 s flight/invulnerability |
| `shield` | 25 | One blocked hit, expires after at most 8 s |
| `magnet` | 25 | At least 6 s attraction for nearby `star`/`lucky`, range 170 |
| `slow` | 25 | At least 4 s slow factor |
| `lucky` | 250 | At least 5 s and +0.25 rare-item chance, capped at 0.85 |

Repeated pickups use `Math.max`, not addition. Item animation phase derives from its string ID; do not feed non-numeric IDs into numeric-only PRNG helpers.

Rare pool stages:

- Below 60: stars only.
- 60–349: add spring, shield, magnet.
- 350–899: add rocket and slow.
- 900+: add lucky.

## Enemies and hazards

| Type | Rule |
|---|---|
| `monster` | Horizontal patrol. A descending top stomp deactivates it, rebounds at 0.9× jump velocity, and awards 200. Other contact damages. |
| `flyer` | Sinusoidal X/Y motion; cannot be stomped under current rules. |
| `hole` | 48 × 48 airborne collision hazard; no attraction force is implemented. |
| `spike` | Canvas platform collision hazard. |

`Player.hurt` returns `false` when already invulnerable or in rocket flight, `true` when a shield blocks the hit, and `null` when the run must end. Preserve those three meanings.

## Scoring and progression

- Add one point for each newly reached meter; never score the same height twice.
- Landing on a new platform adds `min(currentCombo, 3) × 10`.
- Falling more than one logical screen below `comboPeakY` breaks the current combo.
- Award 500 once at each new 500 m milestone.
- Environment thresholds: morning below 300, sky below 1000, sunset below 2500, night thereafter.
- Automatic BGM: morning/sky track 0, sunset track 1, night track 2.
- Game over clears the continue save. Leaderboard submission is optional and local.

## Difficulty curves

`Difficulty.get(height)` is the single source of spawn tuning. It uses asymptotic rising curves rather than abrupt late-game gates.

Unlock/cap parameters:

| Probability | Unlock | Asymptotic cap |
|---|---:|---:|
| Moving platform | 30 | 0.30 |
| Spring platform | 50 | 0.15 |
| Brittle platform | 90 | 0.18 |
| Vanishing platform | 140 | 0.14 |
| Cloud platform | 230 | 0.12 |
| Enemy | 50 | 0.32 |
| Spike | 130 | 0.22 |
| Hole | 380 | 0.14 |
| Flyer share among enemies | 350 | 0.52 |

Item chance starts at 0.24 and approaches 0.56. Rare chance unlocks after 20 and approaches 0.65. Platform width lerps 122 → 76, gap minimum 88 → 110, and gap maximum 122 → 150 by height 3000. Wind unlocks at 650 and caps at 0.8.

Representative raw rates from the current formulas:

| Height | Special platforms | Items | Rare share | Hazards |
|---:|---:|---:|---:|---:|
| 100 | 10.6% | 25.2% | 10.4% | 1.9% |
| 300 | 32.2% | 27.3% | 26.0% | 11.0% |
| 700 | 52.6% | 30.8% | 40.2% | 25.5% |
| 1500 | 67.5% | 35.7% | 50.6% | 40.4% |
| 3000 | 76.8% | 41.1% | 57.0% | 51.3% |

Hazard rates are raw. Actual output is lower because fragile platforms reject hazards and adjacent main-path hazards are forbidden.

## Generation safety

- Populate six normal opening platforms with 104–124 vertical gaps and one opening star.
- Keep horizontal step reach at or below 120 logical pixels.
- Select the highest active non-spike platform as the main-path predecessor.
- Force a special platform after four recent normal platforms once any special probability is available.
- Replace a generated brittle/cloud platform with normal when the previous main platform is also brittle/cloud.
- Do not generate a hazard when the prior main platform has `hazardType` or the new platform is brittle/cloud.
- Select at most one enemy/spike/hole category for a main platform.
- Force an item when the previous three main platforms have no `itemType`.
- Clean entities outside the camera band and enforce global object caps.

## Balance workflow

1. Change curves in `difficulty.js`; remove redundant generator height checks instead of adding another gate.
2. Run `node .agents/skills/cloudbound-maintainer/scripts/report-balance.js`.
3. Add monotonic formula assertions at several heights.
4. Sample many seeds and compare actual low/high ratios and type coverage.
5. Test reachability, no consecutive fragile platforms, no adjacent hazards, and item drought separately.
6. Run long deterministic updates and save/restore comparison.
7. Play at low, medium, and high heights when subjective feel matters; probabilities alone do not prove fun.
