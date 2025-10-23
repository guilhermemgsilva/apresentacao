class OverworldEvent {
    constructor({ map, event }) {
        this.map = map
        this.event = event
    }

    stand(resolve) {
        const who = this.map.gameObjects[this.event.who]

        who.startBehavior({
            map: this.map
        }, {
            type: "stand",
            direction: this.event.direction,
            time: this.event.time
        })

        const completeHandler = e => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonStandComplete", completeHandler)

                resolve()
            }
        }

        document.addEventListener("PersonStandComplete", completeHandler)
    }

    walk(resolve) {
        const who = this.map.gameObjects[this.event.who]

        who.startBehavior({
            map: this.map
        }, {
            type: "walk",
            direction: this.event.direction,
            retry: true
        })

        const completeHandler = e => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonWalkingComplete", completeHandler)

                resolve()
            }
        }

        document.addEventListener("PersonWalkingComplete", completeHandler)
    }

    textMessage(resolve) {
        if (this.event.faceHero) {
            const obj = this.map.gameObjects[this.event.faceHero]
            obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction)
        }
        const message = new TextMessage({
            text: this.event.text,
            speaker: this.event.speaker,
            onComplete: () => resolve()
        })
        message.init(document.querySelector(".game-container"))
    }

    changeMap(resolve) {
        const sceneTrasition = new SceneTransition()
        sceneTrasition.init(document.querySelector(".game-container"), () => {
            this.map.overworld.startMap(window.OverworldMap[this.event.map])

            resolve()

            sceneTrasition.fadeOut()
        })




    }

    throwProjectile(resolve) {
        const who = this.map.gameObjects[this.event.who];
        const projectileId = "projectile_" + Date.now();

        // offsets fixos para ajustar onde o projétil nasce
        const offsetY = 10; // sobe 10 pixels
        const offsetX = 8;   // desloca levemente à frente

        const projectile = new Projectile({
            id: projectileId,
            x: who.x + offsetX,
            y: who.y + offsetY,
            direction: this.event.direction || who.direction,
            speed: this.event.speed || 3,
            distance: this.event.distance || 6,
            src: this.event.src || "/images/icons/spicy.png",
        });

        this.map.gameObjects[projectileId] = projectile;

        const timeToLive = ((projectile.distance * 16) / projectile.speed * 16) -1;
        setTimeout(() => {
            delete this.map.gameObjects[projectileId];
            resolve();
        }, 1000);
    }

    die(resolve) {
        const who = this.map.gameObjects[this.event.who];
        who.die();
        setTimeout(() => resolve(), 1); // espera animação acabar
    }

    fadeScene(resolve) {
    const container = document.querySelector(".game-container");
    const fadeDiv = document.createElement("div");

    // estilo inicial do fade
    fadeDiv.style.position = "absolute";
    fadeDiv.style.top = 0;
    fadeDiv.style.left = 0;
    fadeDiv.style.width = "100%";
    fadeDiv.style.height = "100%";
    fadeDiv.style.backgroundColor = this.event.color || "black";
    fadeDiv.style.opacity = 0;
    fadeDiv.style.pointerEvents = "none";
    fadeDiv.style.transition = `opacity ${this.event.fadeIn || 500}ms`;

    container.appendChild(fadeDiv);

    // Fade in
    requestAnimationFrame(() => {
      fadeDiv.style.opacity = 1;

      setTimeout(() => {
        // Fade out
        fadeDiv.style.transition = `opacity ${this.event.fadeOut || 500}ms`;
        fadeDiv.style.opacity = 0;

        setTimeout(() => {
          container.removeChild(fadeDiv);
          resolve();
        }, this.event.fadeOut || 500);
      }, this.event.hold || 500); // tempo que a tela fica totalmente preta
    });
  }

    init() {
        return new Promise(resolve => {
            this[this.event.type](resolve)
        })
    }
}