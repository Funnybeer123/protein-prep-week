/* Protein Prep Week — app logic. Depends on data.js (window DATA). */
(() => {
  const { catalog, recipes, weeks, snacks } = DATA;
  const LBL = (typeof LABELS !== 'undefined' && LABELS) || {};
  const macrosOf = (r) => NUTRITION.recipeMacros(r, catalog, LBL);
  const byId = Object.fromEntries(recipes.map(r => [r.id, r]));
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------- storage ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem('ppw:' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('ppw:' + k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
  };

  // ---------- week math ----------
  const isoWeek = (d) => {
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - day);
    const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    return Math.ceil(((t - y0) / 864e5 + 1) / 7);
  };
  const mondayOf = (d) => { const m = new Date(d); const day = (m.getDay() + 6) % 7; m.setDate(m.getDate() - day); m.setHours(0, 0, 0, 0); return m; };
  const fmtDate = (d) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  // ---------- state ----------
  const today = new Date();
  const thisWeekNum = isoWeek(today);
  const state = {
    offset: 0,                           // weeks from today
    people: store.get('people', 1),
    variety: store.get('variety', 3),    // number of dinner recipes to cook
    baseUrl: store.get('baseUrl', 'https://protein-prep-week.azurewebsites.net/recipes/'),
    wmIds: store.get('wmIds', {}),
    tab: 'plan',
  };
  const weekKey = () => { const m = mondayOf(today); m.setDate(m.getDate() + state.offset * 7); return m.toISOString().slice(0, 10); };
  const weekMonday = () => { const m = mondayOf(today); m.setDate(m.getDate() + state.offset * 7); return m; };
  const rotationIndex = () => (((thisWeekNum - 1 + state.offset) % weeks.length) + weeks.length) % weeks.length;

  // Per-week overrides: swaps + servings + "have it" checks + pantry includes.
  const wk = () => store.get('week:' + weekKey(), { swaps: {}, servings: {}, have: {}, need: {} });
  const saveWk = (o) => store.set('week:' + weekKey(), o);

  // ---------- plan building ----------
  const defaultServings = (meal, count) => Math.max(1, Math.ceil(state.people * 5 / count));
  const plan = () => {
    const w = weeks[rotationIndex()];
    const o = wk();
    const dinnerIds = w.dinners.slice(0, state.variety).map((id, i) => o.swaps['d' + i] || id);
    const breakfastIds = w.breakfasts.map((id, i) => o.swaps['b' + i] || id);
    const lunchIds = w.lunches.map((id, i) => o.swaps['l' + i] || id);
    const mk = (ids, meal, prefix) => ids.map((id, i) => {
      const r = byId[id];
      const servings = o.servings[id] || defaultServings(meal, ids.length);
      return { r, slot: prefix + i, servings, f: servings / r.baseServings };
    });
    return { week: w, dinners: mk(dinnerIds, 'dinner', 'd'), breakfasts: mk(breakfastIds, 'breakfast', 'b'), lunches: mk(lunchIds, 'lunch', 'l') };
  };
  const allSlots = (p) => [...p.breakfasts, ...p.lunches, ...p.dinners];

  // ---------- quantities ----------
  const fmtQty = (q) => {
    if (q >= 10) return String(Math.round(q));
    const whole = Math.floor(q), frac = q - whole;
    const map = [[0, ''], [0.25, '¼'], [0.333, '⅓'], [0.5, '½'], [0.666, '⅔'], [0.75, '¾'], [1, '']];
    let best = map[0];
    for (const m of map) if (Math.abs(m[0] - frac) < Math.abs(best[0] - frac)) best = m;
    let w = whole; if (best[0] === 1) { w += 1; }
    const s = (w ? w : '') + (best[1] || '');
    return s || '0';
  };
  const unitLabel = (u, q) => ({ lb: 'lb', oz: 'oz', cup: q === 1 ? 'cup' : 'cups', tbsp: 'tbsp', tsp: 'tsp', each: '', clove: q === 1 ? 'clove' : 'cloves', can: q === 1 ? 'can' : 'cans', pint: q === 1 ? 'pint' : 'pints', bunch: q === 1 ? 'bunch' : 'bunches', scoop: q === 1 ? 'scoop' : 'scoops', slice: 'slices' }[u] || u);

  const grocery = (p) => {
    const totals = {};
    for (const s of allSlots(p)) for (const [k, q] of s.r.ing) {
      totals[k] = totals[k] || { item: catalog[k], qty: 0, recipes: [] };
      totals[k].qty += q * s.f; totals[k].recipes.push(s.r.name);
    }
    const rows = Object.values(totals).map(t => {
      const packs = Math.max(1, Math.ceil(t.qty / t.item.pack - 0.02));
      return Object.assign(t, { packs });
    });
    rows.sort((a, b) => a.item.aisle.localeCompare(b.item.aisle) || a.item.name.localeCompare(b.item.name));
    return rows;
  };
  const AISLE_ORDER = ['Produce', 'Meat & Seafood', 'Deli', 'Dairy & Eggs', 'Frozen', 'Pantry'];

  // ---------- Walmart ----------
  const walmartSearch = (q) => 'https://www.walmart.com/search?q=' + encodeURIComponent(q);
  const parseWalmartId = (s) => { const m = String(s).trim().match(/(\d{6,12})(?:\?|$|\/)/) || String(s).trim().match(/^(\d{6,12})$/); return m ? m[1] : ''; };
  const cartLink = (items) => items.length ? 'https://affil.walmart.com/cart/addToCart?items=' + items.map(i => i.id + '|' + i.qty).join(',') : '';

  // ---------- render helpers ----------
  const macroStrip = (r) => {
    const m = macrosOf(r); const n = m.n;
    const badge = m.source === 'label'
      ? `<span class="badge ok" title="Computed from each ingredient's Nutrition Facts${m.usda ? `; ${m.usda} unpackaged item${m.usda > 1 ? 's' : ''} use USDA data` : ''}">from labels</span>`
      : `<span class="badge" title="${esc(m.missing.length ? 'No label yet for: ' + m.missing.join(', ') : 'Estimated')}">estimate · ${m.labeled}/${m.total} labeled</span>`;
    return `<div class="macros" aria-label="per serving">
    <span><b>${n[0]}</b> kcal</span><span class="pro"><b>${n[1]}g</b> protein</span><span><b>${n[2]}g</b> carbs</span><span><b>${n[3]}g</b> fat</span>${badge}</div>`;
  };

  const recipeCard = (s, compact) => {
    const r = s.r;
    const ings = r.ing.map(([k, q]) => { const c = catalog[k]; const v = q * s.f; return `<li><span class="q">${fmtQty(v)} ${unitLabel(c.unit, v)}</span> ${esc(c.name)}</li>`; }).join('');
    const link = state.baseUrl.replace(/\/?$/, '/') + r.id + '.html';
    return `<article class="card recipe" data-slot="${s.slot}" data-id="${r.id}">
      <header>
        <div>
          <p class="eyebrow">${esc(r.meal)} · ${r.time} min${r.time !== r.active ? ` (${r.active} active)` : ''} · ${esc(r.tags.join(' · '))}</p>
          <h3>${esc(r.name)}</h3>
        </div>
        <div class="card-actions">
          <label class="stepper">Servings
            <button type="button" data-act="serv" data-d="-1" aria-label="Fewer servings">−</button>
            <output>${s.servings}</output>
            <button type="button" data-act="serv" data-d="1" aria-label="More servings">+</button>
          </label>
          <button type="button" class="btn ghost" data-act="swap">Swap</button>
        </div>
      </header>
      ${macroStrip(r)}
      ${compact ? '' : `<div class="recipe-body">
        <div><h4>Ingredients <small>for ${s.servings}</small></h4><ul class="ings">${ings}</ul></div>
        <div><h4>Steps</h4><ol class="steps">${r.steps.map(t => `<li>${esc(t)}</li>`).join('')}</ol></div>
      </div>
      <footer class="recipe-foot">
        <button type="button" class="btn" data-act="copy" data-text="${esc(link)}">Copy Samsung Food link</button>
        <a class="btn ghost" href="${esc(link)}" target="_blank" rel="noopener">Open recipe page</a>
        <button type="button" class="btn ghost" data-act="copy" data-text="${esc(recipeText(s))}">Copy as text</button>
      </footer>`}
    </article>`;
  };

  const recipeText = (s) => {
    const r = s.r;
    const m = macrosOf(r).n; const lines = [r.name, `Serves ${s.servings} · ${m[1]}g protein / ${m[0]} kcal per serving`, '', 'Ingredients:'];
    for (const [k, q] of r.ing) { const c = catalog[k]; const v = q * s.f; lines.push(`- ${fmtQty(v)} ${unitLabel(c.unit, v)} ${c.name}`.replace(/\s+/g, ' ')); }
    lines.push('', 'Steps:'); r.steps.forEach((t, i) => lines.push(`${i + 1}. ${t}`));
    return lines.join('\n');
  };

  // ---------- views ----------
  const renderHeader = (p) => {
    const mon = weekMonday(); const sun = new Date(mon); sun.setDate(sun.getDate() + 6);
    $('#week-label').textContent = (state.offset === 0 ? 'This week' : state.offset === 1 ? 'Next week' : state.offset === -1 ? 'Last week' : `Week of ${fmtDate(mon)}`);
    $('#week-dates').textContent = `${fmtDate(mon)} – ${fmtDate(sun)} · rotation ${rotationIndex() + 1} of ${weeks.length}`;
    $('#week-name').textContent = p.week.name;
    $('#week-blurb').textContent = p.week.blurb;
    $('#people-out').textContent = state.people;
    $('#variety').value = String(state.variety);

    const avg = (arr) => arr.reduce((a, s) => a + macrosOf(s.r).n[1], 0) / arr.length;
    const avgK = (arr) => arr.reduce((a, s) => a + macrosOf(s.r).n[0], 0) / arr.length;
    const protein = Math.round(avg(p.breakfasts) + avg(p.lunches) + avg(p.dinners) + 22);
    const kcal = Math.round(avgK(p.breakfasts) + avgK(p.lunches) + avgK(p.dinners) + 180);
    const active = allSlots(p).reduce((a, s) => a + s.r.active, 0);
    const prepMin = Math.round(active * 0.75 + 15);
    const g = grocery(p);
    $('#stats').innerHTML = [
      ['protein / day', `${protein} g`, 'with one snack'],
      ['calories / day', `${kcal}`, allSlots(p).every(s => macrosOf(s.r).source === 'label') ? 'from labels' : 'estimate'],
      ['recipes to cook', `${allSlots(p).length}`, `${p.dinners.length} dinners · 2 breakfasts · 2 lunches`],
      ['prep day', `≈${Math.floor(prepMin / 60)}h ${prepMin % 60}m`, 'hands-on, overlapping'],
      ['grocery list', `${g.filter(x => !x.item.staple).length} items`, `${g.filter(x => x.item.staple).length} pantry staples`],
    ].map(([l, v, s]) => `<div class="stat"><span class="stat-l">${l}</span><span class="stat-v">${v}</span><span class="stat-s">${s}</span></div>`).join('');
  };

  const renderPlan = (p) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const mon = weekMonday();
    const cell = (s) => `<div class="cell"><span class="cell-name">${esc(s.r.name)}</span><span class="cell-p">${macrosOf(s.r).n[1]}g</span></div>`;
    $('#calendar').innerHTML = `<div class="cal-head"></div>` + days.map((d, i) => { const dt = new Date(mon); dt.setDate(dt.getDate() + i); return `<div class="cal-head">${d} <small>${fmtDate(dt)}</small></div>`; }).join('')
      + ['Breakfast', 'Lunch', 'Dinner'].map((m, row) => `<div class="cal-row">${m}</div>` + days.map((_, i) => {
        const list = row === 0 ? p.breakfasts : row === 1 ? p.lunches : p.dinners;
        return cell(list[i % list.length]);
      }).join('')).join('');
    $('#plan-cards').innerHTML = [['Dinners', p.dinners], ['Breakfasts', p.breakfasts], ['Lunches', p.lunches]]
      .map(([t, list]) => `<h3 class="section-h">${t}</h3><div class="grid">${list.map(s => recipeCard(s, true)).join('')}</div>`).join('');
    $('#snacks').innerHTML = snacks.map(s => `<li><span>${esc(s.name)}</span><span class="pro">${s.protein}g</span></li>`).join('');
  };

  const renderRecipes = (p) => {
    $('#recipe-list').innerHTML = [['Dinners', p.dinners], ['Breakfasts', p.breakfasts], ['Lunches', p.lunches]]
      .map(([t, list]) => `<h3 class="section-h">${t}</h3>${list.map(s => recipeCard(s, false)).join('')}`).join('');
    $('#all-links').dataset.text = allSlots(p).map(s => state.baseUrl.replace(/\/?$/, '/') + s.r.id + '.html').join('\n');
  };

  const renderGrocery = (p) => {
    const o = wk();
    const rows = grocery(p);
    const groups = {};
    for (const r of rows) (groups[r.item.staple ? 'Pantry check' : r.item.aisle] = groups[r.item.staple ? 'Pantry check' : r.item.aisle] || []).push(r);
    const order = [...AISLE_ORDER, 'Pantry check'].filter(a => groups[a]);
    const inCart = (r) => r.item.staple ? !!o.need[r.item.key] : !o.have[r.item.key];
    $('#grocery').innerHTML = order.map(a => `<section class="aisle"><h3>${a}${a === 'Pantry check' ? ' <small>tick anything you are out of to add it to the order</small>' : ''}</h3><ul>` +
      groups[a].map(r => {
        const id = state.wmIds[r.item.key] || '';
        const need = fmtQty(r.qty) + ' ' + unitLabel(r.item.unit, r.qty);
        const L = LBL[r.item.key];
        const prod = L && L.source === 'Branded' ? `<span class="g-prod">${esc((L.brand ? L.brand + ' ' : '') + L.description.toLowerCase())}${L.upc ? ` · UPC ${esc(L.upc)}` : ''}</span>` : '';
        const wmq = L && L.upc ? L.upc.replace(/^0+/, '') : r.item.query;
        const checked = r.item.staple ? !!o.need[r.item.key] : !!o.have[r.item.key];
        return `<li class="g-row ${inCart(r) ? '' : 'muted'}" data-key="${r.item.key}">
          <label class="chk"><input type="checkbox" id="chk-${r.item.key}" data-act="${r.item.staple ? 'need' : 'have'}" ${checked ? 'checked' : ''}><span>${r.item.staple ? 'need it' : 'have it'}</span></label>
          <div class="g-main"><span class="g-name">${esc(r.item.name)}</span>
            <span class="g-sub">${r.packs} × ${esc(r.item.packLabel)} <span class="dim">(need ${need.trim()})</span> · ${esc([...new Set(r.recipes)].join(', '))}</span>${prod}</div>
          <div class="g-links">
            <a class="btn ghost sm" href="${walmartSearch(wmq)}" target="_blank" rel="noopener">${L && L.upc ? 'Exact item on Walmart' : 'Find on Walmart'}</a>
            <input type="text" class="wm-id" id="wm-${r.item.key}" placeholder="paste product link" value="${esc(id)}" aria-label="Walmart item ID for ${esc(r.item.name)}" data-act="wmid">
            <span class="linked ${id ? 'on' : ''}" title="${id ? 'Linked to item ' + id : 'Not linked yet'}">${id ? 'linked' : 'not linked'}</span>
          </div></li>`;
      }).join('') + '</ul></section>').join('');

    const cartItems = rows.filter(inCart).filter(r => state.wmIds[r.item.key]).map(r => ({ id: state.wmIds[r.item.key], qty: r.packs }));
    const wanted = rows.filter(inCart);
    const link = cartLink(cartItems);
    const a = $('#wm-cart');
    a.href = link || '#grocery'; a.classList.toggle('disabled', !link);
    $('#wm-status').textContent = link ? `${cartItems.length} of ${wanted.length} items linked. Unlinked items need a product link pasted once (the site remembers it).` : `Paste a Walmart product link next to each item once; after that this button fills your cart in one click.`;
    const text = order.map(a => `${a.toUpperCase()}\n` + groups[a].filter(inCart).map(r => `- ${r.packs} × ${r.item.name} (${r.item.packLabel})`).join('\n')).join('\n\n');
    $('#copy-list').dataset.text = text;
    $('#copy-list-lines').dataset.text = wanted.map(r => `${r.packs} ${r.item.name}`).join('\n');
    $('#sf-links').dataset.text = allSlots(p).map(s => state.baseUrl.replace(/\/?$/, '/') + s.r.id + '.html').join('\n');
    $('#base-url').value = state.baseUrl;
  };

  const renderPrep = (p) => {
    const slots = allSlots(p);
    const by = (m) => slots.filter(s => s.r.method === m);
    const grains = {};
    for (const s of slots) for (const [k, q] of s.r.ing) if (k === 'rice' || k === 'quinoa') grains[k] = (grains[k] || 0) + q * s.f;
    const li = (s, note) => `<li><span class="t">${esc(s.r.name)}</span>${note ? `<span class="n">${esc(note)}</span>` : ''}</li>`;
    const temp = (s) => { const m = s.r.steps.join(' ').match(/(\d{3})°F/); return m ? `${m[1]}°F · ${s.r.time} min` : `${s.r.time} min`; };
    const blocks = [];
    if (by('slowcooker').length) blocks.push(['First thing: load the slow cooker', 'Runs for hours while you do everything else.', by('slowcooker').map(s => li(s, 'HIGH 3–4 h'))]);
    const gl = Object.entries(grains).map(([k, v]) => `<li><span class="t">${fmtQty(v)} cups ${k === 'rice' ? 'jasmine rice' : 'quinoa'} (dry)</span><span class="n">rice cooker or big pot, one batch</span></li>`);
    if (gl.length) blocks.push(['Start the grains', 'Cook all the rice and quinoa for the week at once.', gl]);
    if (by('oven').length) blocks.push(['Oven: run sheet pans back to back', 'Most pans share 425°F; set a timer per pan.', by('oven').map(s => li(s, temp(s)))]);
    if (by('stovetop').length) blocks.push(['Stovetop while pans roast', 'One skillet, wiped between recipes.', by('stovetop').map(s => li(s, `${s.r.active} min hands-on`))]);
    if (by('cold').length) blocks.push(['Cold assembly last', 'No heat. Jars, boxes and bowls.', by('cold').map(s => li(s, `${s.r.active} min`))]);
    blocks.push(['Cool, label, store', 'Let everything cool uncovered 20 min before lidding. Fridge up to 4 days, freeze the rest. Label with the recipe and day.', []]);
    $('#prep').innerHTML = blocks.map(([h, sub, items], i) => `<section class="prep-block"><div class="prep-n">${i + 1}</div><div><h3>${h}</h3><p>${sub}</p>${items.length ? `<ul>${items.join('')}</ul>` : ''}</div></section>`).join('');
  };

  const render = () => {
    const p = plan();
    renderHeader(p); renderPlan(p); renderRecipes(p); renderGrocery(p); renderPrep(p);
  };

  // ---------- interactions ----------
  const toast = (msg) => { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => { t.hidden = true; }, 2200); };
  const copy = async (text, btn) => {
    try { await navigator.clipboard.writeText(text); toast('Copied'); }
    catch {
      const ta = $('#copy-fallback'); ta.hidden = false; ta.value = text; ta.focus(); ta.select(); toast('Select the text below and copy it');
    }
  };

  const setTab = (name) => {
    state.tab = name;
    $$('[data-tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === name)));
    $$('.panel').forEach(p => { p.hidden = p.id !== 'tab-' + name; });
    if (location.hash.slice(1) !== name) history.replaceState(null, '', '#' + name);
  };

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act], [data-tab]');
    if (!b) return;
    if (b.dataset.tab) { setTab(b.dataset.tab); return; }
    const act = b.dataset.act;
    const card = b.closest('[data-slot]');
    if (act === 'copy') { copy(b.dataset.text, b); return; }
    if (act === 'week') { state.offset += Number(b.dataset.d); render(); return; }
    if (act === 'today') { state.offset = 0; render(); return; }
    if (act === 'people') { state.people = Math.min(8, Math.max(1, state.people + Number(b.dataset.d))); store.set('people', state.people); render(); return; }
    if (act === 'serv' && card) {
      const o = wk(); const id = card.dataset.id; const cur = Number(card.querySelector('output').textContent);
      o.servings[id] = Math.min(16, Math.max(1, cur + Number(b.dataset.d))); saveWk(o); render(); return;
    }
    if (act === 'swap' && card) {
      const o = wk(); const id = card.dataset.id; const meal = byId[id].meal;
      const p = plan(); const inUse = new Set(allSlots(p).map(s => s.r.id));
      const pool = recipes.filter(r => r.meal === meal);
      let i = pool.findIndex(r => r.id === id);
      for (let n = 0; n < pool.length; n++) { i = (i + 1) % pool.length; if (!inUse.has(pool[i].id)) break; }
      o.swaps[card.dataset.slot] = pool[i].id; saveWk(o); render(); toast('Swapped for ' + pool[i].name); return;
    }
    if (act === 'reset-week') { saveWk({ swaps: {}, servings: {}, have: {}, need: {} }); render(); toast('Week reset'); return; }
  });

  document.addEventListener('change', (e) => {
    const el = e.target;
    if (el.id === 'variety') { state.variety = Number(el.value); store.set('variety', state.variety); render(); return; }
    if (el.id === 'base-url') { state.baseUrl = el.value.trim(); store.set('baseUrl', state.baseUrl); render(); return; }
    const row = el.closest('[data-key]');
    if (!row) return;
    const key = row.dataset.key; const o = wk();
    if (el.dataset.act === 'have') { o.have[key] = el.checked; saveWk(o); render(); }
    if (el.dataset.act === 'need') { o.need[key] = el.checked; saveWk(o); render(); }
    if (el.dataset.act === 'wmid') {
      const id = parseWalmartId(el.value);
      if (id) { state.wmIds[key] = id; } else { delete state.wmIds[key]; }
      store.set('wmIds', state.wmIds); render();
      toast(id ? 'Linked to Walmart item ' + id : 'No item ID found in that link');
      const next = $('#wm-' + key); if (next) next.value = id;
    }
  });

  window.addEventListener('hashchange', () => { const h = location.hash.slice(1); if (['plan', 'recipes', 'grocery', 'prep'].includes(h)) setTab(h); });

  // boot
  render();
  const h = location.hash.slice(1);
  setTab(['plan', 'recipes', 'grocery', 'prep'].includes(h) ? h : 'plan');
})();
