const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const optionsContainer = document.getElementById("optionsContainer");
const colorInput = document.getElementById("colorInput");
const applyColorBtn = document.getElementById("applyColor");
const quoteContainer = document.getElementById("quoteContainer");
const saveLookBtn = document.getElementById("saveLookBtn");

// Set canvas size
canvas.width = 500;
canvas.height = 700;

// Game state
const state = {
  skinTone: "#FFE0BD",
  makeup: [],
  hair: null,
  breastSize: "medium",
  outfit: {
    top: null,
    bottom: null,
    fullBody: null,
  },
  accessories: [],
};

// Colors for each category
const colors = {
  skinTone: "#FFE0BD",
  eyeshadow: "#FF69B4",
  lipstick: "#FF0000",
  blush: "#FF6B6B",
  eyeliner: "#000000",
  contour: "#B8860B",
  highlighter: "#FFD700",
  hair: "#8B4513",
  outfit: "#9370DB",
  necklace: "#FFD700",
  earrings: "#FFD700",
  crown: "#FFD700",
  boa: "#FF69B4",
  gloves: "#FFFFFF",
  handbag: "#000000",
};

// Customization options
const options = {
  skinTone: ["light", "medium", "dark", "deep"],
  makeup: ["eyeshadow", "lipstick", "blush", "eyeliner", "contour", "highlighter", "eyelashes"],
  hair: ["long", "short", "curly", "updo", "mohawk", "pigtails"],
  breastSize: ["small", "medium", "large"],
  outfit: {
    top: ["tank top", "crop top", "blouse", "corset"],
    bottom: ["skirt", "pants", "shorts"],
    fullBody: ["ballgown", "mermaid", "jumpsuit", "minidress", "catsuit", "pantsuit"],
  },
  accessories: ["crown", "necklace", "earrings", "boa", "gloves", "handbag"],
};

// Preset looks
const presetLooks = [
  {
    name: "Classic Glamour",
    skinTone: "light",
    makeup: ["eyeshadow", "lipstick"],
    hair: "updo",
    outfit: {top: null, bottom: null, fullBody: "ballgown"},
    accessories: ["necklace", "earrings"],
  },
  {
    name: "Edgy Diva",
    skinTone: "medium",
    makeup: ["eyeliner", "contour"],
    hair: "mohawk",
    outfit: {top: null, bottom: null, fullBody: "catsuit"},
    accessories: ["gloves", "earrings"],
  },
  {
    name: "Colorful Queen",
    skinTone: "dark",
    makeup: ["eyeshadow", "lipstick", "blush"],
    hair: "curly",
    outfit: {top: null, bottom: null, fullBody: "jumpsuit"},
    accessories: ["boa", "crown"],
  },
];

// Quotes
const quotes = [
  "Werk, queen! 👑",
  "Slay all day! 💃",
  "Serving looks! 👀✨",
  "Fierce and fabulous! 🔥",
  "Category is: Eleganza Extravaganza! 🌟",
  "Yes, queen! 💖",
  "Yas, honey! 🍯",
  "Sickening! 💅",
  "Werk that runway! 👠",
  "Shantay, you stay! 🌈",
];

let currentCategory = "makeup";

// Sound effects
const soundEffects = {
  select: new Audio("https://example.com/select.mp3"),
  save: new Audio("https://example.com/save.mp3"),
};

// Event listeners
document.querySelectorAll(".categoryBtn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".categoryBtn.active").classList.remove("active");
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    showOptions(currentCategory);
    if (currentCategory === "makeup" || currentCategory === "accessories") {
      const activeOption = document.querySelector(`.optionBtn.active`);
      if (activeOption) {
        colorInput.value = colors[activeOption.textContent];
      }
    } else {
      colorInput.value = colors[currentCategory];
    }
    addGlowEffect(btn);
  });
});

colorInput.addEventListener("change", () => {
  if (currentCategory === "makeup" || currentCategory === "accessories") {
    const activeOption = document.querySelector(`.optionBtn.active`);
    if (activeOption) {
      colors[activeOption.textContent] = colorInput.value;
    }
  } else {
    colors[currentCategory] = colorInput.value;
  }
  updateCanvas();
});

applyColorBtn.addEventListener("click", () => {
  if (currentCategory === "makeup" || currentCategory === "accessories") {
    const activeOption = document.querySelector(`.optionBtn.active`);
    if (activeOption) {
      colors[activeOption.textContent] = colorInput.value;
    }
  } else {
    colors[currentCategory] = colorInput.value;
  }
  updateCanvas();
  playSound("select");
});

saveLookBtn.addEventListener("click", saveLook);

// Add new buttons
const randomizeBtn = document.createElement("button");
randomizeBtn.textContent = "Surprise Me!";
randomizeBtn.id = "randomizeBtn";
randomizeBtn.addEventListener("click", randomizeLook);
document.getElementById("controlsContainer").appendChild(randomizeBtn);

const presetSelect = document.createElement("select");
presetSelect.id = "presetSelect";
presetSelect.innerHTML =
  '<option value="">Choose a preset look</option>' +
  presetLooks.map((look, index) => `<option value="${index}">${look.name}</option>`).join("");
presetSelect.addEventListener("change", applyPresetLook);
document.getElementById("controlsContainer").appendChild(presetSelect);

// Functions
function showOptions(category) {
  optionsContainer.innerHTML = "";
  if (category === "outfit") {
    Object.keys(options.outfit).forEach((subCategory) => {
      const subCategoryDiv = document.createElement("div");
      subCategoryDiv.classList.add("sub-category");
      const subCategoryTitle = document.createElement("h3");
      subCategoryTitle.textContent = subCategory.charAt(0).toUpperCase() + subCategory.slice(1);
      subCategoryDiv.appendChild(subCategoryTitle);
      options.outfit[subCategory].forEach((option) => {
        const btn = createOptionButton(category, option, subCategory);
        subCategoryDiv.appendChild(btn);
      });
      optionsContainer.appendChild(subCategoryDiv);
    });
  } else {
    options[category].forEach((option) => {
      const btn = createOptionButton(category, option);
      optionsContainer.appendChild(btn);
    });
  }
}

function createOptionButton(category, option, subCategory = null) {
  const btn = document.createElement("button");
  btn.textContent = option;
  btn.classList.add("optionBtn");
  if (
    (category === "skinTone" && state.skinTone === option) ||
    (category === "hair" && state.hair === option) ||
    (category === "breastSize" && state.breastSize === option) ||
    (category === "outfit" && subCategory && state.outfit[subCategory] === option) ||
    (category === "makeup" && state.makeup.includes(option)) ||
    (category === "accessories" && state.accessories.includes(option))
  ) {
    btn.classList.add("active");
  }
  btn.addEventListener("click", () => {
    applyOption(category, option, subCategory);
    btn.classList.toggle("active");
    playSound("select");
  });
  return btn;
}

function applyOption(category, option, subCategory = null) {
  if (category === "skinTone") {
    state.skinTone = option;
    colors.skinTone = getSkinToneColor(option);
  } else if (category === "makeup") {
    if (!state.makeup.includes(option)) {
      state.makeup.push(option);
    } else {
      state.makeup = state.makeup.filter((item) => item !== option);
    }
  } else if (category === "accessories") {
    if (!state.accessories.includes(option)) {
      state.accessories.push(option);
    } else {
      state.accessories = state.accessories.filter((item) => item !== option);
    }
  } else if (category === "outfit") {
    if (subCategory === "fullBody") {
      state.outfit.top = null;
      state.outfit.bottom = null;
      state.outfit.fullBody = option;
    } else {
      state.outfit.fullBody = null;
      state.outfit[subCategory] = state.outfit[subCategory] === option ? null : option;
    }
  } else if (category === "breastSize") {
    state.breastSize = option;
  } else {
    state[category] = state[category] === option ? null : option;
  }
  updateCanvas();
  showQuote();
  animateOption(option);
}

function updateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (state.hair) drawHair(state.hair);
  drawOutfit();
  drawCharacterBase();
  state.makeup.forEach((item) => drawMakeup(item));
  state.accessories.forEach((item) => drawAccessory(item));
}

function drawCharacterBase() {
  // Draw face
  ctx.fillStyle = colors.skinTone;
  ctx.beginPath();
  ctx.ellipse(250, 200, 90, 110, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw eyes
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.ellipse(220, 180, 10, 15, 0, 0, Math.PI * 2);
  ctx.ellipse(280, 180, 10, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw nose
  ctx.beginPath();
  ctx.moveTo(250, 200);
  ctx.lineTo(245, 220);
  ctx.lineTo(255, 220);
  ctx.closePath();
  ctx.fill();

  // Draw lips
  ctx.fillStyle = "#FF69B4";
  ctx.beginPath();
  ctx.moveTo(230, 240);
  ctx.quadraticCurveTo(250, 260, 270, 240);
  ctx.quadraticCurveTo(250, 250, 230, 240);
  ctx.fill();

  // Draw neck and shoulders
  ctx.fillStyle = colors.skinTone;
  ctx.beginPath();
  ctx.moveTo(200, 300);
  ctx.lineTo(300, 300);
  // Draw breast shape
  ctx.fillStyle = colors.skinTone;
  const breastSizes = {
    small: 20,
    medium: 30,
    large: 40,
  };
  const breastSize = breastSizes[state.breastSize];
  ctx.beginPath();
  ctx.moveTo(200, 300);
  ctx.quadraticCurveTo(250, 300 - breastSize, 300, 300);
  ctx.quadraticCurveTo(350, 350, 300, 400);
  ctx.lineTo(200, 400);
  ctx.quadraticCurveTo(150, 350, 200, 300);
  ctx.fill();
}

function drawHair(style) {
  ctx.fillStyle = colors.hair;
  switch (style) {
    case "long":
      ctx.beginPath();
      ctx.moveTo(160, 150);
      ctx.quadraticCurveTo(250, 100, 340, 150);
      ctx.quadraticCurveTo(380, 300, 340, 500);
      ctx.quadraticCurveTo(250, 550, 160, 500);
      ctx.quadraticCurveTo(120, 300, 160, 150);
      ctx.fill();
      break;
    case "short":
      ctx.beginPath();
      ctx.arc(250, 180, 110, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "curly":
      for (let i = 0; i < 50; i++) {
        ctx.beginPath();
        ctx.arc(160 + Math.random() * 180, 100 + Math.random() * 200, 20 + Math.random() * 30, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    case "updo":
      ctx.beginPath();
      ctx.moveTo(180, 100);
      ctx.quadraticCurveTo(250, 50, 320, 100);
      ctx.quadraticCurveTo(350, 150, 320, 200);
      ctx.quadraticCurveTo(250, 220, 180, 200);
      ctx.quadrati
