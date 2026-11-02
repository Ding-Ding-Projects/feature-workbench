import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateVocabulary,parseBoundedJSON} from '../src/validation.js';
test('accepts empty dynamic inventory and neutral Unicode entries',()=>{assert.equal(Object.keys(validateVocabulary('{"schemaVersion":1,"entries":{}}').entries).length,0); assert.equal(validateVocabulary(JSON.stringify({schemaVersion:1,entries:{'Label':'Example'}})).entries.Label,'Example');});
for(const [name,input] of Object.entries({duplicate:'{"schemaVersion":1,"entries":{"x":"a","x":"b"}}',unsafe:'{"schemaVersion":1,"entries":{"__proto__":"x"}}',version:'{"schemaVersion":2,"entries":{}}',unknown:'{"schemaVersion":1,"entries":{},"other":0}',nonstring:'{"schemaVersion":1,"entries":{"x":2}}',malformed:'{',empty:'',longkey:JSON.stringify({schemaVersion:1,entries:{['a'.repeat(161)]:'x'}}),longvalue:JSON.stringify({schemaVersion:1,entries:{a:'x'.repeat(1001)}}),large:' '.repeat(262145),depth:'['.repeat(10)+'0'+']'.repeat(10)})) test(`rejects ${name} without leaking content`,()=>assert.throws(()=>validateVocabulary(input)));
test('escaped equivalent duplicate keys rejected',()=>assert.throws(()=>parseBoundedJSON('{"a":1,"\\u0061":2}')));
test('allows Unicode code-point limits',()=>assert.ok(validateVocabulary(JSON.stringify({schemaVersion:1,entries:{['😀'.repeat(160)]:'😀'.repeat(1000)}}))));

test('rejects non-JSON whitespace and trailing tokens',()=>{for(const text of ['\u00a0{}','{} true','[1,]','{\"a\":1,}'])assert.throws(()=>parseBoundedJSON(text));});
