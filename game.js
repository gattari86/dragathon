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
  outfit: null,
  accessories: [],
}

// Colors for each category
const colors = {
  skinTone: "#FFE0BD",
  makeup: "#FF69B4",
  hair: "#8B4513",
  outfit: "#9370DB",
  accessories: "#FFD700",
}

// Customization options
const options = {
  skinTone: ["light", "medium", "dark", "deep"],
  makeup: ["eyeshadow", "lipstick", "blush", "eyeliner", "contour", "highlighter"],
  hair: ["long", "short", "curly", "updo", "mohawk", "pigtails"],
  outfit: ["ballgown", "mermaid", "jumpsuit", "minidress", "catsuit", "pantsuit"],
  accessories: ["crown", "necklace", "earrings", "boa", "gloves", "handbag"],
}

// Preset looks
const presetLooks = [
  {
    name: "Classic Glamour",
    skinTone: "light",
    makeup: ["eyeshadow", "lipstick"],
    hair: "updo",
    outfit: "ballgown",
    accessories: ["necklace", "earrings"],
  },
  {
    name: "Edgy Diva",
    skinTone: "medium",
    makeup: ["eyeliner", "contour"],
    hair: "mohawk",
    outfit: "catsuit",
    accessories: ["gloves", "earrings"],
  },
  {
    name: "Colorful Queen",
    skinTone: "dark",
    makeup: ["eyeshadow", "lipstick", "blush"],
    hair: "curly",
    outfit: "jumpsuit",
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
    colorInput.value = colors[currentCategory]
    addGlowEffect(btn)
  })
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
  options[category].forEach((option) => {
    const btn = document.createElement("button")
    btn.textContent = option
    btn.classList.add("optionBtn")
    if (
      (category === "skinTone" && state.skinTone === option) ||
      (category === "hair" && state.hair === option) ||
      (category === "outfit" && state.outfit === option) ||
      state.makeup.includes(option) ||
      state.accessories.includes(option)
    ) {
      btn.classList.add("active")
    }
    btn.addEventListener("click", () => {
      applyOption(category, option)
      btn.classList.toggle("active")
      playSound("select")
    })
    optionsContainer.appendChild(btn)
  })
}

function applyOption(category, option) {
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
  if (state.outfit) drawOutfit(state.outfit)
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

function drawOutfit(style) {
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
  ctx.fillStyle = colors.makeup
  switch (type) {
    case "eyeshadow":
      ctx.beginPath()
      ctx.ellipse(220, 175, 25, 15, 0, 0, Math.PI * 2)
      ctx.ellipse(280, 175, 25, 15, 0, 0, Math.PI * 2)
      ctx.fill()
      break
    case "lipstick":
      ctx.beginPath()
      ctx.moveTo(230, 240)
      ctx.quadraticCurveTo(250, 260, 270, 240)
      ctx.quadraticCurveTo(250, 250, 230, 240)
      ctx.fill()
      break
    case "blush":
      ctx.fillStyle = `${colors.makeup}80`
      ctx.beginPath()
      ctx.arc(200, 220, 20, 0, Math.PI * 2)
      ctx.arc(300, 220, 20, 0, Math.PI * 2)
      ctx.fill()
      break
    case "eyeliner":
      ctx.strokeStyle = colors.makeup
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(200, 175)
      ctx.quadraticCurveTo(220, 170, 240, 175)
      ctx.moveTo(260, 175)
      ctx.quadraticCurveTo(280, 170, 300, 175)
      ctx.stroke()
      break
    case "contour":
      ctx.fillStyle = `${colors.makeup}40`
      ctx.beginPath()
      ctx.moveTo(200, 220)
      ctx.quadraticCurveTo(220, 260, 250, 280)
      ctx.quadraticCurveTo(280, 260, 300, 220)
      ctx.fill()
      break
    case "highlighter":
      ctx.fillStyle = `${colors.makeup}80`
      ctx.beginPath()
      ctx.moveTo(250, 200)
      ctx.quadraticCurveTo(270, 220, 290, 200)
      ctx.quadraticCurveTo(270, 180, 250, 200)
      ctx.fill()
      break
  }
}

function drawAccessory(type) {
  ctx.fillStyle = colors.accessories
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
      ctx.strokeStyle = colors.accessories
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(250, 350, 50, 0, Math.PI)
      ctx.stroke()
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

  // Create a temporary link element
  const link = document.createElement("a")
  link.href = dataURL
  link.download = "my-fabulous-drag-queen.png"

  // Simulate a click on the link to trigger the download
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  showQuote()
  quoteContainer.textContent = "Sashay You Stay! Your look has been saved, queen! 💖👑"
  playSound("save")
}

function randomizeLook() {
  state.skinTone = getRandomOption("skinTone")
  state.makeup = getRandomOptions("makeup", Math.floor(Math.random() * 4) + 1)
  state.hair = getRandomOption("hair")
  state.outfit = getRandomOption("outfit")
  state.accessories = getRandomOptions("accessories", Math.floor(Math.random() * 3) + 1)

  updateCanvas()
  showQuote()
  playSound("select")
}

function getRandomOption(category) {
  const categoryOptions = options[category]
  return categoryOptions[Math.floor(Math.random() * categoryOptions.length)]
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
    state.outfit = look.outfit
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

