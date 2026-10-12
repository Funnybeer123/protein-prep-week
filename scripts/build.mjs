// Builds index.html (full document for GitHub Pages) and recipes/<id>.html
// (one page per recipe with schema.org Recipe JSON-LD so Samsung Food can import it).
import { createRequire } from 'node:module';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = createRequire(import.meta.url)(join(root, 'data.js'));
const fragment = readFileSync(join(root, 'src/page.html'), 'utf8');
const LABELS = JSON.parse(readFileSync(join(root, 'labels.json'), 'utf8'));
const NUTRITION = createRequire(import.meta.url)(join(root, 'nutrition.js'));
writeFileSync(join(root, 'labels.js'), 'const LABELS = ' + JSON.stringify(LABELS) + ';\n');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const doc = (body, extraHead = '') => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${extraHead}
${body}
</body>
</html>
`;

// index.html: the fragment already starts with <title> and <style>; split head-ish part from body at the first <div.
const i = fragment.indexOf('<div class="bar">');
const head = fragment.slice(0, i), body = fragment.slice(i);
writeFileSync(join(root, 'index.html'), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Weekly high-protein meal prep plans with a Walmart-ready grocery list and Samsung Food recipe pages.">
${head}
<style>body{margin:0}</style>
</head>
<body>
${body}
</body>
</html>
`);

const fmt = q => { const r = Math.round(q * 4) / 4; return r % 1 === 0 ? String(r) : r.toFixed(2).replace(/0+$/, ''); };
const unit = (u, q) => ({ cup: q === 1 ? 'cup' : 'cups', each: '', clove: q === 1 ? 'clove' : 'cloves', can: q === 1 ? 'can' : 'cans', pint: q === 1 ? 'pint' : 'pints', bunch: 'bunch', scoop: q === 1 ? 'scoop' : 'scoops' }[u] || u);

mkdirSync(join(root, 'recipes'), { recursive: true });
const mealLabel = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' };
for (const r of DATA.recipes) {
  const M = NUTRITION.recipeMacros(r, DATA.catalog, LABELS); const n = M.n;
  const ings = r.ing.map(([k, q]) => `${fmt(q)} ${unit(DATA.catalog[k].unit, q)} ${DATA.catalog[k].name}`.replace(/\s+/g, ' ').trim());
  const ld = {
    '@context': 'https://schema.org', '@type': 'Recipe', name: r.name,
    description: `High-protein ${r.meal}: ${n[1]} g protein and ${n[0]} kcal per serving${M.source === 'label' ? ' (from ingredient labels)' : ' (estimate)'}. ${r.tags.join(', ')}.`,
    recipeYield: `${r.baseServings} servings`, recipeCategory: mealLabel[r.meal], recipeCuisine: 'American',
    keywords: ['high protein', 'meal prep', ...r.tags].join(', '),
    prepTime: `PT${Math.max(5, r.active - 5)}M`, cookTime: `PT${Math.max(0, r.time - Math.max(5, r.active - 5))}M`, totalTime: `PT${r.time}M`,
    nutrition: { '@type': 'NutritionInformation', servingSize: '1 serving', calories: `${n[0]} calories`, proteinContent: `${n[1]} g`, carbohydrateContent: `${n[2]} g`, fatContent: `${n[3]} g` },
    recipeIngredient: ings,
    recipeInstructions: r.steps.map((t, i) => ({ '@type': 'HowToStep', position: i + 1, text: t })),
    author: { '@type': 'Organization', name: 'Protein Prep Week' },
  };
  const html = doc(`<title>${esc(r.name)} · Protein Prep Week</title>
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
<style>
  :root { --bg:#f4f6f3; --fg:#16211a; --fg-2:#4b5a50; --line:#d3dbd1; --accent:#1e7a58; --pro:#b4461a; }
  @media (prefers-color-scheme: dark) { :root { --bg:#0f1512; --fg:#e9eee8; --fg-2:#b4c0b7; --line:#2f3c33; --accent:#4fc08f; --pro:#f0905f; color-scheme: dark; } }
  body { margin:0; background:var(--bg); color:var(--fg); font-family: system-ui, sans-serif; line-height:1.5; }
  main { max-width: 680px; margin: 0 auto; padding: 24px 16px 48px; }
  h1 { font-size: 1.8rem; line-height: 1.15; margin: 0 0 6px; }
  .meta { color: var(--fg-2); font-size: 0.9rem; margin-bottom: 18px; }
  .macros { display:flex; flex-wrap:wrap; gap: 6px 16px; font-size: 0.9rem; margin-bottom: 20px; }
  .macros b.pro { color: var(--pro); }
  .macros .src { color: var(--fg-2); font-size: 0.8rem; }
  h2 { font-size: 1.1rem; margin: 20px 0 8px; }
  ul, ol { padding-left: 20px; margin: 0; }
  li { margin-bottom: 4px; }
  a { color: var(--accent); }
  .back { font-size: 0.85rem; display:inline-block; margin-bottom: 16px; }
</style>
</head>
<body>
<main>
  <a class="back" href="../index.html#recipes">← Protein Prep Week</a>
  <h1>${esc(r.name)}</h1>
  <p class="meta">${mealLabel[r.meal]} · serves ${r.baseServings} · ${r.time} min total, ${r.active} min hands-on · ${esc(r.tags.join(' · '))}</p>
  <div class="macros"><span><b>${n[0]}</b> kcal</span><span><b class="pro">${n[1]} g</b> protein</span><span><b>${n[2]} g</b> carbs</span><span><b>${n[3]} g</b> fat</span><span class="src">${M.source === 'label' ? 'from ingredient labels' : 'estimate'}</span></div>
  <h2>Ingredients</h2>
  <ul>${ings.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
  <h2>Steps</h2>
  <ol>${r.steps.map(t => `<li>${esc(t)}</li>`).join('')}</ol>
</main>`);
  writeFileSync(join(root, 'recipes', r.id + '.html'), html);
}
console.log(`built index.html and ${DATA.recipes.length} recipe pages`);
