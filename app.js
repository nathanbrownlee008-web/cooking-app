
const STORAGE_KEY = "chef-at-home-paste-recipes-v3";
const LEGACY_KEYS = [
  "myRecipes",
  "chef-at-home-paste-recipes-v1",
  "chef-at-home-paste-recipes-v2"
];
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
  if (/(dessert|sweet|cake|brownie|cookie|cookies|ice cream|cheesecake|pudding|trifle|muffin|cupcake|fudge|blondie)/.test(joined)) return "Desserts";
  if (/(drink|juice|smoothie|shake|coffee|tea|cocktail|mocktail|lemonade|milkshake|mojito)/.test(joined)) return "Drinks";
  if (/(kids|kid|children|child|toddler|nuggets|fish fingers|mini pizza|mini burgers)/.test(joined)) return "Kids Menu";
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

function cleanTitleLine(line) {
  return cleanLine(line).replace(/\s*recipe\s*$/i, "").trim() || "Untitled Recipe";
}

function isMetadataLine(line) {
  return /^(category|time|total time|cook time|prep time|heat|main heat|serves|difficulty|description)\s*:/i.test(line);
}

function isGenericSectionLabel(line) {
  return /^(ingredients?|steps?|method|instructions?|directions?)\s*:?$/i.test(cleanLine(line));
}

function isShortHeading(line) {
  const cleaned = cleanLine(line);
  return cleaned.endsWith(":") && cleaned.length <= 30 && !isMetadataLine(cleaned);
}

function actionVerbRegex() {
  return /^(preheat|line|grease|melt|mix|stir|whisk|beat|fold|add|pour|bake|cook|fry|grill|boil|simmer|leave|rest|serve|chill|cool|microwave|remove|put|place|spread|sprinkle|top|combine|make|warm|bring|let|turn|flip|toast|slice|season|pat|drizzle|blend|shake|garnish|reduce|cover|uncover|scrape|knead|roll|press|coat|marinate|drain|rinse|set|keep|stop|check|transfer)\b/i;
}

function looksLikeIngredient(line) {
  const cleaned = cleanLine(line);
  if (!cleaned) return false;
  if (cleaned.length > 110) return false;
  if (isMetadataLine(cleaned) || isGenericSectionLabel(cleaned) || isShortHeading(cleaned)) return false;
  if (cleaned.includes("|")) return false;
  if (actionVerbRegex().test(cleaned)) return false;
  if (/\bfor\s+\d+\s*(seconds?|mins?|minutes?|hours?)\b/i.test(cleaned)) return false;
  if (/\buntil\b/i.test(cleaned)) return false;

  return /^\d/.test(cleaned)
    || /^\d+\/?\d*\s/.test(cleaned)
    || /\b(\d+\s?(g|kg|ml|l|tbsp|tsp|oz|lb|cm)|half|quarter|pinch|handful)\b/i.test(cleaned)
    || /\b(clove|cloves|egg|eggs|breast|breasts|fillet|fillets|onion|onions|butter|oil|flour|sugar|salt|pepper|cream|milk|water|pasta|rice|chicken|beef|lettuce|tomato|tomatoes|cheese|chocolate|cocoa|vanilla|strawberries|blueberries|powder|sauce|vinegar|mustard|honey|garlic)\b/i.test(cleaned);
}

function looksLikeInstruction(line) {
  const cleaned = cleanLine(line);
  if (!cleaned) return false;
  if (isMetadataLine(cleaned) || isGenericSectionLabel(cleaned)) return false;
  if (actionVerbRegex().test(cleaned)) return true;
  if (/\b(until|then|once|when|while|after|before|stirring|mixing)\b/i.test(cleaned) && cleaned.length > 18) return true;
  if (/[.!?]/.test(cleaned) && cleaned.length > 18 && !looksLikeIngredient(cleaned)) return true;
  return false;
}

function looksLikeTimeValue(line) {
  return /\b\d+\s?(min|mins|minutes|sec|secs|seconds|hr|hrs|hour|hours)\b/i.test(line)
    || /\b\d+\s?-\s?\d+\s?(min|mins|minutes|sec|secs|seconds|hr|hrs|hour|hours)\b/i.test(line);
}

function looksLikeHeatValue(line) {
  return /\b(low|medium|high|medium-high|medium high|medium-low|medium low|oven|hob|air fryer|grill|gas mark|fan oven|electric hob|180c|190c|200c|160c|170c|350f|375f|400f)\b/i.test(line);
}

function extractTime(text) {
  const cleaned = cleanLine(text);
  const match = cleaned.match(/\b(\d+\s?-\s?\d+\s?(?:sec|secs|seconds|min|mins|minutes|hr|hrs|hour|hours)|\d+\s?(?:sec|secs|seconds|min|mins|minutes|hr|hrs|hour|hours))\b/i);
  return match ? match[1].replace(/\s+/g, " ") : "";
}

function inferHeat(text, fallback = "") {
  const cleaned = cleanLine(text).toLowerCase();
  const explicit = cleaned.match(/\b(oven\s*\d{2,3}\s?[cf]?|fan oven\s*\d{2,3}\s?[cf]?|gas mark\s*\d+|air fryer\s*\d{2,3}\s?[cf]?|medium-high|medium high|medium-low|medium low|low|medium|high|hob|grill)\b/i);
  if (explicit) return explicit[1].replace(/\s+/g, " ");
  if (/\b(bake|roast)\b/i.test(cleaned)) return fallback || "Oven";
  if (/\b(melt|warm|simmer|cool|chill|rest|leave|set)\b/i.test(cleaned)) return "Low";
  if (/\b(boil)\b/i.test(cleaned)) return "High";
  if (/\b(fry|cook|toast|brown|sear|grill)\b/i.test(cleaned)) return fallback || "Medium";
  if (/\b(mix|whisk|beat|fold|combine|add|pour)\b/i.test(cleaned)) return fallback || "No heat";
  return fallback || "As needed";
}

function inferTime(text) {
  const explicit = extractTime(text);
  if (explicit) return explicit;
  const cleaned = cleanLine(text).toLowerCase();
  if (/\b(preheat)\b/.test(cleaned)) return "5 min";
  if (/\b(melt|warm)\b/.test(cleaned)) return "2-3 min";
  if (/\b(whisk|mix|beat|fold|combine)\b/.test(cleaned)) return "1-2 min";
  if (/\b(bake|roast)\b/.test(cleaned)) return "As needed";
  if (/\b(rest|cool|chill|leave|set)\b/.test(cleaned)) return "As needed";
  if (/\b(fry|cook|simmer|boil|grill)\b/.test(cleaned)) return "As needed";
  return "As needed";
}

function createStepTitle(body, heading, index) {
  const cleaned = cleanLine(body);
  let text = cleaned.replace(/\bfor\s+\d+\s?(sec|secs|seconds|min|mins|minutes|hr|hrs|hour|hours)\b/ig, "").trim();
  text = text.replace(/\b(until|then|once|while|when)\b.*$/i, "").trim();
  text = text.replace(/[.,;:]$/, "").trim();
  if (heading && heading.length <= 24) {
    const titleTail = text ? text.split(/[,.]/)[0] : `Step ${index + 1}`;
    const shortTail = titleTail.split(" ").slice(0, 5).join(" ").trim();
    return `${heading} — ${shortTail || `Step ${index + 1}`}`;
  }
  const basic = text.split(/[,.]/)[0].split(" ").slice(0, 6).join(" ").trim();
  return basic || `Step ${index + 1}`;
}

function parseStepLine(text, heading, index, recipeHeat) {
  const cleaned = cleanLine(text);
  const pipeParts = cleaned.split("|").map((part) => part.trim()).filter(Boolean);

  if (pipeParts.length >= 4) {
    return {
      title: pipeParts[0],
      heat: pipeParts[1] || recipeHeat || "As needed",
      time: pipeParts[2] || "As needed",
      body: pipeParts.slice(3).join(" | ")
    };
  }

  return {
    title: createStepTitle(cleaned, heading, index),
    heat: inferHeat(cleaned, recipeHeat),
    time: inferTime(cleaned),
    body: cleaned
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

function shouldMergeStep(previous, current) {
  if (!previous || !current) return false;
  const cleaned = cleanLine(current.text);
  if (!cleaned) return false;
  if (extractTime(cleaned)) return false;
  if (looksLikeIngredient(cleaned)) return false;
  return cleaned.length < 34 || /^(then|and|until|once|when|while|stirring|mixing|stop|leave|let|cool|rest)\b/i.test(cleaned);
}

function sumStepTimes(steps) {
  let totalMinutes = 0;
  let counted = 0;
  steps.forEach((step) => {
    const value = String(step.time || "");
    const match = value.match(/(\d+)\s?-\s?(\d+)\s?(sec|secs|seconds|min|mins|minutes|hr|hrs|hour|hours)|(\d+)\s?(sec|secs|seconds|min|mins|minutes|hr|hrs|hour|hours)/i);
    if (!match) return;
    let amount = 0;
    let unit = "min";
    if (match[1] && match[2] && match[3]) {
      amount = (Number(match[1]) + Number(match[2])) / 2;
      unit = match[3].toLowerCase();
    } else if (match[4] && match[5]) {
      amount = Number(match[4]);
      unit = match[5].toLowerCase();
    }
    if (/sec/.test(unit)) totalMinutes += amount / 60;
    else if (/hr|hour/.test(unit)) totalMinutes += amount * 60;
    else totalMinutes += amount;
    counted += 1;
  });
  if (!counted) return "";
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return minutes ? `${hours} hr ${minutes} min` : `${hours} hr`;
  }
  return `${Math.max(1, Math.round(totalMinutes))} min`;
}

function parseRecipeBlock(rawText) {
  const text = String(rawText || "").replace(/\r/g, "").trim();
  if (!text) throw new Error("Paste a recipe first.");

  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  if (!lines.length) throw new Error("Paste a recipe first.");

  const recipe = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: cleanTitleLine(lines[0]),
    category: "Meats",
    time: "",
    heat: "",
    description: "Imported from your pasted recipe notes.",
    ingredients: [],
    steps: []
  };

  let mode = "unknown";
  let currentHeading = "";
  const rawStepCandidates = [];

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    const cleaned = cleanLine(line);
    if (!cleaned) continue;

    if (/^category\s*:/i.test(cleaned)) {
      recipe.category = normalizeCategory(cleaned.split(":").slice(1).join(":").trim(), recipe.title, text);
      continue;
    }
    if (/^(time|total time|cook time|prep time)\s*:/i.test(cleaned)) {
      const value = cleaned.split(":").slice(1).join(":").trim();
      if (value) recipe.time = value;
      continue;
    }
    if (/^(heat|main heat)\s*:/i.test(cleaned)) {
      const value = cleaned.split(":").slice(1).join(":").trim();
      if (value) recipe.heat = value;
      continue;
    }
    if (/^description\s*:/i.test(cleaned)) {
      const value = cleaned.split(":").slice(1).join(":").trim();
      if (value) recipe.description = value;
      continue;
    }
    if (/^ingredients?\s*:?$/i.test(cleaned)) {
      mode = "ingredients";
      currentHeading = "";
      continue;
    }
    if (/^(steps?|method|instructions?|directions?)\s*:?$/i.test(cleaned)) {
      mode = "steps";
      currentHeading = "";
      continue;
    }

    if (isShortHeading(cleaned)) {
      currentHeading = cleaned.replace(/:$/, "").trim();
      continue;
    }

    if (mode === "ingredients") {
      if (looksLikeInstruction(cleaned)) {
        mode = "steps";
      } else {
        recipe.ingredients.push(cleaned);
        continue;
      }
    }

    if (mode === "steps") {
      rawStepCandidates.push({ text: cleaned, heading: currentHeading });
      continue;
    }

    if (mode === "unknown") {
      if (!recipe.ingredients.length && !looksLikeInstruction(cleaned) && looksLikeIngredient(cleaned)) {
        recipe.ingredients.push(cleaned);
        continue;
      }

      if (recipe.ingredients.length && !looksLikeInstruction(cleaned) && looksLikeIngredient(cleaned)) {
        recipe.ingredients.push(cleaned);
        continue;
      }

      if (looksLikeInstruction(cleaned)) {
        mode = "steps";
        rawStepCandidates.push({ text: cleaned, heading: currentHeading });
        continue;
      }

      if (looksLikeIngredient(cleaned)) {
        recipe.ingredients.push(cleaned);
        continue;
      }

      rawStepCandidates.push({ text: cleaned, heading: currentHeading });
    }
  }

  const mergedCandidates = [];
  rawStepCandidates.forEach((candidate) => {
    const previous = mergedCandidates[mergedCandidates.length - 1];
    if (shouldMergeStep(previous, candidate)) {
      previous.text = `${previous.text}. ${candidate.text}`.replace(/\.\./g, ".");
    } else {
      mergedCandidates.push({ ...candidate });
    }
  });

  recipe.ingredients = dedupeStrings(recipe.ingredients.map(cleanLine).filter(Boolean));
  recipe.steps = mergedCandidates
    .filter((item) => item.text && !looksLikeIngredient(item.text))
    .map((item, index) => parseStepLine(item.text, item.heading, index, recipe.heat))
    .map((step, index) => ({
      title: cleanLine(step.title) || `Step ${index + 1}`,
      heat: cleanLine(step.heat) || "As needed",
      time: cleanLine(step.time) || "As needed",
      body: cleanLine(step.body)
    }))
    .filter((step) => step.body);

  if (!recipe.time) recipe.time = sumStepTimes(recipe.steps) || "Not set";
  if (!recipe.heat) {
    const heatedStep = recipe.steps.find((step) => step.heat && step.heat !== "As needed");
    recipe.heat = heatedStep?.heat || "Not set";
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
          <span class="badge">${escapeHtml(step.heat || "As needed")}</span>
          <span class="badge">${escapeHtml(step.time || "As needed")}</span>
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
