
const STORAGE_KEY = "chef_deluxe_fixed_recipes_v7";
const LEGACY_KEYS = [
  "chef_deluxe_fixed_recipes_v4",
  "chef_deluxe_custom_recipes",
  "chefRecipes",
  "myRecipes"
];

const FIXED_CATEGORIES = ["All", "Meats", "Salads", "Desserts", "Drinks", "Kids Menu"];

const state = {
  category: "All",
  search: ""
};

const grid = document.getElementById("recipeGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilters = document.getElementById("categoryFilters");
const recipeCount = document.getElementById("recipeCount");
const modal = document.getElementById("recipeModal");
const modalContent = document.getElementById("modalContent");
const closeModalBtn = document.getElementById("closeModalBtn");
const surpriseBtn = document.getElementById("surpriseBtn");
const addRecipeBtn = document.getElementById("addRecipeBtn");
const addModal = document.getElementById("addModal");
const closeAddModalBtn = document.getElementById("closeAddModalBtn");
const cancelAddBtn = document.getElementById("cancelAddBtn");
const fixRecipeBtn = document.getElementById("fixRecipeBtn");
const pasteArea = document.getElementById("pasteArea");

for (const key of LEGACY_KEYS) {
  try { localStorage.removeItem(key); } catch (_) {}
}

let recipes = readStore(STORAGE_KEY);

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function readStore(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function saveRecipe(recipe) {
  recipes.unshift(recipe);
  writeStore(STORAGE_KEY, recipes);
}

function persistRecipes() {
  writeStore(STORAGE_KEY, recipes);
}

function updateRecipeTitle(id, newTitle) {
  const recipe = recipes.find(item => item.id === id);
  if (!recipe) return;
  recipe.title = newTitle.trim();
  recipe.description = `${recipe.title} cleaned up with Fix Recipe mode and saved into your ${recipe.category.toLowerCase()} cookbook.`;
  persistRecipes();
}

function deleteRecipe(id) {
  recipes = recipes.filter(item => item.id !== id);
  persistRecipes();
}

function escapeHtml(text = "") {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function openModal(element) {
  element.classList.remove("hidden");
  element.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal(element) {
  element.classList.add("hidden");
  element.setAttribute("aria-hidden", "true");
  if (modal.classList.contains("hidden") && addModal.classList.contains("hidden")) {
    document.body.classList.remove("modal-open");
  }
}

function renderFilters() {
  categoryFilters.innerHTML = FIXED_CATEGORIES.map(category => `
    <button class="chip ${state.category === category ? "active" : ""}" data-category="${escapeHtml(category)}">
      ${escapeHtml(category)}
    </button>
  `).join("");

  categoryFilters.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      state.category = btn.dataset.category;
      renderFilters();
      renderRecipes();
    });
  });
}

function renderIngredientSections(recipe) {
  const sections = Array.isArray(recipe.ingredientSections) && recipe.ingredientSections.length
    ? recipe.ingredientSections
    : [{ title: "Ingredients", items: recipe.ingredients || [] }];

  return sections.map((section, index) => `
    <section class="panel" style="${index ? "margin-top:16px;" : ""}">
      <h3>${escapeHtml(section.title)}</h3>
      ${(section.items || []).length ? section.items.map(item => `
        <div class="ingredient-item">
          <span class="bullet"></span>
          <div>${escapeHtml(item)}</div>
        </div>
      `).join("") : `<div class="ingredient-item"><span class="bullet"></span><div>None added.</div></div>`}
    </section>
  `).join("");
}

function matchesRecipe(recipe) {
  const ingredientText = (recipe.ingredientSections || []).flatMap(section => section.items || []);
  const haystack = [
    recipe.title,
    recipe.category,
    recipe.description,
    ...(recipe.tags || []),
    ...(recipe.ingredients || []),
    ...ingredientText,
    ...(recipe.notes || []),
    ...((recipe.steps || []).map(step => `${step.title} ${step.heat} ${step.time} ${step.body}`))
  ].join(" ").toLowerCase();

  const searchOk = !state.search || haystack.includes(state.search.toLowerCase());
  const categoryOk = state.category === "All" || recipe.category === state.category;
  return searchOk && categoryOk;
}

function renderRecipes() {
  const filtered = recipes.filter(matchesRecipe);
  recipeCount.textContent = recipes.length;

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="empty-state">
        No recipes yet. Tap <strong>+ Add Recipe</strong>, paste your notes, and use <strong>Fix Recipe</strong>.
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(recipe => `
    <article class="recipe-card">
      <div class="recipe-top">
        <span class="category-badge">${escapeHtml(recipe.category)}</span>
        <span class="time-badge">${escapeHtml(recipe.time || "See steps")}</span>
      </div>
      <h3>${escapeHtml(recipe.title)}</h3>
      <p class="recipe-desc">${escapeHtml(recipe.description || "Imported from your pasted recipe notes.")}</p>
      <div class="recipe-meta-row">
        <span class="level-badge">${escapeHtml(recipe.difficulty || "Chef Fix")}</span>
        <span class="serving-badge">${escapeHtml(recipe.serves || "Custom")}</span>
      </div>
      <button class="primary-btn" data-open-id="${escapeHtml(recipe.id)}">Open recipe</button>
    </article>
  `).join("");

  grid.querySelectorAll("[data-open-id]").forEach(btn => {
    btn.addEventListener("click", () => openRecipe(btn.dataset.openId));
  });
}

function openRecipe(id) {
  const recipe = recipes.find(item => item.id === id);
  if (!recipe) return;

  modalContent.innerHTML = `
    <div class="recipe-hero">
      <div class="hero-topline">${escapeHtml(recipe.category)}</div>
      <h2>${escapeHtml(recipe.title)}</h2>
      <p>${escapeHtml(recipe.description || "Imported from your pasted recipe notes.")}</p>
      <div class="recipe-actions" style="display:flex; gap:10px; flex-wrap:wrap; margin:16px 0 0;">
        <button class="secondary-btn" id="editRecipeNameBtn">Edit name</button>
        <button class="secondary-btn" id="deleteRecipeBtn">Remove recipe</button>
      </div>
      <div class="quick-info-grid">
        <div class="info-card">
          <span class="info-label">Category</span>
          <div class="info-value">${escapeHtml(recipe.category)}</div>
        </div>
        <div class="info-card">
          <span class="info-label">Total time</span>
          <div class="info-value">${escapeHtml(recipe.time || "See steps")}</div>
        </div>
        <div class="info-card">
          <span class="info-label">Serves</span>
          <div class="info-value">${escapeHtml(recipe.serves || "Custom")}</div>
        </div>
        <div class="info-card">
          <span class="info-label">Steps</span>
          <div class="info-value">${String((recipe.steps || []).length)}</div>
        </div>
      </div>
    </div>

    <div class="recipe-layout">
      <div>
        ${renderIngredientSections(recipe)}

        <section class="panel" style="margin-top:16px;">
          <h3>Chef notes</h3>
          ${(recipe.notes || []).length ? recipe.notes.map(item => `
            <div class="note-item">
              <span class="bullet"></span>
              <div>${escapeHtml(item)}</div>
            </div>
          `).join("") : `<div class="note-item"><span class="bullet"></span><div>No notes.</div></div>`}
        </section>
      </div>

      <section class="panel">
        <h3>Steps</h3>
        <div class="steps-list">
          ${(recipe.steps || []).map((step, index) => `
            <article class="step-card">
              <div class="step-head">
                <div class="step-number">${index + 1}</div>
                <div class="step-title">${escapeHtml(step.title || `Step ${index + 1}`)}</div>
                <div class="step-badges">
                  ${step.heat ? `<span class="badge">${escapeHtml(step.heat)}</span>` : ""}
                  ${step.time ? `<span class="badge">${escapeHtml(step.time)}</span>` : ""}
                </div>
              </div>
              <div class="step-body">${escapeHtml(step.body || "")}</div>
            </article>
          `).join("")}
        </div>
      </section>
    </div>
  `;

  const editBtn = document.getElementById("editRecipeNameBtn");
  const deleteBtn = document.getElementById("deleteRecipeBtn");

  if (editBtn) {
    editBtn.addEventListener("click", () => {
      const nextTitle = prompt("Edit recipe name", recipe.title || "");
      if (!nextTitle || !nextTitle.trim()) return;
      updateRecipeTitle(recipe.id, nextTitle);
      renderRecipes();
      openRecipe(recipe.id);
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      const confirmed = confirm(`Remove "${recipe.title}" from your cookbook?`);
      if (!confirmed) return;
      deleteRecipe(recipe.id);
      closeModal(modal);
      renderRecipes();
    });
  }

  openModal(modal);
}

function inferCategory(raw) {
  const lower = raw.toLowerCase();
  if (/(brownie|cake|cookie|dessert|chocolate|icing|fudge|pancake|muffin|banoffee|sweet)/.test(lower)) return "Desserts";
  if (/(salad|lettuce|cucumber|tomato salad|caesar)/.test(lower)) return "Salads";
  if (/(juice|drink|smoothie|milkshake|tea|coffee|lemonade|mocktail)/.test(lower)) return "Drinks";
  if (/(kids|nuggets|fish fingers|mini pizza|fries)/.test(lower)) return "Kids Menu";
  return "Meats";
}

function cleanLine(line) {
  return line
    .replace(/^[-•*]\s*/, "")
    .replace(/^\d+[.)]\s*/, "")
    .trim();
}

function normaliseSectionTitle(title) {
  const lower = title.toLowerCase().replace(/:$/, "").trim();
  if (/(fudge sauce|sauce|ganache|topping|icing)/.test(lower)) return "Fudge Sauce Ingredients";
  if (/(brownie batter|batter|brownies|main|base)/.test(lower)) return "Brownie Batter Ingredients";
  if (/(ingredients|ingredient)/.test(lower)) return "Ingredients";
  return title.replace(/:$/, "").trim();
}

function isIngredientHeading(line) {
  const lower = line.toLowerCase().replace(/:$/, "").trim();
  return /^(ingredients|ingredient|brownie batter|batter|brownies|fudge sauce|sauce|ganache|icing|topping|for the brownies|for the sauce)$/.test(lower);
}

function isMethodHeading(line) {
  const lower = line.toLowerCase().replace(/:$/, "").trim();
  return /^(method|steps|step|instructions|instruction|method for brownies|method for sauce)$/.test(lower);
}

function isIngredientLine(line) {
  const lower = line.toLowerCase();
  return (
    (/\d/.test(lower) && /(g|kg|ml|l|tbsp|tsp|teaspoon|tablespoon|cup|cups|oz|egg|eggs)/.test(lower)) ||
    /^(pinch|handful)\b/.test(lower) ||
    /^(salt|pepper|butter|sugar|flour|cream|milk|oil|vanilla|chocolate)\b/.test(lower)
  );
}

function splitIntoSections(raw) {
  const lines = raw.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const title = lines[0] || "Custom Recipe";
  const items = lines.slice(1);

  const ingredientSections = [];
  const methodLines = [];
  let currentIngredientSection = "Ingredients";
  let mode = "auto";

  function getOrCreateSection(title) {
    const existing = ingredientSections.find(section => section.title === title);
    if (existing) return existing;
    const section = { title, items: [] };
    ingredientSections.push(section);
    return section;
  }

  for (const original of items) {
    const line = cleanLine(original);
    if (!line) continue;

    if (isIngredientHeading(line)) {
      currentIngredientSection = normaliseSectionTitle(line);
      mode = "ingredients";
      getOrCreateSection(currentIngredientSection);
      continue;
    }

    if (isMethodHeading(line)) {
      mode = "method";
      continue;
    }

    if (line.endsWith(":") && !isIngredientLine(line)) {
      const possibleSection = normaliseSectionTitle(line);
      if (/Ingredients$/i.test(possibleSection)) {
        currentIngredientSection = possibleSection;
        mode = "ingredients";
        getOrCreateSection(currentIngredientSection);
      } else {
        methodLines.push({ section: line.replace(/:$/, ""), text: "" });
        mode = "method";
      }
      continue;
    }

    if (isIngredientLine(line) && mode !== "method") {
      getOrCreateSection(currentIngredientSection).items.push(line);
      mode = "ingredients";
      continue;
    }

    methodLines.push({ section: "", text: line });
    mode = "method";
  }

  const cleanedSections = ingredientSections
    .map(section => ({ title: section.title, items: Array.from(new Set(section.items)) }))
    .filter(section => section.items.length);

  return { title, ingredientSections: cleanedSections, methodLines };
}

function getSectionItems(ingredientSections, matcher) {
  const result = [];
  ingredientSections.forEach(section => {
    section.items.forEach(item => {
      if (matcher(item.toLowerCase(), section.title.toLowerCase())) result.push(item);
    });
  });
  return Array.from(new Set(result));
}

function joinItems(items) {
  if (!items.length) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function buildMergedSteps(title, ingredientSections, methodLines, category) {
  const fullText = methodLines.map(item => item.text).join(" ").toLowerCase();

  const batterChocolate = getSectionItems(ingredientSections, (item, section) =>
    section.includes("batter") && item.includes("chocolate")
  );
  const batterButter = getSectionItems(ingredientSections, (item, section) =>
    section.includes("batter") && item.includes("butter")
  );
  const batterSugar = getSectionItems(ingredientSections, (item, section) =>
    section.includes("batter") && item.includes("sugar")
  );
  const batterEggs = getSectionItems(ingredientSections, (item, section) =>
    section.includes("batter") && item.includes("egg")
  );
  const batterDry = getSectionItems(ingredientSections, (item, section) =>
    section.includes("batter") && /(flour|cocoa|salt|vanilla)/.test(item)
  );

  const sauceItems = getSectionItems(ingredientSections, (item, section) =>
    section.includes("sauce")
  );

  const allIngredients = ingredientSections.flatMap(section => section.items);
  const anySauce = sauceItems.length > 0 || /fudge sauce|sauce|ganache|icing|topping/.test(fullText);
  const isBrownieStyle = /brownie/.test(title.toLowerCase()) || /brownie/.test(fullText);

  if (isBrownieStyle) {
    const steps = [];

    steps.push({
      title: "Prep the oven and tin",
      heat: "No heat",
      time: "5 min",
      body: "Preheat the oven to 180°C (160 fan) and line your tin with baking paper, leaving some overhang so the brownies lift out cleanly."
    });

    const meltText = [];
    if (batterChocolate.length || batterButter.length) {
      meltText.push(`Gently melt ${joinItems([...batterChocolate, ...batterButter])} together until smooth and glossy.`);
    } else {
      meltText.push("Gently melt the chocolate and butter together until smooth and glossy.");
    }
    meltText.push("Use hob 1–2 on an electric hob or short microwave bursts, then let it cool slightly so it does not scramble the eggs.");
    steps.push({
      title: "Melt the chocolate and butter",
      heat: "Hob 1–2 low",
      time: "3–5 min",
      body: meltText.join(" ")
    });

    const batterBits = [];
    if (batterSugar.length) batterBits.push(joinItems(batterSugar));
    if (batterEggs.length) batterBits.push(joinItems(batterEggs));
    if (batterDry.length) batterBits.push(joinItems(batterDry));
    const batterSugarText = batterSugar.length ? joinItems(batterSugar) : "200g sugar";
    const batterEggText = batterEggs.length ? joinItems(batterEggs) : "3 eggs";
    const batterDryText = batterDry.length ? joinItems(batterDry) : "100g plain flour, 30g cocoa powder, a pinch of salt, and 1 tsp vanilla";
    const batterBody = `Add ${batterSugarText} to the cooled chocolate mixture and stir until combined. Crack in ${batterEggText} one at a time, mixing well after each addition so the batter stays smooth and glossy. Fold in ${batterDryText} gently until just combined — do not overmix or the brownies can turn cakey instead of fudgy.`;
    steps.push({
      title: "Make the brownie batter",
      heat: "No heat",
      time: "4–5 min",
      body: batterBody
    });

    steps.push({
      title: "Bake",
      heat: "Oven 180°C (160 fan)",
      time: "20–25 min",
      body: "Pour the batter into the lined tin and bake until the edges are set and the centre still has a slight wobble. Do not overbake."
    });

    if (anySauce) {
      const sauceBody = sauceItems.length
        ? `Add ${joinItems(sauceItems)} to a small pan or heatproof bowl and warm gently, stirring until the sauce turns smooth, glossy, and pourable. Keep the heat low so it stays silky and does not split.`
        : "Add the cream, butter, chocolate, and syrup to a small pan or bowl and warm gently, stirring until the sauce is smooth, glossy, and pourable.";
      steps.push({
        title: "Make the fudge sauce",
        heat: "Hob 1–2 low",
        time: "2–4 min",
        body: sauceBody
      });
    }

    steps.push({
      title: "Cool and serve",
      heat: "No heat",
      time: "30–60 min",
      body: anySauce
        ? "Let the brownies cool in the tin before slicing so the centre sets properly and the texture turns fudgy, then spoon over the warm sauce when serving."
        : "Let the brownies cool in the tin before slicing so the centre sets properly and the texture turns fudgy."
    });

    
    steps.push({
      title: "Optional: Thicker fudge finish",
      heat: "Fridge",
      time: "1–2 hours",
      body: "For a thicker sauce and more fudgy texture, place the brownies in the fridge for 1–2 hours after cooling. This firms up the centre and makes them extra dense and rich."
    });

  return steps;
  }

  const genericSteps = [];
  const joined = methodLines
    .filter(item => item.text)
    .map(item => item.text)
    .join(" ");

  const sentences = joined
    .split(/(?<=[.!?])\s+/)
    .map(item => item.trim())
    .filter(Boolean);

  const buckets = [
    { key: "prep", title: "Prep", heat: "No heat", time: "5 min", test: /preheat|line|grease|trim|pat dry|measure|prepare|prep/ },
    { key: "start", title: "Start cooking", heat: "Hob 3–4 medium", time: "4–6 min", test: /melt|heat|fry|cook|boil|sear|brown/ },
    { key: "combine", title: "Bring it together", heat: "Hob 2–3 low-medium", time: "3–5 min", test: /mix|whisk|beat|stir|fold|combine|add/ },
    { key: "finish", title: "Finish", heat: "No heat", time: "As needed", test: /rest|cool|serve|slice|leave|chill/ }
  ];

  const grouped = {};
  buckets.forEach(bucket => { grouped[bucket.key] = []; });

  sentences.forEach(sentence => {
    const bucket = buckets.find(item => item.test.test(sentence.toLowerCase()));
    if (bucket) grouped[bucket.key].push(sentence);
    else grouped.combine.push(sentence);
  });

  buckets.forEach(bucket => {
    if (grouped[bucket.key].length) {
      genericSteps.push({
        title: bucket.title,
        heat: bucket.heat,
        time: bucket.time,
        body: grouped[bucket.key].join(" ")
      });
    }
  });

  return genericSteps.length ? genericSteps : [{
    title: "Method",
    heat: "No heat",
    time: "As needed",
    body: "Paste a recipe with a clearer ingredients section and a clearer method section for a better Fix Recipe result."
  }];
}

function buildDescription(title, category, ingredientSections) {
  const extra = ingredientSections.length > 1 ? "with split ingredient sections" : "with cleaner grouped steps";
  return `${title} cleaned up with Fix Recipe mode and saved into your ${category.toLowerCase()} cookbook ${extra}.`;
}

function parseRecipeFromText(raw) {
  const category = inferCategory(raw);
  const { title, ingredientSections, methodLines } = splitIntoSections(raw);

  let fixedSections = ingredientSections;
  if (!fixedSections.length) {
    fixedSections = [{ title: "Ingredients", items: [] }];
  }

  if (
    fixedSections.length === 1 &&
    fixedSections[0].title === "Ingredients" &&
    /brownie/i.test(title) &&
    fixedSections[0].items.length > 8
  ) {
    const batter = [];
    const sauce = [];
    fixedSections[0].items.forEach(item => {
      const lower = item.toLowerCase();
      if (/cream|golden syrup/.test(lower)) sauce.push(item);
      else if (/100g dark chocolate/.test(lower) && sauce.length === 0 && batter.some(existing => /dark chocolate/.test(existing.toLowerCase()))) sauce.push(item);
      else if (/butter/.test(lower) && sauce.length && sauce.every(existing => !/butter/.test(existing.toLowerCase()))) sauce.push(item);
      else batter.push(item);
    });

    const rebuilt = [];
    if (batter.length) rebuilt.push({ title: "Brownie Batter Ingredients", items: batter });
    if (sauce.length) rebuilt.push({ title: "Fudge Sauce Ingredients", items: sauce });
    fixedSections = rebuilt.length ? rebuilt : fixedSections;
  }

  const steps = buildMergedSteps(title, fixedSections, methodLines, category);
  const totalTime = steps.map(step => step.time).find(time => /\d/.test(time)) || "See steps";

  return {
    id: slug(`${title}-${Date.now()}`),
    title,
    category,
    difficulty: "Chef Fix",
    time: category === "Desserts" && /brownie/i.test(title) ? "35–45 min" : totalTime,
    serves: "Custom",
    description: buildDescription(title, category, fixedSections),
    tags: [category, "Fixed", "Step-by-step"],
    ingredients: fixedSections.flatMap(section => section.items),
    ingredientSections: fixedSections,
    notes: [
      "Electric hob guide: 1–2 low, 3–4 medium, 5–6 high.",
      "Times are guide times — use texture and colour as your final check.",
      "Fix Recipe now groups small actions into fuller steps and tries to split sauce ingredients from the main mix."
    ],
    steps
  };
}

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value.trim();
  renderRecipes();
});

surpriseBtn.addEventListener("click", () => {
  if (!recipes.length) return;
  const filtered = recipes.filter(matchesRecipe);
  const pool = filtered.length ? filtered : recipes;
  const random = pool[Math.floor(Math.random() * pool.length)];
  openRecipe(random.id);
});

addRecipeBtn.addEventListener("click", () => openModal(addModal));
closeModalBtn.addEventListener("click", () => closeModal(modal));
closeAddModalBtn.addEventListener("click", () => closeModal(addModal));
cancelAddBtn.addEventListener("click", () => closeModal(addModal));

modal.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal-backdrop")) closeModal(modal);
});
addModal.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal-backdrop")) closeModal(addModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal(modal);
    closeModal(addModal);
  }
});

fixRecipeBtn.addEventListener("click", () => {
  const raw = pasteArea.value.trim();
  if (!raw) {
    alert("Paste your recipe first.");
    return;
  }

  const recipe = parseRecipeFromText(raw);
  saveRecipe(recipe);
  renderRecipes();
  closeModal(addModal);
  pasteArea.value = "";
  state.category = "All";
  renderFilters();
  openRecipe(recipe.id);
});

window.openRecipe = openRecipe;

renderFilters();
renderRecipes();
