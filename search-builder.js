/** Local ECMAScript search. User expressions are evaluated only in disposable workers. */
export const SEARCH_LIMITS = Object.freeze({pattern:4096,inputBytes:1048576,timeoutMs:150,matches:200,saved:30});
export const escapeLiteral = value => String(value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export function normalizeSearchState(value = {}) {
 return {query:typeof value.query==='string'?value.query.slice(0,SEARCH_LIMITS.pattern):'',regex:value.regex===true,flags:typeof value.flags==='string'&&/^(?!.*(.).*\1)[dgimsuvy]*$/.test(value.flags)&&!(value.flags.includes('u')&&value.flags.includes('v'))?value.flags:'i'};
}
export function prepareSearchRequest(state,items=[],sample='',replacement='') {
 const query=String(state.query??'');
 if(String(replacement).length>4096)throw Error('input-limit');
 if(query.length>SEARCH_LIMITS.pattern)throw Error('pattern-limit');
 if(!Array.isArray(items))throw Error('input-invalid');
 if(items.length>10000)throw Error('input-limit');
 const encoder=new TextEncoder();let bytes=encoder.encode(String(sample)).length+encoder.encode(String(replacement)).length;const texts=[];
 if(bytes>SEARCH_LIMITS.inputBytes)throw Error('input-limit');
 for(const item of items){const text=typeof item==='string'?item:String(item?.text??item?.label??item?.title??'');if(text.length>SEARCH_LIMITS.inputBytes)throw Error('input-limit');bytes+=encoder.encode(text).length;if(bytes>SEARCH_LIMITS.inputBytes)throw Error('input-limit');texts.push(text);}
 if(typeof state.flags!=='string'||!/^(?!.*(.).*\1)[dgimsuvy]*$/.test(state.flags)||(state.flags.includes('u')&&state.flags.includes('v')))throw Error('flags-invalid');
 return {query,regex:!!state.regex,flags:state.flags,texts,sample:String(sample),replacement:String(replacement),limit:SEARCH_LIMITS.matches};
}
// This function is serialized into a worker; never call it on the UI thread.
export function searchWorkerTask(request) {
 const started=performance.now();
 try {
  const {query,regex,flags,texts,sample,replacement,limit}=request;
  const source=regex?query:query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const effective=regex?flags:'i';
  const predicate=new RegExp(source,effective);
  const indices=[];
  for(let i=0;i<texts.length;i++){predicate.lastIndex=0;if(!query||predicate.test(texts[i]))indices.push(i);}
  const previewFlags=effective.includes('g')?effective:effective+'g';
  const preview=new RegExp(source,previewFlags);const matches=[];let match,truncated=false;
  while((match=preview.exec(sample))!==null){
   if(matches.length>=limit){truncated=true;break;}
   matches.push({text:match[0],start:match.index,end:match.index+match[0].length,captures:Array.from(match).slice(1).map(x=>x??null),groups:match.groups??{},indices:match.indices??null});
   if(match[0]===''){const n=preview.lastIndex;preview.lastIndex=n+((preview.unicode||preview.unicodeSets)&&sample.codePointAt(n)>65535?2:1);}
  }
  // Replacement itself stays inside the same worker deadline, with bounded output.
  let output='',cursor=0,outputTruncated=false;
  const replacer=new RegExp(source,effective);let replaced=0;
  while((match=replacer.exec(sample))!==null){
   if(replaced>=limit){outputTruncated=true;break;}
   output+=sample.slice(cursor,match.index);
   let expanded='',last=0;const template=/\$([$&`']|\d{1,2}|<[^>]+>)/g;let part;
   const expand=(token,key)=>{
    if(key==='$')return '$';if(key==='&')return match[0];if(key==='`')return sample.slice(0,match.index);if(key==="'")return sample.slice(match.index+match[0].length);
    if(key.startsWith('<'))return match.groups?match.groups[key.slice(1,-1)]??'':token;
    const n=Number(key);if(n>0&&n<match.length)return match[n]??'';
    if(key.length===2&&Number(key[0])>0&&Number(key[0])<match.length)return (match[Number(key[0])]??'')+key[1];return token;
   };
   while((part=template.exec(replacement))!==null){expanded+=replacement.slice(last,part.index);const piece=expand(part[0],part[1]);expanded+=piece.slice(0,Math.max(0,1048576-expanded.length));last=template.lastIndex;if(expanded.length>=1048576){outputTruncated=true;break;}}
   if(!outputTruncated)expanded+=replacement.slice(last);output+=expanded;
   cursor=match.index+match[0].length;replaced++;
   if(outputTruncated){output=output.slice(0,1048576);break;}
   if(output.length>1048576){output=output.slice(0,1048576);outputTruncated=true;break;}
   if(!replacer.global)break;
   if(match[0]===''){const n=replacer.lastIndex;replacer.lastIndex=n+((replacer.unicode||replacer.unicodeSets)&&sample.codePointAt(n)>65535?2:1);}
  }
  if(!outputTruncated)output+=sample.slice(cursor);
  if(output.length>1048576){output=output.slice(0,1048576);outputTruncated=true;}
  return {ok:true,indices,matches,truncated,output,outputTruncated,elapsedMs:performance.now()-started};
 }catch(error){return {ok:false,code:'syntax',detail:String(error.message).slice(0,300)};}
}
export const SEARCH_WORKER_SOURCE=`self.onmessage=e=>self.postMessage((${searchWorkerTask.toString()})(e.data));`;
export function createSearchEvaluator({workerFactory,timeoutMs=SEARCH_LIMITS.timeoutMs}={}) {
 let cancelCurrent=null;
 const factory=workerFactory??(()=>{const url=URL.createObjectURL(new Blob([SEARCH_WORKER_SOURCE],{type:'text/javascript'}));try{return new Worker(url);}finally{URL.revokeObjectURL(url);}});
 return {
  cancel(){cancelCurrent?.();},
  evaluate(request){cancelCurrent?.();return new Promise(resolve=>{
   let worker,timer,finished=false;
   const finish=result=>{if(finished)return;finished=true;clearTimeout(timer);worker?.terminate();cancelCurrent=null;resolve(result);};
   cancelCurrent=()=>finish({ok:false,code:'cancelled'});
   try{worker=factory();timer=setTimeout(()=>finish({ok:false,code:'timeout'}),Math.min(150,Math.max(1,timeoutMs)));worker.onmessage=e=>finish(e.data);worker.onerror=()=>finish({ok:false,code:'worker-unavailable'});worker.postMessage(request);}catch{finish({ok:false,code:'worker-unavailable'});}
  });}
 };
}
export const SEARCH_TOKENS=[
 ['Anchors','位置', [['^','Start','開頭'],['$','End','結尾'],['\\b','Word boundary','詞邊界']]],
 ['Classes','字元類別', [['.','Any character','任何字元'],['\\d','Digit','數字'],['\\w','ASCII word','英數字'],['\\s','Whitespace','空白'],['[a-z]','Range','範圍'],['[^a-z]','Excluded range','排除範圍'],['\\p{L}','Unicode letter (u/v)','Unicode 字母（u/v）'],['\\u{1F600}','Code point (u/v)','碼位（u/v）']]],
 ['Groups','群組', [['()','Capture','擷取'],['(?:)','Non-capturing group','非擷取群組'],['(?<name>)','Named capture','具名擷取'],['\\1','Backreference','反向參照'],['\\k<name>','Named backreference','具名反向參照']]],
 ['Quantifiers','重複次數', [['*','Zero or more','零次或以上'],['+','One or more','一次或以上'],['?','Optional','可選'],['{2,4}','Two to four','兩至四次'],['*?','Lazy repetition','最少重複']]],
 ['Alternation','擇一', [['|','Either alternative','其中一項']]],
 ['Lookarounds','前後查看', [['(?=)','Positive lookahead','正向前瞻'],['(?!)','Negative lookahead','負向前瞻'],['(?<=)','Positive lookbehind','正向後顧'],['(?<!)','Negative lookbehind','負向後顧']]]
];
const COPY={search:['Search','搜尋'],builder:['Pattern builder','模式建立工具'],close:['Close builder','關閉工具'],regex:['Use regular expression','使用正規表達式'],raw:['Query / raw pattern','查詢／原始模式'],flags:['Flags','旗標'],sample:['Sample text (not saved)','範例文字（唔會儲存）'],replacement:['Replacement template','取代範本'],escape:['Escape query as literal','將查詢轉為純文字模式'],tokens:['Insert syntax','插入語法'],examples:['Try an example','試用範例'],saved:['Saved patterns on this device','呢部裝置儲存嘅模式'],save:['Save current pattern','儲存目前模式'],name:['Pattern name','模式名稱'],remove:['Delete','刪除'],load:['Load','載入'],remember:['Remember this field’s query and mode on this device','喺呢部裝置記住呢個欄位嘅查詢同模式'],clear:['Clear remembered state','清除記住嘅狀態'],copy:['Copy pattern and flags','複製模式同旗標'],export:['Export pattern JSON','匯出模式 JSON'],preview:['Live matches and captures','即時比對同擷取'],substitution:['Substitution preview','取代預覽'],explain:['Syntax guide (not a full parser)','語法指南（唔係完整剖析器）'],ready:['Ready','準備好'],running:['Searching…','搜尋中…'],empty:['No matches','冇符合項目'],count:['Matching items','符合項目'],timeout:['Stopped after the 150 ms worker limit. Simplify the pattern.','已達 150 毫秒工作執行緒上限。請簡化模式。'],syntax:['Invalid or unsupported ECMAScript pattern / flags.','ECMAScript 模式／旗標無效或唔受支援。'],'worker-unavailable':['Worker unavailable; regex matching is disabled, not run on the page thread.','工作執行緒無法使用，正規表達式比對已停用，唔會喺頁面執行。'],'input-limit':['Input exceeds 1 MiB or 10,000 items. Narrow the source.','輸入超過 1 MiB 或 10,000 項。請縮小範圍。'],'pattern-limit':['Pattern exceeds 4,096 characters.','模式超過 4,096 個字元。'],'flags-invalid':['Invalid flags; u and v cannot be combined.','旗標無效；u 同 v 唔可以一齊使用。'],stored:['Saved locally','已喺本機儲存'],storage:['Local storage is unavailable or full.','本機儲存無法使用或已滿。'],copied:['Copied','已複製'],copyFailed:['Copy unavailable. Select the raw pattern to copy manually.','無法複製。請選取原始模式手動複製。'],truncated:['Preview truncated at the safety limit.','預覽已達安全上限，未顯示全部內容。'],engine:['Engine: this browser’s native ECMAScript RegExp (version not exposed). UTF-16 indices; plain search ignores case. Regex uses your flags. Matching runs locally in a disposable worker: 150 ms, 1 MiB input, 4,096 pattern characters, 200 preview matches. No network.','引擎：呢個瀏覽器原生 ECMAScript RegExp（冇提供版本）。索引用 UTF-16；純文字搜尋唔分大小寫，模式搜尋跟旗標。比對喺本機一次性工作執行緒進行：150 毫秒、1 MiB 輸入、4,096 模式字元、200 個預覽比對。唔用網絡。'],gaps:['Unavailable: other regex dialects/conversion, atomic groups, possessive quantifiers, conditionals, subroutines, engine tracing/backtracking debugger, filesystem GREP, code templates and external integrations. These need additional real engines or platform adapters; this is not full multi-engine parity. Unicode sets (v) and newer syntax depend on the browser; validation reports support.','未提供：其他模式引擎／轉換、原子群組、佔有量詞、條件式、子程序、引擎追蹤／回溯除錯、檔案搜尋、程式範本同外部整合。呢啲需要額外真實引擎或平台配接器；唔係完整多引擎功能。Unicode 集合（v）同新語法視乎瀏覽器，驗證會報告支援情況。'],guide:['Literals match themselves; backslash escapes syntax. [] chooses a character; () captures; | selects alternatives; ^/$ anchor; * + ? {n,m} repeat. Lookarounds test context without consuming it. Greedy nested repetition may time out. Replacement supports $$, $&, $1…$99, $<name>, $` and $\'. Preview lists all matches; replacement follows g (all) or its absence (first). Empty query shows all search items.','普通字元比對本身；反斜線轉義語法。[] 揀字元；() 擷取；| 擇一；^/$ 定位；* + ? {n,m} 重複。前後查看只測試上下文，唔消耗字元。巢狀重複可能超時。取代支援 $$、$&、$1…$99、$<name>、$` 同 $\'。預覽列出所有比對；取代按 g（全部）或冇 g（第一個）執行。空白查詢會顯示全部搜尋項目。']};
export function createSearchBuilder({id,language='en',getItems=()=>[],onResults=()=>{},onStatus=()=>{},workerFactory,storage,label,transformText=value=>value}={}) {
 if(typeof id!=='string'||!id)throw Error('A stable search field id is required');
 const doc=globalThis.document;if(!doc)throw Error('DOM required');
 const tr=key=>{const pair=COPY[key]??[key,key];const lang=typeof language==='function'?language():language;return transformText(lang==='yue'?pair[1]:lang==='both'?pair.join(' · '):pair[0]);};
 const pair=(en,yue)=>{const lang=typeof language==='function'?language():language;return transformText(lang==='yue'?yue:lang==='both'?en+' · '+yue:en);};
 const key='commonplace.search.v1.'+encodeURIComponent(id);let store=storage;try{store??=globalThis.localStorage;}catch{}
 let state=normalizeSearchState(),saved=[],remember=false,destroyed=false,sequence=0,debounce;
 try{const raw=store?.getItem(key);if(raw&&raw.length<200000){const data=JSON.parse(raw);remember=data.remember===true;if(remember)state=normalizeSearchState(data.state);if(Array.isArray(data.saved))saved=data.saved.filter(x=>x&&typeof x.name==='string'&&x.name.length<=80&&typeof x.query==='string'&&x.query.length<=SEARCH_LIMITS.pattern).slice(0,SEARCH_LIMITS.saved).map(x=>({...normalizeSearchState(x),name:x.name}));}}catch{}
 const evaluator=createSearchEvaluator({workerFactory});
 const el=(tag,text,attrs={})=>{const node=doc.createElement(tag);if(text)node.textContent=text;for(const [name,value]of Object.entries(attrs))node.setAttribute(name,value);return node;};
 const root=el('section',null,{class:'sb-root','data-search-builder':id,'aria-label':label??tr('search')});
 const style=el('style');style.textContent=`.sb-root{position:relative;min-width:0;max-width:100%}.sb-root .sb-row{display:flex;gap:.5rem;align-items:center;flex-wrap:wrap}.sb-root .sb-query{flex:1;min-width:100px}.sb-root input,.sb-root textarea,.sb-root button{font:inherit;max-width:100%;box-sizing:border-box}.sb-root button,.sb-root input:not([type=checkbox]){min-height:44px}.sb-root button{white-space:normal}.sb-root :focus-visible{outline:3px solid var(--primary,#6750a4);outline-offset:2px}.sb-root .sb-panel{position:relative;z-index:12;margin-top:.5rem;padding:1rem;border:1px solid currentColor;border-radius:16px;background:var(--surface,#fff);color:var(--on-surface,#202124);max-height:min(72vh,760px);overflow:auto;overscroll-behavior:contain;min-width:0;box-shadow:0 5px 20px #0002}.sb-root .sb-panel[hidden]{display:none}.sb-root label{display:block;margin:.5rem 0}.sb-root textarea,.sb-root .sb-wide{display:block;width:100%}.sb-root textarea{min-height:90px;resize:vertical}.sb-root fieldset{min-width:0;border:1px solid #8886;border-radius:8px;margin:.5rem 0;padding:.5rem}.sb-root pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:240px;overflow:auto}.sb-root .sb-help{font-size:.875em;overflow-wrap:anywhere}.sb-root .sb-status{min-height:1.5em}.sb-root .sb-check{display:flex;align-items:center;gap:.5rem;min-height:44px}.sb-root .sb-check input{width:20px;height:20px;flex:none}.sb-root details{margin:.5rem 0}.sb-root summary{cursor:pointer;min-height:44px;align-content:center}.sb-root .sb-matches{padding-inline-start:1.5rem;overflow-wrap:anywhere;max-height:220px;overflow:auto}@media(prefers-color-scheme:dark){.sb-root .sb-panel{background:var(--surface,#242329);color:var(--on-surface,#eee)}}@media(prefers-reduced-motion:reduce){.sb-root *{animation:none!important;transition:none!important}}`;
 root.append(style);const row=el('div',null,{class:'sb-row'}),query=el('input',null,{class:'sb-query',type:'search','aria-label':label??tr('search'),placeholder:label??tr('search'),'data-search-query':'',maxlength:SEARCH_LIMITS.pattern}),toggle=el('button',tr('builder'),{type:'button','aria-expanded':'false'});
 query.value=state.query;row.append(query,toggle);root.append(row);
 const status=el('div','',{class:'sb-status',role:'status','aria-live':'polite'});root.append(status);
 const panel=el('div',null,{class:'sb-panel',role:'region','aria-label':tr('builder'),id:'sb-panel-'+encodeURIComponent(id)});panel.hidden=true;toggle.setAttribute('aria-controls',panel.id);root.append(panel);
 const button=(key,action,parent=panel)=>{const b=el('button',tr(key),{type:'button'});b.addEventListener('click',action);parent.append(b);return b;};
 const field=(key,control,parent=panel)=>{const l=el('label',tr(key));l.append(control);parent.append(l);return control;};
 const check=(key,checked,action)=>{const l=el('label',null,{class:'sb-check'}),c=el('input',null,{type:'checkbox'});c.checked=checked;l.append(c,doc.createTextNode(tr(key)));panel.append(l);c.addEventListener('change',()=>action(c.checked));return c;};
 const report=(code,details={})=>{status.textContent=tr(code);onStatus({state:code,message:status.textContent,...details});};
 const persist=()=>{try{if(!store)throw Error();store.setItem(key,JSON.stringify({remember,state:remember?state:undefined,saved}));return true;}catch{report('storage');return false;}};
 function close(returnFocus=true){panel.hidden=true;toggle.setAttribute('aria-expanded','false');if(returnFocus)toggle.focus();}
 function open(){panel.hidden=false;toggle.setAttribute('aria-expanded','true');raw.focus();refresh();}
 toggle.addEventListener('click',()=>panel.hidden?open():close());button('close',()=>close());
 panel.append(el('p',tr('engine'),{class:'sb-help'}));
 const regex=check('regex',state.regex,value=>{state.regex=value;changed();});
 const raw=field('raw',el('input',null,{type:'text',class:'sb-wide',maxlength:SEARCH_LIMITS.pattern}));raw.value=state.query;
 const flags=field('flags',el('input',null,{type:'text',value:state.flags,maxlength:8,class:'sb-wide',spellcheck:'false'}));
 const flagHelp=el('p',pair('d indices · g all replacements · i ignore case · m multiline · s dot-all · u Unicode · v Unicode sets · y sticky','d 索引 · g 全部取代 · i 唔分大小寫 · m 多行 · s 點號包含換行 · u Unicode · v Unicode 集合 · y 黏連'),{class:'sb-help'});panel.append(flagHelp);
 button('escape',()=>{state.query=escapeLiteral(state.query);state.regex=true;changed();});
 const tokenDetails=el('details');tokenDetails.append(el('summary',tr('tokens')));panel.append(tokenDetails);
 for(const [en,yue,tokens]of SEARCH_TOKENS){const group=el('fieldset');group.append(el('legend',pair(en,yue)));const row=el('div',null,{class:'sb-row'});for(const [token,enLabel,yueLabel]of tokens){const b=el('button',token+' · '+pair(enLabel,yueLabel),{type:'button'});b.addEventListener('click',()=>{const start=raw.selectionStart??raw.value.length,end=raw.selectionEnd??start;const next=raw.value.slice(0,start)+token+raw.value.slice(end);if(next.length>SEARCH_LIMITS.pattern){report('pattern-limit');return;}state.query=next;state.regex=true;changed();raw.focus();raw.setSelectionRange(start+token.length,start+token.length);});row.append(b);}group.append(row);tokenDetails.append(group);}
 const examples=el('details');examples.append(el('summary',tr('examples')));panel.append(examples);
 for(const [en,yue,pattern,flagsValue,sampleValue]of [['Whole words','完整詞語','\\b(work|task)\\b','gi','Work on a task.'],['Named captures','具名擷取','(?<name>\\p{L}+)','gu','Hello 你好'],['Line starts','每行開頭','^.+','gm','First line\nSecond line'],['Zero-width context','零寬度上下文','(?=a)','g','banana']]){const b=el('button',pair(en,yue),{type:'button'});b.addEventListener('click',()=>{state={query:pattern,regex:true,flags:flagsValue};sample.value=sampleValue;changed();});examples.append(b);}
 const sample=field('sample',el('textarea',null,{maxlength:SEARCH_LIMITS.inputBytes,spellcheck:'false'}));
 const replacement=field('replacement',el('input',null,{type:'text',class:'sb-wide',maxlength:4096}));
 const explanation=el('details');explanation.append(el('summary',tr('explain')),el('p',tr('guide'),{class:'sb-help'}));panel.append(explanation);
 panel.append(el('h3',tr('preview')));const matches=el('ol',null,{class:'sb-matches'});panel.append(matches);
 panel.append(el('h3',tr('substitution')));const output=el('pre');panel.append(output);
 const storageDetails=el('details');storageDetails.append(el('summary',tr('saved')));panel.append(storageDetails);
 const patternName=field('name',el('input',null,{type:'text',maxlength:80,class:'sb-wide'}),storageDetails);const savedList=el('div');storageDetails.append(savedList);
 function renderSaved(){savedList.replaceChildren();for(const item of saved){const row=el('div',null,{class:'sb-row'});row.append(el('span',item.name));button('load',()=>{state=normalizeSearchState(item);changed();},row);button('remove',()=>{saved=saved.filter(x=>x!==item);persist();renderSaved();},row);savedList.append(row);}}
 button('save',()=>{const name=patternName.value.trim();if(!name){patternName.focus();patternName.setCustomValidity(pair('Enter a name','請輸入名稱'));patternName.reportValidity();return;}patternName.setCustomValidity('');const exists=saved.findIndex(x=>x.name===name);if(exists<0&&saved.length>=SEARCH_LIMITS.saved){report(pair('Saved pattern limit: 30. Delete one first.','儲存上限係 30 個模式，請先刪除一個。'));return;}const entry={...state,name};if(exists>=0)saved[exists]=entry;else saved.push(entry);if(persist())report('stored');renderSaved();},storageDetails);renderSaved();
 const rememberControl=check('remember',remember,value=>{remember=value;persist();});button('clear',()=>{remember=false;rememberControl.checked=false;state=normalizeSearchState();persist();changed();});
 button('copy',async()=>{try{await navigator.clipboard.writeText(JSON.stringify({pattern:state.query,flags:state.flags,regex:state.regex}));report('copied');}catch{report('copyFailed');}});
 button('export',()=>{const url=URL.createObjectURL(new Blob([JSON.stringify({schemaVersion:1,engine:'ECMAScript',pattern:state.query,flags:state.flags,regex:state.regex},null,2)],{type:'application/json'}));const a=el('a',null,{href:url,download:'search-pattern.json'});a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
 panel.append(el('p',tr('gaps'),{class:'sb-help'}));
 function changed(){query.value=state.query;raw.value=state.query;regex.checked=state.regex;flags.value=state.flags;if(remember)persist();clearTimeout(debounce);evaluator.cancel();sequence++;debounce=setTimeout(refresh,100);}
 query.addEventListener('input',()=>{state.query=query.value;changed();});raw.addEventListener('input',()=>{state.query=raw.value;changed();});flags.addEventListener('input',()=>{state.flags=flags.value;changed();});sample.addEventListener('input',changed);replacement.addEventListener('input',changed);
 async function refresh(){if(destroyed)return;clearTimeout(debounce);const run=++sequence;let items,request;matches.replaceChildren();output.textContent='';report('running');
  try{items=getItems();request=prepareSearchRequest(state,items,sample.value,replacement.value);}catch(error){report(error.message);onResults([],{ok:false,code:error.message});return;}
  // An empty query selects every item by definition; it never needs a worker, so a slow cold start cannot hide content.
  const result=state.query===''&&!replacement.value?{ok:true,indices:items.map((_,i)=>i),matches:[],output:'',elapsedMs:0}:await evaluator.evaluate(request);if(destroyed||run!==sequence||result.code==='cancelled')return;
  if(!result.ok){raw.setAttribute('aria-invalid','true');report(result.code,{detail:result.detail});onResults([],result);return;}
  raw.removeAttribute('aria-invalid');const selected=result.indices.map(i=>items[i]);status.textContent=tr('count')+': '+selected.length+' / '+items.length+' · '+result.elapsedMs.toFixed(2)+' ms';onStatus({state:'ready',message:status.textContent,count:selected.length,total:items.length});onResults(selected,result);
  if(!result.matches.length)matches.append(el('li',tr('empty')));
  for(const match of result.matches){matches.append(el('li',JSON.stringify(match)));}if(result.truncated)matches.append(el('li',tr('truncated')));output.textContent=result.output+(result.outputTruncated?'\n'+tr('truncated'):'');
 }
 const onOutside=e=>{if(!panel.hidden&&!root.contains(e.target))close(false);};const onEscape=e=>{if(e.key==='Escape'&&!panel.hidden){e.stopPropagation();e.preventDefault();close();}};
 doc.addEventListener('pointerdown',onOutside);root.addEventListener('keydown',onEscape);
 root.searchBuilder={refresh,setQuery(value,options={}){state={...state,...options,query:String(value)};changed();},getState(){return {...state};},open,close,destroy(){destroyed=true;sequence++;clearTimeout(debounce);evaluator.cancel();doc.removeEventListener('pointerdown',onOutside);root.removeEventListener('keydown',onEscape);}};
 queueMicrotask(refresh);return root;
}
