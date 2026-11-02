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
