# Rehearsal: cp-navigation

Gold: `static-card` for the framing (copied: feature-card stage, pinned window with a gutter at the top and left and a bleed off the right and bottom, quiet browser chrome, filler at the edges), and the `linear` product study for the interaction only (a command menu over the product: its input as the menu's own top line, rows with an icon, a label and a trailing mark, the first match highlighted, the page dimmed underneath). Changed: the Commonplace look (`look-commonplace`, cobalt accent, Material Symbols Rounded filled at 18px), the Commonplace header with its "Find an action" trigger and Ctrl Shift F keycap in its open state, the palette hanging from that trigger with its right edge on the trigger's, Commonplace's pattern button (`.*`) in the search line, and the Text size result carrying its live slider and value in the row, as the real palette does. The board under it keeps its To do, In progress and Done lane colors and icons as filler.

Beats: a still, no script, no cursor (the story is the keyboard shortcut).

Real strings (7): Find an action, Ctrl Shift F, text size (typed), Text size, 110%, Appearance settings, Try the command palette.

Captured: stills at 560 and 390 (358 stage) through `?capture=cp-navigation`, light theme only: `final/cp-navigation.png`, `final/cp-navigation-390.png`. `--gate --still` and `--gate --still --width 390` both end `rehearsal passed`.

## Fresh-eye review

- Whole window with even side margins: the window is now 640 wide (420 narrow) and runs off the right edge as well as the bottom. The header's content row ends at the trigger, so "Find an action" and its Ctrl Shift F keycap stay whole, with the palette hanging from it.
- Board made only of gray bars: the In progress card just below the palette now reads "Try the command palette"; the rest stay bars. The palette dropped its third (filler) row so that card shows whole.
- Same text size value as cp-appearance: the Text size row now shows 110% with its slider at the matching position.
- `tight lines` on the new real card: the title's line box tightened to match the bars' air.

Not checked: dark theme (not requested), reduced motion and motion (still only).

## v2 redesign

What changed: re-skinned to the v2 roles: surface-container-low page with no white header bar; "Find an action" as a full-pill surface-container-high search bar with a white Ctrl Shift F key pill (mono), as in the v2 workspace; lanes secondary, tertiary and primary containers with on-container icon ink; white 18px cards; the palette a 28px white surface with full-pill result rows, the first match on primary-container with on-primary-container text, the `.*` pattern button a pill, and the row's live slider in the v2 track-and-handle form. No v1 hex values remain.

Beats (loop, about 8s, no cursor; keycaps bottom-left wide, top on narrow): 1. Ctrl Shift F: the trigger pill morphs to 12px corners (fast spring) and takes primary-container while the palette grows from 0.92 at its top-right on the default spring and the page scrim fades in (effects curve); 2. "text size" is typed and the recent action that no longer matches closes up (Collapse) under the first match; 3. hold the payoff (the poster: query typed, Text size live in its row); 4. Esc closes the palette where it opened and the scrim fades out; the query clears while it is closed, so the next loop starts from the same calm frame.

Gate: `--gate` (loop) at 560 and 390 both end `rehearsal passed`. Remaining candidates, judged: `steps in its box` on the trigger (its radius and fill change, the text does not move), `manual` deferred layout check while the results close. Finals: final/cp-navigation.png, final/cp-navigation-390.png, final/cp-navigation-loop.png; 390 loop shots/cp-navigation-loop-390.png; press frames shots/cp-navigation-press-open.png (`--at open`) and the seam shots/cp-navigation-seam.png (`--at close`). Narrow drops the recent row (the palette would run past the stage foot). Banned-word scan clean.

Not checked: dark theme, reduced motion toggled mid-play, live frame rate on a real device.

## v2 fresh-eye review

- Reviewer found nothing scene-specific. Set-wide: plate is `var(--ss-canvas)` (was the well); the window already runs off the right and bottom. The To do lane head now reads "To do"; the lanes under the palette keep quiet bars, because a real name there was sliced by the palette's edge.

Gate and finals (after these changes): `--gate` (loop) at 560 and 390 both end `rehearsal passed`; re-filmed final poster, 390 poster and loop sheet in final/, 390 loop in shots/. Banned-word scan clean.
