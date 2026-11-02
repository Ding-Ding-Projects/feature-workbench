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

## v2 redesign

- Re-skin: the terminal uses the dark-theme surface roles (#121318 ground, #C6C5D0 output, #E4E1E9 bright line, #B9C3FF path and tick, #90909A dim and prompt mark) at 28px; the app satellite is a 28px window whose lane heads are the v2 tonal lanes (To do #DEE1F9, In progress #FFDCBE, Done #DDE1FF), each with its label line and a count dot at the two ends. Stage corner 28px.
- Motion: `play="once"` in view, no cursor. Beats: 1. `npm run build` is typed. 2. The three files the build wrote land in their reserved rows, one after another (4px rise on the fast spring, effects fade). 3. "Built version 0.4.0 from a1b2c3d" and its commit time land. 4. The open app picks up the build: its footer's provenance rolls from `0.3.2 · 2026-10-28 16:40` to `0.4.0 · 2026-11-02 09:14` (`Roll`) and pulses once (1 -> 1.06 -> 1, default spring). Poster: the same version and time in both places.
- Fixes on the way: `lopsided` lane heads -> label and count at the two ends; `touching` footer text -> a flex row with an 8px gap, spread to both ends (also clears `uneven inset` at 390); `steps in its box` on the app window (pinned by its foot, its height followed the rolling line) -> the footer is a fixed 34px row.
- Gate: `--gate` passes at 560 and at 390 (no candidate lines). Finals: `ss/final/cp-build.png` and `-390.png` (poster), `ss/final/cp-build-loop.png` (from `--at type`), phone loop `ss/shots/cp-build-loop-390.png`, beat frames `ss/shots/cp-build-press-app.png`. Banned-word scan clean; typecheck clean for this folder.
- Not checked: dark theme; frame pacing (machine heavily loaded, inconclusive coverage on every recording); live reduced-motion toggling; a second reviewer's fresh eye. Compact shows no file rows, so its beat 2 is silent there. The dark area right of the satellite below the log remains, as before.

## v2 fresh-eye review

- Empty black at the terminal's lower right (wide), and at 390 the terminal's foot showing behind the browser card: the layout is now stacked (stacked-cards gold) instead of a satellite straddling the terminal's left edge. Both windows share one left edge with a 12px gap and run off the right. The terminal's height now matches its log, which ends on the idle prompt where the caret waits after the build, so it holds no empty black. The app window is under it and runs off the bottom, so nothing peeks out behind another window. The terminal is whole in height rather than bled off the bottom: the feedback asked for a bottom bleed, but bleeding the terminal would have needed the app to cover it, which is what caused both faults.
- The provenance now sits where the v2 site prints it, at the top right of the app header ("Running version 0.4.0 · 2026-11-02 09:14"). At 390 it takes its own line and the wordmark is dropped (the address bar names the app), so the lane names stay whole in the crop.
- Set-wide hierarchy: the lane heads were gray bars with a count dot. They now read "To do", "In progress" and "Done" in their v2 tonal lanes. Task cards stay as bars (edge filler, off the bottom).
- Set-wide plate: the stage ground is now `var(--ss-canvas)`.
- Film fixes: at 390 the windows were flagged short of the gutter until the compact gutter went to 24px and the terminal became the larger visible window. A lane 8px short of the right edge was fixed with a wider right inset (62px) inside the off-edge window.
- Re-filmed: poster stills at 560 and 390, `final/cp-build-loop.png` and `shots/cp-build-loop-390.png`. `--gate` passes at both widths. The banned-word scan and the typecheck are clean. Not checked: dark theme and live frame pacing. During typing, the reserved output rows are empty black for about 2s before the files list in.
