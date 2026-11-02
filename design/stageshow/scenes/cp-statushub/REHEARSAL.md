# Rehearsal: cp-statushub
Gold: dark-hero (kept: dark theme, window inset top and left and off the right and bottom with its content column ending a full gutter inside, depth from surface steps plus a hairline instead of shadow, one status on its own pill, a record list with hairline rules and filler rows at the foot). Changed: still, 560 x 380 feature card; no sidebar (Commonplace has a top header, so the wide crop shows the wordmark header instead); a session card on the raised surface with an amber In progress pill (the app's In progress colors); a search field over a short record, newest first.
Beats: still. The pill reads In progress; the record shows Answer reached session inbox above Question waiting.
Captured: widths 1280 (wide) and 390 (compact 358 x 300: header and the card's meta bars dropped, window 16px from top and left and well past the right).
Film: wide flagged `tight stack` across the record rows (font-icon rows read as stacked text at the stage's base size) -> row text size set on the row and rows 42px; compact flagged a 16px right overrun and unequal gutters -> window widened to run well past, top gutter set to 16px. Final: no issues at both widths; gate `rehearsal passed`.
Review: compared beside the dark hero still: one lit status, the eye lands on the pill then the first record line. Project name is the sample repository name from the deep-dive page; no people, machines or paths.
Real strings: Commonplace (wordmark, wide only), feature-workbench, In progress, Search record, Answer reached session inbox, Question waiting, two times.
Assumptions: the help icon uses the amber #C2570C on dark, from the light token set, since the dark look defines no warning shade.
Unresolved: none.
Not checked: light theme, a live status change on the pill (still only).

## Fresh-eye review
- Dark navy plate on a light page: the stage ground is now the look's light canvas (#F3F5F9) with a 14px radius. Dark mode stays only inside the window, which still runs off the right and the bottom, and now carries a soft drop shadow on the light ground.
- Systemic "board of bars" note: does not apply here. There is no task board; the bars are header controls and record rows at the edges, and the real strings stay at 7.
- Re-filmed to final/cp-statushub.png and final/cp-statushub-390.png; `--gate --still` passed at 1280 and at 390.

## v2 redesign (Material 3 Expressive)
Changed: the stage ground is v2 surface-container #EFEDF4 (was the v1 #F3F5F9); the dark window uses v2 dark roles (#1F1F25 body, #292A2F card at 24px and lines, #E4E1E9 / #C6C5D0 text, #B9C3FF primary, #FFB870 tertiary for the question icon, replacing the v1 #C2570C note above). Search is an M3 search bar (full pill, surface-container-high). The pill is full: "Question waiting" on secondary-container #424659/#DEE1F9, "In progress" on tertiary-container #6A3C00/#FFDCBE. New real line from the Status Hub deep-dive: "Confirmed by polling". Compact drops the card's leading icon and sets the project name at 12px so the wider "Question waiting" pill never leaves the crop.
Beats (play once in view, no cursor; poster = the end): 1 "Answer reached session inbox" drops in at the top of the record (default spring, content waits for its space). 2 "Confirmed by polling" opens under it. 3 Only then the pill's label rolls to "In progress", its colour crossfades on --cp-effects and it pulses once (1 to 1.06 to 1 on --cp-spring-default). Reduced motion: no pulse, 120ms fades.
Gate: `--gate` rehearsal passed at 1280 and 390 (compact first failed on the pill and times cut by the crop; fixed as above).
Remaining candidates (not gate lines): settle snap of 1.5px on the arriving row as its second line opens below it, a Roll frame mid-change with the old label clipped.
Finals: final/cp-statushub.png, cp-statushub-390.png (posters), cp-statushub-loop.png and cp-statushub-390-loop.png are `--states` sheets (open, each mark, end) since it plays once; beat frames shots/cp-statushub-{answer,confirmed,status}.png.
Not checked: the light theme, replay on re-entry in a real host, a second-reviewer fresh eye.

## v2 fresh-eye review
- The only dark scene in a light set: switched to the light theme (the dark Status Hub look stays in the canvas). Light v2 roles: page #F5F2FA, card #FFFFFF at 24px, search bar and header controls #E9E7EF, primary #2546D6, question icon tertiary #8B5000, waiting pill secondary-container #DEE1F9/#161B2C, In progress pill tertiary-container #FFDCBE/#2D1600, hairlines #E9E7EF; stage plate var(--ss-canvas), window with the hero shadow.
- Empty header pills and meta bars: the header now holds "Find an action" (search icon) and the tune settings button, as the deep-dive's header draws them; the session's facts are three quiet chips from the deep-dive's registration: "main", "stable", "12 passed" (with a check). Header and card were tightened (50px header, 14px even card padding, 10px gaps) so "Question waiting" stays whole above the crop.
- Gate: rehearsal passed at 1280 and 390.
