/** Case-sensitive, Unicode-boundary phrase replacement for owned UI strings.
 * Call with validated entries and original localized text, never rendered output.
 * This module does not mutate DOM, editor content, code, URLs or form values.
 */
export function createWordingMatcher(entries = {}) {
  const candidates = new Map();
  let size = 0;
  for (const [source, replacement] of Object.entries(entries)) {
    if (!source || typeof replacement !== 'string') continue;
    const initial = [...source][0];
    if (!candidates.has(initial)) candidates.set(initial, []);
    candidates.get(initial).push({ source, replacement });
    size++;
  }
  for (const choices of candidates.values()) choices.sort((a, b) => b.source.length - a.source.length);
  const word = character => character !== undefined && /[\p{L}\p{N}\p{M}_]/u.test(character);
  function spans(value) {
    const text = String(value), result = [];
    for (let offset = 0; offset < text.length;) {
      const character = String.fromCodePoint(text.codePointAt(offset));
      let selected;
      const tail = text.charCodeAt(offset - 1);
      const preceding = text.slice(Math.max(0, offset - (tail >= 0xdc00 && tail <= 0xdfff ? 2 : 1)), offset);
      if (!word(preceding)) {
        selected = (candidates.get(character) || []).find(({source}) => {
          if (!text.startsWith(source, offset)) return false;
          const end = offset + source.length;
          // A JSON string may contain a lone surrogate; never match half a code point.
          if (end < text.length && /[\uD800-\uDBFF]/u.test(text[end - 1]) && /[\uDC00-\uDFFF]/u.test(text[end])) return false;
          return end === text.length || !word(String.fromCodePoint(text.codePointAt(end)));
        });
      }
      if (selected) {
        const end = offset + selected.source.length;
        result.push({ start: offset, end, replacement: selected.replacement });
        offset = end;
      } else {
        offset += character.length;
      }
    }
    return result;
  }
  function replace(value) {
    const text = String(value), output = [];
    let cursor = 0;
    for (const match of spans(text)) {
      output.push(text.slice(cursor, match.start), match.replacement);
      cursor = match.end;
    }
    output.push(text.slice(cursor));
    return output.join('');
  }
  return { size, spans, replace };
}
