# Browser-local theme schedules

This is a working **theme-only subset**, not complete scheduled-settings compliance. No accounts, network requests, API sources, Home Assistant connections or credentials are supported. There are no simulated connection controls.

## Module contract

`defaultScheduleConfig(timeZone = 'UTC')` creates disabled state. `validateScheduleConfig(config)` returns a detached normalized value or throws `ScheduleError` with a machine-readable `code`. Unknown fields and versions are rejected; version 1 has no implicit migration. Missing optional date bounds normalize to empty strings. The parent owns browser persistence, reset, history and export/import validation.

```js
{ version: 1, enabled: false, timeZone: 'Europe/London', rules: [
  { id: 'evening', label: 'Evening', enabled: true,
    start: '20:00', end: '07:00', weekdays: [0,1,2,3,4,5,6],
    startDate: '', endDate: '', theme: 'dark', priority: 0 }
] }
```

The schema allows up to 32 rules, unique stable 1–64 character ASCII identifiers, nonblank names up to 100 characters, integer priorities 0–100, and `light`/`dark` themes. Weekdays use Sunday=0 through Saturday=6; all seven days are one rule, not duplicated rules. Time values require `HH:mm`; equal times are rejected rather than interpreted as an entire day. Dates are real ISO calendar dates. Runtime `Intl` validates the configured IANA zone; numeric offsets are rejected.

`evaluateSchedule(config, date = new Date())` is pure and returns `{theme, ruleId}`. Both are null when disabled, empty, or unmatched. Apply the result only to the **effective** theme: `result.theme ?? manualTheme`. Never overwrite manual preferences with a scheduled result. Highest priority wins; ties choose the later listed matching rule. Invalid configuration or clocks throw, so the host must fail safe to manual preferences if stored data is corrupt.

`createSchedulePanel({language, getConfig, onChange})` returns a semantic section with native controls, nested labels, fieldset/legend weekday choices, inline alert validation and a polite effective-theme preview. Language accepts `en`, `yue`, or `both`. `getConfig` must return validated current state. `onChange` must synchronously accept the validated complete configuration (or throw to signal failure). Avoid re-rendering the entire host in that callback: the panel manages its own list rendering. The returned `section.refresh(date?)` updates the clock preview without replacing an active editor or moving focus. The host should call it on its bounded clock interval and visibility changes, alongside recomputing the effective theme. There are no animations, fixed widths or drag-only operations. Buttons and fields are keyboard-operable; new/edit forms focus their name field, and save/cancel/removal returns focus to Add.

## Time semantics

Start is inclusive and end exclusive at minute resolution. Cross-midnight rules use the weekday and optional inclusive date bounds of the **starting** local day, including month/year rollover. A rule ending at 07:00 does not match 07:00:00. Date bounds constrain start dates, so an overnight rule on the final date may continue into the following morning.

The evaluator compares each instant's wall-clock representation in the configured zone. During spring DST transitions nonexistent minutes never match; a window extending past the skipped period can still match later valid minutes. During autumn DST transitions repeated minutes match on both occurrences. These are wall-clock windows, not fixed elapsed durations. Browser timezone databases determine historical and future zone rules. The page must be open for refresh to run; this is not an OS alarm or background scheduler.

## Verification and remaining gaps

`node --test tests/schedules.test.mjs` checks exact boundaries, every-day and selected-day rules, disabled and empty state, invalid schemas and limits, date validity, overnight/year rollover, timezone offsets, DST skip/repeat behavior, priority ties and immutability. Unit checks do not prove browser persistence, layout, screen-reader use or host integration. The host owns supported browser QA and aggregate test/build verification.

Other customization fields, external authenticated sources and their privileged credential/network boundaries, Material components, per-control search builders, rich personalization, and full schedule version migration remain unimplemented. This module does not claim those capabilities. Direct local removal is reversible only through host history when integrated; no independent history or destructive-confirmation framework is provided here.
