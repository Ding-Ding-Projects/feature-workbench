/** Browser-local text tools. No network, storage, external libraries, or user HTML. */
export const TOOL_LIMITS = Object.freeze({bytes: 1048576, rows: 10000, columns: 100, cell: 65536});
export class ToolError extends Error { constructor(code) { super(code); this.name = 'ToolError'; this.code = code; } }
const fail = code => { throw new ToolError(code); };
function bounded(text) {
  if (typeof text !== 'string') fail('schema');
  if (text.length > TOOL_LIMITS.bytes || new TextEncoder().encode(text).length > TOOL_LIMITS.bytes) fail('limit');
  return text;
}
function validateTable(table) {
  if (!Array.isArray(table) || !table.length || table.length > TOOL_LIMITS.rows + 1) fail('schema');
  const header = table[0];
  if (!Array.isArray(header) || !header.length || header.length > TOOL_LIMITS.columns) fail('schema');
  if (header.some(v => typeof v !== 'string' || !v.trim()) || new Set(header).size !== header.length) fail('header');
  for (const row of table) {
    if (!Array.isArray(row) || row.length !== header.length || row.some(v => typeof v !== 'string')) fail('schema');
    if (row.some(v => v.length > TOOL_LIMITS.cell)) fail('limit');
  }
  return table;
}
/** Strict comma-separated CSV, doubled quotes, CRLF/LF/CR records, embedded newlines. */
export function parseCsv(source) {
  const text = bounded(source).replace(/^\uFEFF/, '');
  if (!text) fail('schema');
  const rows = []; let row = [], cell = '', quoted = false, closed = false;
  const field = () => { row.push(cell); if (row.length > TOOL_LIMITS.columns) fail('limit'); cell = ''; closed = false; };
  const record = () => { field(); rows.push(row); row = []; if (rows.length > TOOL_LIMITS.rows + 1) fail('limit'); };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else { quoted = false; closed = true; } }
      else cell += c;
    } else if (c === ',') field();
    else if (c === '\r' || c === '\n') { record(); if (c === '\r' && text[i + 1] === '\n') i++; }
    else if (c === '"' && !cell && !closed) quoted = true;
    else { if (closed || c === '"') fail('csv'); cell += c; }
    if (cell.length > TOOL_LIMITS.cell) fail('limit');
  }
  if (quoted) fail('csv');
  if (cell || row.length || closed || !/[\r\n]$/.test(text)) record();
  return validateTable(rows);
}
// Quote every cell and prefix dangerous spreadsheet expressions, including headers.
export function protectCsvCell(value) {
  if (typeof value !== 'string') fail('schema');
  return /^[\s\u0000-\u001f]*[=+\-@]/u.test(value) || /^[\t\r\n]/.test(value) ? "'" + value : value;
}
export function jsonToCsv(source) {
  bounded(source); let table;
  try { table = JSON.parse(source); } catch { fail('json'); }
  validateTable(table);
  const output = table.map(row => row.map(value => '"' + protectCsvCell(value).replaceAll('"', '""') + '"').join(',')).join('\r\n') + '\r\n';
  bounded(output); parseCsv(output); return output;
}
export function csvToJson(source) { return bounded(JSON.stringify(parseCsv(source), null, 2)); }
const escapeXml = text => text.replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&apos;'}[c]));
export function generateLogoSvg({initials = 'SW', color = '#2457c5'} = {}) {
  if (typeof initials !== 'string' || !/^[\p{L}\p{N} &<>"']{1,4}$/u.test(initials) || !initials.trim()) fail('initials');
  if (typeof color !== 'string' || !/^#[\da-f]{6}$/i.test(color)) fail('color');
  const rgb = color.slice(1).match(/../g).map(v => parseInt(v, 16) / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const luminance = rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
  const ink = luminance > .179 ? '#000000' : '#ffffff';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256" role="img"><title>${escapeXml(initials)}</title><rect width="256" height="256" rx="48" fill="${color}"/><text x="128" y="132" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${Array.from(initials).length > 2 ? 64 : 96}" font-weight="700" fill="${ink}">${escapeXml(initials)}</text></svg>`;
}
/** Trigger a browser download; no destination overwrite or disk-success claim. */
export function downloadText({text, filename, mime = 'text/plain;charset=utf-8'}) {
  bounded(text);
  if (!['converted.csv', 'converted.json', 'logo.svg'].includes(filename)) fail('schema');
  const url = URL.createObjectURL(new Blob([text], {type: mime}));
  const link = document.createElement('a'); link.href = url; link.download = filename;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
// Localized copy is separate from parsing/rendering logic; unknown languages use English.
const COPY = {
 title: ['Local text and logo tools', '本機文字同標誌工具'],
 scope: ['Text stays in this panel; nothing is uploaded or saved. These are limited text-table converters and an SVG initials designer, not a universal file converter or app-logo customization system.', '文字只留喺呢個面板，唔會上載或儲存。呢度只提供文字表格轉換同 SVG 縮寫設計，唔係通用檔案轉換器或者應用程式標誌自訂系統。'],
 schema: ['JSON schema: an array of string arrays. First row: unique, nonempty column names. Every row must have the same width. At most 1 MiB input/output, 10,000 data rows, 100 columns, and 65,536 UTF-16 units per cell. CSV uses commas and quoted fields. Values remain strings; no type inference.', 'JSON 格式係字串陣列組成嘅陣列。第一行係唔重複、非空白嘅欄名，每行欄數相同。輸入同輸出最多 1 MiB、10,000 行資料、100 欄，每格最多 65,536 個 UTF-16 單位。CSV 使用逗號同引號欄位，所有值保留為字串，唔會推斷類型。'],
 loss: ['Before converting: CSV output uses CRLF and quotes every field. Spreadsheet formula-like cells get a leading apostrophe, including headers; that change is not reversed on import. CSV to JSON removes a leading BOM and does not preserve CSV quoting or record separators. Source text is unchanged. No other formats, files, batch processing, or QR codes are supported.', '轉換前留意：CSV 輸出使用 CRLF，每格都加引號。類似試算表公式嘅值（包括欄名）會加前置單引號，匯入時唔會自動移除。CSV 轉 JSON 會移除開首 BOM，唔會保留 CSV 引號同記錄分隔格式。原文不變。未支援其他格式、檔案、批次處理或 QR 碼。'],
 input: ['Source text', '來源文字'], output: ['Converted text', '轉換結果'], toCsv: ['Convert JSON to CSV', '將 JSON 轉成 CSV'], toJson: ['Convert CSV to JSON', '將 CSV 轉成 JSON'], download: ['Download converted text', '下載轉換結果'], clear: ['Clear text', '清除文字'], done: ['Conversion ready. Review the output before downloading.', '轉換完成，下載前請先檢查結果。'], cleared: ['Text cleared.', '文字已清除。'], started: ['Download requested in your browser.', '已向瀏覽器要求下載。'], failed: ['Download could not be requested. Your text is unchanged.', '未能要求下載，文字保持不變。'],
 logo: ['SVG initials designer', 'SVG 縮寫設計'], logoHelp: ['Choose 1–4 letters, numbers, spaces, or & < > " \'. This generates a new 256 × 256 SVG only; it does not replace the app logo or accept image uploads. Text color automatically selects black or white for contrast. Fonts depend on the viewer.', '輸入 1–4 個字母、數字、空格或 & < > " \'。只會產生新嘅 256 × 256 SVG，唔會取代應用程式標誌，亦唔接受圖片上載。文字會自動選擇黑色或白色以提高對比，字體視乎檢視器。'], initials: ['Initials', '縮寫'], color: ['Background color', '背景顏色'], logoDownload: ['Download SVG', '下載 SVG'], preview: ['Generated initials logo preview', '縮寫標誌預覽'],
 json: ['Invalid JSON. Use an array of string arrays.', 'JSON 無效，請使用字串陣列組成嘅陣列。'], csv: ['Invalid CSV quoting. Quotes inside a quoted field must be doubled.', 'CSV 引號無效，引號欄位內嘅引號必須重複兩次。'], header: ['Column names must be unique, nonempty strings. Formula protection can also create duplicate names; rename those columns.', '欄名必須係唔重複、非空白嘅字串。公式保護亦可能造成重複欄名，請重新命名。'], limit: ['The input or output exceeds the documented limits. Nothing was converted.', '輸入或輸出超出已列明上限，未轉換任何資料。'], schemaError: ['Use a nonempty rectangular table of strings with a header row. Blank records and inconsistent widths are not accepted.', '請使用非空白、有欄名行、每行欄數相同嘅字串表格。唔接受空白記錄或唔同欄數。'], initialsError: ['Enter 1–4 allowed characters, with at least one non-space character.', '請輸入 1–4 個允許嘅字元，至少一個唔係空格。'], colorError: ['Choose a six-digit hexadecimal color.', '請選擇六位十六進制顏色。']
};
export function createToolsPanel({language = 'en', onDownload = downloadText, onNotice = () => {}, transformText = value => value} = {}) {
  const t = key => { const pair = COPY[key] || COPY.schemaError; return transformText(language === 'yue' ? pair[1] : language === 'both' ? pair.join(' · ') : pair[0]); };
  const node = (tag, text) => { const el = document.createElement(tag); if (text) el.textContent = text; return el; };
  const panel = node('section'); panel.className = 'local-tools'; panel.style.cssText = 'display:grid;gap:1rem;min-width:0;max-width:100%';
  panel.append(node('h2', t('title')), node('p', t('scope')), node('p', t('schema')), node('p', t('loss')));
  const field = (key, control) => { const label = node('label', t(key)); label.style.cssText = 'display:grid;gap:.4rem;min-width:0'; label.append(control); panel.append(label); return control; };
  const input = field('input', node('textarea')); input.rows = 7; input.maxLength = TOOL_LIMITS.bytes; input.spellcheck = false;
  const actions = node('div'); actions.style.cssText = 'display:flex;flex-wrap:wrap;gap:.6rem'; panel.append(actions);
  const output = field('output', node('textarea')); output.rows = 7; output.readOnly = true; output.spellcheck = false;
  for (const el of [input, output]) el.style.cssText = 'width:100%;min-width:0;box-sizing:border-box';
  const status = node('p'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite'); panel.append(status);
  // Fixed localized event copy only: never include source text, generated output, or initials.
  // The first argument remains compatible with existing single-argument consumers.
  const report = key => {
    const safeKey = Object.hasOwn(COPY, key) ? key : 'schemaError';
    const [en, yue] = COPY[safeKey];
    const error = !['done', 'cleared', 'started'].includes(safeKey);
    status.textContent = t(safeKey);
    onNotice(t(safeKey), {en, yue, category: `local-tools:${safeKey}`, error});
  };
  const errorKey = error => ({schema:'schemaError', initials:'initialsError', color:'colorError'}[error.code] || (COPY[error.code] ? error.code : 'schemaError'));
  const button = (key, handler, parent = actions) => { const el = node('button', t(key)); el.type = 'button'; el.addEventListener('click', handler); parent.append(el); return el; };
  let result = null;
  const invalidate = () => { result = null; output.value = ''; save.disabled = true; status.textContent = ''; };
  const convert = (fn, extension, mime) => { invalidate(); try { const text = fn(input.value); result = {text, filename:`converted.${extension}`, mime}; output.value = text; save.disabled = false; report('done'); } catch (error) { report(errorKey(error)); } };
  button('toCsv', () => convert(jsonToCsv, 'csv', 'text/csv;charset=utf-8'));
  button('toJson', () => convert(csvToJson, 'json', 'application/json;charset=utf-8'));
  const requestDownload = async data => { try { await onDownload(data); report('started'); } catch { report('failed'); } };
  const save = button('download', () => { if (result) requestDownload({...result}); }); save.disabled = true;
  button('clear', () => { input.value = ''; invalidate(); report('cleared'); input.focus(); });
  input.addEventListener('input', invalidate);
  panel.append(node('h3', t('logo')), node('p', t('logoHelp')));
  const initials = field('initials', node('input')); initials.type = 'text'; initials.value = 'SW';
  const color = field('color', node('input')); color.type = 'color'; color.value = '#2457c5';
  const preview = node('img'); preview.alt = t('preview'); preview.width = 128; preview.height = 128; panel.append(preview);
  let svg = '';
  const logoSave = button('logoDownload', () => { if (svg) requestDownload({text:svg,filename:'logo.svg',mime:'image/svg+xml;charset=utf-8'}); }, panel);
  const updateLogo = () => { try { svg = generateLogoSvg({initials:initials.value,color:color.value}); preview.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); preview.hidden = false; logoSave.disabled = false; status.textContent = ''; } catch (error) { svg = ''; preview.removeAttribute('src'); preview.hidden = true; logoSave.disabled = true; report(errorKey(error)); } };
  initials.addEventListener('input', updateLogo); color.addEventListener('input', updateLogo); updateLogo();
  return panel;
}
