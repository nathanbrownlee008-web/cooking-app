function show(type){
let html = "";

if(type==="meat"){
html += card("🥩 Steak - Heat","HIGH heat, pan very hot, oil shimmering");
html += card("⏱ Timing","2-4 mins per side depending on thickness");
html += card("👀 Look","Deep brown crust, not grey");
html += card("❌ Mistakes","Pan cold, flipping too early");
}

if(type==="heat"){
html += card("🔥 Low Heat","Gentle cooking, sauces, eggs");
html += card("🔥 Medium Heat","General cooking, chicken");
html += card("🔥 High Heat","Searing meat, stir fry");
}

if(type==="techniques"){
html += card("🍳 Searing","High heat, no movement");
html += card("🧈 Basting","Butter over meat at end");
}

if(type==="meals"){
html += card("🍝 Pasta","Salt water, use pasta water for sauce");
}

document.getElementById("content").innerHTML = html;
}

function card(title, text){
return `<div class="card">
<div class="section-title">${title}</div>
<div>${text}</div>
</div>`;
}
