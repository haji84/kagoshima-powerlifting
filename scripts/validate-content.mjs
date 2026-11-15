import fs from 'node:fs';
import assert from 'node:assert/strict';

const collections = ['news','events','results','records','clubs'];
const required = {
  news: ['date','category','title'],
  events: ['date','title','venue'],
  results: ['date','title','url'],
  records: ['category','equipment','ageGroup','weightClass','lift','athlete','weightKg','date','sourceUrl'],
  clubs: ['name','area']
};
function isDate(v) {
  if (typeof v !== 'string' || !/^\\d{4}-\\d{2}-\\d{2}$/.test(v)) return false;
  const d = new Date(v + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0,10) === v;
}
function validUrl(v) {
  if (v === undefined || v === '') return true;
  if (typeof v !== 'string') return false;
  try { return ['http:', 'https:'].includes(new URL(v).protocol); } catch { return false; }
}
for (const name of collections) {
  const data = JSON.parse(fs.readFileSync(new URL('../content/' + name + '.json', import.meta.url), 'utf8'));
  assert.ok(data && Array.isArray(data.items), name + ': items must be array');
  data.items.forEach((item, index) => {
    for (const field of required[name]) {
      assert.ok(item[field] !== undefined && item[field] !== null && item[field] !== '', name + '[' + index + '].' + field + ' is required');
    }
    if ('date' in item) assert.ok(isDate(item.date), name + '[' + index + '] invalid date');
    for (const field of ['url','sourceUrl']) if (field in item) assert.ok(validUrl(item[field]), name + '[' + index + '] unsafe URL');
    if (name === 'records') assert.ok(typeof item.weightKg === 'number' && item.weightKg > 0, 'record must have positive kg');
  });
  console.log('PASS ' + name + ' (' + data.items.length + ')');
}
const index = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
assert.ok(index.includes('assets/cms-content.js'), 'index must load CMS content renderer');
for (const selector of ['id="news"', 'id="events"', 'id="records"', 'class="clubsPanel"']) {
  assert.ok(index.includes(selector), 'missing target ' + selector);
}
console.log('PASS static site integration');
