/* Meal-prep data: ingredient catalog, recipes, and the 4-week rotation.
   Quantities are per `baseServings`. Units are fixed per ingredient so
   totals can be summed and converted into Walmart pack counts. */
const DATA = (() => {
  // aisle: how Walmart groups the store. pack: how much one purchasable unit holds (in `unit`).
  // staple: pantry item most kitchens already have; listed separately, excluded from cart by default.
  const C = {};
  const add = (key, name, unit, pack, aisle, query, extra = {}) => {
    C[key] = Object.assign({ key, name, unit, pack, aisle, query }, extra);
  };

  // Meat & seafood
  add('chicken_breast', 'Boneless skinless chicken breast', 'lb', 3, 'Meat & Seafood', 'boneless skinless chicken breast family pack', { packLabel: '3 lb family pack' });
  add('chicken_thigh', 'Boneless skinless chicken thighs', 'lb', 2.5, 'Meat & Seafood', 'boneless skinless chicken thighs', { packLabel: '2.5 lb pack' });
  add('ground_turkey', '93/7 lean ground turkey', 'lb', 1, 'Meat & Seafood', '93/7 lean ground turkey 1 lb', { packLabel: '1 lb' });
  add('ground_beef', '93/7 lean ground beef', 'lb', 1, 'Meat & Seafood', '93/7 lean ground beef 1 lb', { packLabel: '1 lb' });
  add('salmon', 'Salmon fillets', 'lb', 1, 'Meat & Seafood', 'atlantic salmon fillets', { packLabel: '1 lb' });
  add('shrimp', 'Raw shrimp, peeled & deveined', 'lb', 1, 'Frozen', 'frozen raw shrimp peeled deveined 1 lb', { packLabel: '1 lb bag' });
  add('sirloin', 'Beef sirloin (steak or tips)', 'lb', 1, 'Meat & Seafood', 'beef sirloin steak', { packLabel: '1 lb' });
  add('pork_tenderloin', 'Pork tenderloin', 'lb', 1.25, 'Meat & Seafood', 'pork tenderloin', { packLabel: '1.25 lb' });
  add('rotisserie_chicken', 'Rotisserie chicken', 'each', 1, 'Deli', 'rotisserie chicken', { packLabel: '1 chicken' });
  add('deli_turkey', 'Oven-roasted turkey breast (deli)', 'oz', 16, 'Deli', 'oven roasted turkey breast lunch meat 16 oz', { packLabel: '16 oz' });

  // Dairy & eggs
  add('eggs', 'Large eggs', 'each', 12, 'Dairy & Eggs', 'large white eggs 12 count', { packLabel: 'dozen' });
  add('egg_whites', 'Liquid egg whites', 'cup', 2, 'Dairy & Eggs', 'liquid egg whites 16 oz', { packLabel: '16 oz carton' });
  add('greek_yogurt', 'Nonfat plain Greek yogurt', 'cup', 4, 'Dairy & Eggs', 'nonfat plain greek yogurt 32 oz', { packLabel: '32 oz tub' });
  add('cottage_cheese', 'Low-fat cottage cheese', 'cup', 3, 'Dairy & Eggs', 'low fat cottage cheese 24 oz', { packLabel: '24 oz tub' });
  add('cheddar', 'Shredded cheddar', 'oz', 8, 'Dairy & Eggs', 'shredded sharp cheddar cheese 8 oz', { packLabel: '8 oz bag' });
  add('mozzarella', 'Shredded mozzarella', 'oz', 8, 'Dairy & Eggs', 'shredded mozzarella cheese 8 oz', { packLabel: '8 oz bag' });
  add('parmesan', 'Grated parmesan', 'oz', 8, 'Dairy & Eggs', 'grated parmesan cheese 8 oz', { packLabel: '8 oz' });
  add('feta', 'Crumbled feta', 'oz', 6, 'Dairy & Eggs', 'crumbled feta cheese 6 oz', { packLabel: '6 oz' });
  add('milk', '2% milk', 'cup', 8, 'Dairy & Eggs', '2% reduced fat milk half gallon', { packLabel: 'half gallon' });
  add('string_cheese', 'Light string cheese', 'each', 12, 'Dairy & Eggs', 'light mozzarella string cheese 12 count', { packLabel: '12 pack' });
  add('butter', 'Butter', 'tbsp', 32, 'Dairy & Eggs', 'salted butter 1 lb', { packLabel: '1 lb', staple: true });

  // Produce
  add('broccoli', 'Broccoli florets', 'lb', 0.75, 'Produce', 'fresh broccoli florets 12 oz bag', { packLabel: '12 oz bag' });
  add('green_beans', 'Fresh green beans', 'lb', 0.75, 'Produce', 'fresh green beans 12 oz', { packLabel: '12 oz bag' });
  add('asparagus', 'Asparagus', 'lb', 1, 'Produce', 'fresh asparagus', { packLabel: '1 lb bunch' });
  add('bell_pepper', 'Bell peppers', 'each', 3, 'Produce', 'tri color bell peppers 3 pack', { packLabel: '3 pack' });
  add('onion', 'Yellow onions', 'each', 3, 'Produce', 'yellow onions 3 lb bag', { packLabel: '3 lb bag (≈3 large)' });
  add('garlic', 'Garlic', 'clove', 30, 'Produce', 'fresh garlic bulbs 3 count', { packLabel: '3 bulbs' });
  add('lemon', 'Lemons', 'each', 1, 'Produce', 'fresh lemons', { packLabel: 'each' });
  add('lime', 'Limes', 'each', 1, 'Produce', 'fresh limes', { packLabel: 'each' });
  add('avocado', 'Avocados', 'each', 1, 'Produce', 'hass avocados', { packLabel: 'each' });
  add('cherry_tomato', 'Grape tomatoes', 'pint', 1, 'Produce', 'grape tomatoes pint', { packLabel: 'pint' });
  add('cucumber', 'Cucumber', 'each', 1, 'Produce', 'fresh cucumber', { packLabel: 'each' });
  add('romaine', 'Romaine hearts', 'each', 3, 'Produce', 'romaine hearts 3 pack', { packLabel: '3 pack' });
  add('spinach', 'Baby spinach', 'oz', 10, 'Produce', 'baby spinach 10 oz', { packLabel: '10 oz tub' });
  add('sweet_potato', 'Sweet potatoes', 'lb', 1, 'Produce', 'sweet potatoes', { packLabel: 'per lb' });
  add('baby_potato', 'Baby gold potatoes', 'lb', 1.5, 'Produce', 'baby gold potatoes 1.5 lb bag', { packLabel: '1.5 lb bag' });
  add('green_onion', 'Green onions', 'bunch', 1, 'Produce', 'green onions bunch', { packLabel: 'bunch' });
  add('cilantro', 'Cilantro', 'bunch', 1, 'Produce', 'fresh cilantro bunch', { packLabel: 'bunch' });
  add('coleslaw_mix', 'Coleslaw mix (shredded cabbage)', 'oz', 14, 'Produce', 'coleslaw mix 14 oz', { packLabel: '14 oz bag' });
  add('banana', 'Bananas', 'each', 1, 'Produce', 'fresh bananas', { packLabel: 'each' });
  add('apple', 'Apples', 'each', 1, 'Produce', 'gala apples', { packLabel: 'each' });
  add('baby_carrots', 'Baby carrots', 'lb', 1, 'Produce', 'baby carrots 1 lb', { packLabel: '1 lb bag' });

  // Frozen
  add('berries', 'Frozen mixed berries', 'oz', 16, 'Frozen', 'frozen mixed berries 16 oz', { packLabel: '16 oz bag' });
  add('stirfry_veg', 'Frozen stir-fry vegetables', 'oz', 16, 'Frozen', 'frozen stir fry vegetables 16 oz', { packLabel: '16 oz bag' });
  add('edamame', 'Frozen shelled edamame', 'oz', 12, 'Frozen', 'frozen shelled edamame 12 oz', { packLabel: '12 oz bag' });
  add('corn', 'Frozen sweet corn', 'oz', 12, 'Frozen', 'frozen sweet corn 12 oz', { packLabel: '12 oz bag' });

  // Pantry
  add('rice', 'Jasmine rice (dry)', 'cup', 10, 'Pantry', 'jasmine rice 5 lb', { packLabel: '5 lb bag (≈10 cups dry)' });
  add('quinoa', 'Quinoa (dry)', 'cup', 2.5, 'Pantry', 'quinoa 16 oz', { packLabel: '16 oz bag' });
  add('oats', 'Old-fashioned oats', 'cup', 14, 'Pantry', 'old fashioned rolled oats 42 oz', { packLabel: '42 oz canister' });
  add('protein_powder', 'Whey protein powder', 'scoop', 30, 'Pantry', 'whey protein powder vanilla 2 lb', { packLabel: '2 lb tub (≈30 scoops)' });
  add('peanut_butter', 'Peanut butter', 'tbsp', 32, 'Pantry', 'natural peanut butter 16 oz', { packLabel: '16 oz jar' });
  add('chia', 'Chia seeds', 'tbsp', 32, 'Pantry', 'chia seeds 12 oz', { packLabel: '12 oz bag' });
  add('almonds', 'Almonds', 'oz', 16, 'Pantry', 'whole almonds 16 oz', { packLabel: '16 oz bag' });
  add('tuna', 'Canned tuna in water', 'can', 4, 'Pantry', 'chunk light tuna in water 4 pack', { packLabel: '4 pack' });
  add('black_beans', 'Black beans (can)', 'can', 1, 'Pantry', 'black beans 15 oz can', { packLabel: '15 oz can' });
  add('chickpeas', 'Chickpeas (can)', 'can', 1, 'Pantry', 'chickpeas garbanzo beans 15 oz can', { packLabel: '15 oz can' });
  add('diced_tomatoes', 'Fire-roasted diced tomatoes (can)', 'can', 1, 'Pantry', 'fire roasted diced tomatoes 14.5 oz', { packLabel: '14.5 oz can' });
  add('coconut_milk', 'Light coconut milk (can)', 'can', 1, 'Pantry', 'light coconut milk 13.5 oz can', { packLabel: '13.5 oz can' });
  add('marinara', 'Marinara sauce', 'cup', 3, 'Pantry', 'marinara pasta sauce 24 oz', { packLabel: '24 oz jar' });
  add('chicken_broth', 'Chicken broth', 'cup', 4, 'Pantry', 'low sodium chicken broth 32 oz', { packLabel: '32 oz carton' });
  add('salsa', 'Salsa', 'cup', 2, 'Pantry', 'medium salsa 16 oz', { packLabel: '16 oz jar' });
  add('protein_pasta', 'Chickpea or protein pasta', 'oz', 8, 'Pantry', 'banza chickpea pasta 8 oz', { packLabel: '8 oz box' });
  add('tortillas', 'High-protein or low-carb tortillas', 'each', 8, 'Pantry', 'high protein low carb tortillas', { packLabel: '8 count' });
  add('taco_seasoning', 'Taco seasoning packet', 'each', 1, 'Pantry', 'taco seasoning mix packet', { packLabel: 'packet' });
  add('soy_sauce', 'Low-sodium soy sauce', 'tbsp', 30, 'Pantry', 'low sodium soy sauce 15 oz', { packLabel: '15 oz', staple: true });
  add('honey', 'Honey', 'tbsp', 24, 'Pantry', 'honey 12 oz', { packLabel: '12 oz', staple: true });
  add('olive_oil', 'Olive oil', 'tbsp', 34, 'Pantry', 'olive oil 17 oz', { packLabel: '17 oz', staple: true });
  add('sesame_oil', 'Toasted sesame oil', 'tbsp', 10, 'Pantry', 'toasted sesame oil 5 oz', { packLabel: '5 oz', staple: true });
  add('sriracha', 'Sriracha', 'tbsp', 17, 'Pantry', 'sriracha hot chili sauce', { packLabel: '17 oz', staple: true });
  add('bbq_sauce', 'BBQ sauce', 'tbsp', 36, 'Pantry', 'bbq sauce 18 oz', { packLabel: '18 oz', staple: true });
  add('buffalo_sauce', 'Buffalo wing sauce', 'tbsp', 24, 'Pantry', 'buffalo wing sauce 12 oz', { packLabel: '12 oz', staple: true });
  add('cornstarch', 'Cornstarch', 'tbsp', 48, 'Pantry', 'corn starch 16 oz', { packLabel: '16 oz', staple: true });
  add('curry_powder', 'Curry powder', 'tbsp', 6, 'Pantry', 'curry powder spice', { packLabel: 'jar', staple: true });
  add('italian_seasoning', 'Italian seasoning', 'tsp', 24, 'Pantry', 'italian seasoning spice', { packLabel: 'jar', staple: true });
  add('chili_powder', 'Chili powder', 'tsp', 24, 'Pantry', 'chili powder spice', { packLabel: 'jar', staple: true });
  add('cumin', 'Ground cumin', 'tsp', 24, 'Pantry', 'ground cumin spice', { packLabel: 'jar', staple: true });
  add('smoked_paprika', 'Smoked paprika', 'tsp', 24, 'Pantry', 'smoked paprika spice', { packLabel: 'jar', staple: true });
  add('garlic_powder', 'Garlic powder', 'tsp', 30, 'Pantry', 'garlic powder spice', { packLabel: 'jar', staple: true });
  add('ground_ginger', 'Ground ginger', 'tsp', 24, 'Pantry', 'ground ginger spice', { packLabel: 'jar', staple: true });
  add('cinnamon', 'Ground cinnamon', 'tsp', 30, 'Pantry', 'ground cinnamon spice', { packLabel: 'jar', staple: true });
  add('lemon_pepper', 'Lemon pepper seasoning', 'tsp', 24, 'Pantry', 'lemon pepper seasoning', { packLabel: 'jar', staple: true });
  add('everything_seasoning', 'Everything bagel seasoning', 'tsp', 24, 'Pantry', 'everything bagel seasoning', { packLabel: 'jar', staple: true });
  add('salt_pepper', 'Salt & black pepper', 'tsp', 100, 'Pantry', 'salt and pepper shaker set', { packLabel: 'set', staple: true });

  // Label lookup + unit conversion metadata.
  // g: grams in one `unit` of the item (only needed where unit is not lb/oz).
  // q: search text for the USDA FoodData Central lookup (Branded = manufacturer-filed Nutrition Facts).
  // fresh: unbranded produce; nutrition comes from USDA Foundation/SR data instead of a package label.
  // skip: nutritionally negligible, excluded from the math.
  const META = {
    chicken_breast: { q: 'Freshness Guaranteed boneless skinless chicken breasts' },
    chicken_thigh: { q: 'Freshness Guaranteed boneless skinless chicken thighs' },
    ground_turkey: { q: 'Great Value 93% lean ground turkey' },
    ground_beef: { q: 'Great Value 93% lean ground beef' },
    salmon: { q: 'Great Value atlantic salmon fillets' },
    shrimp: { q: 'Great Value raw shrimp peeled deveined' },
    sirloin: { q: 'beef top sirloin steak', fresh: true },
    pork_tenderloin: { q: 'Smithfield pork tenderloin' },
    rotisserie_chicken: { g: 500, q: 'rotisserie chicken', note: 'about 500 g of meat per bird' },
    deli_turkey: { q: 'Great Value oven roasted turkey breast' },
    eggs: { g: 50, q: 'Great Value large white eggs' },
    egg_whites: { g: 243, q: 'Great Value 100% liquid egg whites' },
    greek_yogurt: { g: 227, q: 'Great Value nonfat plain greek yogurt' },
    cottage_cheese: { g: 226, q: 'Great Value low fat cottage cheese' },
    cheddar: { q: 'Great Value finely shredded sharp cheddar cheese' },
    mozzarella: { q: 'Great Value shredded mozzarella cheese' },
    parmesan: { q: 'Great Value grated parmesan cheese' },
    feta: { q: 'Great Value crumbled feta cheese' },
    milk: { g: 244, q: 'Great Value 2% reduced fat milk' },
    string_cheese: { g: 28, q: 'Great Value light mozzarella string cheese' },
    butter: { g: 14, q: 'Great Value salted butter' },
    broccoli: { q: 'broccoli florets raw', fresh: true },
    green_beans: { q: 'green beans raw', fresh: true },
    asparagus: { q: 'asparagus raw', fresh: true },
    bell_pepper: { g: 150, q: 'sweet red bell pepper raw', fresh: true },
    onion: { g: 150, q: 'onions yellow raw', fresh: true },
    garlic: { g: 3, q: 'garlic raw', fresh: true },
    lemon: { g: 58, q: 'lemons raw without peel', fresh: true },
    lime: { g: 44, q: 'limes raw', fresh: true },
    avocado: { g: 136, q: 'avocados raw', fresh: true },
    cherry_tomato: { g: 300, q: 'tomatoes grape raw', fresh: true },
    cucumber: { g: 300, q: 'cucumber with peel raw', fresh: true },
    romaine: { g: 200, q: 'lettuce romaine raw', fresh: true },
    spinach: { q: 'spinach baby raw', fresh: true },
    sweet_potato: { q: 'sweet potato raw', fresh: true },
    baby_potato: { q: 'potatoes gold raw', fresh: true },
    green_onion: { g: 100, q: 'onions spring or scallions raw', fresh: true },
    cilantro: { g: 50, q: 'coriander cilantro leaves raw', fresh: true },
    coleslaw_mix: { q: 'cabbage raw', fresh: true },
    banana: { g: 118, q: 'bananas raw', fresh: true },
    apple: { g: 182, q: 'apples raw with skin', fresh: true },
    baby_carrots: { q: 'carrots baby raw', fresh: true },
    berries: { q: 'Great Value mixed berries frozen' },
    stirfry_veg: { q: 'Great Value stir fry vegetables frozen' },
    edamame: { q: 'Great Value shelled edamame frozen' },
    corn: { q: 'Great Value sweet corn frozen' },
    rice: { g: 185, q: 'Great Value jasmine rice' },
    quinoa: { g: 170, q: 'Great Value quinoa' },
    oats: { g: 80, q: 'Great Value old fashioned oats' },
    protein_powder: { g: 31, q: 'whey protein powder vanilla' },
    peanut_butter: { g: 16, q: 'Great Value natural peanut butter' },
    chia: { g: 12, q: 'Great Value chia seeds' },
    almonds: { q: 'Great Value whole almonds' },
    tuna: { g: 142, q: 'Great Value chunk light tuna in water', note: '5 oz can, drained weight 113 g' },
    black_beans: { g: 260, q: 'Great Value black beans canned', note: 'drained' },
    chickpeas: { g: 250, q: 'Great Value garbanzo beans chickpeas canned', note: 'drained' },
    diced_tomatoes: { g: 411, q: 'Great Value fire roasted diced tomatoes' },
    coconut_milk: { g: 403, q: 'Great Value light coconut milk' },
    marinara: { g: 250, q: 'Great Value marinara pasta sauce' },
    chicken_broth: { g: 240, q: 'Great Value chicken broth' },
    salsa: { g: 240, q: 'Great Value medium salsa' },
    protein_pasta: { q: 'Banza chickpea pasta rotini' },
    tortillas: { g: 45, q: 'Mission carb balance flour tortillas' },
    taco_seasoning: { g: 28, q: 'Great Value taco seasoning mix' },
    soy_sauce: { g: 16, q: 'Great Value less sodium soy sauce' },
    honey: { g: 21, q: 'Great Value clover honey' },
    olive_oil: { g: 14, q: 'Great Value olive oil' },
    sesame_oil: { g: 14, q: 'toasted sesame oil' },
    sriracha: { g: 15, q: 'sriracha hot chili sauce' },
    bbq_sauce: { g: 18, q: 'Great Value original barbecue sauce' },
    buffalo_sauce: { g: 15, q: 'Great Value buffalo wing sauce' },
    cornstarch: { g: 8, q: 'Great Value corn starch' },
    curry_powder: { g: 6, q: 'curry powder', fresh: true },
    italian_seasoning: { g: 1, skip: true },
    chili_powder: { g: 2.7, q: 'chili powder', fresh: true },
    cumin: { g: 2.1, q: 'spices cumin seed', fresh: true },
    smoked_paprika: { g: 2.3, q: 'spices paprika', fresh: true },
    garlic_powder: { g: 3.1, q: 'spices garlic powder', fresh: true },
    ground_ginger: { g: 1.8, q: 'spices ginger ground', fresh: true },
    cinnamon: { g: 2.6, q: 'spices cinnamon ground', fresh: true },
    lemon_pepper: { g: 2.5, skip: true },
    everything_seasoning: { g: 3, skip: true },
    salt_pepper: { g: 0, skip: true },
  };
  for (const [k, m] of Object.entries(META)) Object.assign(C[k], m);
  for (const c of Object.values(C)) { if (c.unit === 'lb') c.g = 453.6; else if (c.unit === 'oz') c.g = 28.35; }

  // Recipes. ing: [key, qty] per baseServings. n: per-serving macros (kcal, protein, carbs, fat).
  // method drives prep-day ordering: slowcooker | oven | stovetop | cold.
  const R = [];
  const recipe = (o) => { R.push(Object.assign({ baseServings: 4 }, o)); };

  // ---- DINNERS (20) ----
  recipe({ id: 'honey-garlic-chicken-broccoli', meal: 'dinner', name: 'Honey-garlic sheet-pan chicken & broccoli',
    time: 35, active: 10, method: 'oven', tags: ['sheet pan', 'one pan'],
    n: [520, 52, 58, 9],
    ing: [['chicken_breast', 2], ['broccoli', 1.5], ['honey', 3], ['soy_sauce', 3], ['garlic', 4], ['olive_oil', 1], ['rice', 2], ['salt_pepper', 1]],
    steps: ['Heat oven to 425°F. Start 2 cups rice in the rice cooker or a pot.',
      'Cut chicken into 1-inch pieces. Toss with honey, soy sauce, minced garlic, oil, salt and pepper.',
      'Spread chicken on one side of a sheet pan and broccoli on the other. Roast 18–20 minutes until chicken hits 165°F.',
      'Portion rice, chicken and broccoli into 4 containers. Spoon pan juices over the top.'] });

  recipe({ id: 'turkey-taco-bowls', meal: 'dinner', name: 'Turkey taco bowls',
    time: 30, active: 20, method: 'stovetop', tags: ['one pot', 'bowls'],
    n: [560, 50, 55, 15],
    ing: [['ground_turkey', 2], ['taco_seasoning', 2], ['black_beans', 1], ['salsa', 1], ['rice', 2], ['cheddar', 4], ['romaine', 1], ['lime', 1]],
    steps: ['Start 2 cups rice. Brown the turkey in a large skillet over medium-high, breaking it up, about 8 minutes.',
      'Stir in taco seasoning, 2/3 cup water, and the drained black beans. Simmer 5 minutes until thick.',
      'Chop romaine. Build 4 bowls: rice, turkey mix, salsa, cheddar. Pack lettuce in a separate bag so it stays crisp.',
      'Squeeze lime over each bowl before eating.'] });

  recipe({ id: 'lemon-pepper-salmon', meal: 'dinner', name: 'Lemon-pepper salmon, asparagus & baby potatoes',
    time: 35, active: 10, method: 'oven', tags: ['sheet pan', 'omega-3'],
    n: [480, 38, 32, 22],
    ing: [['salmon', 1.5], ['asparagus', 1], ['baby_potato', 1.5], ['lemon', 1], ['olive_oil', 2], ['garlic', 2], ['lemon_pepper', 3], ['salt_pepper', 1]],
    steps: ['Heat oven to 425°F. Halve potatoes, toss with 1 tbsp oil and salt, roast 15 minutes.',
      'Push potatoes aside. Add salmon (cut into 4) and trimmed asparagus. Rub with remaining oil, garlic, lemon pepper.',
      'Roast 12 more minutes until salmon flakes. Squeeze lemon over everything.',
      'Portion into 4 containers. Reheat gently or eat salmon cold over the potatoes.'] });

  recipe({ id: 'beef-pepper-stir-fry', meal: 'dinner', name: 'Beef & pepper stir-fry',
    time: 30, active: 25, method: 'stovetop', tags: ['stir-fry', '30 min'],
    n: [520, 42, 55, 13],
    ing: [['sirloin', 1.5], ['bell_pepper', 3], ['onion', 1], ['soy_sauce', 4], ['cornstarch', 1], ['garlic', 3], ['sesame_oil', 1], ['honey', 1], ['rice', 2], ['ground_ginger', 1]],
    steps: ['Start 2 cups rice. Slice beef thin against the grain and toss with cornstarch and 1 tbsp soy sauce.',
      'Sear beef in a very hot skillet with sesame oil, 2 minutes per side. Remove.',
      'Stir-fry sliced peppers and onion 4 minutes. Add garlic, ginger, remaining soy and honey. Return beef, toss 1 minute.',
      'Portion over rice into 4 containers.'] });

  recipe({ id: 'egg-roll-bowl', meal: 'dinner', name: 'Egg roll in a bowl',
    time: 25, active: 20, method: 'stovetop', tags: ['one pan', 'low carb option'],
    n: [470, 41, 38, 18],
    ing: [['ground_beef', 1.5], ['coleslaw_mix', 14], ['soy_sauce', 3], ['sesame_oil', 1], ['garlic', 3], ['green_onion', 1], ['ground_ginger', 1], ['sriracha', 1], ['rice', 1.5]],
    steps: ['Start 1.5 cups rice. Brown beef in a large skillet with garlic and ginger, 7 minutes.',
      'Add the whole bag of coleslaw mix, soy sauce and sesame oil. Cook 4 minutes until cabbage wilts.',
      'Stir in sliced green onions and sriracha. Portion over rice into 4 containers.'] });

  recipe({ id: 'slow-cooker-salsa-chicken', meal: 'dinner', name: 'Slow-cooker salsa chicken bowls',
    time: 240, active: 10, method: 'slowcooker', tags: ['slow cooker', 'dump & go'],
    n: [540, 55, 55, 10],
    ing: [['chicken_breast', 2.5], ['salsa', 2], ['taco_seasoning', 1], ['black_beans', 1], ['rice', 2], ['cheddar', 4], ['cilantro', 1], ['lime', 1]],
    steps: ['Put chicken, salsa and taco seasoning in the slow cooker. Cook on HIGH 3–4 hours or LOW 6.',
      'Shred chicken with two forks right in the pot. Stir in drained black beans.',
      'Start 2 cups rice 20 minutes before serving. Portion rice and chicken into 4 containers, top with cheddar and cilantro.',
      'Squeeze lime over each bowl when eating.'] });

  recipe({ id: 'turkey-meatballs-marinara', meal: 'dinner', name: 'Turkey meatballs with marinara & protein pasta',
    time: 35, active: 20, method: 'oven', tags: ['freezer friendly'],
    n: [580, 58, 48, 18],
    ing: [['ground_turkey', 2], ['eggs', 1], ['parmesan', 2], ['garlic', 3], ['italian_seasoning', 2], ['marinara', 3], ['protein_pasta', 8], ['mozzarella', 2], ['salt_pepper', 1]],
    steps: ['Heat oven to 400°F. Mix turkey, egg, parmesan, minced garlic, Italian seasoning, salt and pepper. Roll 16 meatballs.',
      'Bake on a lined sheet pan 18 minutes. Boil pasta per the box while they bake.',
      'Warm marinara, add meatballs. Portion pasta and meatballs into 4 containers, top with mozzarella.'] });

  recipe({ id: 'garlic-shrimp-stir-fry', meal: 'dinner', name: 'Garlic shrimp & veggie stir-fry',
    time: 20, active: 20, method: 'stovetop', tags: ['20 min', 'stir-fry'],
    n: [470, 44, 60, 7],
    ing: [['shrimp', 2], ['stirfry_veg', 32], ['garlic', 4], ['soy_sauce', 3], ['sesame_oil', 1], ['honey', 1], ['cornstarch', 1], ['rice', 2]],
    steps: ['Start 2 cups rice. Thaw shrimp under cold water and pat dry.',
      'Stir-fry frozen vegetables in sesame oil over high heat 5 minutes. Push aside, add shrimp and garlic, cook 3 minutes.',
      'Whisk soy sauce, honey, cornstarch and 1/4 cup water. Pour in, toss 1 minute until glossy.',
      'Portion over rice into 4 containers.'] });

  recipe({ id: 'bbq-pork-sheet-pan', meal: 'dinner', name: 'BBQ pork tenderloin with sweet potatoes & green beans',
    time: 35, active: 10, method: 'oven', tags: ['sheet pan'],
    n: [460, 42, 45, 10],
    ing: [['pork_tenderloin', 2], ['sweet_potato', 2], ['green_beans', 1], ['bbq_sauce', 6], ['olive_oil', 2], ['smoked_paprika', 2], ['salt_pepper', 1]],
    steps: ['Heat oven to 425°F. Cube sweet potatoes, toss with 1 tbsp oil, paprika and salt. Roast 15 minutes.',
      'Rub pork with remaining oil and salt. Add pork and green beans to the pan. Roast 15 minutes until pork reads 145°F.',
      'Brush pork with BBQ sauce for the last 3 minutes. Rest 5 minutes, slice.',
      'Portion into 4 containers.'] });

  recipe({ id: 'greek-chicken-bowls', meal: 'dinner', name: 'Greek chicken bowls with tzatziki',
    time: 35, active: 20, method: 'oven', tags: ['bowls', 'eat cold'],
    n: [540, 50, 42, 20],
    ing: [['chicken_thigh', 2], ['lemon', 2], ['garlic', 4], ['italian_seasoning', 3], ['olive_oil', 2], ['quinoa', 1.5], ['cucumber', 1], ['cherry_tomato', 1], ['feta', 4], ['greek_yogurt', 1], ['salt_pepper', 1]],
    steps: ['Cook quinoa (1.5 cups quinoa, 3 cups water, 15 minutes). Heat oven to 425°F.',
      'Toss thighs with juice of 1 lemon, 3 garlic cloves, Italian seasoning, oil, salt. Roast 22 minutes. Slice.',
      'Tzatziki: grate half the cucumber, squeeze dry, stir into yogurt with 1 garlic clove, remaining lemon juice and salt.',
      'Build 4 bowls: quinoa, chicken, diced cucumber, halved tomatoes, feta. Pack tzatziki in small cups.'] });

  recipe({ id: 'chicken-fajita-sheet-pan', meal: 'dinner', name: 'Chicken fajita sheet pan',
    time: 30, active: 10, method: 'oven', tags: ['sheet pan', 'tacos'],
    n: [500, 52, 40, 13],
    ing: [['chicken_breast', 2], ['bell_pepper', 3], ['onion', 2], ['taco_seasoning', 2], ['olive_oil', 2], ['tortillas', 8], ['greek_yogurt', 0.5], ['lime', 2]],
    steps: ['Heat oven to 425°F. Slice chicken, peppers and onions into strips.',
      'Toss everything with oil and taco seasoning on a sheet pan. Roast 20 minutes, stirring once.',
      'Portion into 4 containers with 2 tortillas each (wrap separately). Greek yogurt stands in for sour cream.',
      'Finish with lime juice when eating.'] });

  recipe({ id: 'beef-and-broccoli', meal: 'dinner', name: 'Beef & broccoli',
    time: 30, active: 25, method: 'stovetop', tags: ['takeout remake'],
    n: [530, 43, 58, 13],
    ing: [['sirloin', 1.5], ['broccoli', 1.5], ['soy_sauce', 4], ['cornstarch', 2], ['garlic', 3], ['honey', 2], ['sesame_oil', 1], ['ground_ginger', 1], ['rice', 2]],
    steps: ['Start 2 cups rice. Slice beef thin, toss with 1 tbsp cornstarch and 1 tbsp soy.',
      'Sear beef in sesame oil over high heat, 2 minutes per side. Remove.',
      'Add broccoli and 1/4 cup water, cover 3 minutes. Whisk remaining soy, honey, cornstarch, garlic, ginger with 1/2 cup water. Pour in with beef, toss until thick.',
      'Portion over rice into 4 containers.'] });

  recipe({ id: 'tuscan-chicken-skillet', meal: 'dinner', name: 'Tuscan chicken skillet with protein pasta',
    time: 30, active: 25, method: 'stovetop', tags: ['one pan', 'creamy'],
    n: [560, 60, 42, 15],
    ing: [['chicken_breast', 2], ['spinach', 10], ['cherry_tomato', 1], ['garlic', 4], ['chicken_broth', 1], ['greek_yogurt', 0.5], ['parmesan', 2], ['italian_seasoning', 2], ['protein_pasta', 8], ['olive_oil', 1]],
    steps: ['Boil pasta per the box. Cut chicken into bite-size pieces and season.',
      'Sear chicken in oil 6 minutes. Add garlic, halved tomatoes and Italian seasoning, 2 minutes.',
      'Add broth, simmer 3 minutes. Off the heat, stir in yogurt, parmesan and spinach until wilted.',
      'Toss with pasta. Portion into 4 containers.'] });

  recipe({ id: 'turkey-chili', meal: 'dinner', name: 'Turkey chili',
    time: 45, active: 15, method: 'stovetop', tags: ['one pot', 'freezer friendly'],
    n: [480, 50, 42, 12],
    ing: [['ground_turkey', 2], ['diced_tomatoes', 2], ['black_beans', 2], ['onion', 1], ['bell_pepper', 1], ['chili_powder', 6], ['cumin', 2], ['chicken_broth', 2], ['cheddar', 2], ['garlic', 3]],
    steps: ['Brown turkey with diced onion, pepper and garlic in a large pot, 8 minutes.',
      'Add chili powder, cumin, tomatoes, drained beans and broth. Simmer 25 minutes, uncovered.',
      'Portion into 4 containers, top with cheddar. Freezes well.'] });

  recipe({ id: 'teriyaki-salmon-bowls', meal: 'dinner', name: 'Teriyaki salmon bowls with edamame',
    time: 30, active: 15, method: 'oven', tags: ['bowls', 'omega-3'],
    n: [560, 42, 62, 16],
    ing: [['salmon', 1.5], ['soy_sauce', 4], ['honey', 2], ['garlic', 2], ['ground_ginger', 1], ['cornstarch', 1], ['edamame', 12], ['rice', 2], ['cucumber', 1], ['green_onion', 1]],
    steps: ['Start 2 cups rice. Heat oven to 400°F.',
      'Simmer soy, honey, garlic, ginger, cornstarch and 1/3 cup water 2 minutes until it thickens into teriyaki.',
      'Brush salmon with half the sauce, bake 12–14 minutes. Microwave edamame per the bag.',
      'Build 4 bowls: rice, salmon, edamame, sliced cucumber, green onion. Drizzle remaining sauce.'] });

  recipe({ id: 'bbq-pulled-chicken', meal: 'dinner', name: 'Slow-cooker BBQ pulled chicken, potatoes & slaw',
    time: 240, active: 15, method: 'slowcooker', tags: ['slow cooker', 'dump & go'],
    n: [520, 56, 52, 8],
    ing: [['chicken_breast', 2.5], ['bbq_sauce', 8], ['onion', 1], ['baby_potato', 2], ['coleslaw_mix', 14], ['greek_yogurt', 0.5], ['lime', 1], ['olive_oil', 1], ['salt_pepper', 1]],
    steps: ['Slow cooker: chicken, sliced onion, 6 tbsp BBQ sauce. HIGH 3–4 hours. Shred, stir in remaining sauce.',
      'Oven 425°F: halve potatoes, toss with oil and salt, roast 25 minutes.',
      'Slaw: toss coleslaw mix with yogurt, lime juice, salt and pepper.',
      'Portion chicken and potatoes into 4 containers; keep slaw in separate cups.'] });

  recipe({ id: 'chicken-curry-bowls', meal: 'dinner', name: 'Easy chicken curry with spinach & rice',
    time: 35, active: 20, method: 'stovetop', tags: ['one pot', 'freezer friendly'],
    n: [560, 46, 50, 18],
    ing: [['chicken_thigh', 2], ['greek_yogurt', 0.5], ['curry_powder', 2], ['garlic', 4], ['onion', 1], ['diced_tomatoes', 1], ['coconut_milk', 1], ['spinach', 5], ['rice', 2], ['olive_oil', 1]],
    steps: ['Start 2 cups rice. Cube chicken and toss with yogurt and 1 tbsp curry powder.',
      'Soften diced onion and garlic in oil, 4 minutes. Add chicken, cook 6 minutes.',
      'Add remaining curry powder, tomatoes and coconut milk. Simmer 12 minutes. Stir in spinach until wilted.',
      'Portion over rice into 4 containers.'] });

  recipe({ id: 'burger-bowls', meal: 'dinner', name: 'Burger bowls with oven fries',
    time: 35, active: 15, method: 'oven', tags: ['bowls', 'crowd pleaser'],
    n: [540, 50, 32, 24],
    ing: [['ground_beef', 2], ['romaine', 2], ['cherry_tomato', 1], ['cheddar', 4], ['onion', 1], ['baby_potato', 1.5], ['greek_yogurt', 0.5], ['sriracha', 2], ['olive_oil', 1], ['garlic_powder', 2], ['salt_pepper', 1]],
    steps: ['Oven 425°F: cut potatoes into wedges, toss with oil, salt and garlic powder. Roast 25 minutes.',
      'Brown beef with diced onion, salt and pepper, 8 minutes. Drain.',
      'Sauce: yogurt + sriracha. Chop romaine and halve tomatoes.',
      'Pack beef, cheddar and fries hot; lettuce, tomato and sauce cold in separate cups. Assemble when eating.'] });

  recipe({ id: 'shrimp-tacos', meal: 'dinner', name: 'Shrimp tacos with lime slaw',
    time: 20, active: 20, method: 'stovetop', tags: ['20 min', 'tacos'],
    n: [490, 46, 40, 15],
    ing: [['shrimp', 2], ['taco_seasoning', 1], ['coleslaw_mix', 14], ['lime', 2], ['greek_yogurt', 0.5], ['cilantro', 1], ['avocado', 2], ['tortillas', 12], ['olive_oil', 1]],
    steps: ['Thaw shrimp, pat dry, toss with taco seasoning. Sear in oil 2 minutes per side.',
      'Slaw: coleslaw mix, yogurt, juice of 2 limes, chopped cilantro, salt.',
      'Pack shrimp, slaw, tortillas (3 each) and half an avocado per container separately. Assemble when eating.'] });

  recipe({ id: 'honey-sriracha-chicken-sweet-potato', meal: 'dinner', name: 'Honey-sriracha chicken & sweet potato sheet pan',
    time: 35, active: 10, method: 'oven', tags: ['sheet pan', 'one pan'],
    n: [520, 48, 48, 16],
    ing: [['chicken_thigh', 2], ['sweet_potato', 2], ['broccoli', 0.75], ['honey', 2], ['sriracha', 2], ['soy_sauce', 2], ['garlic', 3], ['olive_oil', 2], ['salt_pepper', 1]],
    steps: ['Heat oven to 425°F. Cube sweet potatoes, toss with 1 tbsp oil and salt, roast 10 minutes.',
      'Toss thighs with honey, sriracha, soy, garlic and remaining oil. Add to pan with broccoli. Roast 22 minutes.',
      'Portion into 4 containers, spooning the glaze over the top.'] });

  // ---- BREAKFASTS (6) ----
  recipe({ id: 'overnight-protein-oats', meal: 'breakfast', name: 'Overnight protein oats',
    time: 10, active: 10, method: 'cold', tags: ['no cook', 'grab & go'],
    n: [420, 35, 50, 9],
    ing: [['oats', 2], ['protein_powder', 4], ['milk', 3], ['greek_yogurt', 1], ['chia', 4], ['berries', 8], ['cinnamon', 2]],
    steps: ['Divide oats, protein powder, chia and cinnamon between 4 jars.',
      'Add 3/4 cup milk and 1/4 cup yogurt to each, stir well.',
      'Top with 2 oz frozen berries. Lid and refrigerate overnight. Keeps 5 days.'] });

  recipe({ id: 'cottage-cheese-egg-bites', meal: 'breakfast', name: 'Cottage cheese egg bites',
    time: 30, active: 10, method: 'oven', tags: ['muffin tin', 'reheats well'],
    n: [280, 30, 6, 14],
    ing: [['eggs', 8], ['egg_whites', 1], ['cottage_cheese', 1], ['spinach', 5], ['cheddar', 2], ['bell_pepper', 1], ['salt_pepper', 1]],
    steps: ['Heat oven to 350°F. Grease a 12-cup muffin tin well.',
      'Blend eggs, egg whites, cottage cheese, salt and pepper. Stir in chopped spinach, diced pepper and cheddar.',
      'Fill cups, bake 22 minutes until set. Cool, store 3 per container. Microwave 45 seconds.'] });

  recipe({ id: 'greek-yogurt-power-bowls', meal: 'breakfast', name: 'Greek yogurt power bowls',
    time: 5, active: 5, method: 'cold', tags: ['no cook', '5 min'],
    n: [380, 42, 32, 10],
    ing: [['greek_yogurt', 4], ['protein_powder', 2], ['berries', 8], ['almonds', 2], ['honey', 2]],
    steps: ['Whisk protein powder into the yogurt (half a scoop per cup).',
      'Portion 1 cup per container. Top with 2 oz berries and a few almonds.',
      'Drizzle honey when eating.'] });

  recipe({ id: 'breakfast-burritos', meal: 'breakfast', name: 'Freezer breakfast burritos',
    time: 25, active: 20, method: 'stovetop', tags: ['freezer friendly'],
    n: [360, 36, 22, 15],
    ing: [['eggs', 8], ['cottage_cheese', 1], ['tortillas', 4], ['spinach', 3], ['salsa', 0.5], ['cheddar', 2], ['salt_pepper', 1]],
    steps: ['Whisk eggs with cottage cheese, salt and pepper. Scramble over medium-low until just set.',
      'Fold in spinach until wilted.',
      'Fill 4 tortillas with eggs, cheddar and salsa. Roll tight, wrap in foil. Fridge 4 days or freezer 1 month. Microwave 90 seconds.'] });

  recipe({ id: 'protein-pancakes', meal: 'breakfast', name: 'Banana protein pancakes',
    time: 25, active: 25, method: 'stovetop', tags: ['reheats well'],
    n: [400, 36, 50, 6],
    ing: [['oats', 2], ['egg_whites', 1.5], ['protein_powder', 2], ['banana', 2], ['greek_yogurt', 0.5], ['cinnamon', 2]],
    steps: ['Blend everything until smooth. Rest 5 minutes.',
      'Cook 1/4-cup pancakes on a nonstick pan over medium, 2 minutes per side. Makes about 12.',
      'Store 3 per container. Toast or microwave to reheat.'] });

  recipe({ id: 'pb-banana-smoothie-packs', meal: 'breakfast', name: 'PB-banana smoothie packs',
    time: 10, active: 10, method: 'cold', tags: ['no cook', 'freezer'],
    n: [450, 40, 48, 12],
    ing: [['banana', 4], ['protein_powder', 4], ['peanut_butter', 4], ['oats', 1], ['milk', 4]],
    steps: ['Slice bananas into 4 freezer bags with 1/4 cup oats and 1 tbsp peanut butter each. Freeze.',
      'Morning: dump a bag in the blender with 1 cup milk and 1 scoop protein. Blend 30 seconds.'] });

  // ---- LUNCHES (6) ----
  recipe({ id: 'chicken-caesar-wraps', meal: 'lunch', name: 'Rotisserie chicken Caesar wraps',
    time: 15, active: 15, method: 'cold', tags: ['no cook'],
    n: [420, 45, 25, 15],
    ing: [['rotisserie_chicken', 1], ['romaine', 2], ['parmesan', 2], ['greek_yogurt', 0.5], ['lemon', 1], ['garlic_powder', 1], ['tortillas', 4]],
    steps: ['Pull the chicken off the bone and shred (about 4 cups).',
      'Dressing: yogurt, lemon juice, parmesan, garlic powder, pepper.',
      'Toss chicken and chopped romaine with dressing. Pack filling and tortillas separately; roll when eating.'] });

  recipe({ id: 'mediterranean-tuna-salad', meal: 'lunch', name: 'Mediterranean tuna & chickpea salad',
    time: 15, active: 15, method: 'cold', tags: ['no cook', 'eat cold'],
    n: [380, 40, 24, 13],
    ing: [['tuna', 4], ['chickpeas', 1], ['cucumber', 1], ['cherry_tomato', 1], ['feta', 3], ['lemon', 1], ['olive_oil', 2], ['italian_seasoning', 1]],
    steps: ['Drain tuna and chickpeas. Dice cucumber, halve tomatoes.',
      'Toss everything with lemon juice, oil, Italian seasoning, salt and pepper.',
      'Portion into 4 containers. Keeps 4 days.'] });

  recipe({ id: 'buffalo-chicken-quinoa-bowls', meal: 'lunch', name: 'Buffalo chicken quinoa bowls',
    time: 30, active: 15, method: 'stovetop', tags: ['bowls'],
    n: [480, 50, 35, 14],
    ing: [['chicken_breast', 1.5], ['buffalo_sauce', 4], ['quinoa', 1], ['romaine', 1], ['cherry_tomato', 1], ['greek_yogurt', 0.5], ['cheddar', 2]],
    steps: ['Cook quinoa (1 cup quinoa, 2 cups water, 15 minutes).',
      'Cube chicken, sear 8 minutes, toss with buffalo sauce.',
      'Bowls: quinoa, chicken, chopped romaine, tomatoes, cheddar. Yogurt on the side as ranch-style cooling.'] });

  recipe({ id: 'turkey-cheese-snack-box', meal: 'lunch', name: 'Turkey & cheese protein box',
    time: 10, active: 10, method: 'cold', tags: ['no cook', 'bento'],
    n: [390, 38, 30, 14],
    ing: [['deli_turkey', 16], ['string_cheese', 4], ['apple', 4], ['almonds', 2], ['baby_carrots', 1], ['everything_seasoning', 1]],
    steps: ['Roll 4 oz turkey around each string cheese, sprinkle with everything seasoning.',
      'Pack with an apple, a handful of carrots and 1/2 oz almonds per box.'] });

  recipe({ id: 'chicken-burrito-bowls', meal: 'lunch', name: 'Chicken burrito bowls',
    time: 30, active: 15, method: 'stovetop', tags: ['bowls'],
    n: [520, 42, 58, 12],
    ing: [['chicken_thigh', 1.5], ['rice', 1.5], ['black_beans', 1], ['corn', 12], ['salsa', 1], ['lime', 2], ['cilantro', 1], ['taco_seasoning', 1]],
    steps: ['Start 1.5 cups rice. Dice chicken, toss with taco seasoning, sear 8 minutes.',
      'Stir lime juice and chopped cilantro into the cooked rice.',
      'Bowls: rice, chicken, drained beans, corn, salsa.'] });

  recipe({ id: 'protein-pasta-salad', meal: 'lunch', name: 'High-protein chicken pasta salad',
    time: 20, active: 15, method: 'stovetop', tags: ['eat cold'],
    n: [500, 48, 40, 16],
    ing: [['protein_pasta', 8], ['rotisserie_chicken', 1], ['mozzarella', 4], ['cherry_tomato', 1], ['spinach', 5], ['olive_oil', 2], ['italian_seasoning', 2], ['lemon', 1]],
    steps: ['Boil pasta, rinse cold. Shred the chicken.',
      'Toss pasta, chicken, mozzarella, halved tomatoes and spinach with oil, lemon juice and Italian seasoning.',
      'Portion into 4 containers. Keeps 4 days.'] });

  const SNACKS = [
    { name: 'Greek yogurt cup + handful of almonds', protein: 22 },
    { name: 'Cottage cheese with everything seasoning', protein: 24 },
    { name: 'Protein shake (1 scoop + milk)', protein: 32 },
    { name: 'String cheese × 2 + apple', protein: 14 },
    { name: 'Hard-boiled eggs × 2', protein: 12 },
    { name: 'Turkey roll-ups (4 oz)', protein: 22 },
  ];

  const WEEKS = [
    { name: 'Sheet-pan starter', blurb: 'Two sheet pans, one skillet, done in 90 minutes.',
      dinners: ['honey-garlic-chicken-broccoli', 'turkey-taco-bowls', 'lemon-pepper-salmon', 'beef-pepper-stir-fry', 'egg-roll-bowl'],
      breakfasts: ['overnight-protein-oats', 'cottage-cheese-egg-bites'],
      lunches: ['chicken-caesar-wraps', 'mediterranean-tuna-salad'] },
    { name: 'Set it and forget it', blurb: 'Slow cooker runs while you knock out the rest.',
      dinners: ['slow-cooker-salsa-chicken', 'turkey-meatballs-marinara', 'garlic-shrimp-stir-fry', 'bbq-pork-sheet-pan', 'greek-chicken-bowls'],
      breakfasts: ['greek-yogurt-power-bowls', 'breakfast-burritos'],
      lunches: ['buffalo-chicken-quinoa-bowls', 'turkey-cheese-snack-box'] },
    { name: 'Takeout, remade', blurb: 'Fajitas, beef & broccoli, teriyaki. Cheaper and 50g protein a plate.',
      dinners: ['chicken-fajita-sheet-pan', 'beef-and-broccoli', 'tuscan-chicken-skillet', 'turkey-chili', 'teriyaki-salmon-bowls'],
      breakfasts: ['protein-pancakes', 'overnight-protein-oats'],
      lunches: ['chicken-burrito-bowls', 'mediterranean-tuna-salad'] },
    { name: 'Comfort, leaned out', blurb: 'Pulled chicken, curry, burger bowls, tacos.',
      dinners: ['bbq-pulled-chicken', 'chicken-curry-bowls', 'burger-bowls', 'shrimp-tacos', 'honey-sriracha-chicken-sweet-potato'],
      breakfasts: ['pb-banana-smoothie-packs', 'cottage-cheese-egg-bites'],
      lunches: ['protein-pasta-salad', 'turkey-cheese-snack-box'] },
  ];

  return { catalog: C, recipes: R, weeks: WEEKS, snacks: SNACKS };
})();
if (typeof module !== 'undefined') module.exports = DATA;
