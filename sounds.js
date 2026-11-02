/** Original short synthesized cues; no samples, network, storage, or startup playback. */
export const SOUND_DEFAULTS = Object.freeze({soundEffects:false, soundVolume:0.4, soundMuted:false});
const CUES = Object.freeze({
  success: [[523.25, 0.09], [659.25, 0.09], [783.99, 0.14]],
  refused: [[220, 0.12], [174.61, 0.16]],
  delete: [[392, 0.08], [261.63, 0.14]]
});
const volumeOf = p => Number.isFinite(p.soundVolume) ? Math.min(1, Math.max(0, p.soundVolume)) : SOUND_DEFAULTS.soundVolume;
const blocked = p => p.soundEffects !== true ? 'disabled' : p.soundMuted ? 'muted' : p.reducedSound ? 'reduced-sound' : p.quietHours ? 'quiet-hours' : volumeOf(p) === 0 ? 'zero-volume' : null;

/**
 * play(kind) must be called only for an intentional user action and its known result.
 * It resolves {played, reason}; played means scheduled, not proof of audible output.
 * The host owns settings, persistence, event labels and calling stop on preference changes.
 */
export function createSoundPlayer({getPreferences=()=>SOUND_DEFAULTS,
  AudioContext=globalThis.AudioContext || globalThis.webkitAudioContext,
  now=()=>Date.now(), setTimer=setTimeout, clearTimer=clearTimeout,
  cooldownMs=350, onStatus=()=>{}}={}) {
  let context=null, destroyed=false, active=null, generation=0, lastPlayed=-Infinity;
  const preferences = () => ({...SOUND_DEFAULTS,...getPreferences()});
  const cooldown = Number.isFinite(cooldownMs) ? Math.max(0, cooldownMs) : 350;
  const result = (played, reason) => { const value={played, reason}; try { onStatus(value); } catch { /* Observers cannot block actions. */ } return value; };
  function release(job) {
    if(job.timer !== null) { clearTimer(job.timer); job.timer=null; }
    for(const node of job.nodes) {
      try { if(typeof node.stop==='function') node.stop(); } catch { /* Already stopped. */ }
      try { node.disconnect(); } catch { /* Already disconnected. */ }
    }
    job.nodes=[];
    if(active===job) active=null;
  }
  function stop() { generation++; if(active) release(active); }
  async function play(kind) {
    if(destroyed) return result(false,'destroyed');
    if(!Object.hasOwn(CUES,kind)) return result(false,'unknown-cue');
    let p;
    try { p=preferences(); } catch { return result(false,'preferences-unavailable'); }
    const reason=blocked(p);
    if(reason) { stop(); return result(false,reason); }
    if(active) return result(false,'busy');
    if(now()-lastPlayed<cooldown) return result(false,'cooldown');
    if(typeof AudioContext!=='function') return result(false,'unavailable');
    const job={nodes:[], timer:null, token:generation}; active=job;
    try {
      if(!context || context.state==='closed') context=new AudioContext();
      if(context.state==='suspended') await context.resume();
      if(destroyed || job.token!==generation || active!==job) { release(job); return result(false,'cancelled'); }
      p=preferences();
      const updatedReason=blocked(p);
      if(updatedReason) { release(job); return result(false,updatedReason); }
      if(context.state!=='running') { release(job); return result(false,'suspended'); }
      const gain=context.createGain(); job.nodes.push(gain); gain.connect(context.destination);
      const start=context.currentTime + .01;
      const peak=volumeOf(p)*.12;
      gain.gain.setValueAtTime(0,start);
      let offset=0;
      for(const [frequency,duration] of CUES[kind]) {
        const oscillator=context.createOscillator(); job.nodes.push(oscillator);
        oscillator.type='sine'; oscillator.frequency.setValueAtTime(frequency,start+offset);
        oscillator.connect(gain);
        gain.gain.setValueAtTime(0,start+offset);
        gain.gain.linearRampToValueAtTime(peak,start+offset+.01);
        gain.gain.setValueAtTime(peak,start+offset+duration-.025);
        gain.gain.linearRampToValueAtTime(0,start+offset+duration);
        oscillator.start(start+offset); oscillator.stop(start+offset+duration);
        offset+=duration+.015;
      }
      lastPlayed=now();
      job.timer=setTimer(()=>release(job),Math.ceil((offset+.06)*1000));
      return result(true,'scheduled');
    } catch {
      release(job);
      return result(false,'audio-refused');
    }
  }
  function destroy() {
    if(destroyed) return;
    destroyed=true; stop();
    const previous=context; context=null;
    try { Promise.resolve(previous?.close()).catch(()=>{}); } catch { /* Closing audio is best effort. */ }
  }
  return {play,stop,destroy};
}
