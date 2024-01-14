
var tiles = {}
var generated = {}
var ts = 48*6
var r = 9
var lRoads = []
var pickups = {}
var fuel = 0
var moves = 8
var lost = false
var roadi = 0
var score = 0
var bestScore = 0

var starting = 3
var started = false
var startingR = -1

var retryButton = new ui.Button("rect", "Retry")
var menuButton = new ui.Button("rect", "Menu")
retryButton.bgColour = [0, 0, 0, 0.5]
menuButton.bgColour = [0, 0, 0, 0.5]

var loseA = 0

var buildUi = {x: -1000000, y: 0}

var road = {x: 0, y: 0, ld: 0}

var shakeAnim = 1
var scoreAnim = 1
var connectAnim = 1

var ro = [0, 1, 3, 4, 6, 7]

var rules = [
    [[], [], [], []],
    [[], [], [], []],
    [[2, 8, 9], [2, 8, 9], [2, 8, 9], [2, 8, 9]],
    [[], [], [], []],
    [[], [], [], []],
    [[...ro, 5, 8], [...ro, 5, 8], [...ro, 5, 8], [...ro, 5, 8]],
    [[], [], [], []],
    [[], [], [], []],
    [[...ro, 8, 2, 5], [...ro, 8, 2, 5], [...ro, 8, 2, 5], [...ro, 8, 2, 5]],
    [[2, 10, 9], [2, 10, 9], [2, 10, 9], [2, 10, 9]],
    [[2, 8, 10, 11], [2, 8, 10, 11], [2, 8, 10, 11], [2, 8, 10, 11]],
    [[10], [10], [10], [10]]
]

var player = new Player()

function toScreen(x, y) {
    return [(x-camera.x)*camera.zoom+canvas.width/2, (y-camera.y)*camera.zoom+canvas.height/2]
}

var fps = 0
var start = true

var actual = 0
var pt = {x: 0, y: 0}
function getV(x, y) {
    if (x+","+y in tiles) {
        actual++
        return tiles[x+","+y]
    }
    return -1
}

window.onclick = () => {window.focus()}

function roadTick() {
    if (Math.abs(road.x - pt.x) < r/1.5 && Math.abs(road.y - pt.y) < r/1.5 && moves > 0) {
        let dirs = []
        if (!((road.x+1)+","+(road.y) in tiles) || !ro.includes(tiles[(road.x+1)+","+(road.y)])) dirs.push({x: road.x+1, y: road.y, d: 2})
        if (!((road.x-1)+","+(road.y) in tiles) || !ro.includes(tiles[(road.x-1)+","+(road.y)])) dirs.push({x: road.x-1, y: road.y, d: 0})
        if (!((road.x)+","+(road.y+1) in tiles) || !ro.includes(tiles[(road.x)+","+(road.y+1)])) dirs.push({x: road.x, y: road.y+1, d: 3})
        if (!((road.x)+","+(road.y-1) in tiles) || !ro.includes(tiles[(road.x)+","+(road.y-1)])) dirs.push({x: road.x, y: road.y-1, d: 1})

        if (dirs.length > 0) {
            let t = road.x+","+road.y

            let dir = dirs[Math.round(Math.random()*(dirs.length-1))]
            if (start) dir = dirs[0]; start = false
            road.x = dir.x
            road.y = dir.y
            
            if (dir.d == 0) {
                if (road.ld == 1) {
                    tiles[t] = 4
                } else if (road.ld == 3) {
                    tiles[t] = 7
                } else [
                    tiles[t] = 0
                ]
            } else if (dir.d == 2) {
                if (road.ld == 1) {
                    tiles[t] = 3
                } else if (road.ld == 3) {
                    tiles[t] = 6
                } else {
                    tiles[t] = 0
                }
            } else if (dir.d == 1) {
                if (road.ld == 0) {
                    tiles[t] = 6
                } else if (road.ld == 2) {
                    tiles[t] = 7
                } else {
                    tiles[t] = 1
                }
            } else if (dir.d == 3) {
                if (road.ld == 0) {
                    tiles[t] = 3
                } else if (road.ld == 2) {
                    tiles[t] = 4
                } else {
                    tiles[t] = 1
                }
            }
            let type = 0
            if (roadi%5 == 0 && roadi > 3) type = 1
            pickups[t] = [{x: Math.random()/2-0.25, y: Math.random()/2-0.25, t: type}]
            moves -= 1
            road.ld = dir.d
            roadi++
            lRoads.push({...road})
        } else {
            // let t = lRoads[lRoads.length-2].x+","+lRoads[lRoads.length-2].y
            // delete tiles[t]
            road = lRoads[lRoads.length-1]
            lRoads.splice(lRoads.length-1, 1)
        }

        

        // tiles[t] = dir.d
    }
}

var poses = []

function drawMap() {
    for (let t in tiles) {
        if (!poses.includes(t)) {
            delete tiles[t]
            delete generated[t]
            delete pickups[t]
        } else {
            let p = t.split(",").map(n => parseInt(n))
            ui.img(...toScreen(p[0]*ts, p[1]*ts), ts*camera.zoom*1.01, ts*camera.zoom*1.01, tilesImg, [(tiles[t]%3)*48, Math.floor(tiles[t]/3)*48,  48, 48])
            if (t in pickups) {
                for (let pickup of pickups[t]) {
                    if (pickup.t == 0) {
                        ui.img(...toScreen(p[0]*ts+pickup.x*ts, p[1]*ts+pickup.y*ts), 12*6*camera.zoom/1.5, 12*6*camera.zoom/1.5, buildImg)
                    } else {
                        ui.img(...toScreen(p[0]*ts+pickup.x*ts, p[1]*ts+pickup.y*ts), 12*6*camera.zoom/1.5, 12*6*camera.zoom/1.5, coneImg)
                    }
                }
            }
        }
    }
}

function waveFunctionCollapse() {
    let offs = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1]
    ]

    let done = false

    for (let t in tiles) {
        if (t in generated) continue
        let p = t.split(",").map(n => parseInt(n))
        let edgei = 0
        for (let off of offs) {
            let t2 = (p[0]+off[0])+","+(p[1]+off[1])
            if (poses.includes(t2) && !(t2 in tiles)) {
                let possible = []
                for (let i in rules) {
                    if (rules[i][edgei].includes(tiles[t])) {
                        possible.push(i)
                    }
                }
                if (possible.length > 0) tiles[t2] = parseInt(possible[Math.round(Math.random()*(possible.length-1))])
            }
            edgei++
        }
        // generateda[t] = true
        if (done) break
    }
}

function updatePoses() {
    poses = []
    for (let x = 0; x < r*2+1; x++) {
        for (let y = 0; y < r*2+1; y++) {
            let t = (x-r + road.x)+","+(y-r + road.y)
            
            poses.push(t)
        }
    }
    let r2 = Math.ceil(r*1)
    for (let x = 0; x < r2*2+1; x++) {
        for (let y = 0; y < r2*2+1; y++) {
            let t = (x-r2 + pt.x)+","+(y-r2 + pt.y)

            if (!poses.includes(t)) poses.push(t)
        }
    }
}

var amt = 1

function gameTick() {
    fps++

    shakeAnim += delta
    scoreAnim += delta
    connectAnim += delta
    if (shakeAnim > 1) shakeAnim = 1
    if (scoreAnim > 1) scoreAnim = 1
    if (connectAnim > 1) connectAnim = 1

    camera.zoom = lerp(camera.zoom, su, delta*10)
    camera.x = lerp(camera.x, player.x, delta*10)
    camera.y = lerp(camera.y, player.y, delta*10)
    camera.x += Math.sin(Math.min(shakeAnim*3, 1)*Math.PI*2) * shakeMul
    camera.y += Math.sin(Math.min(shakeAnim*3, 1)*Math.PI*4) * shakeMul

    player.tick()

    for (let t in pickups) {
        let p = t.split(",").map(n => parseInt(n)*ts)
        for (let i = 0; i < pickups[t].length; i++) {
            let p2 = {x: pickups[t][i].x*ts+p[0], y: pickups[t][i].y*ts+p[1]}
            if (Math.sqrt((p2.x-player.x)**2 + (p2.y-player.y)**2) < ts/7.5) {
                if (pickups[t][i].t == 0) {
                    fuel += 1
                    score += 1
                    player.health += 0.1
                    connectAnim = 0
                    scoreAnim = 0
                    playSound(`collect${Math.round(Math.random()*2)+1}.ogg`, 0.5)
                } else {
                    playSound("hit.ogg")
                    player.health -= 1
                    shakeAnim = 0
                }
                pickups[t].splice(i, 1)
                i--
            }
        }
        if (pickups[t].length <= 0) {
            delete pickups[t]
        }
    }

    if (fuel >= 5) {
        moves += 7
        fuel -= 5
    }

    pt = {x: Math.floor(player.x/ts), y: Math.floor(player.y/ts)}

    roadTick()
    
    updatePoses()

    waveFunctionCollapse()

    drawMap()

    ui.img(...toScreen(road.x*ts, road.y*ts), ts*camera.zoom * (0.1*Math.sin(Math.min(connectAnim*3, 1)*Math.PI)+1), ts*camera.zoom * (0.1*Math.sin(Math.min(connectAnim*3, 1)*Math.PI)+1), buildSiteImg)

    player.draw()
    
    let buildUi3 = {x: road.x*ts, y: road.y*ts}
    
    if (roadi > 5) {
        if (buildUi.x == -1000000) {
            buildUi = {...buildUi3}
        }
    
        buildUi.x = lerp(buildUi.x, buildUi3.x, delta*5)
        buildUi.y = lerp(buildUi.y, buildUi3.y, delta*5)
    }

    let buildUi2 = {x: toScreen(buildUi.x, buildUi.y)[0], y: toScreen(buildUi.x, buildUi.y)[1]}

    if (buildUi2.x < 160*su) buildUi2.x = 160*su
    if (buildUi2.x > canvas.width-160*su) buildUi2.x = canvas.width-160*su
    if (buildUi2.y < 60*su) buildUi2.y = 60*su
    if (buildUi2.y > canvas.height-60*su) buildUi2.y = canvas.height-60*su
    if (roadi > 5) {
        ui.rect(buildUi2.x, buildUi2.y, 300*su, 100*su, [0, 0, 0, 0.5])
        ui.text(buildUi2.x, buildUi2.y, 40*su * (0.1*Math.sin(Math.min(connectAnim*3, 1)*Math.PI)+1), (fuel+moves)+" / 5", {align: "center"})
    }

    ui.text(canvas.width/2, 60*su, 50*su * (0.1*Math.sin(Math.min(scoreAnim*3, 1)*Math.PI)+1), score.toString(), {align: "center"})

    ui.rect(canvas.width - 150*su - 25*su, canvas.height - 60*su - 25*su, 300*su, 120*su, [0, 0, 0, 1])

    let amt2 = player.health / 5 + 0.2
    amt = lerp(amt, amt2, delta*15)

    let w1 = Math.max(Math.min(amt-0.2, 0.2), 0)/0.2
    let w2 = Math.max(Math.min(amt-0.4, 0.2), 0)/0.2
    let w3 = Math.max(Math.min(amt-0.6, 0.2), 0)/0.2
    let w4 = Math.max(Math.min(amt-0.8, 0.2), 0)/0.2
    let w5 = Math.max(Math.min(amt-1.0, 0.2), 0)/0.2

    ui.rect(canvas.width - 150*su - 25*su   -   145*su+29*su*w1, canvas.height - 60*su - 25*su, w1*58*su, 110*su, [255, 0, 0, 1])
    ui.rect(canvas.width - 150*su - 25*su   -   145*su+29*su*w2 + 58*su*1, canvas.height - 60*su - 25*su, w2*58*su, 110*su, [255, 127, 0, 1])
    ui.rect(canvas.width - 150*su - 25*su   -   145*su+29*su*w3 + 58*su*2, canvas.height - 60*su - 25*su, w3*58*su, 110*su, [255, 255, 0, 1])
    ui.rect(canvas.width - 150*su - 25*su   -   145*su+29*su*w4 + 58*su*3, canvas.height - 60*su - 25*su, w4*58*su, 110*su, [0, 255, 0, 1])
    ui.rect(canvas.width - 150*su - 25*su   -   145*su+29*su*w5 + 58*su*4, canvas.height - 60*su - 25*su, w5*58*su, 110*su, [0, 200, 0, 1])

    if (lost) {
        loseA = lerp(loseA, 1, delta*10)
    } else {
        loseA = lerp(loseA, 0, delta*10)
    }
    ctx.globalAlpha = loseA

    ui.rect(canvas.width/2, canvas.height/2, 800*su, 600*su, [0, 0, 0, 0.5])

    ui.text(canvas.width/2, canvas.height/2-225*su, 75*su, "Game Over", {align: "center"})

    ui.text(canvas.width/2, canvas.height/2-100*su-25*su, 25*su, "Score: "+score, {align: "center"})
    ui.text(canvas.width/2, canvas.height/2-100*su+25*su, 25*su, "Best Score: "+bestScore, {align: "center"})

    retryButton.set(canvas.width/2, canvas.height/2, 400*su, 100*su)
    retryButton.textSize = 45*su
    if (lost) retryButton.basic()
    retryButton.draw()
    if (lost && retryButton.hovered() && mouse.lclick && overlayT == 0) {
        retryButton.click()
        tScene = "game"
        playSound("click.ogg")
        overlayT = 1
    }

    menuButton.set(canvas.width/2, canvas.height/2+110*su, 400*su, 100*su)
    menuButton.textSize = 45*su
    if (lost) menuButton.basic()
    menuButton.draw()
    if (lost && menuButton.hovered() && mouse.lclick && overlayT == 0) {
        menuButton.click()
        tScene = "menu"
        playSound("click.ogg")
        overlayT = 1
    }

    starting -= delta
    if (starting <= 0 && !started) {
        started = true
        playSound("go.ogg")
    }

    if (Math.floor(starting) != startingR && !started) {
        startingR = Math.floor(starting)
        playSound("tone.ogg")
    }

    ctx.globalAlpha = Math.max(Math.min(starting+1, 1), 0)

    if (started) {
        ui.text(canvas.width/2, canvas.height/2-100*su, 100*su * (1 - Math.abs(Math.floor(starting) - starting)**3), "GO", {align: "center"})
    } else {
        ui.text(canvas.width/2, canvas.height/2-100*su, 100*su * (1 - Math.abs(Math.floor(starting) - starting)**3), (Math.floor(starting)+1).toString(), {align: "center"})
    }
}