/* Shared nutrition math (browser global NUTRITION, or Node module).
   A label record (labels.json) looks like:
   { source: 'Branded' | 'Foundation' | 'SR Legacy', fdcId, description, brand, upc,
     servingG, servingText, per100g: { kcal, p, c, f } } */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory(); else root.NUTRITION = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  // Per-serving macros for a recipe. Returns { n:[kcal,p,c,f], source:'label'|'estimate', labeled, total, missing:[names], usda:count }
  function recipeMacros(recipe, catalog, labels) {
    let kcal = 0, p = 0, c = 0, f = 0, labeled = 0, total = 0, usda = 0; const missing = [];
    for (const [key, qty] of recipe.ing) {
      const item = catalog[key]; if (!item || item.skip) continue;
      total++;
      const L = labels && labels[key];
      if (!L || !L.per100g || !item.g) { missing.push(item.name); continue; }
      labeled++; if (L.source !== 'Branded') usda++;
      const grams = qty * item.g;
      kcal += grams * L.per100g.kcal / 100; p += grams * L.per100g.p / 100; c += grams * L.per100g.c / 100; f += grams * L.per100g.f / 100;
    }
    if (labeled === total && total > 0) {
      const s = recipe.baseServings;
      return { n: [Math.round(kcal / s), Math.round(p / s), Math.round(c / s), Math.round(f / s)], source: 'label', labeled, total, missing, usda };
    }
    return { n: recipe.n, source: 'estimate', labeled, total, missing, usda };
  }
  return { recipeMacros };
});
