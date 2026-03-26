
const recipes = [{"title": "Crispy Chicken Wraps", "ingredients": ["500g chicken", "1 tsp salt", "1/2 tsp black pepper", "1 tsp paprika (optional)", "1 tbsp oil", "2 garlic cloves"], "seasoning": ["1 tsp salt", "1/2 tsp black pepper", "Optional: paprika or garlic powder"], "steps": ["Pat chicken dry. Season evenly with salt, pepper, and paprika. Rub it in well and leave for 5\u201310 minutes.", "Heat pan to medium-high. Add oil until shimmering.", "Cook chicken until golden brown (6\u20138 mins).", "Add garlic and cook briefly.", "Assemble into wraps and serve."], "tips": ["Dry chicken = better crust", "Don\u2019t overcrowd pan", "Rest meat before cutting"]}];

function render(){
 const el=document.getElementById("recipes");
 el.innerHTML="";
 recipes.forEach(r=>{
  el.innerHTML+=`
   <div class="card">
     <div class="title">${r.title}</div>

     <div class="section"><b>Ingredients:</b><br>${r.ingredients.join("<br>")}</div>

     <div class="section"><b>Seasoning (IMPORTANT):</b><br>${r.seasoning.join("<br>")}</div>

     <div class="section"><b>Steps:</b><br>${r.steps.join("<br><br>")}</div>

     <div class="section"><b>Chef Tips:</b><br>${r.tips.join("<br>")}</div>
   </div>
  `;
 });
}

render();
