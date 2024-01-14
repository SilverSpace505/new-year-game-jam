
var volume = 0.5
var shakeMul = 1

var volumeLoaded = localStorage.getItem("volume")
if (volumeLoaded != null) {
    volume = volumeLoaded
}
var shakeMulLoaded = localStorage.getItem("shakeMul")
if (shakeMulLoaded != null) {
    shakeMul = shakeMulLoaded
}

var backButton = new ui.Button("rect", "Back")
backButton.bgColour = [0, 0, 0, 0.5]

var sliderImg = ui.newImg("slider.png")
var knobImg = ui.newImg("slider-knob.png")

var volumeSlider = new ui.ScrollBar(sliderImg, knobImg)
var shakeSlider = new ui.ScrollBar(sliderImg, knobImg)

volumeSlider.value = volume*100
shakeSlider.value = shakeMul*100/5

function settingsTick() {
    ui.text(canvas.width/2, 75*su, 75*su, "Settings", {align: "center"})

    ui.text(canvas.width/2, canvas.height/2 - 16*16*su / 2 - 25*su - 16*16*su/3, 30*su, "Volume: "+Math.round(volume*100), {align: "center"})
    volumeSlider.set(canvas.width/2, canvas.height/2 - 16*16*su / 2 - 25*su, 48*16*su, 16*16*su)
    volumeSlider.set2(4*16*su, 8*16*su, 0)

    volumeSlider.draw()

    if (volumeSlider.hovered() && mouse.ldown) {
        volumeSlider.value = Math.round(volumeSlider.convert(mouse.x))
        volume = volumeSlider.value/100
        localStorage.setItem("volume", volume)
    }

    ui.text(canvas.width/2, canvas.height/2 + 16*16*su / 2 + 25*su - 16*16*su/3, 30*su, "Shake Intensity: "+(Math.round(shakeMul*100)/100), {align: "center"})
    shakeSlider.set(canvas.width/2, canvas.height/2 + 16*16*su / 2 + 25*su, 48*16*su, 16*16*su)
    shakeSlider.set2(4*16*su, 8*16*su, 0)

    shakeSlider.draw()

    if (shakeSlider.hovered() && mouse.ldown) {
        shakeSlider.value = Math.round(shakeSlider.convert(mouse.x)/2)*2
        shakeMul = shakeSlider.value/100*5
        localStorage.setItem("shakeMul", shakeMul)
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