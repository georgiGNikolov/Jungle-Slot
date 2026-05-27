# Slot Assignment

A 5-reel × 3-payline slot machine demo built with **Cocos Creator 3.8.6** and **TypeScript**. Features a mock backend with 10 paylines, paytable-driven win evaluation, wild substitution, animated payline displays, per-line win popups, and an animated total-win counter.

Built as an interview deliverable, so the scope is deliberately small: one scene, no persistence, no real backend.

---

## Running it

1. Install [Cocos Creator 3.8.6](https://www.cocos.com/en/creator).
2. Open the project folder in Cocos Dashboard.
3. Open [assets/scenes/main.scene](assets/scenes/main.scene).
4. Press **Play** in the editor (top toolbar).

---

## Architecture at a glance

Seven scripts, each with a single responsibility. `Main` is the only orchestrator; everything else is driven by it.

```
                            ┌─────────────────┐
                            │      Main       │  ← root component on Canvas
                            │  (orchestrator) │
                            └────────┬────────┘
                                     │
   ┌──────────┬──────────────┬──────────────┬──────────┬──────────────────────┬────────────┐
   ▼          ▼              ▼              ▼          ▼                      ▼            ▼
┌──────────┐┌──────────────┐┌─────────────┐┌──────────┐┌──────────────────────┐┌──────────────┐
│ MockApi  ││ReelController││  WinLines   ││PlayButton││ResponsiveBackground  ││ DebugCheats  │
│ (static) ││              ││             ││          ││   (independent)      ││  (console)   │
└──────────┘└──────────────┘└─────────────┘└──────────┘└──────────────────────┘└──────────────┘
 init/play    layout +        line overlays   button       BG cover-scaling       window.debug
 evaluation   spin/stop       + win counter   state                                cheat API
```

`Main` holds `@property` references to three scene components (`PlayButton`, `ReelController`, `WinLines`), set in the Cocos editor inspector. `MockApi` is a static class — no scene presence. `ResponsiveBackground` lives on its own background node and runs independently. `DebugCheats` is a plain module that installs cheats on `window.debug` at boot.

---

## The play cycle

```
boot                                            press play
 │                                                │
 ▼                                                ▼
MockApi.init() ─→ handleInitResponse           onPlayPressed
 │                  │                             │
 │                  └─→ applyGridImages           ├─→ playButton.setEnabled(false)
 │                       (paints 5 rows/col)      ├─→ winLines.hideAllLines()
 │                                                ├─→ winLines.resetTotal()
 │                                                ├─→ reelController.startSpin()   ┐  parallel
 │                                                └─→ MockApi.play()                ┘
 │                                                         │
 │                                                         ▼ (≥ 400 ms later)
 │                                                  handlePlayResponse
 │                                                         │
 │                                                         ├─→ stopSpin(result)
 │                                                         │     • waits for minSpinTime
 │                                                         │     • cascades reel stops
 │                                                         │     • cubicOut decel + thunk landing
 │                                                         │
 │                                                         ├─→ resolve winIndexes
 │                                                         │   via getCellByIndex
 │                                                         │
 │                                                         ├─→ winLines.playWinLines
 │                                                         │   • per-line +amount popups
 │                                                         │   • symbol bounce on winning cells
 │                                                         │   • total win counter ticks up
 │                                                         │
 │                                                         └─→ playButton.setEnabled(true)
```

Two timing details worth knowing:

- `startSpin()` is fired without `await` so the spin animation runs *in parallel* with the API request. `stopSpin` internally awaits `minSpinTime`, so a fast API response cannot race past the lift-up cascade.
- The lift-up is *intentionally* sequential per reel (200 ms × 5 = ~1 s cascade). This is the desired visual feel, not a bug.

---

## Reel rendering — how it works

### Layout

Each reel column has **5 cell Nodes**, ordered top → bottom:

```
[ hiddenUpper ]   ← peek row (decorative, off the payline)
[ top         ]   ← payline row 0
[ middle      ]   ← payline row 1
[ bottom      ]   ← payline row 2
[ hiddenLower ]   ← peek row (decorative, off the payline)
```

The middle 3 are exposed to the rest of the app via `ReelController.getCellByIndex(idx)`, which uses the flat encoding `col * 3 + row` (matching `MockApi.winIndexes`). The peek rows exist so that during a spin, the eye sees symbols enter and leave smoothly instead of popping in/out at the visible edges.

### Spin — virtual scrolling

Each reel is driven by a single `scrollPx` accumulator. Cell positions and sprite frames are *derived* from that one number every frame via `applyScroll`. The model treats the reel as if it were an infinite tape of symbols passing by the 5 fixed Nodes; only the tape position changes.

Pseudo-code per frame for a spinning reel:

```
cellsScrolled = scrollPx / symbolHeight
wholeCells    = floor(cellsScrolled)
frac          = cellsScrolled - wholeCells     // 0..1, sub-cell slide
topSlot       = -wholeCells                    // slot index displayed at cell 0

for k in 0..4:
    cells[k].y      = baseY + (centerIdx - k) * symbolHeight - frac * symbolHeight
    cells[k].sprite = symbolAtSlot(topSlot + k)
```

Every spinning reel just adds `speed * dt` to its `scrollPx` each frame. The continuous sub-cell slide plus the discrete slot-index rotation produces seamless motion.

### The strip and the pin map

`symbolAtSlot(slot)` resolves the symbol for any slot index in two steps:

1. **Pinned override.** If the slot is a key in `pinnedSymbols`, return that value.
2. **Strip fallback.** Otherwise return `strip[slot mod strip.length]` with negative-safe modulo.

The strip is a 30-entry fixed array (`DEFAULT_STRIP`) rotated per column so reels don't visually sync. `pinnedSymbols` is an empty Map until a result needs to be injected — see Stop below.

### Stop — pinned symbols + cubicOut + thunk

When `stopReel` fires for a column:

1. Compute the landing point: `endScrollPx = ceil(currentCells) + SPIN_DOWN_CELLS` cells × `symbolHeight`. Always an integer multiple of `symbolHeight` so cells land exactly at their home positions.
2. Pin the result symbols at the slot indices that will be visible at that landing point (`endTopSlot..endTopSlot+4` → server result `[0..4]`).
3. Tween `scrollPx` from its current value to `endScrollPx` with `cubicOut` easing over `stopDurationSec`.
4. As the deceleration runs, `applyScroll` continues to derive cell positions and sprites from `scrollPx`. The pinned symbols enter the viewport naturally as the reel slows; no sprite swap at the moment of stop.
5. After the scrollPx tween settles, the parent reel node dips 12 px and returns — the "thunk" for impact feel.

No snap. No teleport. The result glides into the payline as part of the deceleration motion.

### Layout generalization

`normalizeReelColumn` detects each reel's `symbolHeight` from the actual Y delta between its first two scene children, and computes `centerIdx = Math.floor(children.length / 2)`. You can change a reel from 5 cells to 7 in the scene with no code change — the layout math, wrap distance, and `cells` window all scale automatically.

---

## Win presentation

### Per-line `+amount` popups

When a winning line displays, a small `+amount` label pops in over the reels with a `backOut` scale tween. Three Label nodes are wired in via `@property` on `WinLines`, one per payline group:

| Label slot | Lines |
|---|---|
| `perLineLabelMiddle` | 1, 6, 7 |
| `perLineLabelTop`    | 2, 5, 8 |
| `perLineLabelBottom` | 3, 4, 9, 10 |

The routing table (`LINE_TO_POSITION` in [WinLines.ts](assets/scripts/WinLines.ts)) maps payline numbers to label slots. The label scale animates from 0.3× to its editor-set rest scale on each show.

### Animated total counter

The total win label is owned by `WinLines` (`totalWinLabel` `@property`). At the start of each line's display, a `linear` tween advances `displayedTotal` from its current value to the new running total over the line's full display window. An `update()` method floors the value each frame and writes it to the label, deduplicating to avoid redundant string allocations.

For the label not to shift horizontally as digits grow, set its **Horizontal Align** to `CENTER` and anchor X to `0.5` in the inspector. Then the label expands symmetrically around its center; the center position never moves.

---

## Design decisions

### Virtual scrolling with `scrollPx` + pinned symbols
Each reel is one number plus a strip and a pin map. Spin is `scrollPx += speed * dt`; stop is `tween(scrollPx → endScrollPx)`. Same mechanism for both phases. The pinned symbols mechanism injects the API result at the slots that will be visible at landing, so the reel decelerates naturally into the result — no snap, no sprite-swap-at-stop. Enables future features (anticipation, sticky symbols, near-miss reveals) without architectural change.

### Animation timings as editor-tunable `@property` fields
Lift-up, stop, and thunk durations are all `@property({ type: CCFloat })` fields on `ReelController` — `liftUpDurationSec`, `stopDurationSec`, `thunkDipDurationSec`, `thunkReturnDurationSec`. You can tune feel directly from the Cocos inspector and see the change on the next preview, no recompile.

### Win counter and per-line labels owned by `WinLines`
All win-related presentation lives in one component: line overlays, symbol bounces, per-line `+amount` popups, and the animated total counter. `Main` doesn't reference the win label at all. The counter is driven by `WinLines.update()` from a tweened `displayedTotal` field, animating in sync with each line's display window.

### Peek rows (5 cells per reel, only 3 visible on the payline)
Avoids pop-in artifacts at the spin window edges. The `[m-1, m, m+1]` slice in `rebuildPublicCells` exposes only the payline 3 to the win-display layer.

### Sequential cascading stop (`stopGapMs` between reels)
Each reel fully finishes its `cubicOut` decel + thunk before the next starts, with a 450 ms gap. Classic slot machine feel. Implementation is `await stopReel(...)` inside a `for` loop.

### MockApi sends 5 rows per column; paylines evaluated on the middle 3
The reel data is 5 rows but only rows 1–3 are payline rows. `MockApi.evaluateWins` applies a `VISIBLE_ROW_OFFSET = 1` when reading symbols for line evaluation. `winIndexes` stay in 3-row coordinates so the win-display layer doesn't need to know about peeks at all.

### Wild substitution, left-to-right line evaluation
Standard slot semantics: Wild (id 0) substitutes for any symbol; lines are evaluated left-to-right and pay on the longest matching prefix (3, 4, or 5 in a row). See [`MockApi.evaluateLine`](assets/scripts/MockApi.ts).

### Responsive resolution at two independent layers
- [`Main.applyResponsiveResolution`](assets/scripts/Main.ts) switches between `FIXED_WIDTH` and `FIXED_HEIGHT` policy depending on viewport aspect ratio, keeping the design canvas at 1280×720 logical.
- [`ResponsiveBackground`](assets/scripts/ResponsiveBackground.ts) cover-scales the background sprite independently so it always fills the viewport, even when the design canvas leaves letterbox space.

### `WinLines` uses pre-built overlay nodes, not runtime Graphics drawing
The 10 winning-line overlays are pre-built children of `winLinesRoot`, named `"1"` through `"10"`. `playWinLines` toggles the matching child active and runs scale bounces on the winning cell Nodes. Cheaper at runtime than redrawing with `Graphics` every win.

### `@property` decorators use `{ type: ... }` form everywhere
All component, Node, Label, SpriteFrame, and primitive fields are declared as `@property({ type: <type> })`. Primitives use `CCFloat` / `CCInteger` for explicit unit-validated inputs in the inspector. Consistent style across all files.

---

## File map

| File | Responsibility |
|---|---|
| [Main.ts](assets/scripts/Main.ts) | Orchestrator. Wires components, drives the play cycle, manages responsive resolution. |
| [ReelController.ts](assets/scripts/ReelController.ts) | Virtual-scrolling spin model with pinned-symbol result landing; cascading stop with `cubicOut` decel and a parent-node thunk. Exposes `getCellByIndex` for win highlighting. |
| [MockApi.ts](assets/scripts/MockApi.ts) | Static mock backend. Builds random 5×5 reel results, evaluates paylines with wild substitution, returns `winLines` + `totalWin`. |
| [WinLines.ts](assets/scripts/WinLines.ts) | Sequences winning-line overlays, runs per-cell scale bounces, pops per-line `+amount` labels by payline group, and drives the animated total-win counter. |
| [PlayButton.ts](assets/scripts/PlayButton.ts) | Visual + interactable state of the play button. |
| [ResponsiveBackground.ts](assets/scripts/ResponsiveBackground.ts) | Cover-scales the background sprite across resize / orientation changes. |
| [DebugCheats.ts](assets/scripts/DebugCheats.ts) | Installs `window.debug` cheats for forcing specific spin results (see below). |

---

## Debug cheats

Open the browser console (F12) and call any of:

- `debug.line1()` … `debug.line10()` — force a 5-of-a-kind H1 win on each payline individually
- `debug.allLines()` — every payline wins with H1 (~10,000 payout)
- `debug.maxWin()` — every payline wins with Wilds (max payout: 20,000)
- `debug.noWin()` — guaranteed no-win

Then press **Spin**. The override is one-shot — the next spin reverts to random unless you call another cheat.

---

## What I didn't add and why

- **No unit tests.** Most of what matters in a game is visual (bounce feel, landing accuracy, win highlight alignment) and can't be unit-tested. The piece that *would* benefit most from tests is [`MockApi.evaluateWins`](assets/scripts/MockApi.ts) (pure functions, wild substitution edge cases) — but for a single-developer interview deliverable, the cost/benefit favored manual playtesting.
- **No real backend.** `MockApi` plays the role of the server with a 400 ms simulated delay. The interface boundary (`InitData` / `PlayData`) is shaped so a real backend could drop in unchanged.
- **No sound effects.** Out of scope.

---

## Known limitations / next steps

- **Uniform symbol heights per reel.** Tall or stacked symbols would require replacing `symbolHeight: number` with a `cellOffsets: number[]` array and computing cumulative positions instead of `(centerIdx − i) * symbolHeight`.
- **Hard-coded 3 visible rows.** The `[m-1, m, m+1]` slice in `rebuildPublicCells` and the `col * 3 + row` index encoding in both `getCellByIndex` and `MockApi.toIndex` would need to become row-count-aware to support a Megaways-style game.
- **No anticipation feature yet.** The `scrollPx`/`pinnedSymbols` architecture supports it natively — pass a longer `duration` to `stopReel` for specific columns to stretch the deceleration. Not wired up to gameplay logic.
- **Proportional-font digit shift.** The total counter uses center alignment so the label doesn't move horizontally as digits change, but individual characters can still shift micro-pixels because "1" is narrower than "8" in the default font. A BMFont with tabular digits would fix that.
