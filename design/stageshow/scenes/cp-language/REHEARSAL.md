# Rehearsal: cp-language
Gold: panel-annotation. Kept: product window pinned top-left off the bottom, a settings panel straddling its right edge over filler, one neutral leader from the panel to what the setting changed, panel stacked over the window's chrome-side when narrow with no leader. Changed: Commonplace look (look-commonplace, cobalt accent, Bricolage title), the checkout became the Commonplace workspace (bilingual header plus To do and In progress lanes as filler cards), the Branding panel became the Language panel (kit Segmented set to Bilingual, a Cantonese playfulness slider at 3, two quiet toggle rows), stage resized to the feature-card 560 x 380 with compact 358 x 300. The panel runs off the bottom like the window so it keeps one gutter (28px) on the right; the leader became a short level line from the panel's left edge across the empty header band into the compact Cantonese label.
Beats: still (no script, no cursor).
Captured: widths 560 (wide) and 390 viewport (compact 358 x 300), light theme only.
Film: uneven gutters on the panel (left 292, bottom 28) → bled the panel off the bottom. Near-aligned title and segment option (3px) → segmented track padding moved into a transparent thumb border so option boxes start on the panel's text edge. Near-aligned slider label (12px inset box) → slider box removed. Compact: satellite gutter lines with the panel above the window → window pinned to the 16px gutter, panel rises over its lanes as a sheet that runs off the bottom; a sliced quiet toggle and a 3px card tangent at narrow lane width → quiet rows hidden and lane bars scaled to 0.7. Final: `--gate --still` rehearsal passed at both widths.
Review: compared beside shots/gold-panel-annotation.png: eye lands on the panel (Bilingual, slider), then follows the leader to "Workspace 工作區"; one hero window, one satellite, no plate, window bleeds off the bottom.
Real strings: Workspace, 工作區, Language, English, 廣東話, Bilingual, Cantonese playfulness, 3.
Assumptions: the workspace header in bilingual mode shows the English title prominent with the Cantonese label compact beside it (Features-Language.dc.html).
Unresolved: none.
Not checked: dark theme; reduced motion (a still); a resize between widths in one session.

## Fresh-eye review
- Leader from 工作區 ended at the panel's corner, pointing at nothing → it now runs from 工作區 across the empty header band and ground, then down onto the Bilingual segment (kit Connector, route h, a dot at each end); the panel moved down to make that path.
- Void under the last toggle and two bar-only toggle rows → both rows removed; the panel runs off the bottom with its slider just above the crop.
- Over budget (8 real strings) → removed the panel title "Language" and the slider value; the strings are now 7: Workspace, 工作區, English, 廣東話, Bilingual, Cantonese playfulness, and the task title "Pick a language" (systemic finding: one real card in the board, in the Done lane, which turned accent).
- Tight lines on the real card (title over a bar) → title trimmed with negative margins so its ink gap matches the bars.
- Compact: the sheet's empty foot → panel now sits on the 16px gutter at the bottom, lanes peek above it.
- Re-filmed to final/cp-language.png and final/cp-language-390.png; `--gate --still` and `--gate --still --width 390` both passed; banned-word scan clean.

## v2 redesign (Material 3 Expressive)
What changed: v1 colours replaced with v2 roles (lanes #DDE1FF and #FFDCBE with 28px corners, cards 20px, lane icons in their on-container inks). The kit Segmented became the v2 connected button group "English | Cantonese | Bilingual" (as in the v2 Settings page, so 廣東話 became "Cantonese"; the Cantonese text in the scene is now only the payoff 工作區): filled full pill when selected, 6px inner corners otherwise, press morphs to 12px. The settings panel is a 28px-corner card. The slider is the v2 slider: 16px thick track, a 4px handle bar with gaps, the rest of the track in secondary container. Filler card actions became quiet connected groups. Compact: the header's margin grew so no lane head peeks half covered above the card.
It is now a loop (about 7s). Beats: opens in English (no 工作區, no leader) … 1 Bilingual pressed, the selection morphs over (fast spring, effects for colour) … 2 工作區 rises in beside Workspace (default spring), then the leader draws from it to the Bilingual segment (wide only) … payoff holds 2.6s … 3 English pressed (the seen cause): the leader withdraws and the label leaves; the opening frame again. Poster = the Bilingual payoff with the leader.
Gates: wide loop `--gate` rehearsal passed; 390 loop `--gate` rehearsal passed. Remaining candidates: "appears with no entrance" on 工作區 at one sampling gap (it fades 320ms with a rise), a manual note on the Connector drawing, and at 390 a layout note that the window body's content runs past its bottom padding (the window bleeds off the bottom by design).
Real strings (7): Workspace, 工作區, English, Cantonese, Bilingual, Cantonese playfulness, Pick a language.
Captured: final/cp-language.png and -390.png (poster), final/cp-language-loop.png and -390-loop.png, press frames shots/cp-language-v2-{bi,leader,en}.png.
Not checked: dark theme, touch, slider drag (the slider does not move in this story).

## v2 fresh-eye review
- Bilingual showed only one small 工作區 → in Bilingual the lane names and the card title answer too, in a short stagger: 完成 beside Done, 進行中 beside In progress (both real app strings), and 揀語言 under "Pick a language" (the notes bar gives way to it in the same slot, so the card does not grow). Lane heads are real words now, not bars.
- Leader ended on the button's edge → it now ends in the settings card's top padding, 8px above the Bilingual segment.
- Set-wide framing: the browser bled only off the bottom → it now sits on the 28px gutter top and left and bleeds off the right and the bottom (a left bleed was tried and refused by film: the top-left holds the chrome). The leader runs through the window's empty canvas right of the lanes. Plate is var(--ss-canvas); the product panel is #F5F2FA.
- Compact: the settings card holds only the connected group (the slider is not the story) so the header, both bilingual lane names and the bilingual card title stay in view above it.
Gates after this round: wide and 390 loop `--gate` rehearsal passed. Remaining candidates: "drift" of up to 2px between an English lane name and its Cantonese name as the Cantonese leaves, one sampled "appears with no entrance" on 進行中, a manual Connector note.
