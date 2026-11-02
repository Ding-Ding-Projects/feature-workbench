# Commonplace redesign: design handoff

A fully new visual design for the Commonplace sample workbench (the GitHub Pages site built from `src/`). It covers both routes, the settings surface, the setup wizard and a phone screen. This folder is the design source; the app in `src/` has not been changed yet.

## Files

| File | What it is |
| --- | --- |
| `canvas.json` | Canvas index: artboard positions, sizes, titles, notes. |
| `Main.dc.html` | Workspace route, desktop page (fluid, interactive: move cards between lanes, Focus view). |
| `Guide.dc.html` | Field guide route with the capability ledger. |
| `Settings.dc.html` | Settings as a full page with a section rail (a chip row on phones). |
| `Setup.dc.html` | Setup wizard, step 2 of 3 (Look and comfort). |
| `Mobile.dc.html` | Workspace on a 390 x 844 phone, dark theme (interactive lane tabs). |
| `frames/*.png` | Rendered stills of the five screen artboards at 1440 and 390 wide (the canonical originals listed in `docs/design-parity-inventory.json`; keep them byte for byte). |
| `frames/Features-*.jpg` | Rendered stills of the deep-dive pages (1440 stills scaled to 1080 wide to keep the repository small). |
| `Features-*.dc.html` | Feature deep dive: 14 pages (canvas page "Feature deep dive") covering all 112 tracked features in `src/features.json`, one card per feature with its spec and a drawn mock. |
| `REHEARSAL.md` | Review record: what was checked, what was found and fixed. |

Artboards are Design Component HTML files. They open in the design canvas this was made in; for a plain browser preview, a small renderer is needed for the `{{...}}` holes, `<sc-if>` and `<sc-for>` tags.

## The look

- Ground `#F3F5F9`, surface `#FFFFFF`, ink `#0D1526`, secondary ink `#475467`, hairline `#DCE2EC`.
- One accent, cobalt `#2546D6` (tint `#E8EDFF`, deep `#16309F`), used for primary actions, selection and Done.
- Status: To do is neutral (`#E9EDF4` lane), In progress is amber (`#FFEEDD` lane, `#7A2F06` ink, `#C2570C` mark), Done is cobalt.
- Dark theme (phone artboard): ground `#0B1220`, surface `#172238`, raised `#26334F`, ink `#F2F5FA`, secondary `#A9B4C8`, accent `#8EA2FF`.
- Type: Bricolage Grotesque 700 for headings, Inter for UI text, Noto Sans HK for Cantonese, JetBrains Mono only for identifiers and build provenance.
- Icons: Material Symbols Rounded, filled, 20 px (16 to 24 px only where noted), one family throughout.
- Radii: 12 px controls, 14 to 16 px cards, 20 px lanes and panels, pill navigation.
- Touch targets 44 px or larger; the 36 px card move buttons sit inside a 44 px row rhythm and should grow to 44 px if the board is used on touch screens.

## What changed from the current site

- Wordmark replaces the "c." letter tile.
- The workspace leads with the board: a short title row, then setup progress, tools, and three status lanes.
- History and Undo become icon buttons with labels for assistive technology; the shortcut is written "Ctrl Shift F".
- Build provenance moves to the footer line on both routes, with `[VERSION]` and `[COMMIT TIME]` filled from `build-info.json`.
- The ledger shows each row's title, id and status (Partial or Incomplete) with one honest summary instead of repeating the same sentence per row.
- Settings becomes a page with a section rail; the theme choice uses preview tiles.
- Setup becomes a split screen with a step list (a compact progress bar on phones).

## Content rules kept

- All visible copy comes from `src/i18n.js` or restates it; the sample tasks on the board are illustrative only (the shipped app still starts empty).
- The "Browser boundaries" and Material 3 disclaimer copy stays as written.
- No account, telemetry, sync or native capability is implied anywhere.

## Process notes

- Made with the Design canvas in Claude. The Stageshow skill guided the pass: commit `802057409787133703c56001080169e347305572` of `benjitaylor/skills` (folder `stageshow`), loaded from a pinned local copy because a fresh install was not permitted in the build environment.
- References read: `SKILL.md`, `references/craft.md`, `references/framing.md`, `references/rehearse.md`, `references/review.md`.
- Gold examples used for calibration: `static-card` (quiet hierarchy, restraint) and `linear` (lead with the product surface). No gold folder was copied, because these are real application screens rather than a marketing illustration.
- Stageshow rules that do not apply to real application screens and were recorded as not applicable: hero bleed and crop, satellites, the no-real-headings rule, cursor, motion and loop rules.

## Feature deep dive

Every one of the 112 features tracked in `src/features.json` (statuses as of `8157584`) has a card on one of 14 pages: Language, voice and personalization (13), Games (2), Appearance and layout (12), Navigation, search and commands (11), Safety, locks and authentication (7), Records, history and messages (7), Built-in tools and hand-off (8), Status Hub (4), Completeness and evidence (6), Landing site and shared links (10), Build and install (8), Release pipeline (8), Repository records and README (13), Canonical instruction deliverables (3).

Each card shows the feature id and status, a one-line summary, what it must do, the proof it needs, and a drawn mock of the feature working in the Commonplace look. Each page has a jump list. Sample values in mocks (versions, counts, commits, codes like `000 000`) are illustrative only. Mocks never claim a feature has shipped; status pills follow the ledger.

Eleven features had no detailed specification under their id (food discovery and its photo source, release food code names and photo, mobile site, responsive layout matrix, private documentation companion, wiki sync, public evidence gallery, dialog tone and emoji, portable editions); their cards are drawn from the public requirement text and are thinner.

## Source version

Drawn from `src/` at `49fe4d8`, then checked against `8157584` before publishing: the ledger now uses that commit's real counts (27 partial, 85 incomplete) and the drawn rows carry their real statuses. Surfaces added in `8157584` that are not drawn yet: narration controls beyond the Narrator section, local tools, the walkthrough articles and the expandable requirement reader, and the new `src/icon.svg` (the redesign uses a text wordmark instead of a letter tile).

## Open items

- Phone workspace: about 110 px of space remains above the bottom action bar when a lane holds two tasks. Kept: the bar is a fixed action area and the list grows into the space.
- Dark versions of the desktop screens, Cantonese-only string lengths, text at 150 % and focus or hover states are not drawn; they need a decision on scope before more artboards are made.
