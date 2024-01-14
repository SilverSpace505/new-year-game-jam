
var playButton = new ui.Button("rect", "Play")
var settingsButton = new ui.Button("rect", "Settings")
var infoButton = new ui.Button("rect", "Info")
playButton.bgColour = [0, 0, 0, 0.5]
settingsButton.bgColour = [0, 0, 0, 0.5]
infoButton.bgColour = [0, 0, 0, 0.5]

function menuTick() {
    ui.text(canvas.width/2, 75*su, 75*su, "Road Weaver", {align: "center"})
    
    playButton.set(canvas.width/2, canvas.height/2-110*su, 300*su, 100*su)
    playButton.textSize = 45*su

    playButton.basic()
    playButton.draw()

    if (playButton.hovered() && mouse.lclick && overlayT == 0) {
        playButton.click()
        playSound("click.ogg")
        tScene = "game"
        overlayT = 1
    }

    settingsButton.set(canvas.width/2, canvas.height/2, 300*su, 100*su)
    settingsButton.textSize = 45*su

    settingsButton.basic()
    settingsButton.draw()

    if (settingsButton.hovered() && mouse.lclick && overlayT == 0) {
        settingsButton.click()
        tScene = "settings"
        playSound("click.ogg")
        overlayT = 1
    }

    infoButton.set(canvas.width/2, canvas.height/2+110*su, 300*su, 100*su)
    infoButton.textSize = 45*su

    infoButton.basic()
    infoButton.draw()

    if (infoButton.hovered() && mouse.lclick && overlayT == 0) {
        infoButton.click()
        tScene = "info"
        playSound("click.ogg")
        overlayT = 1
    }

    ui.text(canvas.width/2, canvas.height/2-70*su, 20*su, "Best Score: "+bestScore, {align: "center"})
}

