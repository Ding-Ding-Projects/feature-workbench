import test from 'node:test';
import assert from 'node:assert/strict';
import {SOUND_DEFAULTS,createSoundPlayer} from '../src/sounds.js';
function fixture({state='running',resume,throws=false}={}) {
  const contexts=[],timers=new Map(),nodes=[]; let time=1000,id=0;
  let prefs={...SOUND_DEFAULTS,soundEffects:true};
  class Context {
    constructor() {if(throws) throw new Error('private failure'); this.state=state;this.currentTime=2;this.destination={};contexts.push(this);}
    async resume(){if(resume) await resume(this);else this.state='running';}
    close(){this.state='closed';this.closed=true;return Promise.resolve();}
    createGain(){const n={values:[],connect(){},disconnect(){this.disconnected=true;}};n.gain={setValueAtTime:(...v)=>n.values.push(v),linearRampToValueAtTime:(...v)=>n.values.push(v)};nodes.push(n);return n;}
    createOscillator(){const n={frequency:{setValueAtTime(v){n.hz=v;}},connect(){},disconnect(){this.disconnected=true;},start(t){this.started=t;},stop(t){this.stopped=t??true;}};nodes.push(n);return n;}
  }
  const player=createSoundPlayer({AudioContext:Context,getPreferences:()=>prefs,now:()=>time,setTimer:fn=>{timers.set(++id,fn);return id;},clearTimer:id=>timers.delete(id)});
  return {player,contexts,nodes,timers,setPrefs:p=>{prefs={...prefs,...p};},advance:()=>{time+=1000;},finish:()=>{for(const fn of [...timers.values()])fn();}};
}
test('defaults are opt-in and player construction never opens an audio context',async()=>{
  assert.deepEqual(SOUND_DEFAULTS,{soundEffects:false,soundVolume:.4,soundMuted:false});
  const f=fixture();assert.equal(f.contexts.length,0);f.setPrefs({soundEffects:false});
  assert.equal((await f.player.play('success')).reason,'disabled');assert.equal(f.contexts.length,0);
});
test('all intentional cues synthesize through one shared bounded gain path',async()=>{
  const f=fixture();
  for(const kind of ['success','refused','delete']) {
    const from=f.nodes.length;
    assert.deepEqual(await f.player.play(kind),{played:true,reason:'scheduled'});
    const nodes=f.nodes.slice(from);assert.ok(nodes.length>=3);assert.ok(nodes[0].values.every(([v])=>v>=0&&v<=.12));
    assert.ok(nodes.slice(1).every(n=>n.hz>0&&n.started<n.stopped));
    f.finish();assert.ok(nodes.every(n=>n.disconnected));f.advance();
  }
  assert.equal(f.contexts.length,1);f.player.destroy();assert.equal(f.contexts[0].closed,true);
});
test('muting, reduced sound, quiet hours and zero volume suppress; reduced motion does not',async()=>{
  for(const [key,value,reason] of [['soundMuted',true,'muted'],['reducedSound',true,'reduced-sound'],['quietHours',true,'quiet-hours'],['soundVolume',0,'zero-volume']]) {
    const f=fixture();f.setPrefs({[key]:value});assert.equal((await f.player.play('delete')).reason,reason);assert.equal(f.contexts.length,0);
  }
  const f=fixture();f.setPrefs({reducedMotion:true,soundVolume:20});assert.equal((await f.player.play('success')).played,true);
  assert.ok(f.nodes[0].values.every(([v])=>v<=.12));f.player.destroy();
});
test('overlap and repeat suppression, stop and destruction are safe and idempotent',async()=>{
  const f=fixture();await f.player.play('success');assert.equal((await f.player.play('refused')).reason,'busy');
  f.player.stop();assert.equal(f.timers.size,0);assert.ok(f.nodes.every(n=>n.disconnected));
  assert.equal((await f.player.play('success')).reason,'cooldown');f.advance();assert.equal((await f.player.play('delete')).played,true);
  f.player.destroy();f.player.destroy();assert.equal((await f.player.play('success')).reason,'destroyed');
});
test('unavailable, rejected, suspended and unknown requests return honest nonthrowing statuses',async()=>{
  const missing=createSoundPlayer({AudioContext:null,getPreferences:()=>({soundEffects:true})});
  assert.equal((await missing.play('success')).reason,'unavailable');assert.equal((await missing.play('anything')).reason,'unknown-cue');
  for(const options of [{throws:true},{state:'suspended',resume:()=>{throw new Error('private failure');}}]) {
    const f=fixture(options);assert.deepEqual(await f.player.play('success'),{played:false,reason:'audio-refused'});f.player.destroy();
  }
  const f=fixture({state:'suspended',resume:()=>{}});assert.equal((await f.player.play('success')).reason,'suspended');f.player.destroy();
});
test('pending resume cannot play after stop or a newly enabled quiet setting',async()=>{
  for(const action of ['stop','mute','destroy']) {
    let resolve;const wait=new Promise(r=>{resolve=r;});
    const f=fixture({state:'suspended',resume:async c=>{await wait;c.state='running';}});
    const pending=f.player.play('success');assert.equal((await f.player.play('delete')).reason,'busy');
    if(action==='mute')f.setPrefs({quietHours:true});else f.player[action]();
    resolve();const result=await pending;assert.equal(result.played,false);assert.equal(f.nodes.length,0);f.player.destroy();
  }
});
test('resume recovery works and observer exceptions do not break playback',async()=>{
  const f=fixture({state:'suspended'});assert.equal((await f.player.play('success')).played,true);f.player.destroy();
  const player=createSoundPlayer({onStatus:()=>{throw Error('observer');}});assert.equal((await player.play('success')).reason,'disabled');player.destroy();
});
