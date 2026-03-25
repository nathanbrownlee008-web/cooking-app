const sections = [
  {
    id: 'tools',
    level: 'Level 1',
    icon: '🔪',
    title: 'Tools',
    description: 'Start with the gear a home cook actually needs, what each tool does, and how to use it properly.',
    items: [
      {
        id: 'chef-knife',
        title: 'Chef Knife Basics',
        difficulty: 'Beginner',
        time: '10 min read',
        summary: 'How to hold a chef knife, how to guide with your other hand, and the safest way to chop at speed.',
        learn: ['Pinch grip for control', 'Claw hand for safety', 'Rock chop vs slice chop'],
        steps: [
          'Grip the blade with your thumb and side of index finger, not just the handle.',
          'Keep your guiding hand in a claw so your knuckles lead and fingertips stay back.',
          'Use a stable board with a damp cloth underneath so nothing slips.',
          'Cut with smooth, deliberate strokes instead of forcing the blade straight down.'
        ],
        tips: 'A sharp cheap knife is safer than a blunt expensive one. Keep it sharp and dry it straight away.'
      },
      {
        id: 'frying-pan',
        title: 'Frying Pan & Searing Pan',
        difficulty: 'Beginner',
        time: '8 min read',
        summary: 'What pan to use for eggs, chicken, steak, sauces, and why overcrowding ruins browning.',
        learn: ['Heat retention', 'When to use non-stick vs stainless', 'How to preheat properly'],
        steps: [
          'Use non-stick for eggs and delicate items, stainless or cast iron for proper browning.',
          'Preheat before food goes in; the pan should feel hot but not smoking wildly unless searing steak.',
          'Leave space between pieces of food so moisture can escape and colour can build.',
          'Lower the heat once colour is right to finish cooking without burning.'
        ],
        tips: 'If food is steaming instead of sizzling, your pan is crowded or not hot enough.'
      },
      {
        id: 'thermometer',
        title: 'Thermometer = Chef Shortcut',
        difficulty: 'Beginner',
        time: '6 min read',
        summary: 'The easiest way to cook chicken safely, steak accurately, and fish without guessing.',
        learn: ['Internal temperature', 'Carryover cooking', 'Where to probe'],
        steps: [
          'Insert the probe into the thickest part, not touching bone or pan.',
          'Use it near the end of cooking so you do not keep piercing meat too early.',
          'Pull meat slightly before target temperature because it rises a little while resting.'
        ],
        tips: 'A thermometer removes most of the fear from cooking meat.'
      },
      {
        id: 'mixing-bowls',
        title: 'Mixing Bowls, Whisk & Spatula',
        difficulty: 'Beginner',
        time: '5 min read',
        summary: 'Small tools that make prep cleaner, faster, and more organised.',
        learn: ['Mise en place', 'Whisking', 'Folding batter'],
        steps: [
          'Measure and set ingredients out before cooking starts.',
          'Use a whisk for smooth sauces and a spatula to scrape every bit out cleanly.',
          'For baking, fold gently when keeping air in the mixture matters.'
        ],
        tips: 'Chef-level cooking looks calm because the prep is done before the pan gets hot.'
      }
    ]
  },
  {
    id: 'ingredients',
    level: 'Level 2',
    icon: '🧂',
    title: 'Ingredients',
    description: 'Learn the building blocks: proteins, vegetables, fats, acids, herbs, spices, and pantry essentials.',
    items: [
      {
        id: 'salt-fat-acid-heat',
        title: 'Salt, Fat, Acid, Heat',
        difficulty: 'Beginner',
        time: '12 min read',
        summary: 'The four flavour pillars behind almost every good dish.',
        learn: ['Salt seasons', 'Fat carries flavour', 'Acid brightens', 'Heat controls texture'],
        steps: [
          'Salt should enhance the ingredient, not make it taste obviously salty.',
          'Fat gives mouthfeel and helps browning, from butter to olive oil.',
          'Acid like lemon or vinegar lifts heavy food and balances richness.',
          'Heat changes raw ingredients into crisp, tender, caramelised, or silky textures.'
        ],
        tips: 'When food tastes flat, it usually needs a touch more salt or acid.'
      },
      {
        id: 'proteins',
        title: 'Proteins: Chicken, Beef, Pork, Fish, Eggs',
        difficulty: 'Beginner',
        time: '14 min read',
        summary: 'What these ingredients do differently in the pan and why each needs a different approach.',
        learn: ['Lean vs fatty cuts', 'Delicate vs sturdy proteins', 'Resting time'],
        steps: [
          'Chicken breast cooks fast and dries fast, while thighs stay juicier and more forgiving.',
          'Steak loves high heat and a rest; mince wants colour for flavour.',
          'Pork is excellent with sweet, sharp, or smoky seasoning.',
          'Fish is delicate: moderate heat and less movement are key.',
          'Eggs react fast, so lower heat gives more control.'
        ],
        tips: 'Different cuts matter more than people think. Learn the cut, then learn the method.'
      },
      {
        id: 'veg-aromatics',
        title: 'Vegetables & Aromatics',
        difficulty: 'Beginner',
        time: '10 min read',
        summary: 'Onion, garlic, carrot, celery, mushrooms, peppers, potatoes, greens, and why they matter.',
        learn: ['Aromatics as a flavour base', 'Moisture levels', 'Roasting vs sautéing'],
        steps: [
          'Onion and garlic build the base of many sauces, soups, and stews.',
          'Mushrooms need space and time so they brown instead of boiling in their own water.',
          'Potatoes love salt and need enough oil or butter to turn crisp and golden.',
          'Leafy greens cook in seconds, root veg take longer and need a head start.'
        ],
        tips: 'Aromatics go in early, delicate herbs often go in late.'
      },
      {
        id: 'pantry',
        title: 'Chef Pantry Essentials',
        difficulty: 'Beginner',
        time: '8 min read',
        summary: 'The ingredients worth always having at home.',
        learn: ['Everyday pantry setup', 'Quick flavour boosters', 'Dessert basics'],
        steps: [
          'Keep oils, butter, salt, pepper, garlic, onions, lemons, vinegar, stock cubes, and dried pasta stocked.',
          'For baking, keep plain flour, sugar, cocoa, chocolate, eggs, vanilla, and baking powder.',
          'Fresh herbs, parmesan, cream, soy sauce, paprika, and chilli flakes give you range fast.'
        ],
        tips: 'A strong pantry turns random fridge ingredients into real meals.'
      }
    ]
  },
  {
    id: 'techniques',
    level: 'Level 3',
    icon: '🔥',
    title: 'Techniques',
    description: 'This is the chef part: prep, seasoning, browning, resting, tasting, reducing, and balancing flavour.',
    items: [
      {
        id: 'seasoning',
        title: 'How to Season Properly',
        difficulty: 'Core Skill',
        time: '12 min read',
        summary: 'When to salt, how much to use, and why seasoning in layers makes food taste better.',
        learn: ['Season early and finish late', 'Taste as you go', 'Layering'],
        steps: [
          'Season meat before cooking so salt starts working into the surface.',
          'Season vegetables before roasting or sautéing so they taste good all the way through.',
          'Taste sauces near the end and adjust with salt, pepper, acid, or a little butter.',
          'Finish with flaky salt only when it adds texture and contrast.'
        ],
        tips: 'Good cooks do not just add more salt; they balance salt, fat, acid, and sweetness.'
      },
      {
        id: 'browning',
        title: 'Browning & Caramelisation',
        difficulty: 'Core Skill',
        time: '10 min read',
        summary: 'The difference between pale food and restaurant-style flavour.',
        learn: ['Dry surface', 'Hot pan', 'Do not move too soon'],
        steps: [
          'Pat meat and vegetables dry so moisture does not kill browning.',
          'Heat the pan before oil, then add oil, then the food.',
          'Let food sit long enough to form colour before turning.',
          'If the pan is crowded, cook in batches.'
        ],
        tips: 'Colour is flavour. No colour usually means less flavour.'
      },
      {
        id: 'resting-meat',
        title: 'Resting Meat',
        difficulty: 'Core Skill',
        time: '7 min read',
        summary: 'Why cutting too soon loses juices and hurts texture.',
        learn: ['Carryover cooking', 'Redistribution of juices', 'When to rest longer'],
        steps: [
          'After cooking, place meat on a warm plate or board.',
          'Rest small cuts for a few minutes, larger roasts for longer.',
          'Slice across the grain when possible for tenderness.'
        ],
        tips: 'Resting is part of cooking, not a delay.'
      },
      {
        id: 'sauces',
        title: 'Quick Pan Sauces',
        difficulty: 'Intermediate',
        time: '14 min read',
        summary: 'Use the flavour left in the pan after meat to make sauces that feel chef-level.',
        learn: ['Fond', 'Deglazing', 'Reducing', 'Mounting with butter'],
        steps: [
          'After cooking meat, pour off excess fat but keep the browned bits.',
          'Add shallot or garlic and cook briefly.',
          'Deglaze with stock, wine, or water and scrape the pan.',
          'Reduce until stronger in flavour, then whisk in butter for gloss.'
        ],
        tips: 'A sauce turns a decent meal into a proper dish.'
      }
    ]
  },
  {
    id: 'methods',
    level: 'Level 4',
    icon: '🍳',
    title: 'Cooking Methods',
    description: 'The main methods every home cook should know: pan-fry, roast, boil, grill, steam, braise.',
    items: [
      {
        id: 'pan-frying',
        title: 'Pan-Frying',
        difficulty: 'Beginner',
        time: '9 min read',
        summary: 'Fast, direct heat for crust, colour, and speed.',
        learn: ['Preheat', 'Manage heat', 'Turn at the right time'],
        steps: [
          'Use enough oil to coat the base lightly.',
          'Wait for a good sizzle when food hits the pan.',
          'Turn heat down slightly after colour develops to finish through gently.'
        ],
        tips: 'Best for cutlets, fish, eggs, steaks, chicken pieces, and vegetables.'
      },
      {
        id: 'roasting',
        title: 'Roasting',
        difficulty: 'Beginner',
        time: '10 min read',
        summary: 'Oven cooking for even heat, crisp edges, and deep flavour.',
        learn: ['High heat vs moderate heat', 'Tray spacing', 'Turning halfway'],
        steps: [
          'Preheat the oven fully before loading the tray.',
          'Season and oil ingredients so they roast instead of dry out.',
          'Leave space between items for crisping.',
          'Turn halfway when even colour matters.'
        ],
        tips: 'Roasting is one of the easiest ways to cook like you know what you are doing.'
      },
      {
        id: 'boiling-pasta',
        title: 'Boiling Pasta & Potatoes',
        difficulty: 'Beginner',
        time: '8 min read',
        summary: 'How to season water, test doneness, and avoid bland basics.',
        learn: ['Salt the water', 'Save pasta water', 'Start potatoes cold'],
        steps: [
          'Salt the water properly before pasta goes in.',
          'Cook pasta until just tender, then finish it in sauce.',
          'Start potatoes in cold water so they cook evenly through.'
        ],
        tips: 'Pasta water is a sauce ingredient, not waste.'
      },
      {
        id: 'braising',
        title: 'Braising & Slow Cooking',
        difficulty: 'Intermediate',
        time: '11 min read',
        summary: 'The method that turns tough cuts into rich, soft, deep-flavoured dishes.',
        learn: ['Brown first', 'Liquid level', 'Low and slow'],
        steps: [
          'Brown the meat first for flavour.',
          'Add aromatics and cooking liquid.',
          'Cook covered at low heat until tender.'
        ],
        tips: 'Best for stews, short ribs, pork shoulder, and casseroles.'
      }
    ]
  },
  {
    id: 'meats',
    level: 'Level 5',
    icon: '🥩',
    title: 'Meat Mastery',
    description: 'How to prepare, season, cook, rest, and serve meat properly like a chef at home.',
    items: [
      {
        id: 'chicken-breast',
        title: 'Chicken Breast: Juicy, Not Dry',
        difficulty: 'Core Skill',
        time: '15 min read',
        summary: 'Prep, flattening, seasoning, searing, oven finishing, and exact doneness.',
        learn: ['Even thickness', 'Season well', 'Use a thermometer'],
        ingredients: ['Chicken breast', 'Salt', 'Pepper', 'Oil', 'Butter', 'Garlic', 'Lemon'],
        steps: [
          'Pat the chicken dry and lightly flatten the thickest part so it cooks evenly.',
          'Season both sides well with salt and pepper.',
          'Sear in a hot pan until golden on the first side, then flip.',
          'Add butter and garlic, baste briefly, then finish on lower heat or in the oven if needed.',
          'Rest before slicing so juices stay inside.'
        ],
        tips: 'Pull it when it is just cooked, not when it is already overcooked.'
      },
      {
        id: 'chicken-thighs',
        title: 'Chicken Thighs: Crispy Skin Method',
        difficulty: 'Beginner',
        time: '14 min read',
        summary: 'The easier, juicier chicken cut and how to get proper colour.',
        learn: ['Skin-side down first', 'Render fat', 'Do not move too early'],
        ingredients: ['Chicken thighs', 'Salt', 'Pepper', 'Oil', 'Thyme', 'Garlic'],
        steps: [
          'Dry the skin really well and season all over.',
          'Place skin-side down in a medium-hot pan.',
          'Leave it alone long enough to turn deeply golden and crisp.',
          'Flip and finish through gently.'
        ],
        tips: 'Thighs forgive mistakes more than breast, so they are brilliant for practice.'
      },
      {
        id: 'steak',
        title: 'Steak: Sear, Baste, Rest',
        difficulty: 'Core Skill',
        time: '16 min read',
        summary: 'The classic chef steak method with crust, butter basting, and proper resting.',
        learn: ['Dry steak', 'Very hot pan', 'Butter baste', 'Resting'],
        ingredients: ['Steak', 'Salt', 'Pepper', 'Neutral oil', 'Butter', 'Garlic', 'Thyme'],
        steps: [
          'Take the steak out ahead of time if practical and dry it well.',
          'Season it generously with salt and pepper.',
          'Sear in a very hot pan until a crust forms.',
          'Flip, add butter, garlic, and thyme, then baste.',
          'Rest before cutting and slice across the grain if needed.'
        ],
        tips: 'Avoid moving the steak constantly. Leave it to build a crust.'
      },
      {
        id: 'mince',
        title: 'Mince: Build Flavour First',
        difficulty: 'Beginner',
        time: '11 min read',
        summary: 'How to brown mince for bolognese, chilli, tacos, and meat sauces.',
        learn: ['Brown in batches', 'Do not boil it', 'Season in stages'],
        ingredients: ['Beef mince', 'Salt', 'Pepper', 'Onion', 'Garlic', 'Tomato paste'],
        steps: [
          'Get the pan hot and add mince without crowding.',
          'Let it brown before breaking it up fully.',
          'Add onion and garlic once colour develops.',
          'Use tomato paste or stock to deepen flavour.'
        ],
        tips: 'Grey mince tastes flatter than browned mince.'
      },
      {
        id: 'pork',
        title: 'Pork Chops & Pork Tenderloin',
        difficulty: 'Intermediate',
        time: '13 min read',
        summary: 'Tender pork loves seasoning, colour, and careful finishing.',
        learn: ['Brining optional', 'Do not overcook', 'Sweet-sharp pairings'],
        ingredients: ['Pork chops or tenderloin', 'Salt', 'Pepper', 'Oil', 'Butter', 'Mustard or apple'],
        steps: [
          'Season the pork well and sear for colour.',
          'Finish on gentler heat until just cooked.',
          'Rest briefly before slicing.'
        ],
        tips: 'Pork pairs brilliantly with mustard, apple, sage, honey, and cream.'
      },
      {
        id: 'fish',
        title: 'Fish: Delicate Heat & Crisp Skin',
        difficulty: 'Intermediate',
        time: '12 min read',
        summary: 'How to cook salmon and white fish without it sticking or breaking.',
        learn: ['Dry skin', 'Moderate heat', 'Minimal movement'],
        ingredients: ['Salmon or white fish', 'Salt', 'Oil', 'Butter', 'Lemon'],
        steps: [
          'Dry the fish very well, especially the skin.',
          'Use a hot but not screaming-hot pan.',
          'Place skin-side down and press gently at first if needed.',
          'Let the skin crisp before turning or finishing with butter.'
        ],
        tips: 'Fish keeps cooking quickly even after the heat is off.'
      }
    ]
  },
  {
    id: 'meals',
    level: 'Level 6',
    icon: '🍝',
    title: 'Meals',
    description: 'Use the foundations to cook complete dishes: quick dinners, comfort food, and proper chef-style plates.',
    items: [
      {
        id: 'garlic-pasta',
        title: 'Creamy Garlic Parmesan Pasta',
        difficulty: 'Beginner',
        time: '20 min cook',
        summary: 'An easy sauce lesson: butter, garlic, pasta water, cheese, and emulsifying properly.',
        ingredients: ['Pasta', 'Butter', 'Garlic', 'Parmesan', 'Black pepper', 'Pasta water'],
        steps: [
          'Boil pasta in salted water and save some of the cooking water.',
          'Cook garlic gently in butter.',
          'Add pasta, pasta water, and parmesan.',
          'Toss until silky and glossy, not thick and clumpy.'
        ],
        tips: 'The water and cheese create the sauce together.'
      },
      {
        id: 'bolognese',
        title: 'Rich Bolognese',
        difficulty: 'Intermediate',
        time: '60 min cook',
        summary: 'Colour, aromatics, tomato paste, stock, time, and patience.',
        ingredients: ['Beef mince', 'Onion', 'Carrot', 'Celery', 'Garlic', 'Tomato paste', 'Tinned tomatoes', 'Milk or stock'],
        steps: [
          'Brown the mince well.',
          'Cook the diced veg until softened.',
          'Add tomato paste and cook it out.',
          'Add tomatoes and stock, then simmer low until richer and deeper.'
        ],
        tips: 'A slower simmer makes a much better sauce.'
      },
      {
        id: 'roast-chicken-dinner',
        title: 'Simple Roast Chicken Dinner',
        difficulty: 'Intermediate',
        time: '75 min cook',
        summary: 'A proper home chef meal with crispy chicken, roast potatoes, and vegetables.',
        ingredients: ['Whole chicken or thighs', 'Potatoes', 'Carrots', 'Onion', 'Garlic', 'Butter', 'Thyme'],
        steps: [
          'Season the chicken thoroughly and roast until golden.',
          'Parboil potatoes, rough them up, then roast in hot fat.',
          'Roast vegetables around the meat or separately for better colour.'
        ],
        tips: 'Roast potatoes need hot oil and enough space.'
      },
      {
        id: 'stir-fry',
        title: 'Fast Stir-Fry',
        difficulty: 'Beginner',
        time: '15 min cook',
        summary: 'Quick prep, high heat, and cooking in the right order.',
        ingredients: ['Chicken or beef', 'Peppers', 'Broccoli', 'Garlic', 'Soy sauce', 'Honey', 'Rice or noodles'],
        steps: [
          'Prep everything before the pan gets hot.',
          'Cook the protein first, then remove it.',
          'Cook vegetables quickly on high heat.',
          'Return protein and sauce at the end.'
        ],
        tips: 'Stir-fry is fast because the prep was done first.'
      }
    ]
  },
  {
    id: 'desserts',
    level: 'Level 7',
    icon: '🍰',
    title: 'Desserts',
    description: 'Learn the baking side too: accuracy, texture, temperature, and finish.',
    items: [
      {
        id: 'brownies',
        title: 'Fudgy Brownies',
        difficulty: 'Beginner',
        time: '35 min bake',
        summary: 'Chocolate, butter, sugar, eggs, flour, and how not to overbake.',
        ingredients: ['Dark chocolate', 'Butter', 'Sugar', 'Eggs', 'Flour', 'Cocoa', 'Salt'],
        steps: [
          'Melt chocolate and butter together gently.',
          'Whisk eggs and sugar until smooth and slightly lighter.',
          'Fold in chocolate mixture, then flour and cocoa.',
          'Bake until set at the edges but still soft in the centre.'
        ],
        tips: 'For fudgy brownies, slightly underbaked is better than overbaked.'
      },
      {
        id: 'pancakes',
        title: 'Soft Pancakes',
        difficulty: 'Beginner',
        time: '20 min cook',
        summary: 'A batter lesson and a heat control lesson in one.',
        ingredients: ['Flour', 'Baking powder', 'Sugar', 'Milk', 'Egg', 'Butter', 'Vanilla'],
        steps: [
          'Mix dry ingredients separately from wet.',
          'Combine without overmixing.',
          'Cook on a medium pan until bubbles form, then flip.'
        ],
        tips: 'Lumps are fine. Overmixing makes pancakes tougher.'
      },
      {
        id: 'custard',
        title: 'Vanilla Custard Basics',
        difficulty: 'Intermediate',
        time: '18 min cook',
        summary: 'Great for learning gentle heat and thickening without scrambling eggs.',
        ingredients: ['Milk or cream', 'Egg yolks', 'Sugar', 'Vanilla'],
        steps: [
          'Warm the milk gently with vanilla.',
          'Whisk yolks and sugar.',
          'Temper the hot milk into the yolks slowly.',
          'Cook gently until it coats the back of a spoon.'
        ],
        tips: 'Custard needs patience and low heat.'
      },
      {
        id: 'cream-whipped',
        title: 'Whipped Cream & Dessert Finishing',
        difficulty: 'Beginner',
        time: '7 min read',
        summary: 'How to finish desserts neatly and stop them feeling homemade in the bad way.',
        learn: ['Cold cream', 'Soft peaks', 'Balancing sweetness'],
        steps: [
          'Use cold cream and a cold bowl if possible.',
          'Whisk to soft or medium peaks depending on the dessert.',
          'Finish with fruit, chocolate shavings, zest, or a sauce.'
        ],
        tips: 'Small finishing touches make desserts feel much more polished.'
      }
    ]
  }
];

const STORAGE_KEYS = {
  saved: 'chef_app_saved_ids',
  done: 'chef_app_done_ids'
};

let currentSectionId = 'tools';
let savedOnly = false;
let searchTerm = '';

const savedIds = new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.saved) || '[]'));
const doneIds = new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.done) || '[]'));

const mainNav = document.getElementById('mainNav');
const overviewGrid = document.getElementById('overviewGrid');
const sectionLevel = document.getElementById('sectionLevel');
const sectionTitle = document.getElementById('sectionTitle');
const sectionDescription = document.getElementById('sectionDescription');
const sectionStats = document.getElementById('sectionStats');
const cardGrid = document.getElementById('cardGrid');
const modal = document.getElementById('detailModal');
const modalContent = document.getElementById('modalContent');
const searchInput = document.getElementById('searchInput');
const showSavedOnlyBtn = document.getElementById('showSavedOnlyBtn');
const overallProgressFill = document.getElementById('overallProgressFill');
const overallProgressText = document.getElementById('overallProgressText');

function persist() {
  localStorage.setItem(STORAGE_KEYS.saved, JSON.stringify([...savedIds]));
  localStorage.setItem(STORAGE_KEYS.done, JSON.stringify([...doneIds]));
}

function flatItems() {
  return sections.flatMap(section =>
    section.items.map(item => ({ ...item, sectionId: section.id, sectionTitle: section.title, level: section.level }))
  );
}

function renderNav() {
  mainNav.innerHTML = sections.map(section => {
    const completedInSection = section.items.filter(item => doneIds.has(item.id)).length;
    return `
      <button class="nav-btn ${section.id === currentSectionId ? 'active' : ''}" data-section="${section.id}">
        ${section.icon} ${section.title}
        <small>${section.level} • ${completedInSection}/${section.items.length} done</small>
      </button>
    `;
  }).join('');

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentSectionId = btn.dataset.section;
      savedOnly = false;
      renderAll();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function renderOverview() {
  const items = flatItems();
  const total = items.length;
  const completed = items.filter(item => doneIds.has(item.id)).length;
  const saved = items.filter(item => savedIds.has(item.id)).length;
  const meatLessons = sections.find(s => s.id === 'meats').items.length;

  const cards = [
    { label: 'Total Lessons', value: total, note: 'Across tools, methods, meats, meals, and desserts.' },
    { label: 'Completed', value: completed, note: 'Track your progress like a learning path.' },
    { label: 'Saved Guides', value: saved, note: 'Your own quick-access cooking library.' },
    { label: 'Meat Lessons', value: meatLessons, note: 'Prep, seasoning, cooking, resting, serving.' }
  ];

  overviewGrid.innerHTML = cards.map(card => `
    <article class="overview-card">
      <h4>${card.label}</h4>
      <div class="overview-value">${card.value}</div>
      <div class="muted">${card.note}</div>
    </article>
  `).join('');

  const pct = total ? Math.round((completed / total) * 100) : 0;
  overallProgressFill.style.width = `${pct}%`;
  overallProgressText.textContent = `${pct}% complete`;
}

function getCurrentSection() {
  return sections.find(section => section.id === currentSectionId) || sections[0];
}

function filterItems(items) {
  return items.filter(item => {
    const haystack = [
      item.title,
      item.summary,
      ...(item.learn || []),
      ...(item.ingredients || []),
      ...(item.steps || [])
    ].join(' ').toLowerCase();

    const matchesSearch = !searchTerm || haystack.includes(searchTerm.toLowerCase());
    const matchesSaved = !savedOnly || savedIds.has(item.id);
    return matchesSearch && matchesSaved;
  });
}

function renderSection() {
  const section = getCurrentSection();
  sectionLevel.textContent = section.level;
  sectionTitle.textContent = `${section.icon} ${section.title}`;
  sectionDescription.textContent = section.description;

  const all = section.items;
  const visible = filterItems(all);
  const completed = all.filter(item => doneIds.has(item.id)).length;
  const savedCount = all.filter(item => savedIds.has(item.id)).length;

  sectionStats.innerHTML = `
    <span class="stat-pill">${all.length} lessons</span>
    <span class="stat-pill">${completed}/${all.length} completed</span>
    <span class="stat-pill">${savedCount} saved</span>
    <span class="stat-pill">${savedOnly ? 'Saved filter on' : 'All lessons showing'}</span>
  `;

  if (!visible.length) {
    cardGrid.innerHTML = `<div class="empty-state">No guides match that search right now.</div>`;
    return;
  }

  cardGrid.innerHTML = visible.map(item => `
    <article class="lesson-card">
      <div class="lesson-top">
        <div>
          <h4 class="lesson-title">${item.title}</h4>
          <div class="lesson-meta">
            <span class="badge gold">${item.difficulty}</span>
            <span class="badge">${item.time}</span>
            ${savedIds.has(item.id) ? '<span class="badge">⭐ Saved</span>' : ''}
            ${doneIds.has(item.id) ? '<span class="badge">✅ Done</span>' : ''}
          </div>
        </div>
      </div>
      <div class="card-summary">${item.summary}</div>
      <div class="card-footer">
        <button class="mini-btn primary-mini" data-open="${item.id}">Open Guide</button>
        <button class="mini-btn" data-save="${item.id}">${savedIds.has(item.id) ? 'Unsave' : 'Save'}</button>
        <button class="mini-btn ${doneIds.has(item.id) ? 'done' : ''}" data-done="${item.id}">${doneIds.has(item.id) ? 'Completed' : 'Mark Done'}</button>
      </div>
    </article>
  `).join('');

  cardGrid.querySelectorAll('[data-open]').forEach(btn => btn.addEventListener('click', () => openItem(btn.dataset.open)));
  cardGrid.querySelectorAll('[data-save]').forEach(btn => btn.addEventListener('click', () => toggleSave(btn.dataset.save)));
  cardGrid.querySelectorAll('[data-done]').forEach(btn => btn.addEventListener('click', () => toggleDone(btn.dataset.done)));
}

function openItem(itemId) {
  const item = flatItems().find(entry => entry.id === itemId);
  if (!item) return;

  modalContent.innerHTML = `
    <div class="detail-head">
      <span class="section-tag">${item.level} • ${item.sectionTitle}</span>
      <h2>${item.title}</h2>
      <p class="muted">${item.summary}</p>
      <div class="lesson-meta" style="margin-bottom: 14px;">
        <span class="badge gold">${item.difficulty}</span>
        <span class="badge">${item.time}</span>
        ${savedIds.has(item.id) ? '<span class="badge">⭐ Saved</span>' : ''}
        ${doneIds.has(item.id) ? '<span class="badge">✅ Done</span>' : ''}
      </div>
    </div>

    <div class="detail-grid">
      <div class="detail-box">
        <h4>How to do it</h4>
        <ol class="detail-steps">
          ${(item.steps || []).map(step => `<li>${step}</li>`).join('')}
        </ol>
        <div class="tip-box"><strong>Chef Tip:</strong> ${item.tips || 'Practice the basics slowly and cleanly first.'}</div>
      </div>
      <div>
        ${(item.learn || item.ingredients) ? `
          <div class="detail-box" style="margin-bottom: 14px;">
            <h4>${item.ingredients ? 'What you need' : 'What you learn'}</h4>
            <ul class="detail-list">
              ${((item.ingredients || item.learn || [
  ,
  {
    id: 'recipes',
    level: 'Recipe Book',
    icon: '📖',
    title: 'Recipe Book',
    description: 'Full step-by-step recipes with exact ingredients, prep, heat, and timings like a real cookbook.',
    items: [
      {
        id: 'garlic-pasta-recipe',
        title: 'Creamy Garlic Parmesan Pasta',
        difficulty: 'Easy',
        time: '20 mins total',
        summary: 'A simple creamy pasta using butter, garlic, parmesan, and pasta water.',
        ingredients: ['200g pasta','2 tbsp butter','2 cloves garlic','50g parmesan','Salt','Black pepper','1 cup pasta water'],
        learn: ['Prep: 5 mins','Cook: 15 mins','Heat: LOW–MEDIUM'],
        steps: [
          'Boil salted water and cook pasta until al dente.',
          'Save pasta water before draining.',
          'Melt butter on low heat and cook garlic gently.',
          'Add pasta and water.',
          'Add parmesan slowly and mix.',
          'Adjust texture and serve.'
        ],
        tips: 'Keep heat low or sauce will break.'
      }
    ]
  }
]).map(entry => `<li>${entry}</li>`)).join('')}
            </ul>
          </div>
        ` : ''}
        <div class="detail-box">
          <h4>Quick actions</h4>
          <div class="card-footer">
            <button class="mini-btn" id="modalSaveBtn">${savedIds.has(item.id) ? 'Unsave' : 'Save'}</button>
            <button class="mini-btn ${doneIds.has(item.id) ? 'done' : ''}" id="modalDoneBtn">${doneIds.has(item.id) ? 'Completed' : 'Mark Done'}</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('modalSaveBtn').addEventListener('click', () => toggleSave(item.id, true));
  document.getElementById('modalDoneBtn').addEventListener('click', () => toggleDone(item.id, true));

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

function toggleSave(itemId, rerenderModal = false) {
  if (savedIds.has(itemId)) savedIds.delete(itemId);
  else savedIds.add(itemId);
  persist();
  renderAll();
  if (rerenderModal) openItem(itemId);
}

function toggleDone(itemId, rerenderModal = false) {
  if (doneIds.has(itemId)) doneIds.delete(itemId);
  else doneIds.add(itemId);
  persist();
  renderAll();
  if (rerenderModal) openItem(itemId);
}

function renderAll() {
  renderNav();
  renderOverview();
  renderSection();
  showSavedOnlyBtn.textContent = savedOnly ? 'Show All' : 'Saved Only';
}

document.getElementById('closeModalBtn').addEventListener('click', closeModal);
document.getElementById('modalBackdrop').addEventListener('click', closeModal);
document.getElementById('jumpStartBtn').addEventListener('click', () => {
  currentSectionId = 'tools';
  savedOnly = false;
  renderAll();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
document.getElementById('savedBtn').addEventListener('click', () => {
  currentSectionId = 'meals';
  savedOnly = true;
  renderAll();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
showSavedOnlyBtn.addEventListener('click', () => {
  savedOnly = !savedOnly;
  renderAll();
});
searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value.trim();
  renderSection();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

renderAll();
