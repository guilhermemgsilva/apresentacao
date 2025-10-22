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
    }
    init(){
        //aqui starta
        this.startMap(window.OverworldMap.DemoRoom)

        this.bindActionInput()
        this.bindHeroPositionCheck();

        this.directionInput = new DirectionInput()
        this.directionInput.init()
        this.directionInput.direction
        this.startGameLoop()

        this.map.startCutScene([
            //saindo para o trabalho

            {type:"textMessage", text: "Esse é o fulano, ele vive numa terra de fantasia, onde a paz reina, o reino de Banestia.", speaker: "Narrador"},
            {type:"textMessage", text: "Ele sempre foi apenas um súdito do reino, nunca soube como o reino funcionava apenas gozava da duradoura harmonia", speaker: "Narrador"},
            {type:"textMessage", text: "Agora ele além de súdito faz parte da equipe de colaboradores do reino e hoje é o seu primeiro dia de trabalho.", speaker: "Narrador"},
            {who:"hero", type:"walk", direction:"down"},
            {who:"hero", type:"walk", direction:"down"},
            {who:"hero", type:"walk", direction:"left"},
            {who:"hero", type:"walk", direction:"left"},
            {who:"hero", type:"walk", direction:"left"},
            {who:"hero", type:"walk", direction:"left"},
            {who:"hero", type:"walk", direction:"down"},
            {who:"hero", type:"walk", direction:"down"},
            {who:"hero", type:"walk", direction:"down"},
            {who:"hero", type:"walk", direction:"right"},
            {who:"hero", type:"walk", direction:"right"},
            {who:"hero", type:"walk", direction:"right"},
            {who:"hero", type:"walk", direction:"right"},
            {who:"hero", type:"walk", direction:"down"},
            {who:"hero", type:"walk", direction:"down"},
            
            
            
        ])

        
    }
}