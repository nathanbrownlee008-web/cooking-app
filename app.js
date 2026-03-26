const STORAGE_KEY = "chef-at-home-paste-recipes-v2";
const LEGACY_KEYS = ["myRecipes", "chef-at-home-paste-recipes-v1"];
const CATEGORIES = ["All", "Meats", "Salads", "Desserts", "Drinks", "Kids Menu"];

let recipes = [];
let activeCategory = "All";
let activeSearch = "";

const els = {
  recipeCount: document.getElementById("recipeCount"),
  categoryFilters: document.getElementById("categoryFilters"),
  searchInput: document.getElementById("searchInput"),
  surpriseBtn: document.getElementById("surpriseBtn"),
  recipeGrid: document.getElementById("recipeGrid"),
  recipeModal: document.getElementById("recipeModal"),
  modalContent: document.getElementById("modalContent"),
  closeModalBtn: document.getElementById("closeModalBtn"),
  addRecipeBtn: document.getElementById("addRecipeBtn"),
  addModal: document.getElementById("addModal"),
  closeAddModalBtn: document.getElementById("closeAddModalBtn"),
  cancelAddBtn: document.getElementById("cancelAddBtn"),
  saveRecipeBtn: document.getElementById("saveRecipeBtn"),
  pasteArea: document.getElementById("pasteArea")
};

function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function slugify(text) {
  return String(text || "recipe")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || `recipe-${Date.now()}`;
}

function openModal(modal) {
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal(modal) {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  if (document.querySelectorAll(".modal:not(.hidden)").length === 0) {
    document.body.classList.remove("modal-open");
  }
}

function saveRecipes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

function loadRecipes() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    recipes = Array.isArray(saved) ? saved : [];
  } catch {
    recipes = [];
  }
}

function clearLegacyRecipeStorage() {
  LEGACY_KEYS.forEach((key) => {
    if (key !== STORAGE_KEY) localStorage.removeItem(key);
  });
}

function normalizeCategory(value, title = "", raw = "") {
  const joined = `${value} ${title} ${raw}`.toLowerCase();

  if (/(salad|slaw|caesar|coleslaw)/.test(joined)) return "Salads";
  if (/(dessert|sweet|cake|brownie|cookie|cookies|ice cream|cheesecake|pudding|trifle|muffin|cupcake)/.test(joined)) return "Desserts";
  if (/(drink|juice|smoothie|shake|coffee|tea|cocktail|mocktail|lemonade|milkshake)/.test(joined)) return "Drinks";
  if (/(kids|kid|children|child|toddler|nuggets|fish fingers|mini pizza)/.test(joined)) return "Kids Menu";
  return "Meats";
}

function stripListPrefix(line) {
  return String(line || "")
    .replace(/^[-*•●▪◦]+\s*/, "")
    .replace(/^\d+[.)-]\s*/, "")
    .trim();
}

function cleanLine(line) {
  return stripListPrefix(String(line || "").replace(/\s+/g, " ").trim());
}

function isMetadataLine(line) {
  return /^(category|time|total time|cook time|prep time|heat|main heat|serves|difficulty|description)\s*:/i.test(line);
}

function looksLikeIngredient(line) {
  const cleaned = cleanLine(line);
  if (!cleaned) return false;
  if (cleaned.length > 120) return false;
  if (/^(method|instructions?|steps?)\s*:?$/i.test(cleaned)) return false;
  if (/[|]/.test(cleaned)) return false;
  if (/^(preheat|mix|stir|cook|bake|boil|fry|add|pour|whisk|simmer|leave|rest|serve|melt|fold|combine|beat|grease|line)\b/i.test(cleaned)) return false;
  if (/\b(preheat|mix|stir|cook|bake|boil|fry|add|pour|whisk|simmer|leave|rest|serve|melt|fold|combine|beat|grease|line)\b/i.test(cleaned) && cleaned.length > 28) return false;

  return /^\d/.test(cleaned)
    || /\b(\d+\s?(g|kg|ml|l|tbsp|tsp|oz|lb|cm)|half|quarter|pinch|handful)\b/i.test(cleaned)
    || /\b(clove|cloves|egg|eggs|breast|breasts|fillet|fillets|onion|onions|butter|oil|flour|sugar|salt|pepper|cream|milk|water|pasta|rice|chicken|beef|lettuce|tomato|tomatoes|cheese|chocolate|cocoa|vanilla|strawberries|blueberries)\b/i.test(cleaned);
}

function looksLikeTimeValue(line) {
  return /\b\d+\s?(min|mins|minutes|hr|hrs|hour|hours)\b/i.test(line);
}

function looksLikeHeatValue(line) {
  return /\b(low|medium|high|medium-high|medium high|medium-low|medium low|oven|hob|air fryer|grill|gas mark|fan oven|electric hob)\b/i.test(line);
}

function parseInlineStep(line, index) {
  const cleaned = cleanLine(line);
  const pipeParts = cleaned.split("|").map((part) => part.trim()).filter(Boolean);

  if (pipeParts.length >= 4) {
    return {
      title: pipeParts[0],
      heat: pipeParts[1],
      time: pipeParts[2],
      body: pipeParts.slice(3).join(" | ")
    };
  }

  const numbered = cleaned.match(/^(step\s*\d+|\d+[.)-]?)\s*(.*)$/i);
  const baseText = numbered ? numbered[2].trim() : cleaned;

  const timeMatch = baseText.match(/\b(\d+\s?(?:min|mins|minutes|hr|hrs|hour|hours))\b/i);
  const heatMatch = baseText.match(/\b(low|medium|high|medium-high|medium high|medium-low|medium low|oven|hob|air fryer|grill|gas mark \d+)\b/i);

  let title = `Step ${index + 1}`;
  const titleSplit = baseText.split(/[:.-]\s+/);
  if (titleSplit.length > 1 && titleSplit[0].length <= 40) {
    title = titleSplit[0];
  }

  return {
    title,
    heat: heatMatch ? heatMatch[1] : "See note",
    time: timeMatch ? timeMatch[1] : "See note",
    body: baseText
  };
}

function dedupeStrings(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = item.toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function parseRecipeBlock(rawText) {
  const text = String(rawText || "").replace(/\r/g, "").trim();
  if (!text) throw new Error("Paste a recipe first.");

  const rawLines = text.split("\n");
  const lines = rawLines.map((line) => line.trim()).filter(Boolean);
  if (!lines.length) throw new Error("Paste a recipe first.");

  const recipe = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: cleanLine(lines[0]) || "Untitled Recipe",
    category: "Meats",
    time: "",
    heat: "",
    description: "Imported from your pasted recipe notes.",
    ingredients: [],
    steps: []
  };

  let section = "";
  const looseLines = [];

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    const lower = line.toLowerCase();

    if (/^ingredients?\s*:?$/i.test(line) || /^ingredients?\s*:/i.test(line)) {
      section = "ingredients";
      const after = line.split(":").slice(1).join(":").trim();
      if (after) recipe.ingredients.push(cleanLine(after));
      continue;
    }

    if (/^(steps?|method|instructions?)\s*:?$/i.test(line) || /^(steps?|method|instructions?)\s*:/i.test(line)) {
      section = "steps";
      const after = line.split(":").slice(1).join(":").trim();
      if (after) recipe.steps.push(parseInlineStep(after, recipe.steps.length));
      continue;
    }

    if (/^category\s*:/i.test(line)) {
      recipe.category = normalizeCategory(line.split(":").slice(1).join(":").trim(), recipe.title, text);
      continue;
    }

    if (/^(time|total time|cook time|prep time)\s*:/i.test(line)) {
      const value = line.split(":").slice(1).join(":").trim();
      if (value) recipe.time = value;
      continue;
    }

    if (/^(heat|main heat)\s*:/i.test(line)) {
      const value = line.split(":").slice(1).join(":").trim();
      if (value) recipe.heat = value;
      continue;
    }

    if (/^description\s*:/i.test(line)) {
      const value = line.split(":").slice(1).join(":").trim();
      if (value) recipe.description = value;
      continue;
    }

    if (/^serves\s*:/i.test(line) || /^difficulty\s*:/i.test(line)) {
      continue;
    }

    if (section === "ingredients") {
      if (/^(steps?|method|instructions?)\s*:?$/i.test(line)) {
        section = "steps";
      } else {
        recipe.ingredients.push(cleanLine(line));
        continue;
      }
    }

    if (section === "steps") {
      recipe.steps.push(parseInlineStep(line, recipe.steps.length));
      continue;
    }

    looseLines.push(line);
  }

  const looseIngredients = [];
  const looseSteps = [];

  for (const line of looseLines) {
    const cleaned = cleanLine(line);
    if (!cleaned) continue;

    if (!recipe.time && looksLikeTimeValue(cleaned) && /^(about|around|takes|ready in|bake for|cook for|time)/i.test(cleaned)) {
      recipe.time = cleaned.replace(/^(time\s*:?)/i, "").trim();
      continue;
    }

    if (!recipe.heat && looksLikeHeatValue(cleaned) && /^(heat|hob|oven|cook on|bake at|fry on|air fryer)/i.test(cleaned)) {
      recipe.heat = cleaned.replace(/^(heat\s*:?)/i, "").trim();
      continue;
    }

    if (looksLikeIngredient(cleaned) && looseSteps.length === 0) {
      looseIngredients.push(cleaned);
      continue;
    }

    looseSteps.push(parseInlineStep(cleaned, looseSteps.length));
  }

  if (!recipe.ingredients.length) recipe.ingredients = looseIngredients;
  if (!recipe.steps.length) recipe.steps = looseSteps;

  // Fallback split for big messy blocks with ingredient lines followed by instruction lines.
  if (!recipe.ingredients.length && !recipe.steps.length) {
    const bodyLines = lines.slice(1).map(cleanLine).filter(Boolean);
    const ingredientBucket = [];
    const stepBucket = [];
    let switchedToSteps = false;

    bodyLines.forEach((line) => {
      if (!switchedToSteps && looksLikeIngredient(line)) {
        ingredientBucket.push(line);
      } else {
        switchedToSteps = true;
        if (!isMetadataLine(line)) stepBucket.push(parseInlineStep(line, stepBucket.length));
      }
    });

    recipe.ingredients = ingredientBucket;
    recipe.steps = stepBucket;
  }

  recipe.ingredients = dedupeStrings(recipe.ingredients.map(cleanLine).filter(Boolean));
  recipe.steps = recipe.steps
    .map((step, index) => ({
      title: cleanLine(step.title) || `Step ${index + 1}`,
      heat: cleanLine(step.heat) || "See note",
      time: cleanLine(step.time) || "See note",
      body: cleanLine(step.body)
    }))
    .filter((step) => step.body);

  if (!recipe.time) {
    const firstTimedStep = recipe.steps.find((step) => step.time && step.time !== "See note");
    recipe.time = firstTimedStep?.time || "Not set";
  }

  if (!recipe.heat) {
    const firstHeatedStep = recipe.steps.find((step) => step.heat && step.heat !== "See note");
    recipe.heat = firstHeatedStep?.heat || "Not set";
  }

  recipe.category = normalizeCategory(recipe.category, recipe.title, text);
  recipe.id = slugify(`${recipe.title}-${recipe.id}`);

  if (!recipe.ingredients.length && !recipe.steps.length) {
    throw new Error("Could not detect ingredients or steps from that paste.");
  }

  return recipe;
}

function getVisibleRecipes() {
  return recipes.filter((recipe) => {
    const categoryMatch = activeCategory === "All" || recipe.category === activeCategory;
    const searchBlob = [
      recipe.title,
      recipe.category,
      recipe.time,
      recipe.heat,
      recipe.description,
      ...(recipe.ingredients || []),
      ...(recipe.steps || []).map((step) => `${step.title} ${step.heat} ${step.time} ${step.body}`)
    ].join(" ").toLowerCase();

    return categoryMatch && (!activeSearch || searchBlob.includes(activeSearch));
  });
}

function renderCategories() {
  els.categoryFilters.innerHTML = CATEGORIES.map((cat) => `
    <button class="chip ${cat === activeCategory ? "active" : ""}" data-category="${escapeHtml(cat)}">${escapeHtml(cat)}</button>
  `).join("");

  els.categoryFilters.querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.category;
      renderCategories();
      renderRecipes();
    });
  });
}

function renderRecipes() {
  const visible = getVisibleRecipes();
  els.recipeCount.textContent = String(visible.length);

  if (!visible.length) {
    els.recipeGrid.innerHTML = '<div class="empty-state">No recipes yet. Tap <strong>+ Add Recipe</strong> and paste a full recipe block 👨‍🍳</div>';
    return;
  }

  els.recipeGrid.innerHTML = visible.map((recipe) => {
    const preview = recipe.steps?.[0]?.body || recipe.ingredients?.slice(0, 3).join(", ") || "Recipe ready to open.";
    return `
      <article class="recipe-card">
        <div class="recipe-top">
          <span class="category-badge">${escapeHtml(recipe.category)}</span>
          <span class="time-badge">${escapeHtml(recipe.time || "Not set")}</span>
        </div>
        <h3>${escapeHtml(recipe.title)}</h3>
        <p class="recipe-desc">${escapeHtml(preview)}</p>
        <div class="recipe-meta-row">
          <span class="level-badge">🔥 ${escapeHtml(recipe.heat || "Not set")}</span>
          <span class="serving-badge">🥘 ${(recipe.ingredients || []).length} ingredients</span>
        </div>
        <button class="primary-btn" data-open-id="${escapeHtml(recipe.id)}">View Recipe</button>
      </article>
    `;
  }).join("");

  els.recipeGrid.querySelectorAll("[data-open-id]").forEach((btn) => {
    btn.addEventListener("click", () => openRecipe(btn.dataset.openId));
  });
}

function renderIngredientList(items) {
  if (!items?.length) {
    return '<div class="note-item"><span class="bullet"></span><div>None found from this paste.</div></div>';
  }

  return items.map((item) => `
    <div class="ingredient-item">
      <span class="bullet"></span>
      <div>${escapeHtml(item)}</div>
    </div>
  `).join("");
}

function renderSteps(steps) {
  if (!steps?.length) {
    return '<div class="step-card"><div class="step-body">No steps found in this recipe.</div></div>';
  }

  return steps.map((step, index) => `
    <div class="step-card">
      <div class="step-head">
        <div class="step-number">${index + 1}</div>
        <div class="step-title">${escapeHtml(step.title || `Step ${index + 1}`)}</div>
        <div class="step-badges">
          <span class="badge">${escapeHtml(step.heat || "See note")}</span>
          <span class="badge">${escapeHtml(step.time || "See note")}</span>
        </div>
      </div>
      <div class="step-body">${escapeHtml(step.body || "")}</div>
    </div>
  `).join("");
}

function openRecipe(id) {
  const recipe = recipes.find((item) => item.id === id);
  if (!recipe) return;

  els.modalContent.innerHTML = `
    <div class="recipe-hero">
      <div class="hero-topline">${escapeHtml(recipe.category)}</div>
      <h2>${escapeHtml(recipe.title)}</h2>
      <p>${escapeHtml(recipe.description || "Imported from your pasted recipe notes.")}</p>
      <div class="quick-info-grid">
        <div class="info-card">
          <span class="info-label">Category</span>
          <span class="info-value">${escapeHtml(recipe.category)}</span>
        </div>
        <div class="info-card">
          <span class="info-label">Total time</span>
          <span class="info-value">${escapeHtml(recipe.time || "Not set")}</span>
        </div>
        <div class="info-card">
          <span class="info-label">Main heat</span>
          <span class="info-value">${escapeHtml(recipe.heat || "Not set")}</span>
        </div>
        <div class="info-card">
          <span class="info-label">Steps</span>
          <span class="info-value">${recipe.steps?.length || 0}</span>
        </div>
      </div>
    </div>

    <div class="recipe-layout">
      <section class="panel">
        <h3>Ingredients</h3>
        ${renderIngredientList(recipe.ingredients)}
      </section>

      <section class="panel">
        <h3>Steps</h3>
        <div class="steps-list">${renderSteps(recipe.steps)}</div>
      </section>
    </div>

    <div class="recipe-actions">
      <button class="danger-btn" data-delete-id="${escapeHtml(recipe.id)}">Delete Recipe</button>
    </div>
  `;

  const deleteBtn = els.modalContent.querySelector("[data-delete-id]");
  deleteBtn?.addEventListener("click", () => {
    recipes = recipes.filter((recipeItem) => recipeItem.id !== recipe.id);
    saveRecipes();
    renderRecipes();
    closeModal(els.recipeModal);
  });

  openModal(els.recipeModal);
}

function handleSaveRecipe() {
  try {
    const parsed = parseRecipeBlock(els.pasteArea.value);
    recipes.unshift(parsed);
    saveRecipes();
    renderRecipes();
    els.pasteArea.value = "";
    closeModal(els.addModal);
  } catch (error) {
    alert(error.message || "Could not parse recipe.");
  }
}

function handleSurprise() {
  const visible = getVisibleRecipes();
  if (!visible.length) {
    alert("No recipes to choose from yet.");
    return;
  }
  const randomRecipe = visible[Math.floor(Math.random() * visible.length)];
  openRecipe(randomRecipe.id);
}

function wireEvents() {
  els.searchInput.addEventListener("input", (event) => {
    activeSearch = event.target.value.trim().toLowerCase();
    renderRecipes();
  });

  els.surpriseBtn.addEventListener("click", handleSurprise);
  els.addRecipeBtn.addEventListener("click", () => openModal(els.addModal));
  els.closeModalBtn.addEventListener("click", () => closeModal(els.recipeModal));
  els.closeAddModalBtn.addEventListener("click", () => closeModal(els.addModal));
  els.cancelAddBtn.addEventListener("click", () => closeModal(els.addModal));
  els.saveRecipeBtn.addEventListener("click", handleSaveRecipe);

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target.classList.contains("modal-backdrop")) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal(els.recipeModal);
      closeModal(els.addModal);
    }
  });
}

function init() {
  clearLegacyRecipeStorage();
  loadRecipes();
  renderCategories();
  renderRecipes();
  wireEvents();
}

init();
