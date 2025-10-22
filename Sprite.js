class Sprite{
    constructor(config){
        this.image = new Image()
        this.image.src = config.src
        this.image.onload = () =>{
            this.isLoaded = true
        }

        this.shadow = new Image()
        this.useShadow = true
        if(this.useShadow) this.shadow.src = "/images/characters/shadow.png"
        this.shadow.onload = () =>{
            this.isShadowLoaded = true
        }
        

        this.animations = config.animations || {
            "idle-down":[[0,24],[1,24]],
            "idle-up": [[0,22],[1,22]],
            "idle-left": [[0,23],[1,23]],
            "idle-right": [[0,25],[1,25]],
            "walk-up": [[0,8], [1,8], [2,8], [3,8],[4,8],[5,8],[6,8],[7,8],[8,8]],
            "walk-left": [[0,9], [1,9], [2,9], [3,9],[4,9],[5,9],[6,9],[7,9],[8,9]],
            "walk-right": [[0,11], [1,11], [2,11], [3,11],[4,11],[5,11],[6,11],[7,11],[8,11]],
            "walk-down": [[0,10], [1,10], [2,10], [3,10],[4,10],[5,10],[6,10],[7,10],[8,10]],
            "t-up":[[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4]]
        }
        this.currentAnimation = config.currentAnimation || "idle-down"
        this.currentAnimationFrame = 0

        this.animationFrameLimit = config.animationFrameLimit || 8

        this.animationFrameProgress = this.animationFrameLimit



        this.gameObject = config.gameObject
    }

    get frame(){
        return this.animations[this.currentAnimation][this.currentAnimationFrame]
    }
    setAnimation(key){
        if(this.currentAnimation !== key){
            this.currentAnimation = key
            this.currentAnimationFrame = 0
            this.animationFrameProgress = this.animationFrameLimit
        }
    }

    updateAnimationProgress(){
        if(this.animationFrameProgress > 0){
            this.animationFrameProgress -= 1
            return
        }


        this.animationFrameProgress = this.animationFrameLimit
        this.currentAnimationFrame += 1

        if(this.frame === undefined){
            this.currentAnimationFrame = 0
        }
    }

    draw(ctx, cameraPerson){
        const x = this.gameObject.x - 8 + utils.withGrid(10.5) - cameraPerson.x
        const y = this.gameObject.y - 18 + utils.withGrid(6) - cameraPerson.y

        // this.isShadowLoaded && ctx.drawImage(this.shadow,x,y)


        const [frameX, frameY] = this.frame
        this.isLoaded && ctx.drawImage(this.image,
            frameX * 64 ,frameY * 64,
            64,64,
            x,y,
            32,32
        )
        this.updateAnimationProgress()
    }
}