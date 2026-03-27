let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

function save() {
  localStorage.setItem("recipes", JSON.stringify(recipes));
}

function parseRecipe(text) {
  let lines = text.split("\n");

  let recipe = {
    name: "",
    ingredients: [],
    steps: [],
    notes: [],
    heat: "",
    time: ""
  };

  let section = "";

  lines.forEach(line => {
    line = line.trim();

    if (line.startsWith("NAME:")) {
      recipe.name = line.replace("NAME:", "").trim();
    } else if (line.startsWith("INGREDIENTS")) {
      section = "ingredients";
    } else if (line.startsWith("STEPS")) {
      section = "steps";
    } else if (line.startsWith("NOTES")) {
      section = "notes";
    } else if (line.startsWith("HEAT")) {
      recipe.heat = line.replace("HEAT:", "").trim();
    } else if (line.startsWith("TIME")) {
      recipe.time = line.replace("TIME:", "").trim();
    } else {
      if (section && line) {
        recipe[section].push(line);
      }
    }
  });

  return recipe;
}

function addRecipe() {
  let text = document.getElementById("input").value;
  let recipe = parseRecipe(text);

  recipes.push(recipe);
  save();
  render();

  document.getElementById("input").value = "";
}

function deleteRecipe(index) {
  recipes.splice(index, 1);
  save();
  render();
}

function render() {
  let container = document.getElementById("recipes");
  container.innerHTML = "";

  recipes.forEach((r, i) => {
    let div = document.createElement("div");
    div.className = "recipe";

    div.innerHTML = `
      <h2>${r.name}</h2>

      <strong>🍽 Ingredients</strong>
      <ul>${r.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>

      <strong>🔥 Steps</strong>
      <ol>${r.steps.map(s => `<li>${s}</li>`).join("")}</ol>

      <strong>🧈 Notes</strong>
      <ul>${r.notes.map(n => `<li>${n}</li>`).join("")}</ul>

      <p><strong>Heat:</strong> ${r.heat}</p>
      <p><strong>Time:</strong> ${r.time}</p>

      <button onclick="deleteRecipe(${i})">Delete</button>
    `;

    container.appendChild(div);
  });
}

render();
