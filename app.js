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
