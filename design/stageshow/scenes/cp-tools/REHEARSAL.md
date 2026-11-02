# Rehearsal: cp-tools
Gold: upload (kept: well ground with 14px stage radius, hero window shadow, tinted in-flight row with a flat accent Meter, list rows with an icon lane, filler rows as bars). Changed: still instead of drag-and-drop animation; layout is pinned bottom bleed (40px gutters left, right and top, off the bottom) in a 560 x 380 feature card; browser chrome with the commonplace.example pill; content is the Convert files panel from the Built-in tools deep-dive, Commonplace look, Material Symbols Rounded filled 18px, mono file names as the real app draws them.
Beats: still. The queue bar shows the batch, the row above has settled (Done, reopened and checked), the tinted row is the file converting now at 62%.
Captured: widths 1280 (wide) and 390 (compact 358 x 300, 24px gutters, name over result in each row). Light theme only.
Film: compact first pass flagged `framing: ends 16px short of the right edge` -> gutters moved to 24px; `tight lines` on filler bars -> filler cell gap 8px. Final: no issues at both widths; gate `rehearsal passed`.
Review: compared beside gold-static: one hero, no satellite; the eye lands on the tinted row, then the settled row above it.
Real strings: Convert files, Queue · 240 files, Pause, minutes-march.docx → PDF, Done, reopened and checked, site-photo.png → JPG, 62%.
Assumptions: the still shows the mid-action frame rather than a settled one, as the brief asked for one file mid-action.
Unresolved: none.
Not checked: dark theme, reduced motion (still only), a host page around the card.

## Fresh-eye review
- Even side margins (window floated with equal gutters): the window now sits 40px from top and left and runs off the right and the bottom (wide 620px wide, compact 400px wide). The panel inside ends a full gutter inside the stage (40px wide, 16px compact), so only the window's empty margin is cut.
- "Done, reopened and checked" sat about 3px from the card's inner edge: the panel is wider now (432px inner), and the status keeps the row's 12px inset plus the panel's 16px padding.
- Systemic "board of bars" note: does not apply here. There is no task board in this scene; the filler rows are the queue's waiting files, at the foot, away from the subject. The real-string budget stays at 7.
- Re-filmed to final/cp-tools.png and final/cp-tools-390.png; `--gate --still` passed at 1280 and at 390.

## v2 redesign (Material 3 Expressive)
Changed: v2 roles throughout: page #F5F2FA, the card #FFFFFF at 28px with a Bricolage title, queue on surface-container #EFEDF4 at 20px, M3 linear progress (primary active, gap, secondary-container track, stop dot), Pause a tonal full pill, rows full pills, the converting row in the In progress tone (tertiary-container #FFDCBE, ink #2D1600) with an M3 Expressive wavy progress (travelling sine, flat track, stop dot). File text 12px to keep every row inside its pill. A third real-looking queue file, field-notes.pdf (a name from the Built-in tools deep-dive) to TXT.
Beats (loop, no cursor, three conveyor cycles of about 3.6s): 1 the wave runs to 100% while the percent rolls; 2 the row settles: the tint lets go and "Done, reopened and checked" takes the progress's place; 3 the finished row above folds away on the default spring and the next waiting file starts (name, tint, wave in) and climbs to 62%. After three files the frame equals the opening frame, so the seam needs no reset. Rows are keyed by position and shifted by an act.snap while the folded row is out of sight, so the wave keeps its phase across the seam. Poster = the opening frame (one done, one at 62%).
Gate: `--gate` rehearsal passed at 1280 and 390.
Remaining candidates (not gate lines): handoff shift / settle snap of about 1 to 3px and vanish/appear notes at each position snap (the shifted row is drawn identically by its neighbour; checked in shots/cp-tools-next-0.png), "hard edge" on the wave's own growing clip (softened by a 5px mask), lopsided -2px on a row in the still (the hidden status state's width; nothing visible overflows), Count digits mid-roll.
Finals: final/cp-tools.png, cp-tools-390.png, cp-tools-loop.png, cp-tools-390-loop.png (now --states sheets, since it plays once); beat frames shots/cp-tools-{done-0,next-0}.png.
Not checked: dark theme, real-browser pacing of the infinite wave animation, host page, a second-reviewer fresh eye.

## v2 fresh-eye review
- The queue bar never moved while files finished: each completed file now rolls a "done" count beside "Queue · 240 files" (86, 87, 88, 89) and advances the queue bar and its track by one file of 240. Because that count only grows, the scene now plays once in view instead of looping (data never rewinds); the poster is its end (89 done, site-photo at 62%).
- The percentage overprinted mid-roll ("1?%%", "3¿%"): the per-file percent is now a Roll in a fixed 40px right-aligned cell with overflow hidden; Roll clips the changing figure to its own line, so the digits never print over the unit or each other.
- The finished row's words were sliced by its folding edge: closing now fades the words (160ms) before the height folds (delayed 160ms).
- Plate: stage uses var(--ss-canvas); the app page inside keeps #F5F2FA. The window already bled off the right and bottom.
- Gate: rehearsal passed at 1280 and 390.
- Still candidates (not gate lines): small wave phase handoff (about 2px) at each position snap, Roll settle of about 2px, and the kit Count digit strip homing behind its mask.
