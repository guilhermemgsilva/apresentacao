class Overworld{
    constructor(config){
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null
    }

    startGameLoop(){
        const step = () => {
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)

            const cameraPerson = this.map.gameObjects.hero

            Object.values(this.map.gameObjects).forEach(object =>{
                object.update({
                    arrow:this.directionInput.direction,
                    map:this.map
                })
                
            })

            this.map.drawLowerImage(this.ctx, cameraPerson)

            Object.values(this.map.gameObjects).sort((a,b)=>{
                return a.y-b.y
            }).forEach(object =>{
                
                object.sprite.draw(this.ctx, cameraPerson)
            })

            // this.map.drawUpperImage(this.ctx, cameraPerson)
            requestAnimationFrame(() => {
                step()
            })
        }
        step()
    }

    bindActionInput(){
        new KeyPressedListener("Enter", ()=>{
            this.map.checkForActionCutScene()
        })
      }
      bindHeroPositionCheck(){
        document.addEventListener("PersonWalkingComplete",(e)=>{
            if(e.detail.whoId === "hero"){
                this.map.checkForFootstepCutscene()
            }
        })
    }

    startMap(mapConfig){
        this.map = new OverworldMap(mapConfig)
        this.map.overworld = this
        this.map.mountObjects()
        const cena = this.map.overworld.map.lowerImage.attributes[0].nodeValue.split("/maps")[1].split("/")[1]
        
        
        const audio = document.querySelector("#abertura")
        if(cena === "inicio.png"){
             audio.play()
        }else if(cena == "house.png"){
            audio.pause()
        }
        
    }
    init(){
        //aqui starta
        this.startMap(window.OverworldMap.preinicio)

        this.bindActionInput()
        this.bindHeroPositionCheck();

        this.directionInput = new DirectionInput()
        this.directionInput.init()
        this.directionInput.direction
        this.startGameLoop()

        this.map.startCutScene([
           
            
            
            
        ])

        
    }
}