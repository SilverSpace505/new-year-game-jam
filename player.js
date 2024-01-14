
class Player {
    x = 0
    y = 0
    vx = 0
    vy = 0
    angle = Math.PI/2
    size = 6
    speed = 15
    rotSpeed = 5
    frame = 0
    dir = 0
    health = 5
    hitCooldown = 0
    trailCooldown = 0
    trail = []
    trail2 = []
    tick() {

        let mul = score/50+1
        let mul2 = score/50/5+1
        
        let move = 0
        if ((keys["KeyA"] || keys["ArrowLeft"]) && !lost && started) {
            this.angle += this.rotSpeed*delta * mul2
            move = -1
        }
        if ((keys["KeyD"] || keys["ArrowRight"]) && !lost && started) {
            this.angle -= this.rotSpeed*delta * mul2
            move = -1
        }
        if (!lost && started) {
            this.vx += Math.sin(this.angle) * this.speed * delta * mul
            this.vy += Math.cos(this.angle) * this.speed * delta * mul
            this.dir = 1
        }
        // if (keys["KeyS"] && false) {
        //     this.vx -= Math.sin(this.angle) * this.speed * delta / 2
        //     this.vy -= Math.cos(this.angle) * this.speed * delta / 2
        //     this.dir = -1
        // }

        this.frame += move*delta * 10 + Math.sqrt(this.vx**2 + this.vy**2)*delta*3*this.dir
    
        this.vx = lerp(this.vx, 0, (1-0.95)*delta*100)
        this.vy = lerp(this.vy, 0, (1-0.95)*delta*100)

        this.x += this.vx * delta * 100
        this.y += this.vy * delta * 100

        this.trailCooldown -= delta
        if (this.trailCooldown <= 0) {
            this.trailCooldown = 1/20
            this.trail.push([this.x + Math.sin(this.angle+Math.PI/2)*6*2, this.y + Math.cos(this.angle+Math.PI/2)*6*2])
            this.trail2.push([this.x - Math.sin(this.angle+Math.PI/2)*6*2, this.y - Math.cos(this.angle+Math.PI/2)*6*2])
        }

        while (this.trail.length > 20) {
            this.trail.splice(0, 1)
        }
        while (this.trail2.length > 20) {
            this.trail2.splice(0, 1)
        }

        this.hitCooldown -= delta
        if (this.isColliding() && roadi > 0 && started) {
            if (this.hitCooldown <= 0 && !lost) {
                this.hitCooldown = 1
                this.health -= 1
                playSound("hit.ogg")
                shakeAnim = 0
            }
            this.vx = lerp(this.vx, 0, (1-0.9)*delta*100)
            this.vy = lerp(this.vy, 0, (1-0.9)*delta*100)
        }

        if (this.health > 5) this.health = 5
        if (this.health <= 0) {
            if (!lost) onLose()
            this.health = 0
        }
    }
    isColliding() {
        let tile = tiles[Math.floor(this.x/ts+0.5)+","+Math.floor(this.y/ts+0.5)]
        let safe = [0, 1, 3, 4, 6, 7]
        if (!safe.includes(tile)) return true
    }
    draw() {
        let oldSize = this.size
        this.size *= (1 - 0.1*Math.sin(Math.min(shakeAnim*3, 1)*Math.PI))

        ctx.beginPath()
        ctx.moveTo(...toScreen(this.trail[0][0], this.trail[0][1]))
        let traili = 0
        for (let point of this.trail) {
            ctx.lineTo(...toScreen(point[0], point[1]))
            ctx.lineWidth = 6*camera.zoom
            ctx.strokeStyle = `rgba(75, 75, 75, ${traili/this.trail.length})`
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(...toScreen(point[0], point[1]))
            traili++
        }

        ctx.beginPath()
        ctx.moveTo(...toScreen(this.trail2[0][0], this.trail2[0][1]))
        traili = 0
        for (let point of this.trail2) {
            ctx.lineTo(...toScreen(point[0], point[1]))
            ctx.lineWidth = 6*camera.zoom
            ctx.strokeStyle = `rgba(75, 75, 75, ${traili/this.trail2.length})`
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(...toScreen(point[0], point[1]))
            traili++
        }

        ctx.save()
        ctx.translate(...toScreen(this.x, this.y))
        ctx.rotate((-this.angle + Math.PI/2))
        ui.img(0, 0, 14*this.size*camera.zoom, 8*this.size*camera.zoom, carsImg, [(Math.abs(Math.round(this.frame)-Math.floor(Math.round(this.frame)/3)*3))*14+0.05, 0.05, 13.9, 7.9])
        ui.img(0, 0, 14*this.size*camera.zoom, 8*this.size*camera.zoom, healthImg, [(5-Math.ceil(this.health))*14+0.05, 0.05, 13.9, 7.9])
        ctx.restore()

        this.size = oldSize
    }
}
