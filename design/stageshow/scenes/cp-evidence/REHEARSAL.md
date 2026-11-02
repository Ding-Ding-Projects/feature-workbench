# Rehearsal: cp-evidence

Gold: stacked-cards (kept: two components at one width and one left edge, a 12px gap, centered, the top card whole and the lower one off the bottom, flat card shadows on the well). Changed: the plan card became the Completeness inventory card (three real surfaces, a chip per column, the Cantonese chip of Command palette missing in amber, a chevron per row), and the usage chart became the check's dark output block, failing on that row and passing after the file is restored. A browser window over a terminal satellite (static-card layout) was tried first and dropped: at 560 x 380 the terminal could only straddle over the ledger's rows.
Beats: still, no motion. The poster is the whole story: Missing in the ledger, FAIL then PASS below.
Captured: 560 wide (wide layout) and 390 (compact 358 x 300), light theme, Commonplace look.
Film: wide, first pass `uneven inset` on rows (trailing space) → added the row chevron in its own track; `uneven gutters` on the card (also present in the gold) → narrowed the column to 368 so the side gutters and the bottom read as one framing. Compact: the stack bleeds both sides (the cards' corners outside the stage, words 16px in), the title and the Code column go, the idle prompt line goes so no line is sliced.
Gate: `film.mjs --gate --still` → rehearsal passed at 560 and 390.
Compared with gold-static / stacked-cards stills: the eye lands on the amber Missing chip, then the FAIL line; one surface leads (the inventory card), the output is the supporting component.
Assumptions: the deep-dive shows the output block without window chrome, so it is the product's own dark block, not a kit terminal window.
Unresolved: none from the gate.
Not checked: dark theme, reduced motion (no motion), fresh-eye review by a second reviewer.

## Fresh-eye review

- Framing: the inventory card floated whole, centred with even margins. Both cards are now pinned one gutter (24 wide, 16 compact) from the top and left and run off the right edge. The rows' rules run off with them, and the output still runs off the bottom. The row chevrons are gone because the crop would have cut them. All five real columns are back (Code, Article, Cantonese, Test, Screenshot), so PASS reads "3 surfaces, 5 columns each" as on the deep-dive page. Compact keeps Article, Cantonese and Test whole.
- Systemic note (gray-bar board): does not apply. The scene has no board of bars; every visible row is real.
- Gate after the fix: `--gate --still` passes at 560 and at 390. Finals: `ss/final/cp-evidence.png`, `ss/final/cp-evidence-390.png`.

## v2 redesign

- Re-skin: every v1 colour replaced with v2 roles. Check chips are primary-container on on-primary-container; the missing chip is tertiary-container (#FFDCBE / #2D1600); the restored chip is primary (#2546D6, white). The output block now uses the dark-theme surface roles (#121318 ground, #C6C5D0 text, #E4E1E9 command, #B9C3FF prompt mark and PASS, #FFB4AB FAIL, #90909A path). Cards and the output are 28px (24px compact); the stage corner is 28px.
- Motion: now `play="once"` in view, no cursor (a system story). Beats: 1. FAIL lands in its reserved row (4px rise on the fast spring, effects fade) and the chip it names pulses once (1 -> 1.06 -> 1, default spring). 2. The file is restored: the same chip morphs in place, Missing -> Restored (label by `Roll variant="fade"`, its width easing; the close and check glyphs crossfade in one slot on the fast spring; the fill fades on effects), with a second pulse. 3. The check is typed again. 4. PASS lands and holds. Poster: FAIL, the restored chip, PASS. Terminal rows keep their place (no Collapse), so nothing above an arriving line moves; the typed line carries `data-snap` and `data-typing` only while typing; the caret keeps its slot and fades when the command returns.
- Fixes on the way: `lopsided` chip (States held the larger label's box) and a `vanishes with no exit` from Swap -> replaced by Roll plus a glyph crossfade; `settle snap` from typing -> narrow `data-snap` on the typed line; a one-frame width jump when the caret unmounted -> caret kept mounted and faded.
- Gate: `--gate` passes at 560 and at 390 (no candidate lines). Finals: `ss/final/cp-evidence.png` and `-390.png` (the poster, filmed `--still --reduced`), `ss/final/cp-evidence-loop.png` (from `--at fail`, `--every 500 --count 24`), phone loop `ss/shots/cp-evidence-loop-390.png`, beat frames `ss/shots/cp-evidence-press-fail.png` and `-press-fixed.png`. Banned-word scan clean; typecheck clean for this folder.
- Not checked: dark theme; real-time frame pacing (the machine was heavily loaded, so every recording reported inconclusive coverage with gaps of 200 to 500ms, and the script often ran before the film began listening; loop sheets were therefore started at the first mark); live reduced-motion toggling mid-play; the in-app "Reduce motion" setting (not part of a Stageshow scene); a second reviewer's fresh eye.

## v2 fresh-eye review

- Set-wide plate: the stage ground is now `var(--ss-canvas)` (neutral #F1F1F4), not the lavender well.
- Set-wide framing: both cards are pinned top-left at one gutter and run off the right edge. The output block also runs off the bottom (two edges), as before.
- Set-wide hierarchy: no bar sits beside a real number in this scene. Every row, column and count is real text.
- Void under PASS in the terminal (y 340 to 380 in stage px): the output is now 12px instead of 11px, and after PASS the command returns to an idle prompt with the caret waiting (the caret moves from the second prompt to the new one). The rows fill the block down to the crop. At 390 the idle prompt is left out because the crop would slice it; the block ends just under PASS.
- Re-filmed: poster stills at 560 and 390, `final/cp-evidence-loop.png` and `shots/cp-evidence-loop-390.png`. `--gate` passes at both widths. The banned-word scan and the typecheck are clean.
