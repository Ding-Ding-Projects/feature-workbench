# Rehearsal: cp-records

Gold: `static-card` (pinned feature card: one window, one surface over it, real words only where the story is), with the toast placed as the `gmail` study places it: bottom-left, one gutter up, over filler. Kept: the hard bottom crop, the quiet filler rows, a row selection as an inset accent fill. Changed: the Commonplace look and board, a 560 x 380 stage (compact 358 x 300), the window inset one gutter from both sides like the Safety card so the two read as one set, and the anchored history panel instead of a straddling detail card.

Beats: still only. The frame: Local history open from the toolbar's history button (pressed), three snapshots, "Deleted 1 task" selected with the restore mark, the task back at the top of To do, and "Task restored." with Undo in the bottom corner.
Captured: wide (shots/cp-records.png), 390 (shots/cp-records-390.png), light theme only.
Real strings: Local history, Renamed task, Deleted 1 task, Moved to Done (with their times), Pick a language, Task restored., Undo.
Compact: standard browser bar, one lane, the panel spans the content width and the board's real card is dropped (the panel would cover it); panel and toast keep a clear gap.

Film:
- The restored card's title first spilled past its lane, then wrapped to three lines -> switched to a short real task, "Pick a language".
- `tight lines` on the restored card -> 6px gap between the real title and its note bar.
- A blank pill beside the panel title -> removed.
- Lanes in progress and done ended mid-frame -> a third filler card each, so every lane runs off the bottom.
- compact: panel and toast nearly touching -> denser rows (6px pad), a 30px panel head and a 40px toast.
- Final: `--gate --still` passes at both widths with no issues detected.

Still beside the gold: one anchored panel, one toast, a single real card; the eye lands on the selected snapshot, then the toast. Comparable restraint to static-card, with a busier board behind it that stays filler.

Assumptions: the history button in the workspace toolbar opens Local history as an anchored panel; Commonplace puts notices in the bottom corner (the deep-dive mock says so).
Unresolved: none from the film.
Not checked: dark theme, reduced motion (a still), a fresh-eye review by a second reviewer.

## Fresh-eye review
- Unexplained black disc beside the toolbar's title bar (about 338,184 wide): removed; the title stays a quiet bar.
- Phone frame used the hairline bar (gray lights, centred address), unlike every other scene: back to the standard browser chrome (colour lights, left URL pill). To fit, the compact toolbar row is tighter (8px over, 6px under the controls); history rows use a 5px pad so the panel and toast keep a gap.
- Board was only gray bars: real Commonplace task titles where the board shows. "Try the command palette" joins the restored "Pick a language" in To do (wide); the toast covers only that card's filler, never its title.
- Re-filmed to final/cp-records.png and final/cp-records-390.png; `--gate --still` passes at both widths; banned-word scan clean.

## v2 redesign (Material 3 Expressive)
Changed: every v1 colour replaced by v2 roles (page #F5F2FA, lanes secondary/tertiary/primary-container, cards #FFFFFF at 20px, window 28px, panel 28px, rows and buttons full pill). The toolbar is the v2 floating toolbar (surface-container-high pill, filter field, history as a selected filled icon button, undo). Cards carry the v2 connected button group (quiet segments, the lane's own segment filled with a check). The title's black disc is now the real count badge (rolls with the board). Snackbar is inverse-surface #303036, full pill, action #B9C3FF, arriving whole from just above. Selected snapshot row is primary-container with a Restore filled pill.
Beats (loop, about 9s, poster = the opening payoff): 1 Undo in the snackbar (pill to 8px press morph): snackbar leaves, the task folds out of To do on the default spring, counts roll 3 to 2 and 7 to 6, the row lets go. 2 The deleted snapshot is picked again: it fills, Restore takes the time's place (States). 3 Restore: the task drops back, counts roll back, the snackbar arrives. Springs: rows/Restore/Undo radius on --cp-spring-fast, fold on --cp-spring-default, colour on --cp-effects; reduced motion falls to 120ms fades.
Compact: the panel shows the two newest snapshots so the snackbar never covers a word.
Gate: `--gate` rehearsal passed at 1280 and 390. Fixed on the way: squeezed group segments, lopsided filter, uneven Restore and snackbar insets, snackbar opening inside the bottom gutter (now drops from above), compact panel top padding, compact snackbar over a snapshot.
Remaining candidates (not gate lines): "appears with no entrance" on a lane Count (the kit's digit strip; same as cp-hero), "appears, then moves" on the dropped card (the kit's drop reveal, delayed like the kit's).
Finals: final/cp-records.png, cp-records-390.png (posters, reduced motion), cp-records-loop.png, cp-records-390-loop.png; press frames shots/cp-records-{undo,pick,restore}.png.
Not checked: dark theme, live rAF pacing in a real browser, host page, a second-reviewer fresh eye.

## v2 fresh-eye review
- Poster contradicted itself ("Task restored." while the row still offered Restore): the row's trailing slot now has three states (time, Restore, Restored with a check); pressing Restore settles it to "Restored" in the same slot, and the poster shows Restored with the snackbar. Undo returns the row to its time in one step.
- Window floated with even margins: it now sits 28px from the top and left and runs off the right and the bottom (wide 600px, compact 380px); its content column ends one gutter inside the stage, so only the window's empty margin is cut. Gutter is 28px everywhere (snackbar included).
- Plate: the stage uses var(--ss-canvas) (now neutral); the app page inside keeps surface-container-low #F5F2FA.
- Bars beside real counts: the heading is "Workspace" (Bricolage) beside its 7, lanes read "To do", "In progress", "Done" beside their counts.
- Gate: rehearsal passed at 1280 and 390 after the fixes.
