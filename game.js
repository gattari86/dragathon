const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const optionsContainer = document.getElementById("optionsContainer")
const colorInput = document.getElementById("colorInput")
const applyColorBtn = document.getElementById("applyColor")
const quoteContainer = document.getElementById("quoteContainer")
const saveLookBtn = document.getElementById("saveLookBtn")

// Set canvas size
canvas.width = 500
canvas.height = 700

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
}

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
}

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
}

// Preset looks
const presetLooks = [
  {
    name: "Classic Glamour",
    skinTone: "light",
    makeup: ["eyeshadow", "lipstick"],
    hair: "updo",
    outfit: { top: "ballgown", bottom: null, fullBody: "ballgown" },
    accessories: ["necklace", "earrings"],
  },
  {
    name: "Edgy Diva",
    skinTone: "medium",
    makeup: ["eyeliner", "contour"],
    hair: "mohawk",
    outfit: { top: null, bottom: null, fullBody: "catsuit" },
    accessories: ["gloves", "earrings"],
  },
  {
    name: "Colorful Queen",
    skinTone: "dark",
    makeup: ["eyeshadow", "lipstick", "blush"],
    hair: "curly",
    outfit: { top: null, bottom: null, fullBody: "jumpsuit" },
    accessories: ["boa", "crown"],
  },
]

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
]

let currentCategory = "makeup"

// Sound effects
const soundEffects = {
  select: new Audio("https://example.com/select.mp3"),
  save: new Audio("https://example.com/save.mp3"),
}

// Event listeners
document.querySelectorAll(".categoryBtn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".categoryBtn.active").classList.remove("active")
    btn.classList.add("active")
    currentCategory = btn.dataset.category
    showOptions(currentCategory)
    if (currentCategory === "makeup" || currentCategory === "accessories") {
      const activeOption = document.querySelector(`.optionBtn.active`)
      if (activeOption) {
        colorInput.value = colors[activeOption.textContent]
      }
    } else {
      colorInput.value = colors[currentCategory]
    }
    addGlowEffect(btn)
  })
})

colorInput.addEventListener("change", () => {
  if (currentCategory === "makeup" || currentCategory === "accessories") {
    const activeOption = document.querySelector(`.optionBtn.active`)
    if (activeOption) {
      colors[activeOption.textContent] = colorInput.value
    }
  } else {
    colors[currentCategory] = colorInput.value
  }
  updateCanvas()
})

applyColorBtn.addEventListener("click", () => {
  colors[currentCategory] = colorInput.value
  updateCanvas()
  playSound("select")
})

saveLookBtn.addEventListener("click", saveLook)

// Add new buttons
const randomizeBtn = document.createElement("button")
randomizeBtn.textContent = "Surprise Me!"
randomizeBtn.id = "randomizeBtn"
randomizeBtn.addEventListener("click", randomizeLook)
document.getElementById("controlsContainer").appendChild(randomizeBtn)

const presetSelect = document.createElement("select")
presetSelect.id = "presetSelect"
presetSelect.innerHTML =
  '<option value="">Choose a preset look</option>' +
  presetLooks.map((look, index) => `<option value="${index}">${look.name}</option>`).join("")
presetSelect.addEventListener("change", applyPresetLook)
document.getElementById("controlsContainer").appendChild(presetSelect)

// Functions
function showOptions(category) {
  optionsContainer.innerHTML = ""
  if (category === "outfit") {
    Object.keys(options.outfit).forEach((subCategory) => {
      const subCategoryDiv = document.createElement("div")
      subCategoryDiv.classList.add("sub-category")
      const subCategoryTitle = document.createElement("h3")
      subCategoryTitle.textContent = subCategory.charAt(0).toUpperCase() + subCategory.slice(1)
      subCategoryDiv.appendChild(subCategoryTitle)
      options.outfit[subCategory].forEach((option) => {
        const btn = createOptionButton(category, option, subCategory)
        subCategoryDiv.appendChild(btn)
      })
      optionsContainer.appendChild(subCategoryDiv)
    })
  } else {
    options[category].forEach((option) => {
      const btn = createOptionButton(category, option)
      optionsContainer.appendChild(btn)
    })
  }
}

function createOptionButton(category, option, subCategory = null) {
  const btn = document.createElement("button")
  btn.textContent = option
  btn.classList.add("optionBtn")
  if (
    (category === "skinTone" && state.skinTone === option) ||
    (category === "hair" && state.hair === option) ||
    (category === "breastSize" && state.breastSize === option) ||
    (category === "outfit" && subCategory && state.outfit[subCategory] === option) ||
    (category === "makeup" && state.makeup.includes(option)) ||
    (category === "accessories" && state.accessories.includes(option))
  ) {
    btn.classList.add("active")
  }
  btn.addEventListener("click", () => {
    applyOption(category, option, subCategory)
    btn.classList.toggle("active")
    playSound("select")
  })
  return btn
}

function applyOption(category, option, subCategory = null) {
  if (category === "skinTone") {
    state.skinTone = option
    colors.skinTone = getSkinToneColor(option)
  } else if (category === "makeup") {
    if (!state.makeup.includes(option)) {
      state.makeup.push(option)
    } else {
      state.makeup = state.makeup.filter((item) => item !== option)
    }
  } else if (category === "accessories") {
    if (!state.accessories.includes(option)) {
      state.accessories.push(option)
    } else {
      state.accessories = state.accessories.filter((item) => item !== option)
    }
  } else if (category === "outfit") {
    if (subCategory === "fullBody") {
      state.outfit.top = null
      state.outfit.bottom = null
      state.outfit.fullBody = option
    } else {
      state.outfit.fullBody = null
      state.outfit[subCategory] = state.outfit[subCategory] === option ? null : option
    }
  } else if (category === "breastSize") {
    state.breastSize = option
  } else {
    state[category] = state[category] === option ? null : option
  }
  updateCanvas()
  showQuote()
  animateOption(option)
}

function updateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  if (state.hair) drawHair(state.hair)
  drawOutfit()
  drawCharacterBase()
  state.makeup.forEach((item) => drawMakeup(item))
  state.accessories.forEach((item) => drawAccessory(item))
}

function drawCharacterBase() {
  // Draw face
  ctx.fillStyle = colors.skinTone
  ctx.beginPath()
  ctx.ellipse(250, 200, 90, 110, 0, 0, Math.PI * 2)
  ctx.fill()

  // Draw eyes
  ctx.fillStyle = "#000"
  ctx.beginPath()
  ctx.ellipse(220, 180, 10, 15, 0, 0, Math.PI * 2)
  ctx.ellipse(280, 180, 10, 15, 0, 0, Math.PI * 2)
  ctx.fill()

  // Draw nose
  ctx.beginPath()
  ctx.moveTo(250, 200)
  ctx.lineTo(245, 220)
  ctx.lineTo(255, 220)
  ctx.closePath()
  ctx.fill()

  // Draw lips
  ctx.fillStyle = "#FF69B4"
  ctx.beginPath()
  ctx.moveTo(230, 240)
  ctx.quadraticCurveTo(250, 260, 270, 240)
  ctx.quadraticCurveTo(250, 250, 230, 240)
  ctx.fill()

  // Draw neck and shoulders
  ctx.fillStyle = colors.skinTone
  ctx.beginPath()
  ctx.moveTo(200, 300)
  ctx.lineTo(300, 300)
  // Draw breast shape
  ctx.fillStyle = colors.skinTone
  const breastSizes = {
    small: 20,
    medium: 30,
    large: 40,
  }
  const breastSize = breastSizes[state.breastSize]
  ctx.beginPath()
  ctx.moveTo(200, 300)
  ctx.quadraticCurveTo(250, 300 - breastSize, 300, 300)
  ctx.quadraticCurveTo(350, 350, 300, 400)
  ctx.lineTo(200, 400)
  ctx.quadraticCurveTo(150, 350, 200, 300)
  ctx.fill()
}

function drawHair(style) {
  ctx.fillStyle = colors.hair
  switch (style) {
    case "long":
      ctx.beginPath()
      ctx.moveTo(160, 150)
      ctx.quadraticCurveTo(250, 100, 340, 150)
      ctx.quadraticCurveTo(380, 300, 340, 500)
      ctx.quadraticCurveTo(250, 550, 160, 500)
      ctx.quadraticCurveTo(120, 300, 160, 150)
      ctx.fill()
      break
    case "short":
      ctx.beginPath()
      ctx.arc(250, 180, 110, 0, Math.PI * 2)
      ctx.fill()
      break
    case "curly":
      for (let i = 0; i < 50; i++) {
        ctx.beginPath()
        ctx.arc(160 + Math.random() * 180, 100 + Math.random() * 200, 20 + Math.random() * 30, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    case "updo":
      ctx.beginPath()
      ctx.moveTo(180, 100)
      ctx.quadraticCurveTo(250, 50, 320, 100)
      ctx.quadraticCurveTo(350, 150, 320, 200)
      ctx.quadraticCurveTo(250, 220, 180, 200)
      ctx.quadraticCurveTo(150, 150, 180, 100)
      ctx.fill()
      break
    case "mohawk":
      ctx.beginPath()
      ctx.moveTo(250, 50)
      ctx.lineTo(220, 150)
      ctx.quadraticCurveTo(250, 130, 280, 150)
      ctx.closePath()
      ctx.fill()
      break
    case "pigtails":
      ctx.beginPath()
      ctx.arc(180, 150, 50, 0, Math.PI * 2)
      ctx.arc(320, 150, 50, 0, Math.PI * 2)
      ctx.fill()
      break
  }
}

function drawOutfit() {
  if (state.outfit.fullBody) {
    drawFullBodyOutfit(state.outfit.fullBody)
  } else {
    if (state.outfit.top) drawTop(state.outfit.top)
    if (state.outfit.bottom) drawBottom(state.outfit.bottom)
  }
}

function drawTop(style) {
  ctx.fillStyle = colors.outfit
  switch (style) {
    case "tank top":
      ctx.beginPath()
      ctx.moveTo(200, 300)
      ctx.lineTo(220, 400)
      ctx.lineTo(280, 400)
      ctx.lineTo(300, 300)
      ctx.closePath()
      ctx.fill()
      break
    case "crop top":
      ctx.beginPath()
      ctx.moveTo(200, 300)
      ctx.lineTo(220, 350)
      ctx.lineTo(280, 350)
      ctx.lineTo(300, 300)
      ctx.closePath()
      ctx.fill()
      break
    case "blouse":
      ctx.beginPath()
      ctx.moveTo(180, 300)
      ctx.quadraticCurveTo(250, 280, 320, 300)
      ctx.lineTo(320, 400)
      ctx.lineTo(180, 400)
      ctx.closePath()
      ctx.fill()
      break
    case "corset":
      ctx.beginPath()
      ctx.moveTo(200, 300)
      ctx.quadraticCurveTo(250, 280, 300, 300)
      ctx.lineTo(280, 400)
      ctx.lineTo(220, 400)
      ctx.closePath()
      ctx.fill()
      // Draw corset laces
      ctx.strokeStyle = "#FFFFFF"
      ctx.lineWidth = 2
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.moveTo(240, 320 + i * 20)
        ctx.lineTo(260, 320 + i * 20)
        ctx.stroke()
      }
      break
  }
}

function drawBottom(style) {
  ctx.fillStyle = colors.outfit
  switch (style) {
    case "skirt":
      ctx.beginPath()
      ctx.moveTo(220, 400)
      ctx.quadraticCurveTo(250, 420, 280, 400)
      ctx.quadraticCurveTo(300, 550, 280, 680)
      ctx.lineTo(220, 680)
      ctx.quadraticCurveTo(200, 550, 220, 400)
      ctx.closePath()
      ctx.fill()
      break
    case "pants":
      ctx.beginPath()
      ctx.moveTo(220, 400)
      ctx.lineTo(240, 680)
      ctx.lineTo(260, 680)
      ctx.lineTo(280, 400)
      ctx.closePath()
      ctx.fill()
      break
    case "shorts":
      ctx.beginPath()
      ctx.moveTo(220, 400)
      ctx.lineTo(240, 500)
      ctx.lineTo(260, 500)
      ctx.lineTo(280, 400)
      ctx.closePath()
      ctx.fill()
      break
  }
}

function drawFullBodyOutfit(style) {
  ctx.fillStyle = colors.outfit
  switch (style) {
    case "ballgown":
      // Top part
      ctx.beginPath()
      ctx.moveTo(200, 300)
      ctx.quadraticCurveTo(250, 280, 300, 300)
      ctx.lineTo(320, 400)
      ctx.lineTo(180, 400)
      ctx.closePath()
      ctx.fill()
      // Bottom part
      ctx.beginPath()
      ctx.moveTo(180, 400)
      ctx.quadraticCurveTo(100, 550, 180, 680)
      ctx.lineTo(320, 680)
      ctx.quadraticCurveTo(400, 550, 320, 400)
      ctx.closePath()
      ctx.fill()
      break
    case "mermaid":
      // Top part
      ctx.beginPath()
      ctx.moveTo(200, 300)
      ctx.quadraticCurveTo(250, 280, 300, 300)
      ctx.lineTo(320, 400)
      ctx.lineTo(180, 400)
      ctx.closePath()
      ctx.fill()
      // Bottom part
      ctx.beginPath()
      ctx.moveTo(180, 400)
      ctx.quadraticCurveTo(250, 500, 200, 600)
      ctx.quadraticCurveTo(250, 700, 300, 600)
      ctx.quadraticCurveTo(250, 500, 320, 400)
      ctx.closePath()
      ctx.fill()
      break
    case "jumpsuit":
      ctx.beginPath()
      ctx.moveTo(200, 300)
      ctx.quadraticCurveTo(250, 280, 300, 300)
      ctx.lineTo(320, 400)
      ctx.lineTo(300, 680)
      ctx.lineTo(200, 680)
      ctx.lineTo(180, 400)
      ctx.closePath()
      ctx.fill()
      break
    case "minidress":
      ctx.beginPath()
      ctx.moveTo(200, 300)
      ctx.quadraticCurveTo(250, 280, 300, 300)
      ctx.quadraticCurveTo(320, 350, 300, 500)
      ctx.lineTo(200, 500)
      ctx.quadraticCurveTo(180, 350, 200, 300)
      ctx.closePath()
      ctx.fill()
      break
    case "catsuit":
      ctx.beginPath()
      ctx.moveTo(200, 300)
      ctx.quadraticCurveTo(250, 280, 300, 300)
      ctx.lineTo(320, 400)
      ctx.quadraticCurveTo(300, 550, 280, 680)
      ctx.lineTo(220, 680)
      ctx.quadraticCurveTo(200, 550, 180, 400)
      ctx.closePath()
      ctx.fill()
      break
    case "pantsuit":
      // Jacket
      ctx.beginPath()
      ctx.moveTo(200, 300)
      ctx.quadraticCurveTo(250, 280, 300, 300)
      ctx.lineTo(320, 450)
      ctx.lineTo(180, 450)
      ctx.closePath()
      ctx.fill()
      // Pants
      ctx.beginPath()
      ctx.moveTo(200, 450)
      ctx.lineTo(220, 680)
      ctx.lineTo(280, 680)
      ctx.lineTo(300, 450)
      ctx.closePath()
      ctx.fill()
      break
  }
}

function drawMakeup(type) {
  switch (type) {
    case "eyeshadow":
      ctx.fillStyle = colors.eyeshadow
      ctx.beginPath()
      ctx.moveTo(200, 170)
      ctx.quadraticCurveTo(220, 160, 240, 170)
      ctx.quadraticCurveTo(220, 190, 200, 170)
      ctx.moveTo(260, 170)
      ctx.quadraticCurveTo(280, 160, 300, 170)
      ctx.quadraticCurveTo(280, 190, 260, 170)
      ctx.fill()
      break
    case "eyelashes":
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 2
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.moveTo(210 + i * 8, 170)
        ctx.lineTo(205 + i * 8, 160)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(270 + i * 8, 170)
        ctx.lineTo(265 + i * 8, 160)
        ctx.stroke()
      }
      break
    case "lipstick":
      ctx.fillStyle = colors.lipstick
      ctx.beginPath()
      ctx.moveTo(230, 240)
      ctx.quadraticCurveTo(250, 260, 270, 240)
      ctx.quadraticCurveTo(250, 250, 230, 240)
      ctx.fill()
      break
    case "blush":
      ctx.fillStyle = `${colors.blush}80`
      ctx.beginPath()
      ctx.arc(200, 220, 20, 0, Math.PI * 2)
      ctx.arc(300, 220, 20, 0, Math.PI * 2)
      ctx.fill()
      break
    case "eyeliner":
      ctx.strokeStyle = colors.eyeliner
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(200, 175)
      ctx.quadraticCurveTo(220, 170, 240, 175)
      ctx.moveTo(260, 175)
      ctx.quadraticCurveTo(280, 170, 300, 175)
      ctx.stroke()
      break
    case "contour":
      ctx.fillStyle = `${colors.contour}40`
      ctx.beginPath()
      ctx.moveTo(200, 220)
      ctx.quadraticCurveTo(220, 260, 250, 280)
      ctx.quadraticCurveTo(280, 260, 300, 220)
      ctx.fill()
      break
    case "highlighter":
      ctx.fillStyle = `${colors.highlighter}80`
      ctx.beginPath()
      ctx.moveTo(250, 200)
      ctx.quadraticCurveTo(270, 220, 290, 200)
      ctx.quadraticCurveTo(270, 180, 250, 200)
      ctx.fill()
      break
  }
}

function drawAccessory(type) {
  ctx.fillStyle = colors[type]
  switch (type) {
    case "crown":
      ctx.beginPath()
      ctx.moveTo(200, 100)
      ctx.lineTo(220, 60)
      ctx.lineTo(240, 100)
      ctx.lineTo(260, 60)
      ctx.lineTo(280, 100)
      ctx.lineTo(300, 60)
      ctx.lineTo(320, 100)
      ctx.closePath()
      ctx.fill()
      break
    case "necklace":
      ctx.strokeStyle = colors.necklace
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(250, 350, 50, 0, Math.PI)
      ctx.stroke()
      // Add diamonds
      ctx.fillStyle = "#FFFFFF"
      for (let i = 0; i < 5; i++) {
        const angle = Math.PI * (0.1 + i * 0.2)
        const x = 250 + Math.cos(angle) * 50
        const y = 350 + Math.sin(angle) * 50
        ctx.beginPath()
        ctx.moveTo(x, y - 5)
        ctx.lineTo(x - 3, y)
        ctx.lineTo(x, y + 5)
        ctx.lineTo(x + 3, y)
        ctx.closePath()
        ctx.fill()
      }
      break
    case "earrings":
      ctx.beginPath()
      ctx.arc(160, 200, 10, 0, Math.PI * 2)
      ctx.arc(340, 200, 10, 0, Math.PI * 2)
      ctx.fill()
      break
    case "boa":
      for (let i = 0; i < 20; i++) {
        ctx.beginPath()
        ctx.arc(180 + i * 15, 350 + Math.sin(i * 0.5) * 20, 10, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    case "gloves":
      ctx.beginPath()
      ctx.rect(180, 400, 40, 100)
      ctx.rect(280, 400, 40, 100)
      ctx.fill()
      break
    case "handbag":
      ctx.beginPath()
      ctx.arc(150, 500, 30, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(150, 470)
      ctx.lineTo(150, 420)
      ctx.stroke()
      break
  }
}

function showQuote() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)]
  quoteContainer.textContent = quote
  quoteContainer.style.opacity = 1
  setTimeout(() => {
    quoteContainer.style.opacity = 0
  }, 3000)
}

function saveLook() {
  const dataURL = canvas.toDataURL("image/png")

  // Check if the device is mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  if (isMobile) {
    // Open a new window with the image
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(`
                <html>
                    <head>
                        <title>Your Fabulous Drag Queen</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            body {
                                margin: 0;
                                padding: 0;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                min-height: 100vh;
                                background: linear-gradient(135deg, #ff69b4, #9370db);
                                font-family: Arial, sans-serif;
                            }
                            img {
                                max-width: 100%;
                                height: auto;
                                border: 5px solid white;
                                border-radius: 10px;
                                box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
                            }
                            h1 {
                                color: white;
                                text-align: center;
                                margin-bottom: 20px;
                                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
                            }
                            .save-btn {
                                margin-top: 20px;
                                padding: 10px 20px;
                                font-size: 18px;
                                background-color: #4CAF50;
                                color: white;
                                border: none;
                                border-radius: 5px;
                                cursor: pointer;
                                transition: background-color 0.3s;
                            }
                            .save-btn:hover {
                                background-color: #45a049;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>Your Fabulous Drag Queen</h1>
                        <img src="${dataURL}" alt="Your Fabulous Drag Queen">
                        <button class="save-btn" onclick="saveImage()">Save Image</button>
                        <script>
                            function saveImage() {
                                const link = document.createElement('a');
                                link.href = '${dataURL}';
                                link.download = 'my-fabulous-drag-queen.png';
                                link.click();
                            }
                        </script>
                    </body>
                </html>
            `)
    } else {
      alert("Unable to open a new window. Please check your browser settings.")
    }
  } else {
    // For desktop, keep the existing download functionality
    const link = document.createElement("a")
    link.href = dataURL
    link.download = "my-fabulous-drag-queen.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  showQuote()
  quoteContainer.textContent = "Sashay You Stay! Your look has been saved, queen! 💖👑"
  playSound("save")
}

function randomizeLook() {
  state.skinTone = getRandomOption("skinTone")
  state.makeup = getRandomOptions("makeup", Math.floor(Math.random() * 4) + 1)
  state.hair = getRandomOption("hair")
  state.breastSize = getRandomOption("breastSize")
  state.outfit.top = getRandomOption("outfit").top[Math.floor(Math.random() * options.outfit.top.length)]
  state.outfit.bottom = getRandomOption("outfit").bottom[Math.floor(Math.random() * options.outfit.bottom.length)]
  state.outfit.fullBody = null
  state.accessories = getRandomOptions("accessories", Math.floor(Math.random() * 3) + 1)

  updateCanvas()
  showQuote()
  playSound("select")
}

function getRandomOption(category) {
  const categoryplaySound
  ;("select")
}

function getRandomOption(category) {
  const categoryOptions = options[category]
  if (Array.isArray(categoryOptions)) {
    return categoryOptions[Math.floor(Math.random() * categoryOptions.length)]
  } else {
    const keys = Object.keys(categoryOptions)
    return categoryOptions[keys[Math.floor(Math.random() * keys.length)]]
  }
}

function getRandomOptions(category, count) {
  const categoryOptions = options[category]
  const shuffled = categoryOptions.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function applyPresetLook(event) {
  const lookIndex = event.target.value
  if (lookIndex !== "") {
    const look = presetLooks[lookIndex]
    state.skinTone = look.skinTone
    state.makeup = look.makeup
    state.hair = look.hair
    state.outfit = {
      top: look.outfit.top || null,
      bottom: look.outfit.bottom || null,
      fullBody: look.outfit.fullBody || null,
    }
    state.accessories = look.accessories

    updateCanvas()
    showQuote()
    playSound("select")
  }
}

function getSkinToneColor(tone) {
  const skinTones = {
    light: "#FFE0BD",
    medium: "#D8A678",
    dark: "#8D5524",
    deep: "#5C3317",
  }
  return skinTones[tone] || "#FFE0BD"
}

function addGlowEffect(element) {
  element.style.boxShadow = "0 0 10px #ff69b4"
  setTimeout(() => {
    element.style.boxShadow = "none"
  }, 300)
}

function animateOption(option) {
  const btn = Array.from(optionsContainer.children).find((el) => el.textContent === option)
  if (btn) {
    btn.style.transform = "scale(1.1)"
    setTimeout(() => {
      btn.style.transform = "scale(1)"
    }, 200)
  }
}

function playSound(type) {
  soundEffects[type].play().catch((e) => console.error("Error playing sound:", e))
}

// Initialize the game
showOptions("makeup")
updateCanvas()

