export const SCREENS = Object.freeze(['Main', 'Guide', 'Settings', 'Setup', 'Mobile']);
export const WIDTHS = Object.freeze(['1440', '390']);
export const THEMES = Object.freeze(['light', 'dark']);
const CANONICAL = Object.freeze([
  ['Main', 1440, 'light'], ['Main', 390, 'light'],
  ['Guide', 1440, 'light'], ['Guide', 390, 'light'],
  ['Settings', 1440, 'light'], ['Settings', 390, 'light'],
  ['Setup', 1440, 'light'], ['Setup', 390, 'light'], ['Mobile', 390, 'dark'],
]);
export function referenceRoute({ screen, width, theme }) {
  return `design-reference.html?${new URLSearchParams({ screen, width: String(width), theme })}`;
}
export function parseReferenceQuery(search) {
  if (!search || search === '?') return { screen: 'Main', width: '1440', theme: 'light' };
  const params = new URLSearchParams(search);
  if ([...params.keys()].length !== 3 || ['screen', 'width', 'theme'].some(key => params.getAll(key).length !== 1)
    || !SCREENS.includes(params.get('screen')) || !WIDTHS.includes(params.get('width')) || !THEMES.includes(params.get('theme'))) {
    throw new Error('Invalid reference route. Specify exactly one screen, width and theme from the selectors.');
  }
  return Object.fromEntries(params);
}
export function validateInventory(inventory) {
  if (inventory?.schemaVersion !== 1 || !Array.isArray(inventory.frames) || inventory.frames.length !== 9) throw new Error('Reference inventory must contain exactly nine original frames.');
  for (const [screen, width, theme] of CANONICAL) {
    const matches = inventory.frames.filter(f => f.screen === screen && f.viewportWidth === width && f.theme === theme);
    if (matches.length !== 1) throw new Error(`Missing or duplicate original frame: ${screen}-${width}.`);
    const f = matches[0];
    if (f.originalFile !== `design/frames/${screen}-${width}.png` || f.imagePath !== `./${f.originalFile}`
      || f.referenceRoute !== referenceRoute({ screen, width, theme }) || f.pixelWidth !== width || !Number.isInteger(f.pixelHeight) || f.pixelHeight < 1
      || !/^[a-f0-9]{64}$/.test(f.sha256) || !f.state || !f.productStateInstructions
      || f.productRoute !== (screen === 'Guide' ? '#guide' : '#workspace')
      || f.sourceUrl !== `https://github.com/Ding-Ding-Projects/feature-workbench/blob/3b76a24/${f.originalFile}`
      || f.realCapture !== null || f.diff !== null || f.parityVerified !== false || f.verificationStatus !== 'not-captured') {
      throw new Error(`Invalid original reference metadata: ${screen}-${width}.`);
    }
  }
  return inventory.frames;
}
export function selectReference(frames, selection) {
  return frames.find(f => f.screen === selection.screen && f.viewportWidth === Number(selection.width) && f.theme === selection.theme) ?? null;
}
async function startViewer() {
  const byId = id => document.getElementById(id);
  const form = byId('reference-controls');
  const status = byId('reference-status');
  const details = byId('reference-details');
  const frame = byId('reference-frame');
  let frames;
  let generation = 0;
  function render() {
    const current = ++generation;
    details.hidden = true;
    frame.hidden = true;
    frame.replaceChildren();
    let selection;
    try { selection = parseReferenceQuery(location.search); }
    catch (error) { status.textContent = error.message; return; }
    for (const [key, value] of Object.entries(selection)) form.elements.namedItem(key).value = value;
    const item = selectReference(frames, selection);
    if (!item) { status.textContent = `Unavailable: no original ${selection.screen} / ${selection.width} px / ${selection.theme} frame was supplied. Choose another combination; no substitute image is shown.`; return; }
    status.textContent = 'Loading original design PNG…';
    byId('reference-title').textContent = `${item.screen} · ${item.viewportWidth} px · ${item.theme}`;
    byId('reference-state').textContent = item.state;
    byId('reference-size').textContent = `Original file: ${item.originalFile} · ${item.pixelWidth} × ${item.pixelHeight} actual pixels · native-size display.`;
    byId('reference-hash').textContent = item.sha256;
    byId('original-image').href = item.imagePath;
    byId('source-link').href = item.sourceUrl;
    byId('product-link').href = `./${item.productRoute}`;
    byId('product-state').textContent = `Product state is not automatically recreated: ${item.productStateInstructions}`;
    const img = new Image();
    img.alt = `Static ${item.screen} design reference, ${item.theme}, ${item.pixelWidth} by ${item.pixelHeight} pixels. ${item.state}`;
    img.width = item.pixelWidth;
    img.height = item.pixelHeight;
    img.onload = () => {
      if (generation !== current) return;
      if (img.naturalWidth !== item.pixelWidth || img.naturalHeight !== item.pixelHeight) {
        status.textContent = 'Unavailable: original image dimensions do not match the checked-in inventory.';
        return;
      }
      frame.append(img);
      details.hidden = false;
      frame.hidden = false;
      status.textContent = 'Original static design reference loaded. This is not a product capture or a visual-parity result.';
    };
    img.onerror = () => { if (generation === current) status.textContent = 'Unavailable: the original PNG could not be loaded. No substitute image is shown.'; };
    img.src = item.imagePath;
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    const selection = Object.fromEntries(new FormData(form));
    history.pushState(null, '', `./${referenceRoute(selection)}`);
    if (frames) render();
  });
  window.addEventListener('popstate', () => { if (frames) render(); });
  try {
    const response = await fetch('./design-parity-inventory.json');
    if (!response.ok) throw new Error('Reference inventory could not be loaded.');
    frames = validateInventory(await response.json());
    render();
  } catch (error) { status.textContent = `Unavailable: ${error.message}`; }
}
if (typeof document !== 'undefined') startViewer();
