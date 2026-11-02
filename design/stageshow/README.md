# Commonplace product shots (Stageshow)

Faux product UI scenes of the redesigned Commonplace, built with the Stageshow skill (`benjitaylor/skills`, folder `stageshow`, commit `802057409787133703c56001080169e347305572`, MIT). They are marketing-style illustrations of the product, not the product itself.

| Scene | What it shows | Size |
| --- | --- | --- |
| `cp-hero` | Animated: a task is typed, saved to To do, moved to In progress, and confirmed as saved in this browser. About 15 s, seamless loop, poster is the payoff. | 720 × 380, phone 358 |
| `cp-language` | Bilingual mode with a compact Cantonese label and a playfulness slider. | 560 × 380, phone 358 |
| `cp-games` | A shared-model integration ledger over a game editor. | 560 × 380, phone 358 |
| `cp-appearance` | Theme tiles and text size, with their effect on the board. | 560 × 380, phone 358 |
| `cp-navigation` | The Ctrl Shift F command palette jumping to a setting. | 560 × 380, phone 358 |
| `cp-safety` | A two-key delete confirmation. | 560 × 380, phone 358 |
| `cp-records` | Restoring a snapshot from local history. | 560 × 380, phone 358 |
| `cp-tools` | Local file conversion with a checked result. | 560 × 380, phone 358 |
| `cp-statushub` | A live agent session with a searchable record. | 560 × 380, phone 358 |
| `cp-evidence` | A completeness inventory and its failing, then passing, check. | 560 × 380, phone 358 |
| `cp-sites` | A shared link unfurling with its preview. | 560 × 380, phone 358 |
| `cp-build` | A build log with its provenance line in the built app. | 560 × 380, phone 358 |
| `cp-release` | A release with its food code name, timing and assets. | 560 × 380, phone 358 |
| `cp-repository` | README line counts with an effort estimate. | 560 × 380, phone 358 |
| `cp-canonical` | Portable instruction editions as a stack of file cards. | 560 × 380, phone 358 |

## Files

- `scenes/<id>/`: each scene's React source, its scoped CSS and its `REHEARSAL.md` (the gold example it started from, what changed, the fresh-eye review findings and fixes, and what was not checked).
- `commonplace/look.css`: the Commonplace look mapped onto Stageshow's tokens. It imports a local `fonts.css` that is not committed (see below).
- `frames/`: the wide stills (`<id>.jpg`, cropped to the stage at 2x), the phone stills (`<id>-390.jpg`), and the hero loop (`cp-hero.mp4`, 720 × 380).

## Running the scenes

1. Copy the Stageshow skill folder at the commit above into a scratch folder and run `npm ci` there.
2. Copy `scenes/cp-*` into its `examples/` and `commonplace/` next to `kit/` (so `../../kit` and `../../commonplace/look.css` resolve).
3. Create `commonplace/fonts.css` with `@font-face` rules for Inter, Bricolage Grotesque, JetBrains Mono and Noto Sans HK (the repository vendors these in `src/fonts/`) and Material Symbols Rounded (not vendored here).
4. Run the playground and open `?capture=<id>`; film with `scripts/film.mjs`.

## Review status

Every scene was filmed at its shown width and at 390, passed `film.mjs --gate` (`rehearsal passed`; the hero on its full loop), and was reviewed by a separate fresh-eye reviewer following Stageshow's `references/review.md`. All findings that could be fixed were fixed; the remaining notes are in each scene's `REHEARSAL.md`. Dark theme and reduced motion were not reviewed.
