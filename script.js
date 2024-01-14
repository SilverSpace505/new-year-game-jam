
utils.setup()
utils.setStyles()
utils.setGlobals()
ui.setFont("font", "Minercraftory.ttf")
ui.spacingMul = 1.2

var delta = 0
var lastTime = 0
var su = 0

var camera = {x: 0, y: 0, zoom: 1}

var scene = "menu"
var tScene = "menu"

var overlayA = 0
var overlayT = 0

var carsImg = ui.newImg("cars.png")
var tilesImg = ui.newImg("tiles.png")
var buildSiteImg = ui.newImg("build-site.png")
var coneImg = ui.newImg("cone.png")
var buildImg = ui.newImg("build.png")
var healthImg = ui.newImg("health.png")

var loadedBest = localStorage.getItem("bestScore")
if (loadedBest) {
    bestScore = loadedBest
}

function playSound(path, volume2=1) {
    let sound = new Audio(path)
    sound.volume = volume * volume2
    sound.controls = false
    sound.play()
}

var music = new Audio("music.mp3")
music.loop = true
music.volume = 0
music.controls = false
music.play()

function update(timestamp) {
    requestAnimationFrame(update)

    if (music.paused) music.play()
    music.volume = volume
    music.controls = false

    input.setGlobals()
    utils.getDelta(timestamp)
    ui.resizeCanvas()
    ui.getSu()

    ui.rect(canvas.width/2, canvas.height/2, canvas.width, canvas.height, [0, 0, 0, 1])

    if (scene != "game") {
        player.x = lerp(player.x, road.x*ts, delta/10)
        player.y = lerp(player.y, road.y*ts, delta/10)
        moves = 1

        camera.zoom = lerp(camera.zoom, su, delta*10)
        camera.x = lerp(camera.x, player.x, delta*10)
        camera.y = lerp(camera.y, player.y, delta*10)

        pt = {x: Math.floor(player.x/ts), y: Math.floor(player.y/ts)}

        roadTick()
        
        updatePoses()

        waveFunctionCollapse()

        drawMap()

        ui.img(...toScreen(road.x*ts, road.y*ts), ts*camera.zoom, ts*camera.zoom, buildSiteImg)
    }

    if (scene == "game") {
        gameTick()
    } else if (scene == "menu") {
        menuTick()
    } else if (scene == "settings") {
        settingsTick()
    } else if (scene == "info") {
        infoTick()
    }

    overlayA = lerp(overlayA, overlayT, delta*10)
    if (overlayT == 1 && overlayA > 0.99) {
        overlayT = 0
        if (tScene == "game" || (tScene == "menu" && scene == "game")) {
            fuel = 0
            player.x = 0
            player.y = 0
            player.vx = 0
            player.vy = 0
            player.angle = Math.PI/2
            camera.x = 0
            camera.y = 0
            tiles = {}
            generated = {}
            pickups = {}
            lRoads = []
            road = {x: 0, y: 0, ld: 0}
            moves = 8
            roadi = 0
            lost = false
            start = true
            loseA = 0
            player.health = 5
            player.trail = []
            player.trail2 = []
            player.trailCooldown = 0
            player.hitCooldown = 0
            score = 0
            shakeAnim = 1
            scoreAnim = 1
            connectAnim = 1
            started = false
            starting = 3
            startingR = -1
        }
        scene = tScene
    }

    ctx.globalAlpha = 1
    ui.rect(canvas.width/2, canvas.height/2, canvas.width, canvas.height, [0, 0, 0, overlayA])

    input.updateInput()
}

setInterval(() =>{
    // console.log(fps)
    fps = 0
}, 1000)

requestAnimationFrame(update)

function onLose() {
    lost = true
    playSound("game-over.ogg", 0.5)
    if (score > bestScore) {
        bestScore = score
        localStorage.setItem("bestScore", bestScore)
    }
}