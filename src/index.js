import { VectorE } from "./js/vector";
import ParticleGL from "./js/particleGL";

const main = () => {
  const canvas = document.querySelector("#glcanvas");

  const particleGL = new ParticleGL(canvas, {
    //premultipliedAlpha: false,
    alpha: true,
    //antialias: true,
  });
  if (!particleGL.gl) {
    alert("無法初始化WebGL。您的瀏覽器或機器可能不支持它。");
    return;
  }
  particleGL.init();

  //滑鼠位置
  const mPos = VectorE.scale(particleGL.size(), 0.5);

  canvas.addEventListener("mousemove", (ev) => {
    VectorE.set(mPos, ev.pageX, ev.pageY);
    for (let i = 0; i < 3; i++) {
      particleGL.fire(
        mPos,
        2 + Math.random() * 14,
        Math.random() * 2 * Math.PI,
        0.25 + Math.random() * 0.25,
        2 + 3 * Math.random()
      );
    }
  });
  let time = 0;
  function render(now) {
    const delta = (now - time) * 0.001;
    time = now;
    particleGL.draw(delta);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", resize);
  resize();
};

main();
