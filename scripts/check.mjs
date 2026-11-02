import {readFile,readdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
for(const name of await readdir('src'))if(name.endsWith('.js'))execFileSync(process.execPath,['--check',`src/${name}`]);
for(const path of ['src/index.html','src/app.js','src/styles.css','src/i18n.js'])await readFile(path);
console.log('Syntax and required entrypoint checks passed. Not browser evidence.');
