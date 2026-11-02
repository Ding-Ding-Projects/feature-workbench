# Rehearsal: cp-build
Gold: static-card (kept the pinned top-left hero running off the right and bottom, one satellite straddling its left edge about half outside, the well ground and one gutter; changed the hero to a kit terminal in the Commonplace ink, the satellite to the built app in a quiet browser window, and the stage to 560 × 380 with a compact 358 × 300 design)
Beats: none, a still feature card
Captured: widths 560 and 390 (compact), light look only, no states
Film: wide still, a hidden caret prompt line peeked out from behind the satellite -> removed the line; compact, uneven gutters and a loose stack inside a fixed-height satellite -> satellite hugs its content at one left edge with the terminal; footer short of its padding -> satellite height follows content. Final gate: rehearsal passed.
Review: compared beside gold-static: one hero, one satellite of a different kind, real words only on the build line, its commit time, the wordmark and the provenance line; columns and toolbar are filler.
Assumptions: the build prints the version, the short commit and the source commit time, and the app footer shows the same version and time ("Running version 0.4.0 · 2026-11-02 09:14", the Field guide footer form).
Unresolved: the terminal keeps an empty dark area to the right of the satellite below the log; it reads as the finished terminal, not filled further.
Not checked: dark theme, reduced motion (static anyway), a fresh-eye review by a second reviewer.

## Fresh-eye review
- Framing, a dark void under four terminal lines: added the files the build wrote to dist/ with their sizes (path and size on one grid), so the log fills the terminal above the satellite; the satellite's board is slimmer (three tinted column heads) so the log stays clear of it. The compact layout now also shows the source commit line. A smaller dark area remains right of the satellite, below the last line, where a real terminal would sit empty after the build.
- Systemic, board of gray bars: not applied here. The board is a small satellite whose subject is its footer provenance line; naming tasks in it would pass the word budget and compete with the version tie.
- Final: stills in ss/final/cp-build.png and cp-build-390.png; `--gate --still` and `--gate --still --width 390` both end "rehearsal passed".
