# Protein Prep Week

Weekly high-protein, low-effort meal prep plans with a consolidated grocery list in Walmart pack sizes, a one-click Walmart cart hand-off, and per-recipe pages Samsung Food can import.

**Live site:** https://funnybeer123.github.io/protein-prep-week/ (enable GitHub Pages on `main`, root folder)

## How it works

- `data.js` — ingredient catalog (Walmart pack sizes, aisle, gram conversions, USDA lookup text) and 32 recipes in a 4-week rotation.
- `nutrition.js` — computes each recipe's macros from ingredient gram weights × filed Nutrition Facts per 100 g.
- `labels.json` — label records per ingredient, filled by `scripts/pull-labels.mjs` from USDA FoodData Central (Branded = manufacturer-filed labels, matched by UPC; produce from USDA reference data). Until pulled, the UI shows hand estimates marked "estimate".
- `src/page.html` + `app.js` — the single-page app (plan, recipes, grocery & order, prep day).
- `scripts/build.mjs` — generates `index.html`, `labels.js`, and `recipes/*.html` (schema.org Recipe JSON-LD for Samsung Food).

## Commands

```
node scripts/build.mjs                              # rebuild index.html, labels.js, recipes/
FDC_API_KEY=<key> node scripts/pull-labels.mjs      # pull Nutrition Facts for every ingredient
node scripts/pull-labels.mjs --review               # show what each ingredient matched
```

Free USDA API key: https://api.nal.usda.gov/fdc/api-key-signup

## Ordering

- **Walmart:** no public cart API exists, so the site uses Walmart's add-to-cart hand-off link. Paste each product's Walmart page link once (the site remembers the item ID); after that "Add week to Walmart cart" fills the cart in one click.
- **Samsung Food:** copy the recipe links, then in Samsung Food go to Saved → + → Save recipe link. Add the recipes to its shopping list and check out through Walmart or Instacart.
