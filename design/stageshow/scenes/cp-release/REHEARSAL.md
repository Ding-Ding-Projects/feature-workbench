# Rehearsal: cp-release
Gold: stacked-cards (kept one centered column, two cards at one width and one left edge 12px apart, the lower one off the bottom, the well ground; changed the content to the release card and its assets, dropped the motion, stage 560 × 380 with a compact 358 × 300 design)
Beats: none, a still feature card
Captured: widths 560 and 390 (compact), light look only, no states
Film: a filler asset row was cut by the crop -> removed; the timing block drew its own top rule and read as a plate inside the card -> the rule moved to the header; compact stack left the release card with uneven gutters (the gold has the same line) -> compact merges the assets into the release card, which now runs well off the bottom. Final gate: rehearsal passed.
Review: one object leads (the release, its food code name in English and Cantonese); timing rows share one grid (label track, mono value track); assets are the two real files with download actions. No dish photograph and no image area.
Assumptions: phase band proportions (Build, Package, Publish) are illustrative, matching the product's Release pipeline page.
Unresolved: none known.
Not checked: dark theme, a fresh-eye review by a second reviewer.

## Fresh-eye review
- Framing, cards centered with even side margins: the column is now pinned 40px from the left (16px compact) and runs off the right edge. Latest moved beside the version, the timing values and the phase band sit on fixed tracks, and file sizes sit in a fixed column, so no word is near the right-hand crop.
- Framing, a void under two file rows (wide and 390): the list now has Setup.exe, RELEASES, the full and delta .nupkg packages, then one quiet filler row that the stage's bottom edge cuts, so the list runs off the crop. Real rows stay whole.
- Systemic, board of gray bars: not applicable. This scene has no task board, only release surfaces with real content.
- Final: stills in ss/final/cp-release.png and cp-release-390.png; `--gate --still` and `--gate --still --width 390` both end "rehearsal passed".

## v2 redesign
- Re-skin: Material 3 Expressive roles through the look tokens (no hard-coded colours; there were none from v1 to hunt). Cards and stage at xl 28px corners, the code-name tile on tertiary container at 16px, the status chip a full pill, the phase band at the M3 4px track. Root class renamed `cprel` (it shared `cpr` with two other scenes).
- Animated: a system story, no cursor, `play="once"` in view, poster = the finished release with its files.
  1. Publishing: Build and Package done, Publish runs as the Expressive wavy indicator (sine path phase sliding, soft leading edge, stop dot on the track); completed and duration read Measuring.
  2. Done: the wave flattens into a flat bar (fast spring, then a 200ms effects fade), the completed time and duration crossfade in (`States`), the chip turns Publishing (tertiary container) to Latest (primary container) with one 1.06 pulse (fast spring).
  3. Assets: the Waiting for Publish line closes as the files open one by one (`Collapse`, 70ms apart) and the Assets count rolls 0 to 4 (`Count`). Compact: the files join the release card, two shown, a quiet row under the crop.
- Data never rewinds: it plays once and holds the payoff. Reduced motion shows the poster and drops the pulse and the wave travel.
- Films: final/cp-release.png and -390.png (poster), final/cp-release-loop.png and shots/cp-release-390-loop.png (24 x 500ms), shots/cp-release-slow.png (4x), press/beat close-up shots/cp-release-done.png (`--at done`).
- Fixes from film: a real file row cut by the crop (tightened the card, the fourth file is now the quiet row); the assets card first rose in from the crop and left a void above the bottom edge in the opening frame, so it now sits in place from the first frame with a waiting line; the flattened wave vanished (non-scaling stroke at near-zero scale), so a flat bar now takes over; compact uneven gutters (padding under the list moved into the list so it bleeds off the bottom); the wave's hard cut at the fill edge got a soft mask and `data-crop` on the deliberate progress clip; a sliver of the assets card at the bottom edge while rows swapped (more bottom padding).
- Gates: `--gate` wide and `--gate --width 390` both "rehearsal passed" (re-run after the last edits). Typecheck: no errors in this scene (the playground has two unrelated errors in other scenes).
- Not checked: dark theme, a real-device frame-rate check, a fresh-eye reviewer; the host machine was heavily loaded, so film reported sampling gaps (inconclusive coverage) and the first real-speed frames often landed after beat 1, which the 4x film covers. Left as candidates: `appears with no entrance` on the Assets count while it rolls, `steps in its box` on the code-name tile in compact.

## v2 fresh-eye review
- Plate: the stage ground is now `var(--ss-canvas)` (neutral), not the well. The cards still run off the right and bottom.
- Hierarchy: no bar sits beside a real number; Assets and its count are real words.
- Rows ghosting on top of each other while they opened (review2/release-rows.png at 0.8s): each file now owns a reserved 30px row from the first frame; only its content fades and rises 8px inside its own clipped row, 90ms apart, so rows never overlap. Waiting for Publish sits over the first row and fades as it fills.
- Half-rolled glyph in the count: the count rolls once (0 to 4) instead of once per file, inside a chip that clips its roll, with the digit window's soft edge removed.
- Tightened the assets card heading (30px, no top padding) and the stack's top gutter (20px) so the third file stays whole above the crop.
- Re-filmed after these fixes (poster, 390, loop sheets, `--at` close-ups) and `--gate` wide and `--gate --width 390` both "rehearsal passed". Left as candidates, not gate lines: rolling `Count` entrance/handoff notes.
