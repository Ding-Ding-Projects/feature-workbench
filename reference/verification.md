# Verification ledger

## Source checks

27 focused tests pass at source `49fe4d86673e4e060f4c27cc52a79ca9a15e371c`. Bounded JSON validation covers empty dynamic inventories, Unicode bounds, escaped duplicate keys, unsafe keys, malformed input, unsupported versions, unknown fields, string-only values, byte size, depth, strict whitespace, fatal UTF-8, BOM handling and control characters.

A separate differential run against the reference browser-extension validator exercised 361 synthetic cases, including 296 accepted and 65 rejected payloads, plus 592 two-way semantic roundtrips. No private mappings were copied into this repository. This establishes format parity for those cases, not universal proof about every possible input or text-replacement workflow.

The acceptance tests deliberately remove every required feature and evidence class. Green inventory checks mean the ledger is honest and structurally complete, not that incomplete rows have shipped.

## Observed browser interactions

Route: managed cloud browser through the supported preview daemon. Preview artifact: source `49fe4d86673e4e060f4c27cc52a79ca9a15e371c`. No native installation was exercised.

- Onboarding advanced from language to appearance; reload resumed the saved second step.
- Completing setup created a visitor-owned task, and moving it updated the In progress column.
- The Settings dialog exposed language, separate tone controls, appearance, wording upload, narrator and recovery controls.
- A neutral synthetic personal JSON changed the Settings label immediately.
- Reload preserved that wording; a duplicate-key file was rejected while preserving the prior valid wording.
- One workspace screenshot was visually inspected. It is not yet a checked-in source-bound capture record.

These observations are focused browser evidence only. Wording clear/reset, all language modes, mobile sizes, keyboard-only workflows, narration output, malformed storage recovery, downloads and published-site behavior still need their own complete checks. No row is certified fully verified from these observations alone.

## Delivery boundaries

A custom workflow push was refused because the available OAuth credential lacks workflow scope. No permission expansion was attempted. The separately authorized built-in branch publishing route is used for Pages; local tests are not represented as a custom CI run.

Native installer, desktop companion, operating-system integration and release-signing proof remain unavailable. Every incomplete inventory row remains an open obligation.
