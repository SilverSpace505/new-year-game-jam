
var silverImg = ui.newImg("silver.png")
var linkImg = ui.newImg("link.png")

var silverButton = new ui.Button("img", "Website")
silverButton.img = silverImg

var linkButton = new ui.Button("img")
linkButton.img = linkImg

function infoTick() {
    ui.text(canvas.width/2, 75*su, 75*su, "Information", {align: "center"})

    ui.text(canvas.width/2, 75*su+50*su, 20*su, "This is a game made for the New Year, New Skills game jam, it's a game about driving along a road where you need to get the wrenches to build the road and connect it with pieces, this game is made in JS, and is made by Silver (aka silverspace505)", {align: "center", wrap: 800*su})

    ui.text(canvas.width/2, 75*su+50*su+200*su, 75*su, "Controls", {align: "center"})
    ui.text(canvas.width/2, 75*su+50*su+200*su+50*su, 20*su, "A/Left Arrow - Turn Left \nD/Right Arrow - Turn Right", {align: "center", wrap: 800*su})

    ui.text(canvas.width/2, 500*su, 75*su, "Credits", {align: "center"})
    ui.text(canvas.width/2, 500*su+50*su, 20*su, "Sound effects from Kenny Assets \nMusic from tcarisland \nArt and Code from Silver (aka silverspace505)", {align: "center", wrap: 800*su})

    linkButton.set(canvas.width/2+165*su, 500*su+50*su+20*su, 30*su, 30*su)
    linkButton.basic()
    linkButton.draw()

    if (linkButton.hovered() && mouse.lclick) {
        linkButton.click()
        playSound("click.ogg")
        window.open("https://opengameart.org/content/driving", "_blank")
    }

    silverButton.set(canvas.width/2, 525*su+50*su+50*su+110*su, 225*su, 225*su)
    silverButton.textSize = 25*su

    silverButton.basic()
    silverButton.draw()

    if (silverButton.hovered() && mouse.lclick) {
        silverButton.click()
        playSound("click.ogg")
        window.open("https://silverspace.online", "_blank")
    }

    backButton.set(canvas.width/2, canvas.height-75*su, 300*su, 100*su)
    backButton.textSize = 45*su

    backButton.basic()
    backButton.draw()

    if (backButton.hovered() && mouse.lclick && overlayT == 0) {
        backButton.click()
        overlayT = 1
        tScene = "menu"
        playSound("click.ogg")
    }
}