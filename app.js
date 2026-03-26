const STORAGE_KEY = "chef-at-home-paste-recipes-v1";
const DEFAULT_CATEGORIES = ["All", "Meats", "Salads", "Desserts", "Drinks", "Kids Menu"];

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

function slugify(text) {
  return String(text || "recipe")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || `recipe-${Date.now()}`;
}

function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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

function getVisibleRecipes() {
  return recipes.filter((recipe) => {
    const categoryMatch = activeCategory === "All" || recipe.category === activeCategory;
    const searchText = [
      recipe.title,
      recipe.category,
      recipe.time,
      recipe.heat,
      ...(recipe.ingredients || []),
      ...(recipe.steps || []).map((step) => `${step.title} ${step.body} ${step.heat} ${step.time}`)
    ].join(" ").toLowerCase();
    const searchMatch = !activeSearch || searchText.includes(activeSearch);
    return categoryMatch && searchMatch;
  });
}

function renderCategories() {
  els.categoryFilters.innerHTML = DEFAULT_CATEGORIES.map((cat) => `
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
    els.recipeGrid.innerHTML = `<div class="empty-state">No recipes yet. Tap <strong>+ Add Recipe</strong> and paste your first recipe block 👨‍🍳</div>`;
    return;
  }

  els.recipeGrid.innerHTML = visible.map((recipe) => {
    const preview = recipe.steps?.[0]?.body || recipe.ingredients?.slice(0, 3).join(", ") || "Chef-style recipe ready to open.";
    return `
      <article class="recipe-card">
        <div class="recipe-top">
          <span class="category-badge">${escapeHtml(recipe.category)}</span>
          <span class="time-badge">${escapeHtml(recipe.time || "No time")}</span>
        </div>
        <h3>${escapeHtml(recipe.title)}</h3>
        <p class="recipe-desc">${escapeHtml(preview)}</p>
        <div class="recipe-meta-row">
          <span class="level-badge">🔥 ${escapeHtml(recipe.heat || "No heat")}</span>
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

function buildBulletList(items) {
  if (!items?.length) {
    return `<div class="note-item"><span class="bullet"></span><div>None added.</div></div>`;
  }

  return items.map((item) => `
    <div class="ingredient-item">
      <span class="bullet"></span>
      <div>${escapeHtml(item)}</div>
    </div>
  `).join("");
}

function buildSteps(steps) {
  if (!steps?.length) {
    return `<div class="step-card"><div class="step-body">No steps found in this recipe.</div></div>`;
  }

  return steps.map((step, index) => `
    <div class="step-card">
      <div class="step-head">
        <div class="step-number">${index + 1}</div>
        <div class="step-title">${escapeHtml(step.title || `Step ${index + 1}`)}</div>
        <div class="step-badges">
          <span class="badge">${escapeHtml(step.heat || "No heat")}</span>
          <span class="badge">${escapeHtml(step.time || "No time")}</span>
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
      <p>${escapeHtml(recipe.description || "Clean paste-imported recipe.")}</p>
      <div class="quick-info-grid">
        <div class="info-card">
          <span class="info-label">Category</span>
          <span class="info-value">${escapeHtml(recipe.category)}</span>
        </div>
        <div class="info-card">
          <span class="info-label">Total Time</span>
          <span class="info-value">${escapeHtml(recipe.time || "Not set")}</span>
        </div>
        <div class="info-card">
          <span class="info-label">Main Heat</span>
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
        ${buildBulletList(recipe.ingredients)}
      </section>

      <section class="panel">
        <h3>Steps</h3>
        <div class="steps-list">${buildSteps(recipe.steps)}</div>
      </section>
    </div>

    <div class="recipe-actions">
      <button class="danger-btn" data-delete-id="${escapeHtml(recipe.id)}">Delete Recipe</button>
    </div>
  `;

  const deleteBtn = els.modalContent.querySelector("[data-delete-id]");
  deleteBtn?.addEventListener("click", () => {
    deleteRecipe(recipe.id);
  });

  openModal(els.recipeModal);
}

function deleteRecipe(id) {
  recipes = recipes.filter((recipe) => recipe.id !== id);
  saveRecipes();
  renderRecipes();
  closeModal(els.recipeModal);
}

function normalizeCategory(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) return "Meats";

  if (raw.includes("salad")) return "Salads";
  if (raw.includes("dessert") || raw.includes("sweet") || raw.includes("cake") || raw.includes("brownie")) return "Desserts";
  if (raw.includes("drink") || raw.includes("cocktail") || raw.includes("juice") || raw.includes("smoothie") || raw.includes("coffee")) return "Drinks";
  if (raw.includes("kid")) return "Kids Menu";
  return "Meats";
}

function stripListPrefix(line) {
  return line
    .replace(/^[-*•]+\s*/, "")
    .replace(/^\d+[.)-]\s*/, "")
    .trim();
}

function isLikelyIngredient(line) {
  return /\b(g|kg|ml|l|tbsp|tsp|cup|cups|oz|lb|clove|cloves|breast|breasts|fillet|fillets|egg|eggs|onion|onions|butter|oil|flour|sugar|salt|pepper|cream|milk|water|pasta|rice|chicken|beef|lettuce|tomato|tomatoes|cheese|chocolate)\b/i.test(line) || /^\d/.test(line);
}

function parseStepLine(line, index) {
  const cleaned = stripListPrefix(line);
  const pipeParts = cleaned.split("|").map((part) => part.trim()).filter(Boolean);
  if (pipeParts.length >= 4) {
    return {
      title: pipeParts[0],
      heat: pipeParts[1],
      time: pipeParts[2],
      body: pipeParts.slice(3).join(" | ")
    };
  }

  const sentenceParts = cleaned.split(/\s+-\s+/).map((part) => part.trim()).filter(Boolean);
  if (sentenceParts.length >= 3) {
    return {
      title: sentenceParts[0],
      heat: sentenceParts[1],
      time: sentenceParts[2],
      body: sentenceParts.slice(3).join(" - ") || sentenceParts[0]
    };
  }

  return {
    title: `Step ${index + 1}`,
    heat: "See note",
    time: "See note",
    body: cleaned
  };
}

function parseRecipeBlock(rawText) {
  const text = String(rawText || "").replace(/\r/g, "").trim();
  if (!text) throw new Error("Paste a recipe first.");

  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  if (!lines.length) throw new Error("Paste a recipe first.");

  const recipe = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: lines[0],
    category: "Meats",
    time: "",
    heat: "",
    description: "Imported from your pasted recipe notes.",
    ingredients: [],
    steps: []
  };

  let section = "";
  const freeLines = [];

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    const lower = line.toLowerCase();

    if (/^ingredients?\s*:/i.test(line) || lower === "ingredients") {
      section = "ingredients";
      const after = line.split(":").slice(1).join(":").trim();
      if (after) recipe.ingredients.push(stripListPrefix(after));
      continue;
    }

    if (/^(steps?|method|instructions?)\s*:/i.test(line) || lower === "steps" || lower === "method" || lower === "instructions") {
      section = "steps";
      const after = line.split(":").slice(1).join(":").trim();
      if (after) recipe.steps.push(parseStepLine(after, recipe.steps.length));
      continue;
    }

    if (/^category\s*:/i.test(line)) {
      recipe.category = normalizeCategory(line.split(":").slice(1).join(":").trim());
      continue;
    }

    if (/^time\s*:/i.test(line) || /^cook\s*time\s*:/i.test(line) || /^total\s*time\s*:/i.test(line)) {
      recipe.time = line.split(":").slice(1).join(":").trim();
      continue;
    }

    if (/^heat\s*:/i.test(line)) {
      recipe.heat = line.split(":").slice(1).join(":").trim();
      continue;
    }

    if (/^description\s*:/i.test(line)) {
      recipe.description = line.split(":").slice(1).join(":").trim() || recipe.description;
      continue;
    }

    if (section === "ingredients") {
      recipe.ingredients.push(stripListPrefix(line));
      continue;
    }

    if (section === "steps") {
      recipe.steps.push(parseStepLine(line, recipe.steps.length));
      continue;
    }

    freeLines.push(line);
  }

  if (!recipe.ingredients.length || !recipe.steps.length) {
    const possibleIngredients = [];
    const possibleSteps = [];

    freeLines.forEach((line) => {
      if (isLikelyIngredient(line) && possibleSteps.length === 0) {
        possibleIngredients.push(stripListPrefix(line));
      } else {
        possibleSteps.push(parseStepLine(line, possibleSteps.length));
      }
    });

    if (!recipe.ingredients.length) recipe.ingredients = possibleIngredients;
    if (!recipe.steps.length) recipe.steps = possibleSteps;
  }

  if (!recipe.time && recipe.steps.length) {
    const stepTimes = recipe.steps.map((step) => step.time).filter(Boolean);
    recipe.time = stepTimes[0] || "Not set";
  }

  if (!recipe.heat && recipe.steps.length) {
    const stepHeats = recipe.steps.map((step) => step.heat).filter(Boolean);
    recipe.heat = stepHeats[0] || "Not set";
  }

  recipe.category = normalizeCategory(recipe.category);
  recipe.title = recipe.title || "Untitled Recipe";
  recipe.ingredients = recipe.ingredients.filter(Boolean);
  recipe.steps = recipe.steps.filter((step) => step.body || step.title);

  if (!recipe.ingredients.length && !recipe.steps.length) {
    throw new Error("Could not detect ingredients or steps from that paste.");
  }

  recipe.id = slugify(`${recipe.title}-${recipe.id}`);
  return recipe;
}

function handleSaveRecipe() {
  try {
    const parsed = parseRecipeBlock(els.pasteArea.value);
    recipes.unshift(parsed);
    saveRecipes();
    renderRecipes();
    closeModal(els.addModal);
    els.pasteArea.value = "";
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
  loadRecipes();
  renderCategories();
  renderRecipes();
  wireEvents();
}

init();
