# Rehearsal record

## How the frames were made

Every artboard was rendered as a still in headless Chrome with the design's own fonts (downloaded from Google Fonts), at 1440 px and 390 px wide (the phone artboard at 390 x 844 only). The stills are in `frames/`. Each render was checked for horizontal overflow: none at either width.

Gold calibration: `static-card` and `linear`. No gold folder was copied (real application screens).

## Fresh-eye review

A separate reviewer, given only the Stageshow `review.md` and `verify.md`, the gold examples and the frames, returned 15 findings. Fixes were made in the canvas and every artboard was re-rendered.

| # | Finding | Result |
| --- | --- | --- |
| 1 | Phone: empty space under the list; counts and labels differed from desktop | Fixed: same six tasks and labels as desktop, setup card added. About 110 px remains above the bottom action bar (kept, see HANDOFF). |
| 2 | Setup (desktop): content stopped short with an empty band and a gap above the buttons | Fixed: centred 640 px column, buttons directly under the content. |
| 3 | Workspace: lanes ended at different heights | Fixed: two cards per lane. |
| 4 | Settings: Appearance half empty, Personal wording stretched | Fixed: Appearance split two-up, cards align to their content. |
| 5 | Setup and Settings on phones: step list and nav stacked in full before content | Fixed: compact progress bar and a horizontal chip row below 640 px. |
| 6 | Workspace on phones: Undo wrapped alone | Fixed: History and Undo are 44 px icon buttons. |
| 7 | Workspace: the hero pushed the board below the fold | Fixed: title row at 40 px, board starts above the fold. |
| 8 | Raw provenance tokens at card weight | Fixed: moved to the footer line. |
| 9 | Ledger rows repeated one sentence and one pill; an empty "Verified" filter | Fixed: title, id and real status per row (from `8157584`), one honest summary, filter removed. Guide re-rendered after the status update. |
| 10 | Ledger rows tall on phones | Fixed by 9. |
| 11 | One Done card had no Edit | Fixed. |
| 12 | Shift glyph read as a speck; shortcut written two ways | Fixed: "Ctrl Shift F" everywhere. |
| 13 | Ambiguous browser icon in the local chip | Fixed: laptop glyph, chip folded into the subtitle. |
| 14 | Native select chevron | Fixed: styled select with the set's chevron. |
| 15 | Reset close to the safe actions | Fixed: divider before Reset. |

## Not checked

Live interaction in the canvas player, focus and hover states, dark versions of the desktop screens, Cantonese-only layouts, text at 150 %, and real touch-device input.
