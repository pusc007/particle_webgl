import { Vector, VectorE } from "./vector";
export default class Spark {
  constructor(pos = [0, 0], velocity = 10, direct = 0, lifespan = 25, thickness = 3, friction = 0.94) {
    this.options = {
      pos,
      velocity,
      direct,
      lifespan,
      thickness,
      friction,
      gravity: [0, 0.981],
      colorStart: [1, 0, 0, 1],
      colorEnd: [1, 1, 0, 1],
    };
    this.init();
  }
  init() {
    this.prevPos = this.options.pos.slice();
    this.pos = this.options.pos.slice();
    this.velocityPos = [
      Math.cos(this.options.direct) * this.options.velocity,
      Math.sin(this.options.direct) * this.options.velocity,
    ];
    this.lifespan = this.options.lifespan;
    this.maxlife = this.lifespan;
    this.swing = Math.random();
  }
  update(delta) {
    VectorE.set(this.prevPos, ...this.pos);
    VectorE.add(this.pos, this.velocityPos);
    const swingV = [0, Math.sin(this.swing * 2 * Math.PI)];
    VectorE.rotate(swingV, Vector.getAngle(this.velocityPos));
    VectorE.scale(swingV, this.lifespan / this.maxlife);
    VectorE.add(this.velocityPos, swingV);
    VectorE.add(this.velocityPos, this.options.gravity);
    VectorE.scale(this.velocityPos, this.options.friction);
    this.swing += 0.07;
    this.swing %= 1;
    if (this.lifespan > 0) {
      this.lifespan -= delta;
    }
  }
  setColor(colorEnd, colorStart) {
    if (colorStart) {
      this.options.colorStart = colorStart;
    }
    if (colorEnd) {
      this.options.colorEnd = colorEnd;
    }
  }
  get positions() {
    return [...this.prevPos, ...this.pos];
  }
  get colors() {
    return [...this.options.colorEnd, ...this.options.colorStart];
  }
  get lineWidths() {
    const rate = this.lifespan / this.maxlife;
    return [...[0, 0, 0, 0], ...[rate * Math.min(this.options.thickness / 5, 1.0), 0, 0, 0]];
  }
}
