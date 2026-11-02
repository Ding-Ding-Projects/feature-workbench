# Rehearsal: cp-sites

Gold: share (kept: satellite-focus framing, a quiet window pinned at one gutter and off the bottom, the front surface carrying the story with the stronger shadow, the window behind as context). Changed: the document and share popover became the Commonplace landing site (wordmark, "Plan one useful next step.", three guide tiles as filler) and a generic chat panel (no real chat app's brand) straddling the window's right edge over the page's empty side, holding one message with the link and its unfurled large-image preview. The preview image is the board itself (three lanes, In progress in amber), at 1200 x 630 proportions.
Beats: still, no motion.
Captured: 560 wide and 390 (compact 358 x 300), light theme, Commonplace look.
Film: first pass the chat sat 6px off the bottom edge and its header padded 10px against 14px sides → header 42px, card trimmed to a full 24px gutter. Compact first pass put the chat over the site's heading → compact drops the site and shows the chat alone, pinned top and off the bottom, the preview whole (216 wide, 18px clear of the edge, past the 16px gutter). Lanes inside the share image now run well past its lower edge instead of stopping 2px short.
Gate: `film.mjs --gate --still` → rehearsal passed at 560 and 390.
Compared with the share gold still: the eye lands on the preview's picture and title first, the site behind confirms it is the same product.
Assumptions: a chat embed limits its width, so the compact preview leaves white to its right.
Unresolved: compact has no landing page behind (it would only show as a sliver at 358 x 300).
Not checked: dark theme, reduced motion (no motion), fresh-eye review by a second reviewer.

## Fresh-eye review

- Reviewer: no findings.
- Systemic note (gray-bar board): not applied. What sits behind is the landing site, not a task board. The text beside the chat is already real (wordmark and "Plan one useful next step."), and the bar tiles sit at the edges under the chat. Turning one into a task title would add a string that is not about the shared link.
- Gate re-run on the restarted server: `--gate --still` passes at 560 and at 390. Finals: `ss/final/cp-sites.png`, `ss/final/cp-sites-390.png`.

## v2 redesign

- Re-skin: window and chat panel 28px, preview 16px, landing tiles 20px with 12px primary-container icon marks in on-primary-container. The share picture now shows the v2 board: To do secondary-container #DEE1F9, In progress tertiary-container #FFDCBE, Done primary-container #DDE1FF, white task cards with no outline, on the surface-container-low page ground. Hairlines are outline-variant / surface-container-high. Stage corner 28px. Chat moved up 3px (77px) to keep the 24px gutter after its padding grew to 18px.
- Motion: `play="once"` in view, no cursor. Beats: 1. The link has just been sent; the chat makes room (`Collapse reveal="drop"`) and the preview arrives whole as a skeleton at its own geometry (container-high picture ground, placeholder lines). 2. The picture resolves lane by lane in reading order, 120ms apart (6px rise on the default spring, effects fade; the ground turns to the page tone). 3. Site and title replace their placeholder lines in place (`States`). Poster: the finished preview.
- Also fixed: a type error from a `<br />` inside `Text` (the heading is now one string with `white-space: pre-line`).
- Gate: `--gate` passes at 560 and at 390 (no candidate lines). Finals: `ss/final/cp-sites.png` and `-390.png` (poster), `ss/final/cp-sites-loop.png` (from `--at open`), phone loop `ss/shots/cp-sites-loop-390.png`, beat frames `ss/shots/cp-sites-press-open.png`. Banned-word scan clean; typecheck clean for this folder.
- Not checked: dark theme; frame pacing under a heavily loaded machine (every recording reported inconclusive coverage); a one-frame width change of the landing heading was reported once at 0.18s, which reads as the display font arriving late, not scene motion, and did not recur after the heading fix; live reduced-motion toggling; a second reviewer's fresh eye. Compact still opens with a short chat card above white space before the preview unfolds (the opening second only).

## v2 fresh-eye review

- Set-wide plate: the stage ground is now `var(--ss-canvas)`.
- Set-wide framing: the landing window no longer sits inset with air on two sides. It is pinned top-left at the gutter and runs well past the right edge and off the bottom. The chat sits in front of its right side (overlapping windows). Bleeding the window off the left was tried first, and film rejects it because the top-left holds the chrome. The nav-link bars were dropped (now off-stage or slivers), and the tiles keep a fixed 124px width so the second tile's icon is not cut by the chat.
- Set-wide hierarchy: the bars here are edge filler (site copy lines, tile captions, the share picture's tiny lane heads). None sits beside a real number.
- Nothing moves for about 11s after the preview fills in: the scene plays once (`play="once"`). It now holds the payoff for 2s and stops on it; the stillness after that is the finished scene, not a stalled loop. The contact sheet keeps recording after the stop, which is why it shows the held frame.
- Re-filmed: poster stills at both widths and `final/cp-sites-loop.png`. `--gate` passes at 560 and 390. The banned-word scan and the typecheck are clean. `shots/cp-sites-loop-390.png` is from before the framing change (the framing change is wide-only).
