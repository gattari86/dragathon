const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

// Game state
const state = {
  makeup: null,
  wig: null,
  outfit: null,
  accessories: [],
}

// Character base
function drawCharacterBase() {
  // Draw face
  ctx.fillStyle = "#FFE0BD"
  ctx.beginPath()
  ctx.arc(300, 200, 100, 0, Math.PI * 2)
  ctx.fill()

  // Draw eyes
  ctx.fillStyle = "#000"
  ctx.beginPath()
  ctx.arc(260, 180, 10, 0, Math.PI * 2)
  ctx.arc(340, 180, 10, 0, Math.PI * 2)
  ctx.fill()

  // Draw lips
  ctx.fillStyle = "#FF69B4"
  ctx.beginPath()
  ctx.arc(300, 240, 20, 0, Math.PI)
  ctx.fill()

  // Draw body
  ctx.fillStyle = "#FFE0BD"
  ctx.beginPath()
  ctx.moveTo(200, 300)
  ctx.lineTo(400, 300)
  ctx.lineTo(350, 700)
  ctx.lineTo(250, 700)
  ctx.closePath()
  ctx.fill()

  // Draw arms
  ctx.beginPath()
  ctx.moveTo(200, 300)
  ctx.lineTo(150, 500)
  ctx.lineTo(180, 520)
  ctx.lineTo(240, 340)
  ctx.closePath()
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(400, 300)
  ctx.lineTo(450, 500)
  ctx.lineTo(420, 520)
  ctx.lineTo(360, 340)
  ctx.closePath()
  ctx.fill()
}

// Makeup function
function applyMakeup(type, color) {
  ctx.fillStyle = color

  if (type === "lipstick") {
    ctx.beginPath()
    ctx.arc(300, 240, 22, 0, Math.PI)
    ctx.fill()
  } else if (type === "eyeshadow") {
    ctx.beginPath()
    ctx.ellipse(260, 170, 25, 15, 0, 0, Math.PI * 2)
    ctx.ellipse(340, 170, 25, 15, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  state.makeup = { type, color }
}

// Wig function
function applyWig(style, color) {
  ctx.fillStyle = color

  if (style === "long") {
    ctx.beginPath()
    ctx.moveTo(200, 100)
    ctx.quadraticCurveTo(300, 50, 400, 100)
    ctx.quadraticCurveTo(450, 300, 400, 500)
    ctx.quadraticCurveTo(300, 550, 200, 500)
    ctx.quadraticCurveTo(150, 300, 200, 100)
    ctx.fill()
  } else if (style === "short") {
    ctx.beginPath()
    ctx.arc(300, 150, 120, 0, Math.PI * 2)
    ctx.fill()
  }

  state.wig = { style, color }
}

// Outfit function
function applyOutfit(style, color) {
  ctx.fillStyle = color

  if (style === "ballgown") {
    ctx.beginPath()
    ctx.moveTo(200, 300)
    ctx.quadraticCurveTo(100, 500, 200, 700)
    ctx.lineTo(400, 700)
    ctx.quadraticCurveTo(500, 500, 400, 300)
    ctx.closePath()
    ctx.fill()
  } else if (style === "mermaid") {
    ctx.beginPath()
    ctx.moveTo(200, 300)
    ctx.quadraticCurveTo(300, 400, 250, 600)
    ctx.quadraticCurveTo(300, 700, 350, 600)
    ctx.quadraticCurveTo(300, 400, 400, 300)
    ctx.closePath()
    ctx.fill()
  }

  state.outfit = { style, color }
}

// Accessory function
function addAccessory(type) {
  if (type === "crown") {
    ctx.fillStyle = "gold"
    ctx.beginPath()
    ctx.moveTo(250, 80)
    ctx.lineTo(270, 40)
    ctx.lineTo(290, 80)
    ctx.lineTo(310, 40)
    ctx.lineTo(330, 80)
    ctx.lineTo(350, 40)
    ctx.lineTo(370, 80)
    ctx.closePath()
    ctx.fill()
  } else if (type === "necklace") {
    ctx.strokeStyle = "silver"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(300, 300, 50, 0, Math.PI)
    ctx.stroke()
  }

  state.accessories.push(type)
}

// Draw function
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawCharacterBase()

  if (state.wig) {
    applyWig(state.wig.style, state.wig.color)
  }

  if (state.outfit) {
    applyOutfit(state.outfit.style, state.outfit.color)
  }

  if (state.makeup) {
    applyMakeup(state.makeup.type, state.makeup.color)
  }

  state.accessories.forEach((accessory) => addAccessory(accessory))
}

// Event listeners
document.getElementById("makeupBtn").addEventListener("click", () => {
  applyMakeup("lipstick", "#FF0000")
  draw()
})

document.getElementById("wigBtn").addEventListener("click", () => {
  applyWig("long", "#FFD700")
  draw()
})

document.getElementById("outfitBtn").addEventListener("click", () => {
  applyOutfit("ballgown", "#FF69B4")
  draw()
})

document.getElementById("accessoryBtn").addEventListener("click", () => {
  addAccessory("crown")
  draw()
})

document.getElementById("saveLookBtn").addEventListener("click", () => {
  alert("Look saved! Work it, queen! 👑✨")
})

// Initial draw
draw()

