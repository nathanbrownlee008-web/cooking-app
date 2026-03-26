const STORAGE_KEY = "chef_deluxe_fixed_recipes_v4";
const LEGACY_KEYS = [
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
  if (key !== STORAGE_KEY) {
    try { localStorage.removeItem(key); } catch (_) {}
  }
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

function getCategories() {
  return FIXED_CATEGORIES;
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
  categoryFilters.innerHTML = getCategories().map(category => `
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

function matchesRecipe(recipe) {
  const haystack = [
    recipe.title,
    recipe.category,
    recipe.description,
    ...(recipe.tags || []),
    ...(recipe.ingredients || []),
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
        <section class="panel">
          <h3>Ingredients</h3>
          ${(recipe.ingredients || []).length ? recipe.ingredients.map(item => `
            <div class="ingredient-item">
              <span class="bullet"></span>
              <div>${escapeHtml(item)}</div>
            </div>
          `).join("") : `<div class="ingredient-item"><span class="bullet"></span><div>None added.</div></div>`}
        </section>

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

function isSectionHeading(line) {
  const lower = line.toLowerCase().replace(/:$/, "").trim();
  return [
    "ingredients", "ingredient", "method", "steps", "step", "instructions", "instruction",
    "fudge sauce", "sauce", "brownies", "brownie", "for the sauce", "for the brownies",
    "topping", "filling", "icing", "ganache"
  ].includes(lower);
}

function isIngredientLine(line) {
  const lower = line.toLowerCase();
  return /\d/.test(lower) && /(g|kg|ml|l|tbsp|tsp|teaspoon|tablespoon|cup|cups|oz|egg|eggs)/.test(lower)
    || /^(pinch|handful)\b/.test(lower)
    || /^(salt|pepper|butter|sugar|flour|cream|milk|oil)\b/.test(lower);
}

function looksLikeInstruction(line) {
  const lower = line.toLowerCase();
  return /^(preheat|line|grease|melt|mix|whisk|beat|fold|stir|add|pour|bake|cook|heat|simmer|boil|fry|rest|cool|chill|serve|place|remove|microwave|combine|spread|slice|season|turn|flip|cover|leave|put)\b/.test(lower)
    || /(oven|hob|pan|bake|microwave|fridge|freezer)/.test(lower);
}

function extractTime(line) {
  const lower = line.toLowerCase();
  const match = lower.match(/\b(\d+\s*(?:-|to)\s*\d+|\d+)\s*(seconds?|secs?|minutes?|mins?|hours?|hrs?)\b/);
  if (match) {
    return `${match[1].replace(/\s*to\s*/g, "–")} ${match[2].replace("secs", "sec").replace("seconds", "sec").replace("minutes", "min").replace("mins", "min").replace("hours", "hr").replace("hrs", "hr")}`;
  }
  if (/20 second bursts?/.test(lower)) return "20 sec bursts";
  if (/few minutes?/.test(lower)) return "2–3 min";
  if (/until smooth|until melted/.test(lower)) return "2–4 min";
  if (/cool|rest|chill/.test(lower)) return "20–30 min";
  if (/preheat|prep|line/.test(lower)) return "3–5 min";
  if (/bake/.test(lower)) return "20–25 min";
  if (/boil|fry|simmer|cook/.test(lower)) return "5–8 min";
  return "As needed";
}

function extractHeat(line) {
  const lower = line.toLowerCase();
  if (/microwave/.test(lower)) return "Microwave";
  if (/fridge|chill|cool|rest/.test(lower)) return "No heat";
  const ovenTemp = lower.match(/(\d{3})\s*°?c/);
  if (ovenTemp) {
    const fan = lower.match(/\((\d{3})\s*fan\)/);
    return fan ? `Oven ${ovenTemp[1]}°C (${fan[1]} fan)` : `Oven ${ovenTemp[1]}°C`;
  }
  if (/oven|bake|roast/.test(lower)) return "Oven 180°C (160 fan)";
  if (/boil|rapid/.test(lower)) return "Hob 5–6 high";
  if (/fry|sear|medium-high|medium high/.test(lower)) return "Hob 4–5 medium-high";
  if (/medium/.test(lower)) return "Hob 3–4 medium";
  if (/low|gentle|melt|simmer/.test(lower)) return "Hob 1–2 low";
  return "No heat";
}

function buildStepTitle(line, index) {
  const cleaned = cleanLine(line).replace(/[.!?]$/, "");
  const parts = cleaned.split(/[,:]/)[0].trim().split(/\s+/).slice(0, 6);
  const title = parts.join(" ");
  if (!title) return `Step ${index + 1}`;
  return title.charAt(0).toUpperCase() + title.slice(1);
}

function normaliseInstructionText(line) {
  const cleaned = cleanLine(line);
  return cleaned.endsWith(".") ? cleaned : `${cleaned}.`;
}

function buildDescription(title, category) {
  return `${title} cleaned up with Fix Recipe mode and saved into your ${category.toLowerCase()} cookbook.`;
}

function parseRecipeFromText(raw) {
  const lines = raw.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const title = lines[0] || "Custom Recipe";
  const category = inferCategory(raw);
  const ingredients = [];
  const steps = [];
  const notes = [
    "Electric hob guide: 1–2 low, 3–4 medium, 5–6 high.",
    "Times are guide times — use texture and colour as your final check."
  ];

  let mode = "auto";
  let currentSection = "";

  for (let i = 1; i < lines.length; i += 1) {
    const original = lines[i];
    const line = cleanLine(original);
    if (!line) continue;

    if (isSectionHeading(line)) {
      currentSection = line.replace(/:$/, "");
      const lower = currentSection.toLowerCase();
      if (["ingredients", "ingredient", "brownies", "fudge sauce", "sauce", "topping", "filling", "icing", "ganache", "for the sauce", "for the brownies"].includes(lower)) {
        mode = "ingredients";
      }
      if (["method", "steps", "step", "instructions", "instruction"].includes(lower)) {
        mode = "steps";
      }
      continue;
    }

    if (line.includes("|") && line.split("|").length >= 4) {
      const [rawTitle, rawHeat, rawTime, ...bodyParts] = line.split("|");
      steps.push({
        title: cleanLine(rawTitle),
        heat: cleanLine(rawHeat),
        time: cleanLine(rawTime),
        body: normaliseInstructionText(bodyParts.join("|").trim())
      });
      mode = "steps";
      continue;
    }

    if (isIngredientLine(line) && mode !== "steps") {
      ingredients.push(line);
      mode = "ingredients";
      continue;
    }

    if (looksLikeInstruction(line) || mode === "steps") {
      const prefix = currentSection && !["ingredients", "ingredient", "method", "steps", "step", "instructions", "instruction"].includes(currentSection.toLowerCase())
        ? `${currentSection}: `
        : "";
      steps.push({
        title: buildStepTitle(line, steps.length),
        heat: extractHeat(line),
        time: extractTime(line),
        body: normaliseInstructionText(prefix + line)
      });
      mode = "steps";
      continue;
    }

    if (isIngredientLine(line)) {
      ingredients.push(line);
      continue;
    }
  }

  const uniqueIngredients = Array.from(new Set(ingredients));
  const totalTime = steps.find(step => /\d/.test(step.time || "") && /(min|hr|sec)/.test(step.time || ""))?.time || "See steps";

  return {
    id: slug(`${title}-${Date.now()}`),
    title,
    category,
    difficulty: "Chef Fix",
    time: totalTime,
    serves: "Custom",
    description: buildDescription(title, category),
    tags: [category, "Fixed", "Step-by-step"],
    ingredients: uniqueIngredients,
    notes,
    steps: steps.length ? steps : [{
      title: "Add method",
      heat: "No heat",
      time: "As needed",
      body: "This paste did not include clear method lines. Paste the cooking instructions underneath the ingredients and fix it again."
    }]
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
  renderFilters();
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
