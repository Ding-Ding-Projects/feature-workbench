# Local search builder

Every integration can create its own adjacent, inline-anchored panel using `createSearchBuilder`. Plain text is the default. Source items are never rewritten or reordered. All matching, including previews and replacements, runs in a fresh disposable worker using the same browser ECMAScript `RegExp` engine. There is no network or main-thread regex fallback.

```js
import { createSearchBuilder } from './search-builder.js';
const section = createSearchBuilder({
  id: 'task-filter', // stable, unique per surface
  language: 'both', // en / yue / both, or a function returning one
  label: 'Filter tasks',
  getItems: () => tasks.map(task => ({ ...task, text: task.title + '\n' + task.notes })),
  onResults: (items, report) => renderVisibleTasks(items),
  onStatus: ({ state, message }) => { /* optional status integration */ }
});
container.append(section);
// Refresh when the underlying collection changes:
section.searchBuilder.refresh();
// Teardown before removing the owning surface:
section.searchBuilder.destroy();
```

`getItems` is synchronous and returns strings or objects. Objects use `text`, then `label`, then `title` as searchable content. `onResults` receives the original matching item references and an engine report. Errors return an empty list and `{ok:false,code}`; callers must not treat that as authorization for a destructive action. `onStatus` emits actual running, error, and result states. Each field owns its own evaluator and state.

The returned DOM section has `searchBuilder` methods:

- `refresh()` reevaluates current source items, sample, and replacement.
- `setQuery(text, {regex, flags})` synchronizes query and builder, with debounced evaluation.
- `getState()` returns a copy of `{query, regex, flags}`.
- `open()` / `close()` disclose the anchored panel and restore focus.
- `destroy()` terminates pending work, removes document listeners, and cancels timers.

The query input has `data-search-query`. The owning section has `data-search-builder` containing its stable ID. Host applications should catalog all required search surfaces, use unique IDs, refresh when source data changes, and destroy removed controls. Recreate the control when interface language changes; a language function affects subsequent messages but does not rewrite already-created labels.

## Functionality

- Bidirectional query/raw-pattern editing; explicit regex mode; editable `d g i m s u v y` flags.
- Grouped syntax insertion: anchors, classes and Unicode escapes, capture/noncapture groups and backreferences, alternation, greedy/lazy quantifiers, lookahead and lookbehind.
- Literal escaping; working sample presets; static syntax and replacement guidance (not a parser).
- Real match preview: text, UTF-16 start/end, numbered and named captures, `d` capture indices. Zero-width advancement is Unicode-aware with `u`/`v`.
- Replacement preview uses ECMAScript templates (`$$`, `$&`, numbered/named captures, prefix and suffix). `g` replaces all occurrences; without it, only the first occurrence is replaced. The match inspection preview lists all matches even without `g`.
- Explicit local save/load/delete with up to 30 named patterns per field. Copy and JSON export preserve pattern/flags/mode; they do not include sample text or source items.
- Optional per-field “Remember” persists query/mode/flags after explicit opt-in. Default queries and samples are not persisted. Clear remembered state resets query/mode/flags but leaves deliberately saved patterns intact. Storage failures are visible.
- English, Cantonese and bilingual controls; semantic inputs/buttons; live status; Escape and outside dismissal. The panel is in normal flow directly beneath its field, so does not cover its trigger. Narrow layouts wrap controls and keep long output within the panel. There is no required animation.

## Safety and exact semantics

The worker is terminated after **150 ms maximum configured deadline**, including worker startup. Browser scheduling can delay when the termination callback runs; this is not a hard real-time guarantee. There is no synchronous matching fallback if workers are unavailable or forbidden by Content Security Policy. The app must permit its own Blob worker if it wants regex search.

Bounds: 4,096 pattern UTF-16 code units; 1 MiB combined UTF-8 source/sample/replacement input; 10,000 source items; 200 preview matches/replacements; replacement template 4,096 code units; replacement output 1,048,576 code units. Truncation is explicit. Search result indices cover the complete allowed source collection, not only the preview limit. New evaluations terminate older workers; stale results cannot overwrite the current state. The module does not run a user-provided pattern on the UI thread, even for validation.

Plain text matches case-insensitive substrings with metacharacters escaped. Regex flags are literal and engine-validated; `u` and `v` cannot coexist. Unsupported flags/syntax produce an error rather than silent substitution. Empty queries include all source items (bulk actions must independently prohibit empty queries). The actual browser engine version is not exposed. No other dialect is claimed. Prefix/suffix replacement expansion is bounded rather than allocating arbitrary repeated copies of sample text.

## Explicit open capability gaps

This is a real single-engine search component, **not complete multi-engine regex workbench parity**. It does not implement other engines or proven dialect conversion; full syntax parsing/annotated analysis; atomic groups, possessive quantifiers, conditionals or subroutines; engine tracing or backtracking debug hooks; test-suite management; benchmarking/growth analysis; file/folder GREP and backed-up replacement; generated code or editable language templates; parameterized libraries/import; multi-pattern history; external tools/CLI automation; or configurable workspace layout. Those require additional engines, adapters, and separately tested workflows. Unsupported capabilities remain disclosed in the panel. Newer native syntax, including Unicode sets, depends on the browser and is checked by actual worker compilation.

## Verification

`node --test tests/search-builder.test.mjs` exercises the same serialized production worker using Node worker threads: literal punctuation/case, empty query, invalid syntax, Unicode/named captures/indices, multiline and sticky flags, replacement semantics, zero-width Unicode, no matches, truncation, byte/count/pattern/flag bounds, isolated normalized state, adversarial timeout, supersession, and worker creation failure. Node is engine-level coverage, not browser UI verification. Browser integration must additionally verify every cataloged consumer, keyboard/focus/scroll behavior, theme and 320px layout, per-ID saved-state isolation and storage denial, all language modes, and actual browser Worker/CSP availability. The module does not claim those host-level checks from unit tests alone.
