# Offline designer fonts

This pass supersedes the initial system-font-only limitation in
`design-implementation.md`. The four requested families were obtainable from
the official [Google Fonts repository](https://github.com/google/fonts), pinned
to commit `6c1dbe27dcf7d817d4b62cec033ba77fa8e2a5ec` (reviewed 2026-11-02).
The family metadata and full OFL 1.1 licenses were read before acquiring binaries.
All files are unmodified upstream data; no package or downloaded script was run,
no font conversion/subsetting occurred, and product CSS has no CDN dependency.

| Family | Intended role | Variable axes / normal style |
|---|---|---|
| Bricolage Grotesque | Headings/wordmark at 700 | weight 200–800, optical size 12–96, width 75–100 |
| Inter | UI | weight 100–900, optical size 14–32 |
| Noto Sans HK | Cantonese fallback | weight 100–900 |
| JetBrains Mono | Identifiers/build provenance | weight 100–800 |

`src/fonts/provenance.json` records exact commit-pinned raw source URLs, byte
sizes and SHA-256 values for each font, license and metadata file. Each family
folder contains its exact upstream `OFL.txt` and `METADATA.pb`, including original
copyright statements and upstream author repository/commit details. The font
licenses remain OFL-1.1, not the application's license. No endorsement is implied.

## Integration

Load `fonts/fonts.css` **after** `styles.css` and recursively include all of
`src/fonts/` in distribution, including licenses and provenance. The font sheet
sets family roles as well as local `@font-face` declarations. Existing stylesheet
and entrypoint are intentionally unchanged in this font-only commit; the parent
owns that integration. Fonts are fetched from the same deployed site, never from
Google at runtime. System fallback remains during `font-display:swap` loading.
Only normal-style faces were needed by the design and vendored.

The full Noto Sans HK TTF is about 11.9MB. This intentionally preserves the
unmodified official multilingual font rather than silently narrowing Cantonese
coverage; it is a bandwidth tradeoff, not an optimized web-font claim. Fonts
need a successful initial download/cache like other site assets; this change
does not itself implement an offline service worker or guarantee first-visit
network-free operation.

## Verification boundary

`tests/font-provenance.test.mjs` verifies 12 exact files, hashes, lengths, TTF
headers, license presence and four resolvable local font URLs. These are source
and asset-integrity checks, not a font-security audit or rendered parity proof.
Browser font loading, Cantonese glyph selection, layout after swap and visual
parity still require the parent's managed-preview/CUA review after integration.

## Material Symbols Rounded icon subset

Icons come from Material Symbols Rounded (Apache-2.0), vendored as a single
subset `src/fonts/materialsymbolsrounded/MaterialSymbolsRounded-subset.woff2`.
It was fetched once on 2026-11-02 from the Google Fonts css2 API with
`icon_names=` listing only the glyphs the app uses, axes `FILL` 0..1, `wght`
500 and `opsz` 24. The exact request URL, the resolved `fonts.gstatic.com`
file URL, the glyph list, byte size and SHA-256 are recorded under `iconFont`
in `src/fonts/provenance.json`. The Apache-2.0 `LICENSE` beside it is the
unmodified file from the official `google/material-design-icons` repository,
pinned to commit `10ecc14790612ca8fd164e3f4ffe9c16fc50d5b7`.

The face uses `font-display:block` so ligature names never flash as text while
it loads. Adding an icon means requesting a new subset with the extended
sorted `icon_names` list and updating the manifest; `tests/font-provenance.test.mjs`
fails when the app or stylesheet names a glyph that is not in the subset.
