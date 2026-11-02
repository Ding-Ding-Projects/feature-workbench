import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditInventory} from '../scripts/acceptance.mjs';
test('all required features remain inventoried independently of runtime discovery',async()=>{
 const ids=JSON.parse(await readFile('src/required-ids.json','utf8'));
 const rows=JSON.parse(await readFile('src/features.json','utf8'));
 // Reviewed 2026-11-02: add the independently required local Base64 toolkit (114 to 115).
 assert.equal(ids.length,115,'Pinned contract baseline must be reviewed before changing');
 const result=auditInventory(ids,rows); assert.deepEqual(result.defects,[]);
 for(const id of ids)assert.equal(auditInventory(ids,rows.filter(r=>r.id!==id)).valid,false,`Removed ${id} must fail`);
 for(const row of rows.filter(r=>r.status==='verified')) for(const proof of row.evidence) await readFile(proof.path);
});
