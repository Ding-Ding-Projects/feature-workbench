# Rehearsal: cp-canonical
Gold: tilted-stack. Kept: three same-size cards in one cell at -6, 4 and -2 degrees, each turned about its own center and offset unevenly, the straightest on top and the only one with words, the pile centered with room on every side and nothing cut. Changed: receipts became the portable editions of a shared instruction set as file cards; the top card is the single-file edition (file tile, name, one-line description, version and date in JetBrains Mono, outlined Download button) with copy from the Canonical instruction deliverables deep-dive page; the lower cards show a quiet file tile and short filler lines; Commonplace look with filled Material Symbols Rounded icons at 18px. The repository itself is never named.
Beats: still, no motion.
Captured: widths 560 (wide) and 390 (compact 358 x 300), light look only.
Film: onion skin and near-tangent on the lower cards' bars (the turned bars' bounding boxes overlapped; the gold shows the same lines) -> shorter bars with a 12px gap so even the turned boxes are clear; uneven padding when the middle card held only its tile -> gave it its filler lines back; compact description 5.7px from the card edge -> compact card widened to 256; compact tight control (a hidden lower-card bar's box near the Download button) -> the lower cards keep two filler lines in compact; top card height trimmed so the button keeps an even inset below it. Final: no issues at both widths, `--gate --still` rehearsal passed.
Review: beside the gold still, same silhouette and proportion (card about 47% of stage width); the eye lands on the edition name and its Download action.
Assumptions: version and date "0.4.0 · 2026-11-02" are the example values from the deep-dive page.
Unresolved: none.
Not checked: dark theme, reduced motion (still scene), a fresh-eye reviewer pass by a second agent.

## Fresh-eye review
- Framing: the small centred stack left about 40% of the frame empty -> cards widened to 360x236 and drawn at 1.4x (1x at 390, with 264px-tall cards). The pile now runs well off the right and bottom edges. Card offsets were tuned until no edge lands as a sliver (each runs at least 24px past). The top card's words stay whole on the stage.
- Hierarchy: the file tile is now its own column (like an avatar). The name, version and Download share the text column beside it, which clears film's near-aligned line on the scaled glyph.
- Polish: the lower cards keep two filler lines each, so their turned boxes clear the top card's button (tight-control and near-tangent lines).
- Systemic board finding: not applicable. There is no task board in this scene.
- Final: `--gate --still` and `--gate --still --width 390` both say rehearsal passed. Stills are in ss/final/.

## v2 redesign
- Re-skin: Material 3 Expressive roles through the look tokens (no v1 colours were hard-coded). Cards at xl 28px corners, the file tile at 12px, Download as an M3 outlined button: a full pill, 44px tall. Root class renamed `cpcan` (it shared `cpc` across scenes).
- Animated: a pointer story, `play="once"` in view, poster = the downloaded edition.
  1. The pointer travels from the empty well to Download and presses it: the pill morphs to 12px corners on the fast spring, with a 10% primary state layer.
  2. Downloading: a spinner takes the icon's fixed 18px slot (`States`), the label fades to Downloading (`Roll variant="fade"`) and the pill eases to the new width; the pointer returns to rest on the well.
  3. Done: a check and Downloaded, the button turns tonal (primary container, 200ms effects).
- Data never rewinds: plays once and holds. Reduced motion shows the poster with no morph.
- Films: final/cp-canonical.png and -390.png (poster), final/cp-canonical-loop.png and shots/cp-canonical-390-loop.png, shots/cp-canonical-slow.png (4x), press frames shots/cp-canonical-press.png (`--at press`, 4x, 60ms).
- Fixes from film: the pointer's return used a missing target (now a point per layout); `uneven padding` on the idle button while `States` held the longest label's width, so the label now resizes with `Roll` and the icon keeps a fixed slot; `will-change: transform` on the button face, which moves by layout as the pill resizes.
- Gates: `--gate` wide and `--gate --width 390` both "rehearsal passed" (re-run after the last edits). Typecheck: no errors in this scene (the playground has two unrelated errors in other scenes).
- Not checked: dark theme, real-device frame rate, touch, a fresh-eye reviewer; heavy host load gave inconclusive sampling coverage.

## v2 fresh-eye review
- A tilted pile with no Commonplace UI could have been any product, and its front card was empty below the button: the scene is now the product's own Portable editions panel in a quiet browser window (`commonplace.example`), bleeding off the right and bottom with one 36px gutter top and left. The three editions are M3 list cards (Prompt edition / Copy prompt, Full edition / Download, Complete edition / Download); the story is the Full edition's Download. Compact: two editions whole, Copy prompt as an outlined icon button, and a quiet row under the crop.
- The pointer sat at the left edge while Downloading started: it now rests on the panel beside the heading, near the buttons, and the opening holds 1.4s so the press is seen before the change; the press frames are filmed with `--at press`.
- Plate: `var(--ss-canvas)`. Placeholder row bars keep a name-over-file pitch and a quiet action so the row's insets match.
- Re-filmed after these fixes (poster, 390, loop sheets, `--at` close-ups) and `--gate` wide and `--gate --width 390` both "rehearsal passed". Left as candidates, not gate lines: rolling `Count` entrance/handoff notes, and `lopsided`/`steps in its box` on the Download pill while its label resizes mid-transition (even 16px padding at rest).
