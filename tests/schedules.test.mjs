import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultScheduleConfig,validateScheduleConfig,evaluateSchedule,ScheduleError} from '../src/schedules.js';
const rule = (patch = {}) => ({id:'night',label:'Night',enabled:true,start:'20:00',end:'07:00',weekdays:[0,1,2,3,4,5,6],theme:'dark',priority:0,...patch});
const config = (rules = [rule()], patch = {}) => ({version:1,enabled:true,timeZone:'UTC',rules,...patch});
const at = (c,iso) => evaluateSchedule(c,new Date(iso));
const off = {theme:null,ruleId:null};
test('default is disabled and creates independent bounded state',() => {
  assert.deepEqual(defaultScheduleConfig(),{version:1,enabled:false,timeZone:'UTC',rules:[]});
  assert.deepEqual(at(defaultScheduleConfig(),'2026-11-02T23:00Z'),off);
  const input = config(), valid = validateScheduleConfig(input); valid.rules[0].weekdays.pop(); assert.equal(input.rules[0].weekdays.length,7);
  assert.deepEqual(at(config([]),'2026-11-02T23:00Z'),off);
  assert.deepEqual(at(config([rule({enabled:false})]),'2026-11-02T23:00Z'),off);
});
test('same-day exact inclusive start/exclusive end and seconds',() => {
  const c = config([rule({start:'09:00',end:'17:00',weekdays:[1]})]);
  for (const [clock,match] of [['08:59:59',false],['09:00:00',true],['16:59:59',true],['17:00:00',false]]) assert.equal(at(c,`2026-11-02T${clock}Z`).theme,match?'dark':null);
  assert.deepEqual(at(c,'2026-11-03T10:00Z'),off);
});
test('overnight uses starting weekday including Sunday wrap',() => {
  const c = config([rule({weekdays:[0]})]);
  for (const [iso,match] of [['2026-11-01T19:59Z',false],['2026-11-01T20:00Z',true],['2026-11-02T00:00Z',true],['2026-11-02T06:59Z',true],['2026-11-02T07:00Z',false],['2026-11-02T20:00Z',false]]) assert.equal(at(c,iso).theme,match?'dark':null);
});
test('inclusive optional date bounds anchor overnight to start date across year',() => {
  const c = config([rule({startDate:'2025-12-31',endDate:'2025-12-31'})]);
  assert.deepEqual(at(c,'2025-12-31T02:00Z'),off);
  assert.equal(at(c,'2026-01-01T02:00Z').theme,'dark');
  assert.deepEqual(at(c,'2026-01-01T20:00Z'),off);
});
test('highest priority wins, equal priority later array order wins; no mutation',() => {
  const c = config([rule({priority:5}),rule({id:'day',theme:'light',priority:5})]);
  const snapshot = JSON.stringify(c); assert.equal(at(c,'2026-11-02T21:00Z').ruleId,'day'); assert.equal(JSON.stringify(c),snapshot);
  c.rules[0].priority = 6; assert.equal(at(c,'2026-11-02T21:00Z').ruleId,'night');
  c.rules[0].enabled = false; assert.equal(at(c,'2026-11-02T21:00Z').ruleId,'day');
});
test('IANA timezone and non-hour offset use local date and clock',() => {
  const c = config([rule({start:'09:00',end:'10:00',weekdays:[1]})],{timeZone:'Asia/Kathmandu'});
  assert.equal(at(c,'2026-11-02T03:15Z').theme,'dark');
  assert.deepEqual(at(c,'2026-11-02T04:15Z'),off);
  const tokyo = config([rule({start:'00:00',end:'01:00',weekdays:[1]})],{timeZone:'Asia/Tokyo'});
  assert.equal(at(tokyo,'2026-11-01T15:00Z').theme,'dark');
});
test('DST spring skipped times do not execute',() => {
  const c = config([rule({start:'02:00',end:'03:00'})],{timeZone:'America/New_York'});
  for (const iso of ['2026-03-08T06:59:59Z','2026-03-08T07:00:00Z','2026-03-08T07:30:00Z']) assert.deepEqual(at(c,iso),off);
  c.rules[0].end = '04:00'; assert.equal(at(c,'2026-03-08T07:00Z').theme,'dark');
});
test('DST repeated times match twice, both end boundaries excluded',() => {
  const c = config([rule({start:'01:00',end:'01:30'})],{timeZone:'America/New_York'});
  for (const iso of ['2026-11-01T05:00Z','2026-11-01T05:29Z','2026-11-01T06:00Z','2026-11-01T06:29Z']) assert.equal(at(c,iso).theme,'dark');
  for (const iso of ['2026-11-01T05:30Z','2026-11-01T06:30Z']) assert.deepEqual(at(c,iso),off);
});
test('strict configuration rejects unknown versions, fields, sources, credentials, zones and overflow',() => {
  for (const bad of [null,[],{},config([],{version:2}),config([],{enabled:1}),config([],{token:'secret'}),config([],{timeZone:'Invalid/Zone'}),config([],{timeZone:'+01:00'}),config([],{timeZone:''}),config([],{rules:{}}),config(Array.from({length:33},(_,i) => rule({id:`r${i}`}))),config([rule(),rule()])]) assert.throws(() => validateScheduleConfig(bad),ScheduleError);
  assert.equal(validateScheduleConfig(config(Array.from({length:32},(_,i) => rule({id:`r${i}`})))) .rules.length,32);
});
test('rule validation negative matrix and optional date leap-year boundaries',() => {
  for (const patch of [{id:''},{id:'bad id'},{label:' '},{label:'a'.repeat(101)},{enabled:'yes'},{start:'9:00'},{start:'24:00'},{end:'07:60'},{end:'20:00'},{weekdays:[]},{weekdays:[7]},{weekdays:[-1]},{weekdays:[1,1]},{weekdays:['1']},{weekdays:[1.5]},{priority:-1},{priority:101},{priority:1.5},{theme:'system'},{startDate:'2026-02-29'},{endDate:'2026-04-31'},{startDate:'2026-02-02',endDate:'2026-02-01'},{startDate:'not-date'},{source:'api'},{token:'private'}]) assert.throws(() => validateScheduleConfig(config([rule(patch)])),ScheduleError,JSON.stringify(patch));
  assert.equal(validateScheduleConfig(config([rule({startDate:'2024-02-29',endDate:'2024-02-29'})])).rules[0].startDate,'2024-02-29');
  assert.throws(() => evaluateSchedule(config(),new Date(NaN)),ScheduleError);
  assert.throws(() => evaluateSchedule(config(),'2026-01-01'),ScheduleError);
});
