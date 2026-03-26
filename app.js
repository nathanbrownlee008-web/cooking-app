let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

const home = document.getElementById("home");
const addPage = document.getElementById("addPage");
const viewPage = document.getElementById("viewPage");

const recipeList = document.getElementById("recipeList");
const preview = document.getElementById("preview");

let parsedRecipe = null;

document.getElementById("addBtn").onclick = () => {
  home.classList.add("hidden");
  addPage.classList.remove("hidden");
};

document.getElementById("backBtn").onclick = () => {
  viewPage.classList.add("hidden");
  home.classList.remove("hidden");
  renderRecipes();
};

document.getElementById("parseBtn").onclick = () => {
  const text = document.getElementById("recipeInput").value;
  const lines = text.split("\n");

  let title = lines[0];
  let ingredients = [];
  let steps = [];

  lines.forEach(line => {
    if (line.match(/^\d+\./)) {
      steps.push(line);
    } else if (line.match(/g|ml|tbsp|tsp|cup|egg|butter|flour/i)) {
      ingredients.push(line);
    }
  });

  parsedRecipe = { title, ingredients, steps };

  preview.innerHTML = `
    <h3>${title}</h3>
    <div class="section"><b>Ingredients</b><br>${ingredients.join("<br>")}</div>
    <div class="section"><b>Steps</b><br>${steps.join("<br>")}</div>
  `;
};

document.getElementById("saveBtn").onclick = () => {
  if (!parsedRecipe) return;

  recipes.push(parsedRecipe);
  localStorage.setItem("recipes", JSON.stringify(recipes));

  addPage.classList.add("hidden");
  home.classList.remove("hidden");
  renderRecipes();
};

function renderRecipes() {
  recipeList.innerHTML = "";

  recipes.forEach((r, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerText = r.title;

    card.onclick = () => openRecipe(i);

    recipeList.appendChild(card);
  });
}

function openRecipe(i) {
  const r = recipes[i];

  home.classList.add("hidden");
  viewPage.classList.remove("hidden");

  document.getElementById("recipeView").innerHTML = `
    <h2>${r.title}</h2>

    <div class="section">
      <b>Ingredients</b><br>
      ${r.ingredients.join("<br>")}
    </div>

    <div class="section">
      <b>Steps</b><br>
      ${r.steps.join("<br>")}
    </div>
  `;
}

renderRecipes();
