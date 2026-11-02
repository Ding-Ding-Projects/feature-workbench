# Rehearsal: cp-appearance

Gold: `panel-annotation` (panel over product). Kept: the product large and behind, the smaller tool panel in front with the satellite shadow and clear of the focal content, one neutral leader from the setting to the thing it changed, and a narrow design with no leader. Changed: the Commonplace look (`look-commonplace`, Inter and Bricolage Grotesque, cobalt accent, Material Symbols Rounded filled at 16px), a quiet browser window at `commonplace.example` running off the right and bottom with the To do and In progress lanes in view, and the Appearance panel (Light and Dark theme tiles, Text size at 110%) as the tool, over the window's address bar and page-header filler. Narrow: the same window off the right with the focal card at its top, the panel lying across the window's foot in one row (tiles beside the slider), no leader.

Beats: a still, no script. A short leader drops from the Text size slider to the In progress card right under the panel, whose title reads at 110%.

Real strings (7): Appearance, Light, Dark, Text size, 110%, Choose a comfortable text size, Export a backup before experimenting.

Captured: stills at 560 and 390 (358 stage) through `?capture=cp-appearance`, light theme only: `final/cp-appearance.png`, `final/cp-appearance-390.png`. `--gate --still` and `--gate --still --width 390` both end `rehearsal passed`.

## Fresh-eye review

- Empty bottom-right quadrant (window stopped short of the panel): the window is now 640 wide, runs under the panel and off the right edge, with two lanes in view; the In progress lane's right edge lines up with the panel's, a gutter from the stage edge.
- `uneven gutters: section.cpa-panel` (earlier at both widths): cleared by the new composition. Wide, the panel now sits over the window instead of beside it; narrow, the panel lies over the window's foot instead of stacking under nothing.
- Board made only of gray bars: the To do lane now shows its real first card, "Export a backup before experimenting", beside the focal card; other cards stay bars.
- Text wrapping: the two real card titles wrap inside their cards (the first pass let them run past the card edge).
- Leader: the board moved down below a setup strip (filler, as in the real workspace) so the leader runs through the lane's tint only, never over a card.
- `layout:` lines for page content past the window foot: the window is taller (still off the stage), so the page ends inside it.
- Same text size value as cp-navigation: both show 110%.

Not checked: dark theme (not requested), reduced motion and motion (still only).

## v2 redesign

What changed: re-skinned to the v2 Material 3 Expressive roles (DESIGN_V2 section 1): surface-container-low page, To do lane secondary-container #DEE1F9, In progress lane tertiary-container #FFDCBE with on-container icon ink, white task cards at 20px, wordless connected button groups on every card (the current lane's segment a full primary pill), lanes at 28px, panel at 28px, theme tiles with radio marks and v2 previews, the setup strip's step on the slowly turning cookie shape (the one decorative shape). Text size is now the v2 slider: a 16px track split by a 4px handle bar, a stop dot, and an inverse-surface value bubble. The v1 leader is gone: the taller v2 panel left it a stray dot, and the growing titles now show the cause and effect in motion. No v1 hex values remain. Narrow keeps only the Text size control in the panel (the whole Appearance panel covered the focal card once the slider grew).

Beats (loop, about 8s, poster = the opening frame at 110%): 1. press the handle, it widens and the value bubble rises (fast spring) before any travel; 2. drag to 130%, the handle follows the pointer, the value rolls (Count), both task titles grow on the default spring; release springs the track to the step; 3. hold the larger board; 4. the same hand drags back to 110%, which is the opening frame (the reset is a drag, never a rewind).

Gate: `--gate` (loop) at 560 and 390 both end `rehearsal passed`. Remaining candidates, judged: `appears with no entrance` on the Count and bubble (the bubble fades and scales in over 200 to 350ms; the detector catches the Count's strip), `near-tangent` lane foot at 390 (filler running off the window foot). Finals: final/cp-appearance.png (poster, wide), final/cp-appearance-390.png, final/cp-appearance-loop.png; 390 loop in shots/cp-appearance-loop-390.png; press frames shots/cp-appearance-press.png (`--at grow`). Banned-word scan clean.

Not checked: dark theme, reduced-motion toggled mid-play, live frame rate on a real device, a fresh-eye review by a second reviewer.

## v2 fresh-eye review

- Panel over the browser's address bar: the panel now hangs 8px under an in-app Settings control (a tonal pill in the page's header row, inside the crop), right edges aligned, measured with `rect('settings')`; the chrome is clear. The To do lane with both real cards moved to the open left column; the panel sits over the In progress lane (wordless; its head is a bar so no word is sliced by the panel).
- Gap between "Text size" and the slider: tightened to 6px. The floating value bubble that needed that room is gone; the value beside the label reads live as the handle steps, and the handle widens while held.
- Status buttons drawn as bars inside pills: the connected group is labelled "To do", "In progress", "Done" with the current one selected (only on the focal card; the second card keeps title and note).
- Handoff snap and a Count with no entrance on the size value (review2/appearance-roll.png): the rolling Count was removed; the value is a plain readout that steps with the handle (`data-snap` on that text node only), so nothing swaps or rolls mid-drag.
- Set-wide: plate is `var(--ss-canvas)`; the window bleeds off right and bottom; lane heads read "To do" (the eye's lane) instead of bars. Narrow: the lane head is hidden (it sat under the panel) and a filler card carries the lane off the bottom.

Gate and finals (after these changes): `--gate` (loop) at 560 and 390 both end `rehearsal passed`; re-filmed final poster, 390 poster and loop sheet in final/, 390 loop in shots/. Banned-word scan clean.
