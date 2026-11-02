/** Local wall-clock theme schedules. This module never stores data or contacts a server. */
export class ScheduleError extends Error {
  constructor(code) { super(code); this.name = 'ScheduleError'; this.code = code; }
}
const fail = code => { throw new ScheduleError(code); };
const keys = (value, allowed) => value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).every(key => allowed.includes(key));
const time = value => typeof value === 'string' && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
const day = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && value >= '0001-01-01' && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;
export function defaultScheduleConfig(timeZone = 'UTC') { return validateScheduleConfig({version:1, enabled:false, timeZone, rules:[]}); }
export function validateScheduleConfig(config) {
  if (!keys(config, ['version','enabled','timeZone','rules']) || config.version !== 1 || typeof config.enabled !== 'boolean' || !Array.isArray(config.rules) || config.rules.length > 32) fail('config');
  if (typeof config.timeZone !== 'string' || config.timeZone.length > 100 || !/^[A-Za-z_]+(?:\/[A-Za-z0-9_+\-]+)*$/.test(config.timeZone)) fail('timezone');
  try { new Intl.DateTimeFormat('en-US', {timeZone:config.timeZone}).format(0); } catch { fail('timezone'); }
  const ids = new Set();
  const rules = config.rules.map(rule => {
    if (!keys(rule, ['id','label','enabled','start','end','weekdays','theme','priority','startDate','endDate'])) fail('rule');
    if (typeof rule.id !== 'string' || !/^[a-zA-Z0-9_-]{1,64}$/.test(rule.id) || ids.has(rule.id)) fail('id');
    ids.add(rule.id);
    if (typeof rule.label !== 'string' || !rule.label.trim() || rule.label.length > 100 || typeof rule.enabled !== 'boolean') fail('rule');
    if (!time(rule.start) || !time(rule.end) || rule.start === rule.end) fail('time');
    if (!Array.isArray(rule.weekdays) || !rule.weekdays.length || rule.weekdays.length > 7 || rule.weekdays.some(v => !Number.isInteger(v) || v < 0 || v > 6) || new Set(rule.weekdays).size !== rule.weekdays.length) fail('weekdays');
    if (!['light','dark'].includes(rule.theme) || !Number.isInteger(rule.priority) || rule.priority < 0 || rule.priority > 100) fail('rule');
    const startDate = rule.startDate ?? '', endDate = rule.endDate ?? '';
    if ((startDate !== '' && !day(startDate)) || (endDate !== '' && !day(endDate)) || (startDate && endDate && startDate > endDate)) fail('dates');
    return {id:rule.id, label:rule.label.trim(), enabled:rule.enabled, start:rule.start, end:rule.end, weekdays:[...rule.weekdays], theme:rule.theme, priority:rule.priority, startDate, endDate};
  });
  return {version:1,enabled:config.enabled,timeZone:config.timeZone,rules};
}
export function evaluateSchedule(config, date = new Date()) {
  const valid = validateScheduleConfig(config);
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) fail('clock');
  const none = {theme:null, ruleId:null};
  if (!valid.enabled) return none;
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {timeZone:valid.timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date).map(p => [p.type,p.value]));
  const localDate = `${parts.year.padStart(4,'0')}-${parts.month}-${parts.day}`;
  const clock = `${parts.hour}:${parts.minute}`;
  let winner = null;
  for (const rule of valid.rules) {
    if (!rule.enabled) continue;
    const overnight = rule.start > rule.end;
    if (!(overnight ? clock >= rule.start || clock < rule.end : clock >= rule.start && clock < rule.end)) continue;
    const anchor = new Date(`${localDate}T12:00:00Z`);
    if (overnight && clock < rule.end) anchor.setUTCDate(anchor.getUTCDate() - 1);
    const anchorDay = anchor.toISOString().slice(0,10);
    if (!rule.weekdays.includes(anchor.getUTCDay()) || (rule.startDate && anchorDay < rule.startDate) || (rule.endDate && anchorDay > rule.endDate)) continue;
    if (!winner || rule.priority >= winner.priority) winner = rule;
  }
  return winner ? {theme:winner.theme,ruleId:winner.id} : none;
}
const copy = {
 active:['Enabled','已啟用'], inactive:['Disabled','已停用'], title:['Theme schedules','主題時間表'], enabled:['Enable theme schedules','啟用主題時間表'], zone:['IANA time zone','IANA 時區'], saveZone:['Save schedule settings','儲存時間表設定'], add:['Add schedule','新增時間表'], edit:['Edit','編輯'], remove:['Remove','移除'], label:['Schedule name','時間表名稱'], start:['Start time','開始時間'], end:['End time','結束時間'], startDate:['First start date (optional)','首個開始日期（可選）'], endDate:['Last start date (optional)','最後開始日期（可選）'], weekdays:['Starting weekdays','開始嘅星期幾'], every:['Every day','每日'], ruleEnabled:['Enable this rule','啟用呢條規則'], priority:['Priority (0–100, higher wins)','優先次序（0–100，數字大優先）'], theme:['Theme','主題'], light:['Light','淺色'], dark:['Dark','深色'], save:['Save rule','儲存規則'], cancel:['Cancel','取消'], empty:['No schedules. Your manual theme is retained.','未有時間表，保留你手動揀嘅主題。'], manual:['Current result: manual theme','目前結果：手動主題'], current:['Current scheduled theme','目前時間表主題'], note:['Times use the selected zone. Start is included; end is excluded. Overnight rules belong to the starting day. Equal times are invalid. DST skipped minutes do not run; repeated minutes run twice. Higher priority wins; ties use the last listed rule.','時間按所選時區計算，包含開始但唔包含結束。跨午夜規則屬於開始嗰日。開始同結束唔可以相同。夏令時間跳過嘅分鐘唔會執行，重複嘅分鐘會執行兩次。優先數字較大嘅規則生效；相同就用列表最後嗰條。'], boundary:['Only browser-local theme scheduling is supported. Manual preferences are retained. Authenticated APIs and Home Assistant are not supported; no credentials are collected.','只支援瀏覽器本機主題時間表，手動偏好會保留。唔支援需要驗證嘅 API 同 Home Assistant，唔會收集憑證。'], error:['Check the time zone and all fields. Use different start/end times and select at least one weekday. Maximum 32 rules.','請檢查時區同所有欄位。開始同結束時間必須唔同，並至少揀一日。最多 32 條規則。'], days:[['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],['星期日','星期一','星期二','星期三','星期四','星期五','星期六']]
};
/** onChange must synchronously accept/persist the complete config; getConfig supplies its latest value.
 * Returned section.refresh(date?) updates only the live clock preview, without destroying edits. */
export function createSchedulePanel({language = 'en', getConfig, onChange}) {
  const pair = p => language === 'yue' ? p[1] : language === 'both' ? p.join(' · ') : p[0];
  const t = key => pair(copy[key]);
  const el = (tag, text) => { const node = document.createElement(tag); if (text) node.textContent = text; return node; };
  const root = el('section'); root.id = 'theme-schedules';
  const heading = el('h3',t('title')); root.append(heading);
  const error = el('p'); error.setAttribute('role','alert');
  const preview = el('p'); preview.setAttribute('role','status'); preview.setAttribute('aria-live','polite');
  const controls = el('div'), list = el('div'), editor = el('div');
  root.append(el('p',t('note')),el('p',t('boundary')),controls,preview,error,list,editor);
  const field = (form,key,type,value) => { const label = el('label',t(key)), input = el('input'); input.type = type; if (type === 'checkbox') input.checked = value; else input.value = value; label.append(input); form.append(label); return input; };
  const button = (parent,key,action) => { const b = el('button',t(key)); b.type = 'button'; b.addEventListener('click',action); parent.append(b); return b; };
  const commit = config => { try { onChange(validateScheduleConfig(config)); error.textContent = ''; return true; } catch { error.textContent = t('error'); return false; } };
  root.refresh = (date = new Date()) => { try { const result = evaluateSchedule(getConfig(),date); const text = result.theme ? `${t('current')}: ${t(result.theme)}` : t('manual'); if (preview.textContent !== text) preview.textContent = text; } catch { preview.textContent = t('error'); } };
  function editRule(original) {
    editor.replaceChildren();
    const form = el('form'); form.className = 'stack'; editor.append(form);
    const name = field(form,'label','text',original?.label || ''); name.required = true; name.maxLength = 100;
    const enabled = field(form,'ruleEnabled','checkbox',original?.enabled ?? true);
    const start = field(form,'start','time',original?.start || '20:00'); start.required = true;
    const end = field(form,'end','time',original?.end || '07:00'); end.required = true;
    const startDate = field(form,'startDate','date',original?.startDate || '');
    const endDate = field(form,'endDate','date',original?.endDate || '');
    const days = el('fieldset'); days.append(el('legend',t('weekdays'))); form.append(days);
    const checks = Array.from({length:7},(_,i) => { const label = el('label',pair([copy.days[0][i],copy.days[1][i]])), input = el('input'); input.type = 'checkbox'; input.checked = original ? original.weekdays.includes(i) : true; label.append(input); days.append(label); return input; });
    button(days,'every',() => checks.forEach(input => { input.checked = true; }));
    const themeLabel = el('label',t('theme')), theme = el('select'); for (const value of ['light','dark']) { const option = el('option',t(value)); option.value = value; theme.append(option); } theme.value = original?.theme || 'dark'; themeLabel.append(theme); form.append(themeLabel);
    const priority = field(form,'priority','number',original?.priority ?? 0); priority.min = '0'; priority.max = '100'; priority.step = '1'; priority.required = true;
    const save = el('button',t('save')); save.type = 'submit'; form.append(save);
    button(form,'cancel',() => { editor.replaceChildren(); add.focus(); });
    form.addEventListener('submit',event => { event.preventDefault(); const config = getConfig(); const rule = {id:original?.id || globalThis.crypto.randomUUID(),label:name.value,enabled:enabled.checked,start:start.value,end:end.value,startDate:startDate.value,endDate:endDate.value,weekdays:checks.flatMap((input,i) => input.checked ? [i] : []),theme:theme.value,priority:Number(priority.value)}; const rules = original ? config.rules.map(r => r.id === original.id ? rule : r) : [...config.rules,rule]; if (commit({...config,rules})) { editor.replaceChildren(); render(); add.focus(); } });
    name.focus();
  }
  let add;
  function render() {
    controls.replaceChildren(); list.replaceChildren();
    const config = getConfig(), form = el('form'); form.className = 'stack'; controls.append(form);
    const enabled = field(form,'enabled','checkbox',config.enabled);
    const zone = field(form,'zone','text',config.timeZone); zone.required = true; zone.maxLength = 100; zone.placeholder = 'Europe/London';
    const save = el('button',t('saveZone')); save.type = 'submit'; form.append(save);
    form.addEventListener('submit',event => { event.preventDefault(); if (commit({...getConfig(),enabled:enabled.checked,timeZone:zone.value.trim()})) root.refresh(); });
    if (!config.rules.length) list.append(el('p',t('empty')));
    for (const rule of config.rules) { const item = el('div'); item.append(el('p',`${rule.label} — ${t(rule.enabled ? 'active' : 'inactive')} — ${rule.start}–${rule.end} — ${t(rule.theme)} — ${t('priority')}: ${rule.priority}`)); button(item,'edit',() => editRule(rule)).setAttribute('aria-label',`${t('edit')}: ${rule.label}`); button(item,'remove',() => { if (commit({...getConfig(),rules:getConfig().rules.filter(r => r.id !== rule.id)})) { editor.replaceChildren(); render(); add.focus(); } }).setAttribute('aria-label',`${t('remove')}: ${rule.label}`); list.append(item); }
    add = button(list,'add',() => editRule()); add.disabled = config.rules.length >= 32; root.refresh();
  }
  render(); return root;
}
