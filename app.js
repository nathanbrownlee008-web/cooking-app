let recipes=JSON.parse(localStorage.getItem('recipes'))||[];
function save(){localStorage.setItem('recipes',JSON.stringify(recipes))}
function addRecipe(){let t=document.getElementById('input').value;if(!t)return;
recipes.push({text:t});save();render();document.getElementById('input').value=''}
function deleteRecipe(i){recipes.splice(i,1);save();render()}
function render(){let c=document.getElementById('recipes');c.innerHTML='';
recipes.forEach((r,i)=>{c.innerHTML+=`<div class="recipe"><pre>${r.text}</pre><button onclick="deleteRecipe(${i})">Delete</button></div>`})}
render();