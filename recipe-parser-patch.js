// Recipe paste / fix parser patch
// Drop-in safe parser for mobile paste and grouped recipe fixes

function normalizeRecipeText(input) {
  return String(input || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .replace(/\u00A0/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n[ ]+/g, "\n")
    .replace(/[ ]+\n/g, "\n")
    .trim();
}

function splitNonEmptyLines(block) {
  return String(block || "")
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function extractSection(text, startLabel, endLabels = []) {
  const upper = text.toUpperCase();
  const startIndex = upper.indexOf(startLabel.toUpperCase());
  if (startIndex === -1) return "";

  const afterStart = startIndex + startLabel.length;
  let endIndex = text.length;

  for (const label of endLabels) {
    const idx = upper.indexOf(label.toUpperCase(), afterStart);
    if (idx !== -1 && idx < endIndex) endIndex = idx;
  }

  return text.slice(afterStart, endIndex).trim();
}

function parseTimeRangeToMinutes(text) {
  const str = String(text || "").toLowerCase();

  const rangeMatch = str.match(/(\d+)\s*(?:-|to|–)\s*(\d+)\s*min/);
  if (rangeMatch) {
    return {
      min: Number(rangeMatch[1]),
      max: Number(rangeMatch[2]),
      label: `${rangeMatch[1]}–${rangeMatch[2]} min`,
    };
  }

  const singleMatch = str.match(/(\d+)\s*min/);
  if (singleMatch) {
    const value = Number(singleMatch[1]);
    return { min: value, max: value, label: `${value} min` };
  }

  return null;
}

function sumStepTimes(steps) {
  let min = 0;
  let max = 0;

  steps.forEach((step) => {
    if (step.time && typeof step.time.min === "number" && typeof step.time.max === "number") {
      min += step.time.min;
      max += step.time.max;
    }
  });

  if (!min && !max) return "";
  return min === max ? `${min} min` : `${min}–${max} min`;
}

function detectHeat(text) {
  const str = String(text || "").toLowerCase();

  if (/no heat|rest|room temperature|season|dry the meat|prep/.test(str)) return "No heat";
  if (/heat 5|hob 5/.test(str)) return "Hob 5 high";
  if (/heat 4|hob 4/.test(str)) return "Hob 4 medium";
  if (/heat 3|hob 3/.test(str)) return "Hob 3 low-medium";

  return "";
}

function cleanIngredientLine(line) {
  return line.replace(/^[-•*]\s*/, "").trim();
}

function parseIngredientsBlock(block) {
  return splitNonEmptyLines(block).map(cleanIngredientLine).filter(Boolean);
}

function parseNotesBlock(block) {
  return splitNonEmptyLines(block);
}

function parseStepBlock(block) {
  const rawLines = splitNonEmptyLines(block);
  const steps = [];
  let i = 0;

  const looksLikeStepTitle = (line) => {
    const l = line.toLowerCase();
    return !/min|°c|optional|remove at|add |cook |rest |cover |baste |heat \d|hob \d|take out|pat dry|season both|insert thermometer/.test(l);
  };

  while (i < rawLines.length) {
    const current = rawLines[i];
    const next = rawLines[i + 1] || "";

    let title = current;
    let body = "";

    if (looksLikeStepTitle(current) && next) {
      body = next;
      i += 2;
    } else {
      body = current;
      title = `Step ${steps.length + 1}`;
      i += 1;
    }

    const fullText = `${title} ${body}`.trim();

    let time = parseTimeRangeToMinutes(fullText);
    if (!time) {
      const lower = fullText.toLowerCase();
      if (/room temperature/.test(lower)) {
        time = { min: 20, max: 30, label: "20–30 min" };
      } else if (/preheat/.test(lower)) {
        time = { min: 2, max: 3, label: "2–3 min" };
      } else if (/sear first side/.test(lower)) {
        time = { min: 3, max: 4, label: "3–4 min" };
      } else if (/flip|second side|baste/.test(lower)) {
        time = { min: 3, max: 4, label: "3–4 min" };
      } else if (/optional finish|cover/.test(lower)) {
        time = { min: 2, max: 3, label: "2–3 min" };
      } else if (/rest/.test(lower)) {
        time = { min: 5, max: 10, label: "5–10 min" };
      }
    }

    steps.push({
      number: steps.length + 1,
      title: title.trim(),
      text: body.trim(),
      heat: detectHeat(fullText),
      time,
    });
  }

  return steps;
}

function parseRecipeText(rawText) {
  const text = normalizeRecipeText(rawText);
  const title = splitNonEmptyLines(text)[0] || "Untitled Recipe";

  const ingredientsBlock = extractSection(text, "INGREDIENTS", ["STEPS", "NOTES"]);
  const stepsBlock = extractSection(text, "STEPS", ["NOTES"]);
  const notesBlock = extractSection(text, "NOTES", []);

  const ingredients = parseIngredientsBlock(ingredientsBlock);
  const steps = parseStepBlock(stepsBlock);
  const notes = parseNotesBlock(notesBlock);

  const totalTime =
    notes.find((n) => /^total time:/i.test(n))?.replace(/^total time:\s*/i, "").trim() ||
    sumStepTimes(steps);

  return {
    title,
    ingredients,
    steps,
    notes,
    totalTime,
    serves: "Custom",
  };
}

function recipeToDisplayData(parsed) {
  return {
    name: parsed.title,
    totalTime: parsed.totalTime || "",
    serves: parsed.serves || "Custom",
    stepCount: parsed.steps.length,
    ingredients: parsed.ingredients,
    notes: parsed.notes,
    steps: parsed.steps.map((step) => ({
      id: step.number,
      number: step.number,
      title: step.title || `Step ${step.number}`,
      description: step.text || "",
      heatLabel: step.heat || "No heat",
      timeLabel: step.time?.label || "",
    })),
  };
}

function handleRecipePaste(rawText) {
  const parsed = parseRecipeText(rawText);
  return recipeToDisplayData(parsed);
}

if (typeof module !== "undefined") {
  module.exports = {
    normalizeRecipeText,
    splitNonEmptyLines,
    extractSection,
    parseTimeRangeToMinutes,
    sumStepTimes,
    detectHeat,
    parseIngredientsBlock,
    parseNotesBlock,
    parseStepBlock,
    parseRecipeText,
    recipeToDisplayData,
    handleRecipePaste,
  };
}
