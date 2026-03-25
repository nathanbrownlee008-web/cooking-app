function openSection(type){
let html = "";

if(type==="meat"){
html = `
<h2>🥩 Steak</h2>

${block("🔥 Heat", "Pan HIGH. Wait until oil shimmers. If steak doesn't sizzle loudly, pan isn't hot enough.")}

${block("⏱ Timing", "1 inch steak: Rare 2-2.5 mins per side, Medium 3-4 mins. Thicker steak = longer.")}

${block("👀 What to look for", "Crust should be deep brown. Steak will release naturally when ready to flip.")}

${block("🧂 Seasoning", "Salt 30-60 mins before. Butter + garlic last minute for flavour.")}

${block("❌ Mistakes", "Cold pan, flipping too early, not resting meat (juices lost).")}
`;
}

if(type==="heat"){
html = `
<h2>🔥 Heat Control</h2>

${block("Low Heat", "Gentle cooking. Eggs, sauces. No sizzling.")}

${block("Medium Heat", "Chicken, general cooking. Steady sizzle.")}

${block("High Heat", "Searing meat. Loud sizzle, quick cooking.")}
`;
}

if(type==="techniques"){
html = `
<h2>🍳 Techniques</h2>

${block("Searing", "High heat, do not move food until crust forms.")}

${block("Basting", "Spoon butter over meat for flavour.")}
`;
}

if(type==="meals"){
html = `
<h2>🍝 Pasta</h2>

${block("Cooking", "Salt water heavily. Use pasta water for sauce.")}

${block("Sauce", "Mix pasta water + butter + cheese for creamy texture.")}
`;
}

document.getElementById("section").innerHTML = html;
}

function block(title, text){
return `<div class="detail"><b>${title}</b><br>${text}</div>`;
}
