class OverworldMap {
    constructor(config) {
        this.overworld = null
        this.gameObjects = config.gameObjects
        this. cutsceneSpaces = config.cutsceneSpaces || {}
        this.walls = config.walls || {}

        this.lowerImage = new Image()
        this.lowerImage.src = config.lowerSrc

        // this.upperImage = new Image()
        // this.upperImage.src = config.upperSrc

        this.isCutScenePlaying = false    }

    drawLowerImage(ctx, cameraPerson) {
        ctx.drawImage(this.lowerImage, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y)
    }
    // drawUpperImage(ctx, cameraPerson) {
    //     ctx.drawImage(this.upperImage,  utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y)
    // }

    isSpaceTaken(currentX, currentY, direction){
        const{x,y} = utils.nextPosition(currentX,currentY,direction)
        return this.walls[`${x},${y}`] || false
    }
    mountObjects(){
        Object.keys(this.gameObjects).forEach(key=>{
            let object = this.gameObjects[key]
            object.id = key
            object.mount(this)
        })
    }
    async startCutScene(events){
        this.isCutScenePlaying = true
        for(let i=0; i<events.length; i++){
            const eventHandler = new OverworldEvent({
                event: events[i],
                map:this,
            })
            await eventHandler.init();
        }    
        
        this.isCutScenePlaying = false

        Object.values(this.gameObjects).forEach(object=>object.doBehaviorEvent(this))
    }

    checkForActionCutScene() {
        const hero = this.gameObjects["hero"]
        const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction)
        const match = Object.values(this.gameObjects).find(object=>{
            return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
        })
        if(!this.isCutScenePlaying && match && match.talking.length){
            this.startCutScene(match.talking[0].events)
        }
    }

    checkForFootstepCutscene(){
        const hero = this.gameObjects["hero"]
        const match = this.cutsceneSpaces[`${hero.x},${hero.y}`]

        if(!this.isCutScenePlaying && match){
            this.startCutScene(match[0].events)
        }
    }

    addWall(x,y){
        this.walls[`${x},${y}`] = true
    }
    removeWall(x,y){
       delete this.walls[`${x},${y}`]
    }
    moveWall(wasX, wasY, direction){
        this.removeWall(wasX,wasY,direction)
        const {x,y} = utils.nextPosition(wasX, wasY, direction)
        this.addWall(x,y)
    }
}

window.OverworldMap = {
    DemoRoom:{
        lowerSrc:"/images/maps/house.png",
        // upperSrc:"/images/maps/DemoUpper.png",
        gameObjects:{
            hero: new Person({
                isPlayerControlled:true,
                x:utils.withGrid(5),
                y:utils.withGrid(6), 
                src:"/images/characters/people/fulano.png"   
            }),
            // npcA: new Person({
            //     x:utils.withGrid(7),
            //     y:utils.withGrid(9),
            //     src:"/images/characters/people/npc1.png",
            //     behaviorLoop:[
            //         {type:"stand", direction:"left", time:800},
            //         {type:"stand", direction:"up", time:800},
            //         {type:"stand", direction:"right", time:1200},
            //     ],
            //     talking:[
            //         {
            //             events:[
            //                 {type:"textMessage", text: "Hello",faceHero:"npcA"},
            //                 {type:"textMessage", text: "vai embora"}
            //             ]
            //         },
            //                             {
            //             events:[
            //                 {type:"textMessage", text: "eita"}
            //             ]
            //         }
            //     ]
            // }),
            //  npcB: new Person({
            //     x:utils.withGrid(8),
            //     y:utils.withGrid(5),
            //     src:"/images/characters/people/npc2.png",
            //     behaviorLoop:[
            //         {type:"walk", direction:"left"},
            //         {type:"stand", direction:"up", time:800},
            //         {type:"walk", direction:"up"},
            //         {type:"walk", direction:"right"},
            //         {type:"walk", direction:"down"},

            //     ]
            // }),
            // npcC: new Person({
            //     x:utils.withGrid(9),
            //     y:utils.withGrid(7),
            //     src:"/images/characters/people/npcC.png",
            //     behaviorLoop:[
            //         {type:"walk", direction:"down"},
            //         {type:"stand", direction:"up", time:800}]
            // })
        },
        walls:{
            [utils.asGridCoord(7,6)] : true,
            [utils.asGridCoord(8,6)] : true,
            [utils.asGridCoord(7,7)] : true,
            [utils.asGridCoord(8,7)] : true
        },
        cutsceneSpaces:{
            // [utils.asGridCoord(7,4)]:[
            //     {
            //         events:[
            //             {who:"npcB", type: "walk", direction: "left"},
            //             {who:"npcB", type: "stand", direction: "up", time:800},
            //             {type: "textMessage", text: "Você não pode entrar aí!"},
            //             {who:"npcB", type: "walk", direction: "right"},
            //             {who:"hero", type: "walk", direction: "down"},
            //             {who:"hero", type: "walk", direction: "left"},
            //         ]
            //     }]
            // ,
            // [utils.asGridCoord(5,10)]:[
            //     {
            //         events:[
            //             {type:"changeMap", map:"Kitchen"}
            //         ]
            //     }
            // ]
        }
    }
    // ,
    // Kitchen:{
    //     lowerSrc:"/images/maps/KitchenLower.png",
    //     upperSrc:"/images/maps/KitchenUpper.png",
    //     gameObjects:{
    //         hero: new Person({
    //             isPlayerControlled:true,
    //             x:utils.withGrid(5),
    //             y:utils.withGrid(5),    
    //         }),
           
    //         npcB: new Person({
    //             x:utils.withGrid(10),
    //             y:utils.withGrid(8),
    //             src:"/images/characters/people/npc3.png",
    //             talking:[
    //                 {
    //                     events:[
    //                         {type:"textMessage", text: "Parabéns",faceHero:"npcB"}
    //                     ]
    //                 },
                                        
    //             ]
            
    //         })
    //     }
    // }
}