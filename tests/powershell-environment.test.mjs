import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {powershellEnvironment} from '../scripts/powershell-environment.mjs';
test('telemetry opt-out is inherited before child startup without changing the parent',()=>{
 const parent={PATH:process.env.PATH,POWERSHELL_TELEMETRY_OPTOUT:'0'},env=powershellEnvironment(parent);
 assert.equal(parent.POWERSHELL_TELEMETRY_OPTOUT,'0');assert.equal(env.POWERSHELL_TELEMETRY_OPTOUT,'1');
 const child=spawnSync(process.execPath,['-e',"process.stdout.write(process.env.POWERSHELL_TELEMETRY_OPTOUT === '1' ? 'opted-out' : 'missing')"],{env,encoding:'utf8'});
 assert.equal(child.status,0);assert.equal(child.stdout,'opted-out');
});
test('Windows launcher opts out before PowerShell begins, rather than inside a profile',()=>{
 const source=readFileSync(new URL('../build.bat',import.meta.url),'utf8');
 const setting=source.indexOf('set "POWERSHELL_TELEMETRY_OPTOUT=1"');
 assert.ok(setting>=0);assert.ok(setting<source.indexOf('powershell.exe'));
});
