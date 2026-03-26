
let recipes = [{"title": "Creamy Garlic Chicken", "description": "Golden seared chicken finished in a rich garlic cream sauce.", "steps": ["Sear chicken until a deep golden crust forms \u2014 this builds flavour.", "Lower heat and cook through until juices run clear.", "Add garlic and cook briefly until fragrant, not browned.", "Pour in cream and let it gently thicken.", "Return chicken and coat until glossy."], "tips": ["If garlic turns dark brown, it\u2019s burnt \u2014 start again.", "Sauce should coat the spoon, not run watery.", "If it tastes flat, add a squeeze of lemon."], "plating": ["Slice chicken at an angle.", "Spoon sauce underneath, not over everything.", "Finish with parsley for colour."]}];
let favs = JSON.parse(localStorage.getItem("favs")||"[]");

function render(){
 const q=document.getElementById("search").value.toLowerCase();
 const el=document.getElementById("recipes");
 el.innerHTML="";
 recipes.filter(r=>r.title.toLowerCase().includes(q)).forEach(r=>{
  const fav=favs.includes(r.title);
  el.innerHTML+=`
  <div class="card">
    <h2>${r.title}</h2>
    <p>${r.description}</p>
    <button onclick="toggleFav('${r.title}')">${fav?'★':'☆'}</button>
    <div class="small">
      <b>Steps:</b><br>${r.steps.join("<br>")}<br><br>
      <b>Pro tips:</b><br>${r.tips.join("<br>")}<br><br>
      <b>Plating:</b><br>${r.plating.join("<br>")}
    </div>
  </div>`;
 });
}

function toggleFav(t){
 if(favs.includes(t)) favs=favs.filter(x=>x!==t);
 else favs.push(t);
 localStorage.setItem("favs",JSON.stringify(favs));
 render();
}

function generateRecipe(){
 const ing=prompt("Enter ingredients");
 if(!ing)return;
 recipes.push({
  title:"Custom Dish",
  description:"Created from "+ing,
  steps:["Cook using proper heat control","Adjust seasoning to taste"],
  tips:["Taste as you go"],
  plating:["Keep it clean and simple"]
 });
 render();
}

render();
