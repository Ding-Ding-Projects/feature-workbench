import {defaultScheduleConfig,validateScheduleConfig,evaluateSchedule} from '../src/schedules.js';
import {SOUND_DEFAULTS} from '../src/sounds.js';
// Source integration checks with a minimal DOM harness, not browser evidence.
import {createWordingMatcher} from '../src/wording.js';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {localize,message} from '../src/i18n.js';
import {NARRATION_DEFAULTS,SPEECH_RANGES} from '../src/narration.js';
import {parseBoundedJSON,validateVocabulary,parseVocabularyBytes} from '../src/validation.js';
const source=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const executable=source.replace(/^import .*;\n/gm,'').slice(0,source.replace(/^import .*;\n/gm,'').lastIndexOf('\nrender();\nfetch('));
function harness(){
 const handlers={},windowHandlers={},nodes=new Map(),calls={queue:[],cancel:0,destroy:0,panels:[]},cache=new Map();
 const voices={available:true,en:{voices:[{id:'english-local',name:'English',lang:'en-GB',local:true}],selectedId:'',effective:{id:'english-local',name:'English',lang:'en-GB',local:true},missing:false,network:false,reason:null},yue:{voices:[],selectedId:'',effective:null,missing:false,network:false,reason:'no-voice'}};
 nodes.set('#modal',{addEventListener(){},close(){},open:false});
 const context=vm.createContext({defaultScheduleConfig,validateScheduleConfig,evaluateSchedule,createSchedulePanel:()=>({refresh(){}}),createSearchBuilder:()=>{throw Error('Search builder must be explicitly mocked for DOM mounting');},setInterval:()=>1,clearInterval(){},SOUND_DEFAULTS,createSoundPlayer:()=>({play:async()=>({played:false,reason:'disabled'}),stop(){},destroy(){}}),createWordingMatcher,localize,message,NARRATION_DEFAULTS,SPEECH_RANGES,parseBoundedJSON,validateVocabulary,parseVocabularyBytes,structuredClone,TextDecoder,TextEncoder,Event,setTimeout,clearTimeout,URL,Blob,crypto:globalThis.crypto,console,location:{hash:''},CSS:{escape:x=>x},localStorage:{getItem:k=>cache.get(k)||null,setItem:(k,v)=>cache.set(k,v),removeItem:k=>cache.delete(k)},document:{querySelector:k=>nodes.get(k)||null,removeEventListener(){},querySelectorAll:key=>nodes.get(key)||[],addEventListener:(name,fn)=>{(handlers[name]??=[]).push(fn);}},window:{addEventListener:(name,fn)=>{const previous=windowHandlers[name];windowHandlers[name]=()=>{previous?.();fn();};}},createNarrator:({getPreferences,onStatus})=>{onStatus({type:'voices'});return {queue:item=>{calls.queue.push(item);return true;},cancel:()=>calls.cancel++,destroy:()=>calls.destroy++,getVoices:()=>voices,subscribe:fn=>{fn(voices,{type:'voices'});calls.subscriber=fn;},refresh:()=>calls.subscriber(voices,{type:'voices'})};},createToolsPanel:options=>{const fields=new Map([['textarea',{value:'',dispatchEvent(){}}],['input[type="text"]',{value:'SW',dispatchEvent(){}}],['input[type="color"]',{value:'#2457c5',dispatchEvent(){}}]]);const panel={querySelector:key=>fields.get(key)};calls.panels.push({options,panel});return panel;},FormData:class{constructor(form){this.form=form;}get(k){return this.form.values[k];}}});
 vm.runInContext(executable,context);return {context,calls,handlers,windowHandlers,nodes,voices,run:code=>vm.runInContext(code,context)};
}
const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
const fontsCss=readFileSync(new URL('../src/fonts/fonts.css',import.meta.url),'utf8');
const manifest=JSON.parse(readFileSync(new URL('../src/fonts/provenance.json',import.meta.url),'utf8'));
// Source contracts for the v2 Material 3 Expressive redesign. Not browser or screenshot proof.
const block=selector=>{const start=css.indexOf(selector+'{');assert.ok(start>=0,selector);return css.slice(start,css.indexOf('}',start));};
test('M3 tonal colour roles are defined for light and dark',()=>{
  const light={'--md-primary':'#2546d6','--md-on-primary':'#ffffff','--md-primary-container':'#dde1ff','--md-secondary-container':'#dee1f9','--md-tertiary':'#8b5000','--md-tertiary-container':'#ffdcbe','--md-error':'#ba1a1a','--md-surface':'#fbf8ff','--md-surface-container-low':'#f5f2fa','--md-surface-container-highest':'#e3e1e9','--md-on-surface':'#1b1b21','--md-on-surface-variant':'#45464f','--md-outline':'#767680','--md-outline-variant':'#c6c5d0','--md-inverse-surface':'#303036','--md-inverse-primary':'#b9c3ff'};
  const dark={'--md-primary':'#b9c3ff','--md-on-primary':'#00218b','--md-primary-container':'#0035c2','--md-secondary-container':'#424659','--md-tertiary':'#ffb870','--md-tertiary-container':'#6a3c00','--md-error':'#ffb4ab','--md-surface':'#121318','--md-surface-container-low':'#1b1b21','--md-surface-container-highest':'#34343a','--md-on-surface':'#e4e1e9','--md-on-surface-variant':'#c6c5d0','--md-outline':'#90909a','--md-outline-variant':'#45464f','--md-inverse-surface':'#e4e1e9','--md-inverse-primary':'#2546d6'};
  const lightBlock=block(':root'),darkBlock=block(':root[data-theme=dark]');
  for(const [name,value] of Object.entries(light))assert.ok(lightBlock.includes(`${name}:${value};`),'light '+name);
  for(const [name,value] of Object.entries(dark))assert.ok(darkBlock.includes(`${name}:${value};`),'dark '+name);
  for(const status of ['todo','doing','done'])assert.ok(css.includes(status==='todo'?'.lane{--lane-bg:var(--md-secondary-container)':`.lane[data-lane=${status}]{--lane-bg:var(--md-${status==='doing'?'tertiary':'primary'}-container)`),status);
  assert.doesNotMatch(css,/@import|https?:\/\//i);
});
test('spring motion tokens keep their exact design values',()=>{
  const curve='linear(0, 0.006, 0.025 2.8%, 0.101 6.1%, 0.539 18.9%, 0.721 25.3%, 0.849 31.5%, 0.937 38.1%, 0.968 41.8%, 0.991 45.7%, 1.006 50.1%, 1.015 55%, 1.017 63.9%, 1.001 85.9%, 1)';
  assert.ok(css.includes('--motion-spring-fast-spatial:350ms linear(0, 0.013 0.6%, 0.05 1.2%, 0.2 2.6%, 0.468 4.4%, 0.734 6.3%, 0.899 8%, 1.003 9.8%, 1.058 11.6%, 1.074 13.6%, 1.06 15.6%, 1.03 18.1%, 1.002 21.3%, 0.991 25.4%, 1.001 34.4%, 1);'));
  assert.ok(css.includes(`--motion-spring-default-spatial:500ms ${curve};`));
  assert.ok(css.includes(`--motion-spring-slow-spatial:650ms ${curve};`));
  assert.ok(css.includes('--motion-effects:200ms cubic-bezier(0.34, 0.8, 0.34, 1);'));
  for(const shape of ['--shape-xs:4px','--shape-sm:8px','--shape-md:12px','--shape-lg:16px','--shape-lg-inc:20px','--shape-xl:28px','--shape-xl-inc:32px','--shape-xxl:48px','--shape-full:999px'])assert.ok(css.includes(shape),shape);
  // Every choreography is present in source.
  for(const hook of ['.page-enter>*{animation:enter-up','.nav-ghost{','.lane-count.roll-up','button:active:not(:disabled)','.fab.is-collapsed .fab-label{max-width:0','dialog[open]{animation:dialog-in','.wavy-fill{','.saved-chip.pulse{animation:chip-pulse','.list-enter>.requirement-row{animation:row-in','::view-transition-new(root){animation:theme-reveal'])assert.ok(css.includes(hook),hook);
});
test('reduced motion neutralises animation and transition for both triggers',()=>{
  const app=css.slice(css.indexOf('.reduce-motion *,'));
  assert.match(app,/^\.reduce-motion \*,\.reduce-motion \*::before,\.reduce-motion \*::after\{animation:none!important;transition:opacity 120ms linear!important/);
  const media=css.slice(css.lastIndexOf('@media(prefers-reduced-motion:reduce)'));
  assert.match(media,/\*,\*::before,\*::after\{animation:none!important;transition:opacity 120ms linear!important/);
  assert.match(media,/::view-transition-new\(\*\)\{animation:none!important\}/);
  assert.match(css,/\.reduce-motion details::details-content\{transition:none!important\}/);
  assert.ok(css.lastIndexOf('.reduce-motion *,')>css.lastIndexOf('@keyframes'),'reduced-motion rules come after all animation rules');
});
test('JavaScript motion is skipped under either reduced-motion trigger',()=>{
  const h=harness();
  assert.equal(h.run('motionAllowed()'),true);
  h.run('state.prefs.motion=true');assert.equal(h.run('motionAllowed()'),false);assert.equal(h.run('captureLayout()'),null);
  h.run('state.prefs.motion=false');h.context.matchMedia=query=>({matches:query==='(prefers-reduced-motion: reduce)'});assert.equal(h.run('motionAllowed()'),false);
  let applied=0;h.context.applyTheme=()=>applied++;h.run('changeTheme({},applyTheme)');assert.equal(applied,1,'theme still changes without animation');
});
test('navigation rail and bottom bar share one landmark with aria-current',()=>{
  const h=harness();
  for(const route of ['workspace','guide','tools']){
    h.run(`route='${route}'`);const html=h.run('navigation()');
    assert.match(html,/^<nav class="nav" aria-label="Main">/);
    assert.equal((html.match(/aria-current="page"/g)||[]).length,1);
    assert.match(html,new RegExp(`href="#${route}" aria-current="page"`));
    for(const target of ['#workspace','#guide','#tools'])assert.ok(html.includes(`href="${target}"`));
    assert.ok(html.includes('data-action="settings"'));
    assert.match(html,/<span class="nav-icon"><span class="ms" aria-hidden="true">/);
  }
  assert.match(css,/\.nav-item\[aria-current\] \.ms[^{]*\{font-variation-settings:"FILL" 1/);
  assert.match(css,/@media\(max-width:839\.98px\)\{[\s\S]*\.nav\{position:fixed;left:0;right:0;bottom:0/);
});
test('task cards use a connected button group with the current status selected',()=>{
  const h=harness();h.context.task={id:'a',title:'First <task>',notes:'',status:'doing'};
  const html=h.run('taskCard(task)');
  assert.match(html,/<div class="card-bottom button-group connected" role="group" aria-label="Status: First &lt;task&gt;">/);
  assert.equal((html.match(/aria-pressed="true"/g)||[]).length,1);
  assert.match(html,/class="is-selected" aria-pressed="true">[^]*In progress<\/button>/);
  for(const status of ['todo','done'])assert.match(html,new RegExp(`aria-pressed="false" data-move="a" data-status="${status}" aria-label="First &lt;task&gt; → `));
  assert.doesNotMatch(html,/data-move="a" data-status="doing"/,'the selected segment is not a move action');
  assert.ok(css.includes('.connected>button[aria-pressed=true]{border-radius:var(--shape-pill)'));
});
test('the vendored icon font is local, subset and recorded with provenance',()=>{
  assert.match(fontsCss,/@font-face\{font-family:"Material Symbols Rounded";src:url\("\.\/materialsymbolsrounded\/MaterialSymbolsRounded-subset\.woff2"\) format\("woff2"\)/);
  assert.equal(manifest.iconFont.license,'Apache-2.0');
  assert.ok(manifest.iconFont.files.some(row=>row.path==='materialsymbolsrounded/MaterialSymbolsRounded-subset.woff2'&&/^[0-9a-f]{64}$/.test(row.sha256)));
  assert.ok(manifest.iconFont.glyphs.length<60,'a subset, not the full icon set');
  assert.match(css,/\.ms\{font-family:"Material Symbols Rounded"/);
});
