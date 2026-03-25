const recipes = [
  {
    name: "Creamy Garlic Chicken",
    category: "chicken",
    details: `
    <b>Ingredients:</b><br>
    Chicken, garlic, cream, butter<br><br>
    <b>Instructions:</b><br>
    Sear chicken 5-6 mins each side. Add garlic, then cream and simmer.<br><br>
    <b>Chef Tip:</b> Don't move chicken early.
    `
  },
  {
    name: "Steak Butter Baste",
    category: "beef",
    details: `
    Sear steak hot pan. Add butter, garlic, baste constantly.<br><br>
    <b>Chef Tip:</b> Rest steak after cooking.
    `
  },
  {
    name: "Carbonara",
    category: "pasta",
    details: `
    Cook pasta. Mix egg + cheese. Combine OFF heat.<br><br>
    <b>Chef Tip:</b> Avoid scrambling eggs.
    `
  },
  {
    name: "Fudge Brownies",
    category: "dessert",
    details: `
    Melt chocolate + butter. Bake 180°C 20 mins.<br><br>
    <b>Chef Tip:</b> Slight wobble = fudgy.
    `
  },
  {
    name: "Chicken Stir Fry",
    category: "chicken",
    details: `
    High heat. Cook chicken fast. Add veg + sauce.<br><br>
    <b>Chef Tip:</b> Keep everything moving.
    `
  },
  {
    name: "Beef Burger",
    category: "beef",
    details: `
    Form patties. Cook 3-4 mins each side.<br><br>
    <b>Chef Tip:</b> Don't press burger.
    `
  }
];

function displayRecipes(list) {
  const container = document.getElementById("recipes");
  container.innerHTML = "";

  list.forEach((r, i) => {
    container.innerHTML += `
      <div class="card">
        <h2>${r.name}</h2>
        <button onclick="toggle(${i})">View Recipe</button>
        <div class="details" id="d${i}">${r.details}</div>
      </div>
    `;
  });
}

function toggle(i) {
  const el = document.getElementById("d" + i);
  el.style.display = el.style.display === "block" ? "none" : "block";
}

function filterRecipes(cat) {
  if (cat === "all") return displayRecipes(recipes);
  displayRecipes(recipes.filter(r => r.category === cat));
}

displayRecipes(recipes);
