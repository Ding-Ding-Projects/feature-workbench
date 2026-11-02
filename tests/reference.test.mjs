import {test} from 'node:test';
import assert from 'node:assert/strict';
import {renderMarkdown} from '../scripts/build-reference.mjs';
test('bundled reference renders headings lists and code without granting markup privileges',()=>{const html=renderMarkdown('# Title\n\n- One\n- Two\n\n```js\n<script>alert(1)</script>\n```');assert.match(html,/<h1>Title<\/h1>/);assert.match(html,/<ul>/);assert.match(html,/&lt;script&gt;/);assert.doesNotMatch(html,/<script>/);});
