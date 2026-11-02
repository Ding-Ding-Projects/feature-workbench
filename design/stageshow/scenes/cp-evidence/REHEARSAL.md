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
