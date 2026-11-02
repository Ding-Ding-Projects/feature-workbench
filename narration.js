/** Platform narration. Status codes are data; presentation and persistence belong to the app. */
export const NARRATION_DEFAULTS = Object.freeze({narration:false,narrationLanguage:'en',voiceEn:'',voiceYue:'',speechRate:1,speechPitch:1});
export const SPEECH_RANGES = Object.freeze({rate:Object.freeze({min:0.1,max:10}),pitch:Object.freeze({min:0,max:2})});
const clamp = (value, min, max) => Number.isFinite(value) ? Math.min(max,Math.max(min,value)) : 1;
const matches = (voice, language) => language === 'en' ? /^en(?:[-_]|$)/i.test(voice.lang) : /^(?:yue(?:[-_]|$)|zh[-_]HK(?:[-_]|$))/i.test(voice.lang);

export function createNarrator({getPreferences=()=>NARRATION_DEFAULTS,onStatus=()=>{},
  synthesis=globalThis.speechSynthesis,Utterance=globalThis.SpeechSynthesisUtterance,
  events=globalThis.window,isOnline=()=>globalThis.navigator?.onLine !== false,
  now=()=>Date.now(),setTimer=setTimeout,clearTimer=clearTimeout,debounceMs=200,cooldownMs=2000}={}) {
  const available=!!(synthesis && typeof synthesis.speak==='function' && typeof Utterance==='function');
  let voices=[], destroyed=false, generation=0, active=null, pending=[], timer=null;
  const subscribers=new Set(), lastSpoken=new Map();
  const prefs=()=>({...NARRATION_DEFAULTS,...getPreferences()});
  const blocked=p=>!p.narration?'disabled':p.screenReaderActive?'screen-reader':p.reducedSound?'reduced-sound':p.quietHours?'quiet-hours':null;
  function selection(language) {
    const p=prefs(), selectedId=p[language==='en'?'voiceEn':'voiceYue'] || '';
    const choices=voices.filter(v=>matches(v,language));
    const chosen=choices.find(v=>v.voiceURI===selectedId);
    // Prefer an installed local voice; never substitute Mandarin for Cantonese.
    const fallback=choices.find(v=>v.localService && v.default)||choices.find(v=>v.localService)||choices.find(v=>v.default)||choices[0];
    const effective=chosen||fallback||null;
    return {voices:choices.map(v=>({id:v.voiceURI,name:v.name,lang:v.lang,local:v.localService===true,default:v.default===true})),selectedId,
      effective:effective?{id:effective.voiceURI,name:effective.name,lang:effective.lang,local:effective.localService===true}:null,
      missing:!!selectedId&&!chosen,network:!!effective&&!effective.localService,offline:!isOnline(),
      reason:!available?'unavailable':!effective?'no-voice':!effective.localService&&!isOnline()?'network-offline':null};
  }
  function getVoices(){return {available,en:selection('en'),yue:selection('yue')};}
  function emit(status){if(destroyed)return;onStatus(status);for(const fn of subscribers)fn(getVoices(),status);}
  function refresh(){if(destroyed)return;try{voices=available?Array.from(synthesis.getVoices()):[];}catch{voices=[];}emit({type:'voices'});}
  function cancel(){generation++;if(timer!==null){clearTimer(timer);timer=null;}pending=[];const hadActive=!!active;active=null;if(hadActive){try{synthesis.cancel();}catch{/* Audio failure must not block the app. */}}if(!destroyed)emit({type:'cancelled'});}
  function pump(){
    if(destroyed||active||!pending.length)return;
    const p=prefs(), reason=blocked(p);
    if(reason){cancel();emit({type:'suppressed',reason});return;}
    const item=pending[0];
    if(item.readyAt>now()){if(timer!==null)clearTimer(timer);timer=setTimer(()=>{timer=null;pump();},item.readyAt-now());return;}
    pending.shift();
    const languages=p.narrationLanguage==='both'?['en','yue']:[p.narrationLanguage==='yue'?'yue':'en'];
    const job={item,languages,index:0,token:generation};active=job;
    function next(){
      if(destroyed||active!==job||job.token!==generation)return;
      const current=prefs();if(blocked(current)){cancel();return;}
      if(job.index>=languages.length){active=null;pump();return;}
      const language=languages[job.index++], text=item[language], info=selection(language);
      if(!text){next();return;}
      if(info.reason){emit({type:'skipped',language,reason:info.reason});next();return;}
      const voice=voices.find(v=>v.voiceURI===info.effective.id&&matches(v,language));
      let utterance,settled=false;
      const finish=error=>{if(settled||destroyed||active!==job||generation!==job.token)return;settled=true;emit({type:error?'error':'ended',language,...(error?{reason:error}: {})});next();};
      try {
        utterance=new Utterance(text);utterance.voice=voice;utterance.lang=voice.lang;
        utterance.rate=clamp(current.speechRate,0.1,10);utterance.pitch=clamp(current.speechPitch,0,2);
        utterance.onend=()=>finish();utterance.onerror=e=>finish(e?.error||'speech-failed');
        lastSpoken.set(item.category,now());emit({type:'speaking',language,voiceId:voice.voiceURI});
        if(destroyed||active!==job||generation!==job.token)return;
        synthesis.speak(utterance);
      }catch{finish('speech-failed');}
    }
    next();
  }
  function queue({en='',yue='',category='normal',error=false}={}){
    if(destroyed)return false;
    const reason=blocked(prefs())||(!available?'unavailable':null);
    if(reason){emit({type:'suppressed',reason});return false;}
    if(![en,yue].every(v=>typeof v==='string')||(!en.trim()&&!yue.trim()))return false;
    const time=now();
    // Errors bypass timing limits and are not dropped by newer routine messages.
    const item={en,yue,category,error,readyAt:error?time:Math.max(time+debounceMs,(lastSpoken.get(category)??-Infinity)+cooldownMs)};
    if(!error){const old=pending.findIndex(v=>!v.error&&v.category===category);if(old>=0)pending.splice(old,1);}
    if(error)pending.unshift(item);else pending.push(item);
    if(timer!==null){clearTimer(timer);timer=null;}pump();return true;
  }
  function subscribe(fn){if(destroyed)return ()=>{};subscribers.add(fn);fn(getVoices(),{type:'voices'});return ()=>subscribers.delete(fn);}
  // Property-only implementations are supported without discarding the host listener.
  let previous,propertyListener;
  if(synthesis?.addEventListener)synthesis.addEventListener('voiceschanged',refresh);
  else if(synthesis){previous=synthesis.onvoiceschanged;propertyListener=function(event){previous?.call(synthesis,event);refresh();};synthesis.onvoiceschanged=propertyListener;}
  events?.addEventListener?.('online',refresh);events?.addEventListener?.('offline',refresh);
  refresh();
  return {queue,cancel,getVoices,subscribe,refresh,destroy(){if(destroyed)return;cancel();destroyed=true;subscribers.clear();synthesis?.removeEventListener?.('voiceschanged',refresh);if(propertyListener&&synthesis.onvoiceschanged===propertyListener)synthesis.onvoiceschanged=previous;events?.removeEventListener?.('online',refresh);events?.removeEventListener?.('offline',refresh);}};
}
