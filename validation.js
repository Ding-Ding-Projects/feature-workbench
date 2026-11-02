/** Local-only bounded JSON parser. Error messages never contain supplied data. */
export function parseBoundedJSON(text, limit = 262144) {
  if (typeof text !== 'string' || new TextEncoder().encode(text).length > limit) throw Error('File exceeds the allowed size.');
  let i = 0;
  const fail = () => { throw Error('Invalid or unsupported JSON.'); };
  const space = () => { while (/[ \t\r\n]/.test(text[i] || '') && i < text.length) i++; };
  function string() {
    const start = i++;
    while (i < text.length) {
      if (text[i] === '\\') { i += 2; continue; }
      if (text[i++] === '"') { try { return JSON.parse(text.slice(start, i)); } catch { fail(); } }
    }
    fail();
  }
  function value(depth) {
    if (depth > 8) fail();
    space();
    if (text[i] === '"') return string();
    if (text[i] === '{') {
      i++; space(); const result = Object.create(null), keys = new Set();
      if (text[i] === '}') { i++; return result; }
      while (i < text.length) {
        space(); if (text[i] !== '"') fail(); const key = string();
        if (keys.has(key) || ['__proto__','constructor','prototype'].includes(key) || [...key].length > 160) fail();
        keys.add(key); space(); if (text[i++] !== ':') fail(); result[key] = value(depth + 1); space();
        const next = text[i++]; if (next === '}') return result; if (next !== ',') fail();
      } fail();
    }
    if (text[i] === '[') {
      i++; space(); const result = []; if (text[i] === ']') { i++; return result; }
      while (i < text.length) { result.push(value(depth+1)); space(); const next=text[i++]; if(next===']')return result;if(next!==',')fail(); } fail();
    }
    const match = text.slice(i).match(/^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/);
    if (!match) fail(); i += match[0].length; const result=JSON.parse(match[0]); if(typeof result==='number'&&!Number.isFinite(result))fail(); return result;
  }
  const result=value(0);space();if(i!==text.length)fail();return result;
}
export function validateVocabulary(text) {
  return validateVocabularyObject(parseBoundedJSON(text));
}
function validateVocabularyObject(data) {
  const plain = v => v !== null && typeof v === 'object' && !Array.isArray(v);
  if (!plain(data) || Object.keys(data).sort().join(',') !== 'entries,schemaVersion' || data.schemaVersion !== 1 || !plain(data.entries)) throw Error('Unsupported personal wording format.');
  for (const [key,value] of Object.entries(data.entries)) {
    if (!key.length || [...key].length > 160 || ['__proto__','prototype','constructor'].includes(key) || typeof value !== 'string' || [...value].length > 1000 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(value)) throw Error('Unsupported personal wording entry.');
  }
  if (new TextEncoder().encode(JSON.stringify(data)).byteLength > 262144) throw Error('File exceeds the allowed size.');
  return data;
}

/** Decode original bytes strictly; invalid UTF-8 must never become replacement text. */
export function parseVocabularyBytes(bytes) {
  if (!(bytes instanceof Uint8Array) || bytes.byteLength > 262144) throw Error('File exceeds the allowed size.');
  let text;
  try { text = new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
  catch { throw Error('Invalid file encoding.'); }
  return validateVocabulary(text);
}

/** Portable serialization, independent of session exports (which exclude wording). */
export function serialiseVocabulary(value) {
  return JSON.stringify(validateVocabularyObject(value));
}
