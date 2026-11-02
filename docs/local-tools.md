# Browser-local text and initials tools

This module is a deliberately limited implementation, **not** a universal file converter or complete app-logo customization system. It makes no network requests and does not persist source text, results, or logo selections. Closing/rebuilding the panel discards them.

## Supported data conversion

`jsonToCsv(text)` accepts a JSON array of arrays of strings. The first row contains unique, nonempty (not whitespace-only) column names. All rows have the same number of cells. A header-only table is valid. Numbers, booleans, nulls, objects, nested cell arrays, empty tables, ragged rows, and duplicate headers are rejected. Strings are not coerced or inferred.

`parseCsv(text)` returns that table; `csvToJson(text)` returns its indented JSON. CSV is strictly comma-delimited, with double-quoted cells and doubled interior quotes. It supports embedded newlines in quoted cells and CR, LF, or CRLF record delimiters. A final record delimiter is optional; additional blank records are data and must satisfy the schema. One leading Unicode BOM is removed. Whitespace after a closing quote is rejected rather than guessed.

Limits apply before parsing and before download: 1 MiB UTF-8 input/output, 10,000 data rows plus header, 100 columns, and 65,536 UTF-16 code units per cell. Conversion is synchronous and bounded; there is no queue or cancellation mechanism.

Generated CSV quotes every field and uses CRLF. To reduce spreadsheet formula injection, cells starting with `=`, `+`, `-`, or `@` after whitespace/control characters, or starting with tab/CR/LF, receive a leading apostrophe. Headers receive the same protection. A collision between protected header names is rejected. Apostrophes remain literal in JSON on reimport: this intentional safety transformation is **not lossless** and is disclosed before the conversion action. Spreadsheet import settings and later editing can change interpretation; do not remove the protective prefix from untrusted data. CSV quoting, BOM, and record separators are not round-tripped. Original source text is never changed.

## SVG initials designer

`generateLogoSvg({initials, color})` produces one 256 × 256 SVG. Initials are 1–4 Unicode letters/numbers, spaces, or `& < > " '` with at least one non-space character; XML characters are escaped. Colors must be six-digit hexadecimal values. The SVG contains only a title, rounded rectangle, and text. Foreground is black or white selected for contrast. Fonts depend on the viewer. No uploaded SVG, image decoding, scripts, links, foreign objects, or external resources are accepted.

This creates a downloadable logo asset; it does not apply it to the application or alter installed identity. Image uploads, crop/fit/focal controls, format derivatives, persistent app-logo presets, and image-conversion adapters remain unsupported.

## Integration API

```js
import {createToolsPanel} from './local-tools.js';
container.append(createToolsPanel({
  language: 'en', // 'en', 'yue', 'both'; unknown values fall back to English
  onDownload: ({text, filename, mime}) => { /* optional app download handler */ },
  onNotice: localizedMessage => { /* optional app event/narration handler */ }
}));
```

Omit `onDownload` to use the exported `downloadText({text, filename, mime})` browser implementation. Allowed filenames are `converted.csv`, `converted.json`, and `logo.svg`. A handler may return a promise; rejection produces a download-request failure notice. A successful callback only reports that the browser download was requested, never that bytes were saved. The host is responsible for restricting custom handler side effects to the user's authorized local download.

The panel uses native headings, labels, buttons, textareas, color input, image alternative text and a polite status region. Styling is scoped to panel nodes. It does not inject user HTML. Editing source invalidates an earlier result so stale output cannot be downloaded. Invalid logo input disables SVG download and removes its preview. Recreate the panel when effective language changes; the host owns global preferences, focus/route handling, message decoration and narration.

## Explicit gaps and verification

No file picker, file signature detection, batch/resumable queue, adapter catalog, PDF/document/media/image/archive/binary converter, atomic filesystem destination, editor integration, QR encoding, custom-image upload, or full logo system is implemented. Global preference integration and browser interaction verification belong to the host. This limited panel must not be recorded as complete compliance with those broader feature contracts.

Run `node --test tests/local-tools.test.mjs` for pure parser, schema, formula protection, resource-bound and safe SVG tests. These tests do not constitute browser, offline-runtime, screen-reader or packaged-artifact evidence.
