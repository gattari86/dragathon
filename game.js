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
  makeup: [],
  hair: null,
  outfit: null,
  accessories: [],
}

// Customization options
const options = {
  makeup: ["eyeshadow", "lipstick", "blush", "eyeliner"],
  hair: ["long", "short", "curly", "updo"],
  outfit: ["ballgown", "mermaid", "jumpsuit", "minidress"],
  accessories: ["crown", "necklace", "earrings", "boa"],
}

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

// Colors
let currentColor = "#FF69B4"

// Event listeners
document.querySelectorAll(".categoryBtn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".categoryBtn.active").classList.remove("active")
    btn.classList.add("active")
    showOptions(btn.dataset.category)
  })
})

applyColorBtn.addEventListener("click", () => {
  currentColor = colorInput.value
  updateCanvas()
})

saveLookBtn.addEventListener("click", saveLook)

// Functions
function showOptions(category) {
  optionsContainer.innerHTML = ""
  options[category].forEach((option) => {
    const btn = document.createElement("button")
    btn.textContent = option
    btn.classList.add("optionBtn")
    if (
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
    })
    optionsContainer.appendChild(btn)
  })
}

function applyOption(category, option) {
  if (category === "makeup") {
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
  ctx.fillStyle = "#FFE0BD"
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
  ctx.fillStyle = "#FFE0BD"
  ctx.beginPath()
  ctx.moveTo(200, 300)
  ctx.lineTo(300, 300)
  ctx.quadraticCurveTo(350, 350, 300, 400)
  ctx.lineTo(200, 400)
  ctx.quadraticCurveTo(150, 350, 200, 300)
  ctx.fill()
}

function drawHair(style) {
  ctx.fillStyle = currentColor
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
  }
}

function drawOutfit(style) {
  ctx.fillStyle = currentColor
  switch (style) {
    case "ballgown":
      ctx.beginPath()
      ctx.moveTo(180, 400)
      ctx.quadraticCurveTo(100, 550, 180, 680)
      ctx.lineTo(320, 680)
      ctx.quadraticCurveTo(400, 550, 320, 400)
      ctx.closePath()
      ctx.fill()
      break
    case "mermaid":
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
      ctx.moveTo(180, 400)
      ctx.lineTo(200, 680)
      ctx.lineTo(300, 680)
      ctx.lineTo(320, 400)
      ctx.closePath()
      ctx.fill()
      break
    case "minidress":
      ctx.beginPath()
      ctx.moveTo(180, 400)
      ctx.quadraticCurveTo(250, 450, 180, 500)
      ctx.lineTo(320, 500)
      ctx.quadraticCurveTo(250, 450, 320, 400)
      ctx.closePath()
      ctx.fill()
      break
  }
}

function drawMakeup(type) {
  switch (type) {
    case "eyeshadow":
      ctx.fillStyle = currentColor
      ctx.beginPath()
      ctx.ellipse(220, 175, 25, 15, 0, 0, Math.PI * 2)
      ctx.ellipse(280, 175, 25, 15, 0, 0, Math.PI * 2)
      ctx.fill()
      break
    case "lipstick":
      ctx.fillStyle = currentColor
      ctx.beginPath()
      ctx.moveTo(230, 240)
      ctx.quadraticCurveTo(250, 260, 270, 240)
      ctx.quadraticCurveTo(250, 250, 230, 240)
      ctx.fill()
      break
    case "blush":
      ctx.fillStyle = `${currentColor}80`
      ctx.beginPath()
      ctx.arc(200, 220, 20, 0, Math.PI * 2)
      ctx.arc(300, 220, 20, 0, Math.PI * 2)
      ctx.fill()
      break
    case "eyeliner":
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(200, 175)
      ctx.quadraticCurveTo(220, 170, 240, 175)
      ctx.moveTo(260, 175)
      ctx.quadraticCurveTo(280, 170, 300, 175)
      ctx.stroke()
      break
  }
}

function drawAccessory(type) {
  switch (type) {
    case "crown":
      ctx.fillStyle = "gold"
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
      ctx.strokeStyle = "silver"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(250, 350, 50, 0, Math.PI)
      ctx.stroke()
      break
    case "earrings":
      ctx.fillStyle = "gold"
      ctx.beginPath()
      ctx.arc(160, 200, 10, 0, Math.PI * 2)
      ctx.arc(340, 200, 10, 0, Math.PI * 2)
      ctx.fill()
      break
    case "boa":
      ctx.fillStyle = currentColor
      for (let i = 0; i < 20; i++) {
        ctx.beginPath()
        ctx.arc(180 + i * 15, 350 + Math.sin(i * 0.5) * 20, 10, 0, Math.PI * 2)
        ctx.fill()
      }
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
  const link = document.createElement("a")
  link.href = dataURL
  link.download = "my-fabulous-drag-queen.png"
  link.click()
  showQuote()
}

// Initialize the game
showOptions("makeup")
updateCanvas()

