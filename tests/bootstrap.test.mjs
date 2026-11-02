import {powershellEnvironment} from '../scripts/powershell-environment.mjs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const read=path=>readFileSync(path,'utf8');
test('bootstrap inventory covers actual build tools with pinned upstream digests',()=>{
 const manifest=JSON.parse(read('scripts/build-tools.json'));
 assert.deepEqual(manifest.tools.map(t=>t.name).sort(),['git','node']);
 assert.deepEqual(manifest.projectPackages,[]);
 for(const tool of manifest.tools){
  assert.match(tool.sha256,/^[a-f0-9]{64}$/);
  assert.match(tool.executableSha256,/^[a-f0-9]{64}$/);
  assert.ok(['nodejs.org','github.com'].includes(new URL(tool.url).hostname));
  assert.ok(tool.url.includes(tool.version));
 }
 assert.equal(JSON.parse(read('package.json')).engines.node,'>=20');
});
test('Windows launcher supports all silent aliases and preserves exit result',()=>{
 const batch=read('build.bat');
 for(const token of ['/s','--silent','%SILENT%','%~dp0scripts\\build.ps1','exit /b %RC%']) assert.ok(batch.includes(token),token);
 const script=read('scripts/build.ps1');
 assert.match(script,/if \(!\$Silent -and !\$admin\)/);
 assert.match(script,/-Verb RunAs -Wait -PassThru/);
 assert.match(script,/exit \$child.ExitCode/);
 assert.match(script,/if \(\$env:SILENT -eq '1'\)/);
 assert.match(script,/\$ElevatedChild -and !\$admin/);
});
test('installer no-target route cannot pretend to package or launch',()=>{
 const script=read('build-installer.bat');
 assert.match(script,/exit \/b 2/);
 assert.match(script,/No installer was created/);
 assert.doesNotMatch(script,/^\s*(call|powershell|node|start)\b/im);
});
const shell=process.env.POWERSHELL_EXE || (process.platform==='win32'?'powershell.exe':'pwsh');
const shellEnv=powershellEnvironment();
const probe=spawnSync(shell,['-NoProfile','-Command','$PSVersionTable.PSVersion.ToString()'],{encoding:'utf8',env:shellEnv});
test('PowerShell parser and offline hash, extraction, version and phase regressions',{skip:probe.error?'PowerShell unavailable; Windows runtime remains unverified':false},()=>{
 const parser=spawnSync(shell,['-NoProfile','-Command',`$bad=$false; Get-ChildItem scripts/*.ps1,tests/bootstrap-offline.ps1 | ForEach-Object { $t=$null; $e=$null; [void][System.Management.Automation.Language.Parser]::ParseFile($_.FullName,[ref]$t,[ref]$e); if($e.Count){$e | Out-String | Write-Host; $bad=$true} }; if($bad){exit 1}`],{encoding:'utf8',env:shellEnv});
 assert.equal(parser.status,0,parser.stdout+parser.stderr);
 const env={...shellEnv}; delete env.NODE_TEST_CONTEXT;
 const run=spawnSync(shell,['-NoProfile','-File','tests/bootstrap-offline.ps1','-Node',process.execPath],{encoding:'utf8',env});
 assert.equal(run.status,0,run.stdout+run.stderr);
});
