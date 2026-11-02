# Rehearsal: cp-games
Gold: overlap. Kept: the back window pinned top on the gutter and off the bottom with a right gutter, a smaller chromeless card in front on the left gutter whose right edge stops 24px short of the window's sidebar line, covering only sidebar filler; one chrome set; the card's real row is the same fact the window shows. Changed: Commonplace look (look-commonplace, cobalt accent, amber for pending, Material Symbols Rounded filled at 18px), the dashboard became a quiet game editor (explorer tree of bars, a lane-gray world map with two roads and placed-model tiles), the checkout card became the model integration ledger (title, count, a verified Ferris wheel row with its evidence, a verified filler row, a pending Harbour crane row marked Not counted). The lit accent tile on the map is the Ferris wheel; the crane's map slot is an empty dashed amber outline. Stage resized to 560 x 380, compact 358 x 300.
Beats: still (no script, no cursor).
Captured: widths 560 (wide) and 390 viewport (compact 358 x 300), light theme only.
Film: uneven card padding at the foot → card bottom padding removed and the pending row padded 16 on every side. Compact first pass (window inset lower right, card top-left) → narrower-than-tall window, card gutters, toolbar glyphs cut by the crop → window pinned on the 16px gutter at full column width, card on the same left and bottom gutter over its chrome and explorer, map tiles repositioned into the strip the card leaves clear; tiles drew over the card → card raised above the window. Hiding the explorer in compact left an empty pane → kept. Final: `--gate --still` rehearsal passed at both widths.
Review: compared beside shots/gold-overlap.png: the eye lands on the ledger, then the lit Ferris wheel tile and the dashed crane slot; one window, one card, no plate.
Real strings: Model integration ledger, 5 of 6 models in use, Ferris wheel, Ride screenshot, Harbour crane, Not counted. No game company name or mark.
Assumptions: the editor is drawn generic on purpose; map tiles use Material Symbols (attractions, bakery_dining, local_shipping, storefront, precision_manufacturing).
Unresolved: none.
Not checked: dark theme; reduced motion (a still); a resize between widths in one session.

## Fresh-eye review
- Whole window with even side margins, bleeding only at the bottom → the editor now runs off the right edge too (wide 520px from 112; compact 420px from 16). The toolbar glyphs it would have cut were removed; map tiles moved to fixed px positions so every tile stays whole.
- Systemic board finding: not applicable here (the board is the map; the ledger already carries real model names).
- Re-filmed to final/cp-games.png and final/cp-games-390.png; `--gate --still` and `--gate --still --width 390` both passed; banned-word scan clean.

## v2 redesign (Material 3 Expressive)
What changed: v1 colours replaced with v2 roles (pending = tertiary container #FFDCBE with #8B5000 icons and #2D1600 text, verified evidence in primary). Ledger card 28px corners, map tiles 16px. The still became a loop with no cursor (what the system does). The Ferris wheel starts unplaced: its map slot is a dashed amber outline like the crane's, its ledger row pending, "Not counted", count 4 of 6.
Beats (about 6.5s): 1 the Ferris wheel tile lands in its slot from just above (default spring) as the dashed outline fades … 2 the row answers: pending icon gives way to verified (fast spring, a small overshoot), the tinted row turns to the plain surface, "Not counted" fades to "Ride screenshot" … 3 the count rolls 4 to 5 of 6 … payoff holds 2.2s (the poster) … reset with a seen cause: Undo (Ctrl Z keycaps, bottom right) lifts the tile out, the row returns to pending and the count rolls back to 4. The harbour crane stays pending throughout.
Tried play="once" first: film only ever saw the end state, so it could not be rehearsed; changed to a loop with the Undo reset.
Fixes this round: compact card's top landed 2px from the window's lights (near-tangent) → the compact card drops the filler row; a compact bakery tile peeked under the card → moved clear; count digit touched its words → own span with a word-space margin.
Gates: wide loop `--gate` rehearsal passed; 390 loop `--gate` rehearsal passed. Remaining candidates: "appears with no entrance" on the kit Count and once on the verified icon (it scales and fades in over 200 to 350ms; a sampling gap), "handoff shift" of 0.7px inside the kit Count strip, "touching" 3px between the count digit and its words (a normal word space).
Captured: final/cp-games.png and -390.png (poster), final/cp-games-loop.png and -390-loop.png, beat frames shots/cp-games-v2-{place,verify,count,undo}.png.
Not checked: dark theme, whether a reviewer reads the Undo reset as product behaviour rather than a demo reset, touch.

## v2 fresh-eye review
- Sidebar glyphs peeked half cut below the ledger card (wide and 390) → the explorer tree now has only as many rows as the card covers (8 wide, 7 compact); below the card the sidebar is plain.
- Set-wide: the plate is var(--ss-canvas); roads on the map use #F5F2FA. The editor already bleeds off the right and bottom.
Gates after this round: wide and 390 loop `--gate` rehearsal passed. Remaining candidates: Count entrance (kit) and the 3px word space between the count and its words.
