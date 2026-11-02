# Rehearsal: cp-repository
Gold: fade-crop. Kept: a surface inset top and sides on the well, fading out over its last part with a mask on a padded wrapper (shadow kept on top and sides), real rows in the top half, filler carrying on under the fade, a compact layout that runs the surface off the right. Changed: the window became a document (a ruled page with real margins, per craft.md) showing the project README; the list became a Markdown line-count table at content width; added one satellite, the hand-time estimate, straddling the page's right edge over its empty margin and filler; Commonplace look (look-commonplace tokens, Inter, JetBrains Mono for the file name, one filled Material Symbols Rounded icon at 18px).
Beats: still, no motion.
Captured: widths 560 (wide) and 390 (compact 358 x 300), light look only.
Film: uneven gutters on the satellite (its center sat exactly on the page edge, so it was judged as set on the ground) -> moved it 8px over the page and to the 32px gutter; touching icon and label in the satellite -> dropped the satellite icon; total row inside the fade -> removed the intro paragraph bar and moved the mask start to 82%; table rows rebuilt as one shared grid template so each rule runs the table width; table narrowed so it clears the satellite by 24px. Final: no issues at both widths, `--gate --still` rehearsal passed.
Review: beside the gold still, the eye lands on the table and the estimate (the only accent ink); the page is the one hero, the estimate is a different kind of object. The page's top-right is plain page margin, which is how a README table renders.
Assumptions: README values are the example values shown on the Repository records deep-dive page (TypeScript 3,100, CSS 900, total 4,800, 96 to 144 working days).
Unresolved: none.
Not checked: dark theme, reduced motion (still scene), a fresh-eye reviewer pass by a second agent.

## Fresh-eye review
- Framing: the plate's top-right was empty and the table filled only the left two-thirds -> the page now bleeds off the top, right and bottom (left 136, top -40). The table and its heading rule span the full 360px text column. The satellite moved to straddle the page's left edge below the table, static-card style, covering only page margin and filler. The fade mask was removed because the page now bleeds instead.
- 390: the callout is kept, sitting over the filler under the table. The table starts on TypeScript: the placeholder header and filler rows are gone, and HTML 800 is now a real row.
- Polish: the label-to-value gap in the callout was cut to 2px (film flagged a loose stack).
- Systemic board finding: not applicable. This scene has no task board, only a document.
- Final: `--gate --still` and `--gate --still --width 390` both say rehearsal passed. Stills are in ss/final/.

## v2 redesign
- Re-skin: Material 3 Expressive roles through the look tokens (no v1 colours were hard-coded). The README page at xl 28px corners, the estimate satellite at 20px, the new row tinted primary container. Root class renamed `cprepo` (it shared `cpr` with two other scenes).
- Animated: a system story, no cursor, `play="once"` in view, poster = the finished table and its estimate.
  1. The HTML row opens into the table (`Collapse`), tinted primary container for a moment, the total row and the filler below moving with it.
  2. The hand-written total rolls 4,000 to 4,800 (`Count`).
  3. The estimate follows: 80 to 120 rolls to 96 to 144 working days (two `Count`s) and the satellite's surface pulses once (1.06, fast spring; only the surface scales, never the words).
- Assumption: the opening estimate (80 to 120 for 4,000 lines) keeps the deep-dive page's ratio (96 to 144 for 4,800).
- Data never rewinds: plays once and holds. Reduced motion shows the poster and drops the tint and the pulse.
- Films: final/cp-repository.png and -390.png (poster), final/cp-repository-loop.png and shots/cp-repository-390-loop.png, shots/cp-repository-slow.png (4x), beat close-up shots/cp-repository-row.png (`--at row`).
- Fixes from film: the estimate's figures and words shared one text run with the `Count` strips, which read as words cut by the crop and touching; the figures and words are now separate boxes with a word-space gap. `will-change: transform` on the total row, which moves by layout as the new row opens.
- Gates: `--gate` wide and `--gate --width 390` both "rehearsal passed" (re-run after the last edits). Typecheck: no errors in this scene (the playground has two unrelated errors in other scenes).
- Not checked: dark theme, real-device frame rate, a fresh-eye reviewer; heavy host load gave inconclusive sampling coverage and late first frames, covered by the 4x film. Left as a candidate: `appears with no entrance` on a rolling `Count`.

## v2 fresh-eye review
- Plate: the stage ground is now `var(--ss-canvas)`.
- Lower third was filler bars over white (y 620 to 760 at 2x): the bars are gone; the README's own method from the Repository records page fills it (Rate: 40 to 60 lines a day; Multiplier: 1.2 for tests and review; 4,800 / 60 × 1.2 = 96; 4,800 / 40 × 1.2 = 144). The arithmetic is part of the story: in beat 3 its line count and results roll (4,000 to 4,800, 80 to 96, 120 to 144), then the estimate follows. Compact keeps the table and the estimate only.
- "96 to 144" figures read larger than the words: the estimate is now one run of text at one size, with only the changed figures rolling (`Roll`), no `Count` boxes.
- The page moved right (left 216, text column 280 wide) so the satellite straddles only the page margin, clear of the method lines.
- Re-filmed after these fixes (poster, 390, loop sheets, `--at` close-ups) and `--gate` wide and `--gate --width 390` both "rehearsal passed". Left as candidates, not gate lines: rolling `Count` entrance/handoff notes.
