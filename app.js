/* =========================
   CLEAN APP BASE (NO RECIPES)
========================= */

// empty starter recipes
const starterRecipes = [];

// load from storage
let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

// save
function saveRecipes() {
  localStorage.setItem("recipes", JSON.stringify(recipes));
}

// render recipes
function renderRecipes() {
  const container = document.getElementById("recipesContainer");
  if (!container) return;

  if (recipes.length === 0) {
    container.innerHTML = `
      <div style="opacity:0.6; text-align:center; padding:40px;">
        No recipes yet.<br>
        Paste one to get started.
      </div>
    `;
    return;
  }

  container.innerHTML = recipes.map(r => `
    <div class="card">
      <h3>${r.title}</h3>
      <p>${r.category || "Custom"}</p>
    </div>
  `).join("");
}

// render categories (your menus)
function renderFilters() {
  const wrap = document.getElementById("categoryFilters");
  if (!wrap) return;

  const categories = ["All", "Meats", "Salads", "Desserts", "Drinks", "Kids Menu"];

  wrap.innerHTML = categories.map((cat, i) => `
    <button class="chip ${i === 0 ? "active" : ""}">
      ${cat}
    </button>
  `).join("");
}

// init
document.addEventListener("DOMContentLoaded", () => {
  recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  renderFilters();
  renderRecipes();
});
// ===== PASTE SYSTEM =====

// detect heat
function detectHeat(text) {
  text = text.toLowerCase();

  if (text.includes("oven")) return "180°C oven";
  if (text.includes("fry") || text.includes("pan")) return "medium heat";
  if (text.includes("boil")) return "high heat";
  if (text.includes("fridge")) return "fridge";
  if (text.includes("freeze")) return "freezer";

  return "no heat";
}

// detect time
function detectTime(text) {
  const match = text.match(/\d+\s?(min|minutes|hr|hours)/i);
  return match ? match[0] : "";
}

// parse recipe
function parseRecipeFromText(text) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  let title = lines[0];
  let ingredients = [];
  let steps = [];

  lines.forEach(line => {

    // ingredients (grams etc)
    if (line.match(/\d+(g|ml|tsp|tbsp)/i)) {
      ingredients.push(line);
      return;
    }

    // steps
    if (line.match(/^\d+\./)) {
      const clean = line.replace(/^\d+\.\s*/, "");

      steps.push({
        title: clean,
        body: clean,
        heat: detectHeat(clean),
        time: detectTime(clean)
      });
    }

  });

  return {
    id: "r_" + Date.now(),
    title: title,
    category: "Custom",
    ingredients,
    steps
  };
}

// button click
document.getElementById("pasteRecipeBtn")?.addEventListener("click", () => {
  const raw = document.getElementById("recipePasteInput").value.trim();

  if (!raw) {
    alert("Paste a recipe first");
    return;
  }

  const recipe = parseRecipeFromText(raw);

  recipes.push(recipe);
  saveRecipes();

  renderRecipes();

  document.getElementById("recipePasteInput").value = "";
});
