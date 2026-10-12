// Pulls Nutrition Facts for every catalog item from USDA FoodData Central
// (Branded = the label the manufacturer filed, keyed by UPC; produce falls back
// to USDA Foundation / SR Legacy data). Writes labels.json; `node scripts/build.mjs` then
// regenerates labels.js and the recipe pages.
//
//   FDC_API_KEY=xxxx node scripts/pull-labels.mjs            # all items
//   FDC_API_KEY=xxxx node scripts/pull-labels.mjs eggs rice  # just these keys
//   node scripts/pull-labels.mjs --review                    # print what was matched
//
// Free key (instant): https://api.nal.usda.gov/fdc/api-key-signup . DEMO_KEY works for a
// few dozen requests an hour. Network access to api.nal.usda.gov is required.
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = createRequire(import.meta.url)(join(root, 'data.js'));
const file = join(root, 'labels.json');
const labels = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
const args = process.argv.slice(2);
const KEY = process.env.FDC_API_KEY || 'DEMO_KEY';
const API = 'https://api.nal.usda.gov/fdc/v1';

if (args.includes('--review')) {
  for (const c of Object.values(DATA.catalog)) {
    const L = labels[c.key];
    console.log(`${c.key.padEnd(22)} ${L ? `${L.source.padEnd(10)} ${L.description} ${L.brand ? '(' + L.brand + ')' : ''} upc=${L.upc || '-'} per100g=${L.per100g.kcal}kcal/${L.per100g.p}p/${L.per100g.c}c/${L.per100g.f}f serving=${L.servingText || L.servingG + 'g'}` : 'NOT PULLED'}`);
  }
  process.exit(0);
}

const nutrient = (food, ids) => {
  for (const n of food.foodNutrients || []) if (ids.includes(n.nutrientId || n.nutrient?.id)) return n.value ?? n.amount ?? 0;
  return 0;
};
// Nutrient IDs: Energy kcal 1008 (also 2047/2048 Atwater), Protein 1003, Fat 1004, Carbs 1005
const per100 = (food) => ({
  kcal: Math.round(nutrient(food, [1008, 2048, 2047]) * 10) / 10,
  p: Math.round(nutrient(food, [1003]) * 10) / 10,
  c: Math.round(nutrient(food, [1005]) * 10) / 10,
  f: Math.round(nutrient(food, [1004]) * 10) / 10,
});

const search = async (query, dataType, brandOwner) => {
  const u = new URL(API + '/foods/search');
  u.searchParams.set('api_key', KEY); u.searchParams.set('query', query);
  u.searchParams.set('dataType', dataType); u.searchParams.set('pageSize', '8');
  if (brandOwner) u.searchParams.set('brandOwner', brandOwner);
  const r = await fetch(u);
  if (r.status === 429) { console.log('rate limited; waiting 60s'); await new Promise(s => setTimeout(s, 60000)); return search(query, dataType, brandOwner); }
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} for ${query}`);
  return (await r.json()).foods || [];
};

const score = (food, q) => {
  const d = (food.description + ' ' + (food.brandName || '') + ' ' + (food.brandOwner || '')).toLowerCase();
  let s = 0; for (const w of q.toLowerCase().split(/\s+/)) if (d.includes(w)) s++;
  if (/great value/i.test(q) && /wal-?mart/i.test(food.brandOwner || '')) s += 2;
  return s;
};

const keys = args.length ? args : Object.values(DATA.catalog).filter(c => !c.skip).map(c => c.key);
for (const key of keys) {
  const c = DATA.catalog[key]; if (!c || c.skip) continue;
  try {
    let foods = c.fresh ? await search(c.q, 'Foundation,SR Legacy') : await search(c.q, 'Branded');
    if (!foods.length && !c.fresh) foods = await search(c.q.replace(/^great value /i, ''), 'Branded');
    if (!foods.length) { console.log(`${key}: no match`); continue; }
    foods.sort((a, b) => score(b, c.q) - score(a, c.q));
    const f = foods[0];
    labels[key] = {
      source: f.dataType, fdcId: f.fdcId, description: f.description,
      brand: f.brandName || f.brandOwner || undefined, upc: f.gtinUpc || undefined,
      servingG: f.servingSize && /g/i.test(f.servingSizeUnit || '') ? f.servingSize : undefined,
      servingText: f.householdServingFullText || undefined,
      per100g: per100(f), pulled: new Date().toISOString().slice(0, 10),
      alternates: foods.slice(1, 4).map(x => ({ fdcId: x.fdcId, description: x.description, brand: x.brandName || x.brandOwner })),
    };
    console.log(`${key}: ${f.dataType} · ${f.description} ${f.brandName ? '(' + f.brandName + ')' : ''} · ${labels[key].per100g.kcal} kcal/100g`);
    writeFileSync(file, JSON.stringify(labels, null, 1));
    await new Promise(s => setTimeout(s, KEY === 'DEMO_KEY' ? 2500 : 250));
  } catch (e) { console.log(`${key}: ${e.message}`); }
}
console.log('wrote labels.json');
