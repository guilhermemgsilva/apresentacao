class Projectile extends GameObject {
  constructor(config) {
    super(config);
    this.id = config.id || "projectile_" + Date.now();
    this.direction = config.direction;
    this.speed = config.speed || 4;
    this.distance = config.distance || 5; // blocos
    this.travelled = 0;
    this.stepSize = 4; // pixels por atualização

    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "/images/effects/fireball.png",
      animationFrameLimit: 6,
      animations: {
        "idle-down": [[0, 0]],
      }
    });

    this.directionUpdate = {
      "up": ["y", -this.stepSize],
      "down": ["y", this.stepSize],
      "left": ["x", -this.stepSize],
      "right": ["x", this.stepSize],
    };
  }

  update(state) {
  const [prop, delta] = this.directionUpdate[this.direction];
  this[prop] += delta * this.speed;        // ← aplica speed aqui
  this.travelled += Math.abs(delta * this.speed);

  if (this.travelled >= this.distance * 16) {
    delete state.map.gameObjects[this.id];
  }
}
}
