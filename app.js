const recipes = [
{
name:"Creamy Garlic Chicken",
content:`
<h2>Creamy Garlic Chicken</h2>

<h3>Ingredients</h3>
- 2 chicken breasts  
- 3 garlic cloves  
- 200ml cream  
- 1 tbsp butter  
- Salt & pepper  

<h3>Preparation</h3>
Pat chicken dry. Season both sides.

<h3>Cooking</h3>
1. Heat pan medium-high for 2 mins  
2. Add butter → wait until foaming  
3. Add chicken → DO NOT TOUCH for 5 mins  
4. Flip → cook another 5 mins  
5. Lower heat → add garlic (30 sec)  
6. Add cream → simmer gently (not boiling)  
7. Return chicken → cook 2–3 mins  

<h3>Chef Tips</h3>
- Golden crust = flavour  
- Burnt garlic ruins dish  
- Sauce too thick? add water  
`
},
{
name:"Steak Butter Baste",
content:`
<h2>Steak Butter Baste</h2>

<h3>Ingredients</h3>
- Steak  
- Butter  
- Garlic  
- Thyme  

<h3>Cooking</h3>
1. Heat pan HIGH (very hot)  
2. Add steak → sear 2–3 mins  
3. Flip → add butter + garlic  
4. Tilt pan → spoon butter over steak for 1–2 mins  

<h3>Chef Tips</h3>
- Rest steak 5 mins after cooking  
- Don't overcrowd pan  
`
},
{
name:"Fudge Brownies",
content:`
<h2>Fudge Brownies</h2>

<h3>Ingredients</h3>
- 200g chocolate  
- 150g butter  
- 200g sugar  
- 3 eggs  
- 100g flour  

<h3>Cooking</h3>
1. Melt chocolate + butter  
2. Mix sugar + eggs  
3. Combine all  
4. Bake at 180°C for 20 mins  

<h3>Chef Tips</h3>
- Slight wobble = fudgy center  
`
}
];

function loadRecipes(){
  const container=document.getElementById("recipes");
  container.innerHTML="";
  recipes.forEach((r,i)=>{
    container.innerHTML+=`
      <div class="card">
        <h2>${r.name}</h2>
        <button onclick="openRecipe(${i})">Open Recipe</button>
      </div>
    `;
  });
}

function openRecipe(i){
  document.getElementById("recipes").style.display="none";
  const page=document.getElementById("recipePage");
  page.classList.remove("hidden");
  page.innerHTML=recipes[i].content + `<br><button onclick="back()">← Back</button>`;
}

function back(){
  document.getElementById("recipes").style.display="block";
  document.getElementById("recipePage").classList.add("hidden");
}

loadRecipes();
