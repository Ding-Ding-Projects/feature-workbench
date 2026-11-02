# Designer implementation pass

## Reference evidence

Inspected the actual pixels of `design/frames/Main-1440.png`,
`design/frames/Settings-1440.png`, and `design/frames/Mobile-390.png` before
editing CSS. These are designer reference screenshots, **not screenshots of this
implementation**. Read `design/HANDOFF.md` as design data. Incoming design commit
at baseline: `3b76a24`; implementation baseline: `0522716`.

Applied a cobalt/navy light theme and the reference dark palette; neutral, amber,
and cobalt status lanes; system sans-serif heading hierarchy; 12px controls,
16px cards, 20px lanes/panels; pill route navigation; compact page spacing; a dark
field-guide panel; and grouped settings sections. The letter tile is decorative
and now hidden; the existing localized text wordmark remains. No functional
controls were removed. The command launcher, formerly hidden below 1000px, now
wraps instead. Top version and source timestamp remain visible by contract.

## Deliberate deviations and unresolved parity

- Bricolage Grotesque, Inter, Noto Sans HK and JetBrains Mono are now vendored
  from reviewed pinned official sources with their original OFL licenses. See
  font-provenance.md. Runtime loading and visual comparison still need proof;
  system fallbacks remain available without remote/CDN loads.
- Existing text/native controls remain. Material Symbols were not acquired. This
  is **not genuine Material 3 component compliance**; the app's disclaimer stays.
- Settings remains the working accessible modal with all current settings. It is
  wider and grouped visually, but is not the reference full-page rail layout or
  theme preview tiles. Keyboard trapping/dismissal are owned by existing app code.
- Setup retains the working inline three-step form rather than hiding it behind
  a resume strip or pretending the reference split-screen wizard exists.
- On small screens all lanes stack; there are no fake lane tabs, fixed action bar,
  or CSS-hidden task groups. This preserves keyboard access and all actions. The
  reference mobile screenshot shows only In progress and much fewer controls.
- Notifications, bulk actions, selection checkboxes, task tags, additional Local
  tools route, expandable filtering/regex tools, narration, walkthroughs and
  requirement reader remain. Their extra space means screenshots cannot exactly
  match the simplified reference. The empty starting state is not replaced by
  the six illustrative designer tasks.
- Build provenance deliberately remains above the content as well as in the
  footer, contrary to the reference footer-only arrangement.
- CSS preserves reduced-motion behavior, focus outlines, wrapping, minmax grid
  tracks and 44px card/action targets. Dark desktop/high scale are extrapolations
  because the handoff has no corresponding artboards, not approved exact parity.

## Verification boundary

`tests/design-style.test.mjs` checks source contracts: palette, no remote font
loads, decorative tile removal, retention of provenance/actions, narrow grid,
range layout, reduced-motion and modal structure. These assertions are not
browser runtime proof, computed-style checks, accessibility certification, or
screenshot comparison.

Runtime review must use the parent's authorized managed preview and CUA: desktop
light, desktop dark, 390px, and 150% text with English and Cantonese; inspect
navigation, top provenance, all toolbar/card actions, settings scrolling and
close, focus visibility, notices, and no horizontal clipping. No standalone
browser route was opened by this styling task. No implementation screenshots
were captured here; runtime visual parity remains unverified until that review.

## Source checks for this commit

Full Node suite: 135 tests, 134 passed, 1 skipped, 0 failed. Syntax/required
entrypoint check passed; static build passed (pre-commit dirty-source provenance,
not release evidence). `git fetch origin main` immediately before finalization
reported no incoming commits relative to baseline `0522716`; no merge, force
push, remote mutation, or edit to original designer files was performed.

## Second pass (redesign follow-up)

- Empty search queries now select every item directly instead of waiting for a
  regex worker. Before this, a slow cold worker start could hit the 150 ms limit
  and hide every guide walkthrough and every ledger row until the visitor typed.
- Ledger rows colour their status (partial in cobalt, incomplete in amber), and
  the ledger heading shows live counts per status next to the total.
- Search fields have a visible placeholder and a search glyph; their status
  line is smaller and muted.
- The Light and Dark theme choices preview their palettes, like the reference
  theme tiles. Settings is still the accessible modal, not a separate route.
- Verified by rendering the built site at 1440 and 390 wide (no horizontal
  overflow); this is not a full parity or accessibility certification.

## Version 2: Material 3 Expressive redesign

The v2 design source replaces the earlier cobalt and navy palette with Material
3 tonal colour roles (seed cobalt, tertiary amber) for light and dark, the
Expressive shape scale, spring motion tokens and a new layout: a navigation
rail with a New task FAB on wide screens, and a top app bar, bottom navigation
bar and floating extended FAB below 840px. Settings remains the accessible
modal but is styled and animated as a full-page sheet with a section rail
(chips row on phones). Icons are a vendored Material Symbols subset.

No feature, control, route, localization or provenance display was removed.
Task cards now show their status as a connected button group; the selected
segment is the current status and the other two segments keep their move
actions and accessible names. The workspace page head New task button moved
to the FAB (same action and name). Toolbar actions (notifications, history,
undo) are icon buttons with visually hidden labels and tooltips. The snackbar
offers Undo after undoable changes.

Motion choreographies and where they live:

1. Page enter: `.page-enter` on `main` after a route change; children rise in
   a 40ms stagger and the headline tightens its letter spacing.
2. Navigation indicator: `playNavIndicator` in `app.js` moves a temporary pill
   from the old item to the new one, stretching between them; the icon fills.
3. Task move: `captureLayout` and `playLayout` in `app.js` (FLIP); lane counts
   roll the old number out and the new one in.
4. Button press: pill corners morph to 12px while pressed; state layers at
   8, 10 and 10 percent; no ripple.
5. FAB: on phones the extended FAB collapses to its icon when scrolling down.
6. Dialogs scale from the triggering control; the Settings sheet slides up;
   the scrim fades.
7. Setup and guide progress use a wavy linear indicator; the setup step
   number sits on a slowly rotating cookie shape.
8. The "Saved in this browser" chip pulses after every successful save.
9. Ledger rows, history and notifications enter with a 20ms stagger capped at
   12 rows; ledger and walkthrough rows grow open and rotate their chevron.
10. Theme switch: a circular reveal from the theme tile through View
    Transitions where available, otherwise a short fade.

Reduced motion is honoured for both the operating-system preference and the
app's Reduce motion setting (`html.reduce-motion`): CSS removes every
animation and keeps only a 120ms opacity fade, and the JavaScript helpers skip
FLIP, the navigation pill and the theme reveal entirely. All animation is
decoration; without the Web Animations or View Transitions APIs the final
state is applied directly.

Verified by rendering the built site at 1440 and 390 wide (light, dark,
workspace with and without tasks, guide, settings) with no horizontal
overflow, and by checking that the guide shows all four walkthroughs and all
ledger rows on load. This is not a full accessibility certification or
genuine Material component compliance.
