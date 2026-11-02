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

- Typography uses OS/system sans-serif, not Bricolage Grotesque, Inter or Noto
  Sans HK. Provenance uses local monospace fallbacks, not JetBrains Mono. No font
  was fetched or vendored; there are no new remote/CDN loads or licensing claims.
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
