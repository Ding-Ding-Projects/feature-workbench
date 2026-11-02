# Rehearsal: cp-safety

Gold: `share` (satellite focus). Kept its structure: one browser window inset one gutter from the top and both sides, running off the bottom; the hero surface anchored under its trigger and measured from it with `rect()`, right edge on the trigger's right edge, 8px below it. Changed: the Commonplace look (`look-commonplace`, Material Symbols Rounded filled at 18px, cobalt accent, lane colors), a still instead of a script, a feature-card stage (560 x 380, compact 358 x 300), and the popover is the two-key confirmation. Its left edge lands on the In progress column's line, so it covers whole lanes of filler cards.

Beats: still only. The frame: Delete pressed, the confirmation open with key 1 turned and key 2 waiting, so the slider is asleep; Emergency exit always present.
Captured: wide (shots/cp-safety.png), 390 (shots/cp-safety-390.png), light theme only.
Real strings (8): Delete, Delete “Pick a language”?, Pick a language and Try the command palette on the board, Key 1 turned, Turn key 2, Slide to delete, Emergency exit.
Compact: standard browser bar, one lane, the question set at 13px, so the whole dialog fits with a gutter below.

Film:
- `framing: satellite sits 28px from the bottom edge` (wide) -> evened the dialog's spacing so it clears by the gutter.
- `uneven inset` on the task row -> the task chip hugs its name.
- `uneven padding` on the lanes -> lane header height set so the icon's top inset equals its side inset.
- compact `cut by the crop` / `framing` on Emergency exit and `small text` on the address -> one-line question at 13px (later round: standard chrome restored, see Fresh-eye review).
- `layout: lane leaves 1px below its last child` (compact) -> window made taller so lanes end inside it, past the stage's crop.
- Final: `--gate --still` passes at both widths with no issues detected.

Still beside the gold: the eye lands on the confirmation first, then the blue turned key; one hero, no satellite pile; the board is quiet filler at the edges, the only words are on the feature. It is denser than static-card by design (the dialog is the subject), with the same hard crop at the bottom.

Assumptions: the selection toolbar carries a Delete control (the deep-dive mock shows "Delete selected"); a single task is named to match the brief.
Unresolved: none from the film.
Not checked: dark theme, reduced motion (a still), a fresh-eye review by a second reviewer.

## Fresh-eye review
- Unexplained black disc beside the toolbar's title bar (about 338,184 wide): removed; the title stays a quiet bar.
- Phone frame used the hairline bar (gray lights, centred address), unlike every other scene: back to the standard browser chrome (colour lights, left URL pill). To fit, the compact toolbar row is tighter (8px over, 6px under the controls).
- Board was only gray bars: real Commonplace task titles where the board shows. The selected card is now "Pick a language" (the task the dialog names, now in the question itself: Delete “Pick a language”?) and the next card is "Try the command palette"; the separate task chip is gone, so the real-string count stays at 8 including the two board titles. The deleted task matches the one cp-records restores.
- Re-filmed to final/cp-safety.png and final/cp-safety-390.png; `--gate --still` passes at both widths; banned-word scan clean.
