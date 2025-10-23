class OverworldMap {
    constructor(config) {
        this.overworld = null
        this.gameObjects = config.gameObjects
        this.cutsceneSpaces = config.cutsceneSpaces || {}
        this.walls = config.walls || {}

        this.lowerImage = new Image()
        this.lowerImage.src = config.lowerSrc

        // this.upperImage = new Image()
        // this.upperImage.src = config.upperSrc

        this.isCutScenePlaying = false
    }

    drawLowerImage(ctx, cameraPerson) {
        ctx.drawImage(this.lowerImage, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y)
    }
    // drawUpperImage(ctx, cameraPerson) {
    //     ctx.drawImage(this.upperImage,  utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y)
    // }

    isSpaceTaken(currentX, currentY, direction) {
        const { x, y } = utils.nextPosition(currentX, currentY, direction)
        return this.walls[`${x},${y}`] || false
    }
    mountObjects() {
        Object.keys(this.gameObjects).forEach(key => {
            let object = this.gameObjects[key]
            object.id = key
            object.mount(this)
        })
    }
    async startCutScene(events) {
        this.isCutScenePlaying = true
        for (let i = 0; i < events.length; i++) {
            const eventHandler = new OverworldEvent({
                event: events[i],
                map: this,
            })
            await eventHandler.init();
        }

        this.isCutScenePlaying = false

        Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
    }

    checkForActionCutScene() {
        const hero = this.gameObjects["hero"]
        const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction)
        const match = Object.values(this.gameObjects).find(object => {
            return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
        })
        if (!this.isCutScenePlaying && match && match.talking.length) {
            this.startCutScene(match.talking[0].events)
        }
    }

    checkForFootstepCutscene() {
        const hero = this.gameObjects["hero"]
        const match = this.cutsceneSpaces[`${hero.x},${hero.y}`]

        if (!this.isCutScenePlaying && match) {
            this.startCutScene(match[0].events)
        }
    }

    addWall(x, y) {
        this.walls[`${x},${y}`] = true
    }
    removeWall(x, y) {
        delete this.walls[`${x},${y}`]
    }
    moveWall(wasX, wasY, direction) {
        this.removeWall(wasX, wasY, direction)
        const { x, y } = utils.nextPosition(wasX, wasY, direction)
        this.addWall(x, y)
    }
}

window.OverworldMap = {
    DemoRoom: {
        lowerSrc: "/images/maps/house.png",
        // upperSrc:"/images/maps/DemoUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(6),
                src: "/images/characters/people/fulano.png"
            }),

        },

        cutsceneSpaces: {

            [utils.asGridCoord(5, 14)]: [
                {
                    events: [
                        { type: "changeMap", map: "Banestia" }
                    ]
                }
            ],
            [utils.asGridCoord(5, 7)]: [
                {
                    events: [
                        // saindo para o trabalho

                        { type: "textMessage", text: "Esse é o Bacário, ele vive numa terra de fantasia, onde a paz reina, o reino de Banéstia.", speaker: "Narrador" },
                        { type: "textMessage", text: "Ele era  apenas um súdito do reino, nunca soube como o reino funcionava apenas gozava da duradoura harmonia", speaker: "Narrador" },
                        { type: "textMessage", text: "Agora ele além de súdito, faz parte da equipe de colaboradores do reino e hoje é o seu primeiro dia de trabalho.", speaker: "Narrador" },

                        { who: "hero", type: "walk", direction: "down" },
                        { who: "hero", type: "walk", direction: "left" },
                        { who: "hero", type: "walk", direction: "left" },
                        { who: "hero", type: "walk", direction: "left" },
                        { who: "hero", type: "walk", direction: "left" },
                        { who: "hero", type: "walk", direction: "down" },
                        { who: "hero", type: "walk", direction: "down" },
                        { who: "hero", type: "walk", direction: "down" },
                        { who: "hero", type: "walk", direction: "right" },
                        { who: "hero", type: "walk", direction: "right" },
                        { who: "hero", type: "walk", direction: "right" },
                        { who: "hero", type: "walk", direction: "right" },
                        { who: "hero", type: "walk", direction: "down" },
                        { who: "hero", type: "walk", direction: "down" },
                    ]
                }
            ],
        }
    },
    DemoRoom2: {
        lowerSrc: "/images/maps/house.png",
        // upperSrc:"/images/maps/DemoUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(6),
                src: "/images/characters/people/fulano.png"
            }),

        },

        cutsceneSpaces: {

            [utils.asGridCoord(5, 14)]: [
                {
                    events: [
                        { type: "changeMap", map: "BanestiaDemandada" }
                    ]
                }
            ],
            [utils.asGridCoord(5, 7)]: [{
                events: [
                    { type: "textMessage", text: "Alguns anos depois...", speaker: "Narrador" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                ]
            }]

        }
    }
    ,
    Banestia: {
        lowerSrc: "/images/maps/map-mundo.png",
        // upperSrc:"/images/maps/KitchenUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(32),
                y: utils.withGrid(19),
                // x: utils.withGrid(53),
                // y: utils.withGrid(22),
                src: "/images/characters/people/fulano.png"
            })
            ,

            tiao: new Person({
                x: utils.withGrid(50),
                y: utils.withGrid(26),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/guard1.png",


            }),
            enemy: new Person({
                x: utils.withGrid(65),
                y: utils.withGrid(23),
                src: "/images/characters/people/enemy.png",


            })
        },

        cutsceneSpaces: {
            [utils.asGridCoord(32, 20)]: [
                {
                    events: [

                        { who: "hero", type: "walk", direction: "down" },
                        { who: "hero", type: "walk", direction: "down" },
                        { who: "hero", type: "walk", direction: "down" },
                        { who: "hero", type: "walk", direction: "right" },
                        { who: "hero", type: "walk", direction: "right" },
                        { who: "hero", type: "walk", direction: "right" },
                        { who: "hero", type: "walk", direction: "right" },
                        { who: "hero", type: "walk", direction: "right" },
                        { who: "hero", type: "walk", direction: "right" },
                        { who: "hero", type: "walk", direction: "right" },
                        { who: "hero", type: "walk", direction: "right" },
                        { who: "hero", type: "walk", direction: "right" },
                        { who: "hero", type: "walk", direction: "right" },
                        { who: "hero", type: "walk", direction: "right" },
                        { who: "hero", type: "walk", direction: "right" },
                        { who: "hero", type: "walk", direction: "right" },
                        { who: "hero", type: "walk", direction: "right" },
                        { who: "hero", type: "walk", direction: "right" },
                        { who: "hero", type: "walk", direction: "right" },
                        { who: "hero", type: "walk", direction: "right" },
                        { who: "hero", type: "walk", direction: "down" },
                        { who: "hero", type: "walk", direction: "down" },
                        { who: "hero", type: "walk", direction: "down" },
                        { who: "hero", type: "stand", direction: "right" },
                        { who: "tiao", type: "stand", direction: "left" },

                        { type: "textMessage", text: "Bom dia Guarda Tião, meu nome é Bancário e hoje é o meu primeiro dia.", speaker: "Bancário" },
                        { type: "textMessage", text: "Bom dia Bancário, hoje vamos ficar de guarda no portão da cidade.", speaker: "Guarda Tião" },
                    ]
                }],
            [utils.asGridCoord(49, 25)]: [{
                events: [
                    { who: "tiao", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },


                    { who: "tiao", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },

                    { who: "tiao", type: "walk", direction: "right" },


                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                ]
            }],
            [utils.asGridCoord(52, 23)]: [{
                events: [
                    { who: "enemy", type: "walk", direction: "left" },
                    { who: "enemy", type: "walk", direction: "left" },
                    { who: "enemy", type: "walk", direction: "left" },

                    { type: "textMessage", text: "MEU DEUS O QUE É AQUILO?!", speaker: "Bancário" },

                    { who: "hero", type: "walk", direction: "right" },


                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "stand", direction: "down" },
                    { type: "textMessage", text: "HA HA HA, DÁ PRA VER QUE SEU PRIMEIRO DIA!", speaker: "Guarda Tião" },
                    { type: "textMessage", text: "Calma, é só uma demanda.", speaker: "Guarda Tião" },
                    { type: "textMessage", text: "Elas aparece de vez em quando, mas nós temos um procedimento pra cuidar delas.", speaker: "Guarda Tião" },
                    { type: "textMessage", text: "É a nossa maravilhosa Corrente de Comando Imutável.", speaker: "Guarda Tião" },
                    { type: "textMessage", text: "Encontre o capitão, avisa sobre essa demanda.", speaker: "Guarda Tião" },
                    { type: "textMessage", text: "Ele vai te explicar os próximos passos.", speaker: "Guarda Tião" },





                ]
            }]
            ,
            [utils.asGridCoord(53, 23)]: [{
                events: [
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },


                    //         
                ]
            }],
            [utils.asGridCoord(9, 10)]: [{
                events: [
                    { who: "hero", type: "stand", direction: "up" },
                    { type: "changeMap", map: "capitainRoom" },
                ]
            }]

        }
    },
    capitainRoom: {
        lowerSrc: "/images/maps/sala do capitao.png",
        // upperSrc:"/images/maps/KitchenUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(13),
                src: "/images/characters/people/fulano.png",
                direction:"up"
            }),
            capitao: new Person({
                x: utils.withGrid(5),
                y: utils.withGrid(10),
                src: "/images/characters/people/captain.png"
            })
        },
        cutsceneSpaces: {
            [utils.asGridCoord(5, 12)]: [{
                events: [
                    { who: "hero", type: "stand", direction: "up" },
                    { who: "capitao", type: "stand", direction: "down" },
                    { type: "textMessage", text: "Capitão temos uma demanda chegando.", speaker: "Bancário" },
                    { type: "textMessage", text: "Vou convocar o conselho para definir a estratégia de defesa.", speaker: "Capitão" },
                    { type: "textMessage", text: "Precisamos de um documento com os mínimos detalhes para começarmos a agir.", speaker: "Capitão" },
                    { type: "textMessage", text: "Mas Capitão, não podemos começar a mobilizar as forças?", speaker: "Bancário" },
                    { type: "textMessage", text: "Só podemos começar a agir depois de o conselho listar todos os perigos e soluções possíveis.", speaker: "Capitão" },
                    { type: "textMessage", text: "Eles criam um modelo de defesa, então atacamos de uma vez, isso será a validação da estratégia já na prática.", speaker: "Capitão" },
                    { type: "textMessage", text: "Volte pro seu posto e aguarde.", speaker: "Capitão" },

                    { type: "textMessage", text: "Aqui nós estamos falando do Modelo em Cascata.", speaker: "Narrador" },
                    { type: "textMessage", text: "No Modelo em cascata o processo flui de cima para baixo", speaker: "Narrador" },
                    { type: "textMessage", text: "O processo é dividido em fases e não se pode iniciar a próxima fase antes da primeira acabar.", speaker: "Narrador" },
                    { type: "textMessage", text: "O levantamento dos requisitos é feito todo de uma só vez e no início.", speaker: "Narrador" },
                    { type: "textMessage", text: "Isso gera uma documentação extensa que torna o contrato de trabalho rígido para todas as fases.", speaker: "Narrador" },
                ]
            }],
            [utils.asGridCoord(5, 15)]: [{
                events: [{ type: "changeMap", map: "BanestiaCascata" }

                ]
            }
            ]
        }
    },
    captainRoom2: {
        lowerSrc: "/images/maps/sala do capitao.png",
        // upperSrc:"/images/maps/KitchenUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(13),
                src: "/images/characters/people/fulano.png",
                direction:"up"
            }),
            capitao: new Person({
                x: utils.withGrid(5),
                y: utils.withGrid(10),
                src: "/images/characters/people/captain.png"
            })
        },
        cutsceneSpaces: {
            [utils.asGridCoord(5, 12)]: [{
                events: [
                    { who: "hero", type: "stand", direction: "up" },
                    { who: "capitao", type: "stand", direction: "down" },
                    { type: "textMessage", text: "Capitão temos várias demandas, elas são diferentes, parecem mais fortes e e estão chegando rápido.", speaker: "Bancário" },
                    { type: "textMessage", text: "Vá depressa à sala de treinamento.", speaker: "Capitão" },
                    { type: "textMessage", text: " Lá você verá uma folha de papel com a filosofia manifesto que os sábios escreveram para esse momento.", speaker: "Capitão" },
                    { type: "textMessage", text: "Medite nessa filosofia.", speaker: "Capitão" },

                ]
            }],
            [utils.asGridCoord(5, 15)]: [{
                events: [{ type: "changeMap", map: "BanestiaDemandada2" }

                ]
            }
            ]
        }
    },
    BanestiaCascata: {
        lowerSrc: "/images/maps/map-mundo.png",
        // upperSrc:"/images/maps/KitchenUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(8),
                y: utils.withGrid(10),

                src: "/images/characters/people/fulano.png"
            })
            ,

            tiao: new Person({
                x: utils.withGrid(51),
                y: utils.withGrid(24),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/guard1.png",
                behaviorLoop: [

                    { type: "stand", direction: "right", time: 800 }]
            }),
            gomes: new Person({
                x: utils.withGrid(56),
                y: utils.withGrid(16),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/soldado1.png",

            }),
            soares: new Person({
                x: utils.withGrid(56),
                y: utils.withGrid(15),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/soldado2.png",

            }),
            kovalski: new Person({
                x: utils.withGrid(56),
                y: utils.withGrid(14),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/soldado3.png",

            }),
            rocha: new Person({
                x: utils.withGrid(56),
                y: utils.withGrid(13),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/soldado4.png",

            }),
            mohamed: new Person({
                x: utils.withGrid(56),
                y: utils.withGrid(12),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/soldado5.png",

            }),



            enemy: new Person({
                x: utils.withGrid(59),
                y: utils.withGrid(23),
                src: "/images/characters/people/enemy.png",


            })
        },

        cutsceneSpaces: {

            [utils.asGridCoord(8, 12)]: [{
                events: [
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },

                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },




                ]
            }],
            [utils.asGridCoord(51, 23)]: [{
                events: [
                    { type: "textMessage", text: "Alguns dias depois", speaker: "Narrador" },
                    { who: "gomes", type: "walk", direction: "down" },
                    { who: "soares", type: "walk", direction: "down" },
                    { who: "kovalski", type: "walk", direction: "down" },
                    { who: "rocha", type: "walk", direction: "down" },
                    { who: "mohamed", type: "walk", direction: "down" },

                    { who: "gomes", type: "walk", direction: "down" },
                    { who: "soares", type: "walk", direction: "down" },
                    { who: "kovalski", type: "walk", direction: "down" },
                    { who: "rocha", type: "walk", direction: "down" },
                    { who: "mohamed", type: "walk", direction: "down" },

                    { who: "gomes", type: "walk", direction: "down" },
                    { who: "soares", type: "walk", direction: "down" },
                    { who: "kovalski", type: "walk", direction: "down" },
                    { who: "rocha", type: "walk", direction: "down" },
                    { who: "mohamed", type: "walk", direction: "down" },

                    { who: "gomes", type: "walk", direction: "down" },
                    { who: "soares", type: "walk", direction: "down" },
                    { who: "kovalski", type: "walk", direction: "down" },
                    { who: "rocha", type: "walk", direction: "down" },
                    { who: "mohamed", type: "walk", direction: "down" },

                    { who: "gomes", type: "walk", direction: "down" },
                    { who: "soares", type: "walk", direction: "down" },
                    { who: "kovalski", type: "walk", direction: "down" },
                    { who: "rocha", type: "walk", direction: "down" },
                    { who: "mohamed", type: "walk", direction: "down" },

                    { who: "gomes", type: "walk", direction: "down" },
                    { who: "soares", type: "walk", direction: "down" },
                    { who: "kovalski", type: "walk", direction: "down" },
                    { who: "rocha", type: "walk", direction: "down" },
                    { who: "mohamed", type: "walk", direction: "down" },

                    { who: "gomes", type: "walk", direction: "down" },
                    { who: "soares", type: "walk", direction: "down" },
                    { who: "kovalski", type: "walk", direction: "down" },
                    { who: "rocha", type: "walk", direction: "down" },
                    { who: "mohamed", type: "walk", direction: "down" },

                    { who: "gomes", type: "walk", direction: "down" },
                    { who: "soares", type: "walk", direction: "down" },
                    { who: "kovalski", type: "walk", direction: "down" },
                    { who: "rocha", type: "walk", direction: "down" },
                    { who: "mohamed", type: "walk", direction: "down" },

                    { who: "gomes", type: "stand", direction: "right", time: 800 },
                    { who: "soares", type: "stand", direction: "right", time: 800 },
                    { who: "kovalski", type: "stand", direction: "right", time: 800 },
                    { who: "rocha", type: "stand", direction: "right", time: 800 },
                    { who: "mohamed", type: "stand", direction: "right", time: 800 },


                    { type: "textMessage", text: "Viemos executar o plano e resolver a demanda.", speaker: "Exército" },

                    { who: "gomes", type: "walk", direction: "down" },
                    { who: "gomes", type: "walk", direction: "right" },
                    { who: "gomes", type: "walk", direction: "right" },
                    { who: "gomes", type: "walk", direction: "right" },
                    { who: "gomes", type: "walk", direction: "right" },
                    { who: "gomes", type: "stand", direction: "up", time: 800 },

                    { who: "soares", type: "walk", direction: "down" },
                    { who: "soares", type: "walk", direction: "down" },
                    { who: "soares", type: "walk", direction: "right" },
                    { who: "soares", type: "walk", direction: "right" },
                    { who: "soares", type: "walk", direction: "right" },
                    { who: "soares", type: "stand", direction: "up", time: 800 },

                    { who: "kovalski", type: "walk", direction: "down" },
                    { who: "kovalski", type: "walk", direction: "down" },
                    { who: "kovalski", type: "walk", direction: "right" },

                    { who: "rocha", type: "walk", direction: "down" },
                    { who: "rocha", type: "walk", direction: "down" },
                    { who: "rocha", type: "walk", direction: "right" },
                    { who: "mohamed", type: "walk", direction: "down" },
                    { who: "mohamed", type: "walk", direction: "down" },
                    { who: "mohamed", type: "walk", direction: "right" },

                    { who: "enemy", type: "stand", direction: "left", time: 2500 },
                    { who: "enemy", type: "walk", direction: "right" },
                    { who: "enemy", type: "walk", direction: "right" },
                    { who: "enemy", type: "walk", direction: "right" },
                    { who: "enemy", type: "walk", direction: "right" },
                    { who: "enemy", type: "walk", direction: "right" },

                    { type: "textMessage", text: "Dessa vez a demanda foi resolvido com essa estratégia.", speaker: "Narrador" },
                ]
            }],
            [utils.asGridCoord(52, 21)]: [{
                events: [
                    { type: "changeMap", map: "DemoRoom2" },
                    { who: "hero", type: "stand", direction: "down", time: 1000 },

                ]
            }],
            [utils.asGridCoord(5, 14)]: [{
                events: [
                    { type: "changeMap", map: "BanestiaDemandada" },

                ]
            }]

        }
    },
    BanestiaDemandada: {
        lowerSrc: "/images/maps/map-mundo.png",
        // upperSrc:"/images/maps/KitchenUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                // x: utils.withGrid(32),
                // y: utils.withGrid(19),
                x: utils.withGrid(32),
                y: utils.withGrid(19),
                src: "/images/characters/people/fulano.png"
            })
            ,

            tiao: new Person({
                x: utils.withGrid(50),
                y: utils.withGrid(22),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/guard1.png",
                behaviorLoop: [

                    { type: "stand", direction: "right", time: 800 }]
            }),
            enemy1: new Person({
                x: utils.withGrid(63),
                y: utils.withGrid(23),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/enemy2.png",

            }),
            enemy2: new Person({
                x: utils.withGrid(63),
                y: utils.withGrid(22),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/enemy2.png",

            }),
            enemy3: new Person({
                x: utils.withGrid(63),
                y: utils.withGrid(21),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/enemy2.png",

            }),
            enemy4: new Person({
                x: utils.withGrid(63),
                y: utils.withGrid(25),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/enemy2.png",

            }),
            enemy5: new Person({
                x: utils.withGrid(63),
                y: utils.withGrid(26),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/enemy2.png",

            }),



            enemy6: new Person({
                x: utils.withGrid(63),
                y: utils.withGrid(27),
                src: "/images/characters/people/enemy2.png",


            })
        },

        cutsceneSpaces: {
            [utils.asGridCoord(32, 20)]: [{
                events: [
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "tiao", type: "walk", direction: "down" },
                    { who: "tiao", type: "walk", direction: "down" },
                    { who: "tiao", type: "walk", direction: "right" },

                ]
            }],
            [utils.asGridCoord(52, 23)]: [{
                events: [
                    { type: "textMessage", text: "Olha Tião, dessa vez o nosso jeito não vai resolver!", speaker: "Bancário" },
                    { who: "enemy1", type: "walk", direction: "left" },
                    { who: "enemy2", type: "walk", direction: "left" },
                    { who: "enemy3", type: "walk", direction: "left" },
                    { who: "enemy4", type: "walk", direction: "left" },
                    { who: "enemy5", type: "walk", direction: "left" },
                    { who: "enemy6", type: "walk", direction: "left" },

                    { who: "enemy1", type: "walk", direction: "left" },
                    { who: "enemy2", type: "walk", direction: "left" },
                    { who: "enemy3", type: "walk", direction: "left" },
                    { who: "enemy4", type: "walk", direction: "left" },
                    { who: "enemy5", type: "walk", direction: "left" },
                    { who: "enemy6", type: "walk", direction: "left" },

                    { who: "enemy1", type: "walk", direction: "left" },
                    { who: "enemy2", type: "walk", direction: "left" },
                    { who: "enemy3", type: "walk", direction: "left" },
                    { who: "enemy4", type: "walk", direction: "left" },
                    { who: "enemy5", type: "walk", direction: "left" },
                    { who: "enemy6", type: "walk", direction: "left" },

                    { who: "tiao", type: "walk", direction: "left" },
                    { who: "tiao", type: "walk", direction: "left" },
                    { who: "tiao", type: "walk", direction: "right" },
                    { who: "tiao", type: "walk", direction: "right" },
                    { who: "tiao", type: "walk", direction: "left" },
                    { who: "tiao", type: "walk", direction: "left" },
                    { who: "tiao", type: "walk", direction: "right" },
                    { who: "tiao", type: "walk", direction: "right" },

                    { type: "textMessage", text: "ai meu Deus!", speaker: "Tião" },
                    { type: "textMessage", text: "AI Meu Deus!...", speaker: "Tião" },
                    { type: "textMessage", text: "AI Meu DEUS!.....", speaker: "Tião" },
                    { type: "textMessage", text: "Corra até o capitão e informe.", speaker: "Tião" },
                    { type: "textMessage", text: "OK!", speaker: "Bancário" },

                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },

                ]
            }],
            [utils.asGridCoord(9, 10)]: [{
                events: [
                    { type: "changeMap", map: "captainRoom2" }
                ]
            }]
        }
    },
    BanestiaDemandada2: {
        lowerSrc: "/images/maps/map-mundo.png",
        // upperSrc:"/images/maps/KitchenUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                // x: utils.withGrid(32),
                // y: utils.withGrid(19),
                x: utils.withGrid(9),
                y: utils.withGrid(10),
                src: "/images/characters/people/fulano.png"
            })
            ,

            tiao: new Person({
                x: utils.withGrid(50),
                y: utils.withGrid(22),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/guard1.png",
                behaviorLoop: [

                    { type: "stand", direction: "right", time: 800 }]
            }),
            enemy1: new Person({
                x: utils.withGrid(60),
                y: utils.withGrid(23),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/enemy2.png",

            }),
            enemy2: new Person({
                x: utils.withGrid(60),
                y: utils.withGrid(22),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/enemy2.png",

            }),
            enemy3: new Person({
                x: utils.withGrid(60),
                y: utils.withGrid(21),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/enemy2.png",

            }),
            enemy4: new Person({
                x: utils.withGrid(60),
                y: utils.withGrid(25),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/enemy2.png",

            }),
            enemy5: new Person({
                x: utils.withGrid(60),
                y: utils.withGrid(26),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/enemy2.png",

            }),



            enemy6: new Person({
                x: utils.withGrid(60),
                y: utils.withGrid(27),
                src: "/images/characters/people/enemy2.png",


            })
        },

        cutsceneSpaces: {
            [utils.asGridCoord(9, 11)]: [{
                events: [
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },

                ]
            }],
            [utils.asGridCoord(19, 9)]: [{
                events: [
                    { type: "changeMap", map: "trainingRoom" }

                ]
            }]
        }
    },
    trainingRoom: {
        lowerSrc: "/images/maps/sala de treino.png",
        // upperSrc:"/images/maps/KitchenUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(14),
                src: "/images/characters/people/fulano.png",
                direction:"up"

            })
        },
        cutsceneSpaces: {
            [utils.asGridCoord(5, 13)]: [{
                events: [
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },

                    { type: "textMessage", text: "Esse é o pergaminho do manifesto ágil, está escrito:", speaker: "Bancário" },
                    { type: "textMessage", text: "A Voz do Guerreiro mais que o Livro de Regras: Valorizar a comunicação e a colaboração entre os membros da defesa.", speaker: "Bancário" },
                    { type: "textMessage", text: "A Espada Afiada mais que o Desenho Detalhado: O que importa é uma arma funcional, mesmo que ainda possa ser melhorada.", speaker: "Bancário" },
                    { type: "textMessage", text: "O Acordo Contínuo com o exército mais que o Contrato Antigo: O exército deve ser ouvido durante a construção da defesa.", speaker: "Bancário" },
                    { type: "textMessage", text: "A Dança da Batalha mais que a Rota Pré-definida: A capacidade de mudar o plano de batalha no meio da luta.", speaker: "Bancário" },

                    { type: "textMessage", text: "Aqui temos o manifésto ágil.", speaker: "Narrador" },
                    { type: "textMessage", text: "Agilidade é a capacidade de um sistema, organização ou equipe de se adaptar e responder rapidamente à mudança.", speaker: "Narrador" },
                    { type: "textMessage", text: "O manifesto ágil fala sobre:", speaker: "Narrador" },
                    { type: "textMessage", text: "Indivíduos e iterações mais que processos e ferramentas.", speaker: "Narrador" },
                    { type: "textMessage", text: "Software em funcionamento mais que documentação abrangente.", speaker: "Narrador" },
                    { type: "textMessage", text: "Colaboração com o cliente mais que negociação de contratos.", speaker: "Narrador" },
                    { type: "textMessage", text: "Responder à mudança mais que seguir um plano.", speaker: "Narrador" },

                    { type: "textMessage", text: "O pergaminho tem dois rituais que aplicam a filosofia. Isso vai salvar Banéstia!", speaker: "Bancário" },
                    { type: "textMessage", text: "E ainda tem um terceiro ritual maior para quando já houverem grupamentos ágeis.", speaker: "Bancário" },

                    { type: "textMessage", text: "O Scrum é um framework ágil que foca em ter um MVP e ir incrementando o produto em ciclos.", speaker: "Narrador" },
                    { type: "textMessage", text: "Pode ser oraganizado em ciclos, papéis fixos, e cerimônias.", speaker: "Narrador" },
                    { type: "textMessage", text: "Os ciclos são chamados de Sprints (1 a 4 semanas).", speaker: "Narrador" },
                    { type: "textMessage", text: "Os papéis fixos são:", speaker: "Narrador" },
                    { type: "textMessage", text: "O PO (Product Owner) que nesse contexto se torna a voz do cliente.", speaker: "Narrador" },
                    { type: "textMessage", text: "O Scrum Master que vem a ser um facilitador.", speaker: "Narrador" },
                    { type: "textMessage", text: "E por último o time de desenvolvimento.", speaker: "Narrador" },
                    { type: "textMessage", text: "E as cerimônias são:", speaker: "Narrador" },
                    { type: "textMessage", text: "Daily Scrum que é uma reunião diária sobre: O que fiz? O que farei? O que me impede?", speaker: "Narrador" },
                    { type: "textMessage", text: "Sprint Planning que é o planejamento do que será feito no ciclo.", speaker: "Narrador" },
                    { type: "textMessage", text: "Sprint Review que é a demonstração do que foi feito para o cliente e feedback.", speaker: "Narrador" },
                    { type: "textMessage", text: "Retrospectiva que é quando o time reflete sobre como trabalhar melhor.", speaker: "Narrador" },

                    { type: "textMessage", text: "O Kanban é também um framework ágil.", speaker: "Narrador" },
                    { type: "textMessage", text: "O trabalho é visualizado em um quadro com colunas que representam os estágios do processo.", speaker: "Narrador" },
                    { type: "textMessage", text: "Os estágios do processo são (A Fazer, Fazendo, Testando, Feito).", speaker: "Narrador" },

                    { type: "textMessage", text: "Tem um limite máximo de tarefas que podem estar em andamento em cada coluna.(WIP)", speaker: "Narrador" },
                    { type: "textMessage", text: "O foco principal é medir e otimizar o tempo que uma tarefa leva do início ao fim.", speaker: "Narrador" },
                    { type: "textMessage", text: "Mudanças são bem-vindas a qualquer momento.", speaker: "Narrador" },
                    { type: "textMessage", text: "Só para reforçar, vamos fazer uma pequena comparação.", speaker: "Narrador" },
                    
                    { type: "textMessage", text: "O Scrum é iterativo (ciclos). Sprints com duração definida.", speaker: "Narrador" },
                    { type: "textMessage", text: "O Kanban é contínuo. Entrega assim que pronto.", speaker: "Narrador" },
                    { type: "textMessage", text: "No Scrum o limite é deifinido na Sprint Planning.", speaker: "Narrador" },
                    { type: "textMessage", text: "No Kanban o limite é deifinido pela quantidade de WIP simultâneas.", speaker: "Narrador" },
                    { type: "textMessage", text: "No Scrum os papéis são definidos (PO, SM e TD).", speaker: "Narrador" },
                    { type: "textMessage", text: "No Kanban, não existem papéis formais.", speaker: "Narrador" },
                    { type: "textMessage", text: "O Scrum aceita mudanças, desde que entre as Sprints.", speaker: "Narrador" },
                    { type: "textMessage", text: "Já o Kanban, aceita mudanças a qualquer momento.", speaker: "Narrador" },
                    
                    { type: "textMessage", text: "Agora sobre o SAFe.", speaker: "Narrador" },


                    { type: "textMessage", text: "O Scaled Agile Framework (SAFe) é um framework ágil. ", speaker: "Narrador" },
                    { type: "textMessage", text: "Esse framework  permite que organizações grandes e complexas apliquem a agilidade em escala.", speaker: "Narrador" },

                    { type: "textMessage", text: "Enquanto Scrum e Kanban funcionam bem para equipes pequenas, o SAFe resolve o desafio de alinhamento e coordenação.", speaker: "Narrador" },
                    { type: "textMessage", text: "O SAFe garante que a estratégia da organização esteja alinhada com o trabalho que cada equipe está fazendo. ", speaker: "Narrador" },
                    { type: "textMessage", text: "Ele transforma a organização de uma coleção de equipes ágeis para uma rede de valor.", speaker: "Narrador" },
                    { type: "textMessage", text: "O ART é um time de times que trabalham em sincronia. ", speaker: "Narrador" },
                    { type: "textMessage", text: "O coração do SAFe é o Agile Release Train (ART), uma locomotiva ágil. ", speaker: "Narrador" },
                    { type: "textMessage", text: "O PI (Program Increment) é o evento mais importante. ", speaker: "Narrador" },
                    { type: "textMessage", text: "É uma reunião de dois dias onde todos os membros do ART se reúnem.  para planejar o trabalho dos próximos 2 ou 3 meses. ", speaker: "Narrador" },
                    { type: "textMessage", text: "Nessa reunião, planejam o trabalho dos próximos 2 ou 3 meses. ", speaker: "Narrador" },
                    { type: "textMessage", text: "É o grande conselho de guerra. ", speaker: "Narrador" },
                    { type: "textMessage", text: "E o RTE (Release Train Engineer) é o maestro da orquestra. ", speaker: "Narrador" },
                    { type: "textMessage", text: "Ele tem papel de coach e líder servidor. ", speaker: "Narrador" },
                    { type: "textMessage", text: "Ele é o scrum master dos scrum masters. ", speaker: "Narrador" },
                    { type: "textMessage", text: "Ele é quem lidera o PI, coleta métricas e resolve impedimentos. ", speaker: "Narrador" },

                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },






                ]
            }],
            [utils.asGridCoord(5, 15)]: [{
                events: [
                    { type: "changeMap", map: "BanestiaAgil" }
                ]
            }
            ]
        }
    },

    BanestiaAgil: {
        lowerSrc: "/images/maps/map-mundo.png",

        gameObjects: {

            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(19),
                y: utils.withGrid(10),

                src: "/images/characters/people/heroP.png",
                direction: "down"
            })
            ,

            gomes: new Person({
                x: utils.withGrid(52),
                y: utils.withGrid(21),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/soldado1.png",
                direction: "right"
            }),
            soares: new Person({
                x: utils.withGrid(52),
                y: utils.withGrid(22),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/soldado2.png",
                direction: "right"
            }),
            kovalski: new Person({
                x: utils.withGrid(52),
                y: utils.withGrid(25),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/soldado3.png",
                direction: "right"

            }),
            enemy1: new Person({
                x: utils.withGrid(60),
                y: utils.withGrid(23),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/enemy2.png",

            }),
            enemy2: new Person({
                x: utils.withGrid(60),
                y: utils.withGrid(22),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/enemy2.png",

            }),
            enemy3: new Person({
                x: utils.withGrid(60),
                y: utils.withGrid(21),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/enemy2.png",

            }),
            enemy4: new Person({
                x: utils.withGrid(60),
                y: utils.withGrid(25),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/enemy2.png",

            }),

        },
        cutsceneSpaces: {

            [utils.asGridCoord(19, 11)]: [{
                events: [

                    { type: "textMessage", text: "Olha eu to diferente... eu me sinto...", speaker: "Bancário" },
                    { type: "textMessage", text: "Go go Power Ranger.", speaker: "Bancário" },
                    { type: "textMessage", text: "Agora eu vou salvar Banéstia.", speaker: "Bancário" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },
                    { who: "hero", type: "walk", direction: "down" },

                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },

                    { who: "hero", type: "walk", direction: "up" },
                    { who: "hero", type: "walk", direction: "up" },

                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    { who: "hero", type: "walk", direction: "right" },
                    
                    
                ]
            }],
            [utils.asGridCoord(52, 23)]: [{
                events: [
                    


                    { type: "textMessage", text: "Nós não estamos conseguindo lidar com essas demandas.", speaker: "Exército" },
                    { type: "textMessage", text: "Os métodos que nós conhecemos não irão funcionar.", speaker: "Exército" },
                    { type: "textMessage", text: "Olha, o que é aquilo que chegou? É outra demanda?", speaker: "Exército" },




                    { type: "textMessage", text: "Agora é minha vez de agir.", speaker: "Bancário" },
                    { type: "textMessage", text: "Vou salvar Banéstia com meus novos poderes.", speaker: "Bancário" },
                    { who: "hero", type: "throwProjectile", direction: "right", speed: 0.4, distance: 7, src: "/images/icons/laser.png" },

                    {
                        type: "fadeScene",
                        color: "white",
                        fadeIn: 2000,  // duração do fade in em ms
                        hold: 3000,     // tempo que a tela fica totalmente preta
                        fadeOut: 2000  // duração do fade out em ms
                    },


                    { who: "enemy1", type: "die" },

                    { who: "enemy2", type: "die" },
                    { who: "enemy3", type: "die" },
                    { who: "enemy4", type: "die" },


                    { type: "textMessage", text: "Ele conseguiu, Banéstia foi salva.", speaker: "Exército" },
                    { type: "textMessage", text: "Nós vamos treinar para ajudar com as demandas de forma mais eficiente.", speaker: "Exército" },
                    { type: "textMessage", text: "Eu ajudarei vocês com essa tarefa.", speaker: "Bancário" },

                ]
            }],
            [utils.asGridCoord(53, 23)]: [{
                events: [
                    {type:"changeMap", map:"newBanestia"}
                ]
            }]


        }
    },

    newBanestia: {
        lowerSrc: "/images/maps/map-mundo.png",

        gameObjects: {

            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(51),
                y: utils.withGrid(23),

                src: "/images/characters/people/heroP.png",
                direction: "down"
            }),
             gomes: new Person({
                x: utils.withGrid(55),
                y: utils.withGrid(21),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/soldado6.png",
                direction: "right"
            }),
             gomes2: new Person({
                x: utils.withGrid(57),
                y: utils.withGrid(23),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/soldado6.png",
                direction: "left"
            }),
             gomes3: new Person({
                x: utils.withGrid(57),
                y: utils.withGrid(25),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/soldado7.png",
                direction: "left"
            }),
            sabia: new Person({
                x: utils.withGrid(23),
                y: utils.withGrid(22),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/sabia.png",
                
            }),
            enemy1: new Person({
                x: utils.withGrid(56),
                y: utils.withGrid(21),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/enemy2.png",

            }),
            enemy2: new Person({
                x: utils.withGrid(56),
                y: utils.withGrid(23),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/enemy2.png",

            }),
            enemy3: new Person({
                x: utils.withGrid(56),
                y: utils.withGrid(25),
                // x:utils.withGrid(51),
                // y:utils.withGrid(24),
                src: "/images/characters/people/enemy2.png",

            }),
        },
        cutsceneSpaces: {
        [utils.asGridCoord(51, 24)]: [{
                events: [
                    { type: "textMessage", text: "Banéstia nos dias atuais...", speaker: "Narrador" },
                    { type: "textMessage", text: "Banéstia agora tem um exército treinado para resolver as demandas", speaker: "Bancário" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "stand", direction: "down", time:800 },
                    { type: "textMessage", text: "O mundo continua evoluindo e as demanda vão mudando.", speaker: "Bancário" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "stand", direction: "down", time:800 },
                    { type: "textMessage", text: "Em Banéstia não ficamos mais parados no tempo.", speaker: "Bancário" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "stand", direction: "down", time:800 },
                    { type: "textMessage", text: "Não perca os próximos capítulos, temos uma nova arma secreta.", speaker: "Bancário" },
                    { who: "hero", type: "walk", direction: "left" },
                    { type: "textMessage", text: "Ah não, a arma secreta fugiu de novo.", speaker: "Bancário" },
                    { who: "sabia", type: "walk", direction: "left" },
                    { who: "sabia", type: "walk", direction: "left" },
                    { who: "sabia", type: "walk", direction: "left" },
                    { type: "textMessage", text: "Volta aqui Sab.ia.", speaker: "Bancário" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "hero", type: "walk", direction: "left" },
                    { who: "sabia", type: "walk", direction: "left" },
                    { who: "sabia", type: "walk", direction: "left" },
                    { who: "hero", type: "stand", direction: "down", time:800 },
                    { type: "textMessage", text: "Obrigado por nos acompanhar nesse aprendizado e até a próxima.", speaker: "Bancário" },
                ]
            }],
            [utils.asGridCoord(27, 24)]: [{
                events: [{type:"changeMap",map:"nota"}]
            }]
        }
    },

     nota: {
        lowerSrc: "/images/maps/nota.png",
        // upperSrc:"/images/maps/KitchenUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(9),
                y: utils.withGrid(2),
                src: "/images/characters/people/nav.png",

            })
        },
        cutsceneSpaces: {
            [utils.asGridCoord(9, 3)]: [{
                events: [

                    { type: "changeMap", map: "qrcode" }
                ]
            }],
            
        }
    },
    qrcode: {
        lowerSrc: "/images/maps/qrcode.png",
        // upperSrc:"/images/maps/KitchenUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(6),
                y: utils.withGrid(6),
                src: "/images/characters/people/nav.png",

            })
        },
        cutsceneSpaces: {
           
            
        }
    },
    
    preinicio: {
        lowerSrc: "/images/maps/preinicio.png",
        // upperSrc:"/images/maps/KitchenUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(17),
                y: utils.withGrid(5),
                src: "/images/characters/people/nav.png",

            })
        },
        cutsceneSpaces: {
            [utils.asGridCoord(18, 5)]: [{
                events: [

                    { type: "changeMap", map: "Inicio" }
                ]
            }],
            [utils.asGridCoord(5, 15)]: [{
                events: [

                ]
            }
            ]
        }
    },
    Inicio: {
        lowerSrc: "/images/maps/inicio.png",
        // upperSrc:"/images/maps/KitchenUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(9),
                y: utils.withGrid(2),
                src: "/images/characters/people/nav.png",

            })
        },
        cutsceneSpaces: {
            [utils.asGridCoord(9, 3)]: [{
                events: [

                    { type: "changeMap", map: "logo" }
                ]
            }],
            [utils.asGridCoord(5, 15)]: [{
                events: [

                ]
            }
            ]
        }
    },
    logo: {
        lowerSrc: "/images/maps/logoa.png",
        // upperSrc:"/images/maps/KitchenUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(6),
                y: utils.withGrid(6),
                src: "/images/characters/people/nav.png",

            })
        },
        cutsceneSpaces: {
            [utils.asGridCoord(6, 7)]: [{
                events: [

                    { type: "changeMap", map: "DemoRoom" }
                ]
            }],
            [utils.asGridCoord(5, 15)]: [{
                events: [

                ]
            }
            ]
        }
    },


}

