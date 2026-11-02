import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
test('build provenance never substitutes launch time or file mtime',()=>{const source=readFileSync('scripts/build.mjs','utf8');assert.match(source,/git.*status.*--porcelain/);assert.match(source,/if\(!dirty\)updatedAt=/);assert.match(source,/provenance:updatedAt\?'clean-source-commit':'unavailable'/);assert.doesNotMatch(source,/new Date\(\)|Date\.now|mtime/);});

import vm from 'node:vm';
test('live provenance bypasses stale browser metadata cache',async()=>{
 const source=readFileSync('src/app.js','utf8');
 const statement=source.split('\n').find(line=>line.startsWith("fetch('./build-info.json'"));
 let request,rendered=0;
 const context=vm.createContext({build:null,fetch:(url,options)=>{request={url,options};return Promise.resolve({ok:true,json:async()=>({version:'test',updatedAt:'2026-11-02T21:20:07Z'})});},render:()=>rendered++});
 await vm.runInContext(statement,context);
 assert.equal(request.url,'./build-info.json');assert.equal(request.options.cache,'no-store');
 assert.equal(context.build.version,'test');assert.equal(rendered,1);
});
