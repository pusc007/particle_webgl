import { mat4 } from "gl-matrix";
import { arrayBufferData, elementArrayBufferData, loadTexture, useTexture } from "./glSupply";
import EasingFunctions from "./ease";
import { Vector } from "./vector";
import Spark from "./spark";
import particleShader from "./shader/particle/particleShader";
import gradientColor from "../gradientColor.jpg";
const modelBuffers = (gl) => {
  const positions = [
    [-1.0, -1.0],
    [-1.0, 1.0],
    [1.0, -1.0],
    [1.0, 1.0],
  ].flat();
  const positionBufferData = arrayBufferData(gl, positions, 2);
  const textureCoordinates = [
    [0.0, 0.0],
    [0.0, 1.0],
    [1.0, 0.0],
    [1.0, 1.0],
  ].flat();
  const textureCoordinatesBufferData = arrayBufferData(gl, textureCoordinates, 2);
  const indices = [
    [1, 2, 0],
    [1, 3, 2],
  ].flat();
  //const indicesBufferData = elementArrayBufferData(gl, indices, Uint32Array);
  //const indicesBufferData = elementArrayBufferData(gl, indices, Uint16Array);
  const indicesBufferData = elementArrayBufferData(gl, indices, Uint8Array);

  return {
    positionBufferData: positionBufferData,
    textureCoordinatesBufferData: textureCoordinatesBufferData,
    indicesBufferData: indicesBufferData,
  };
};
export default class ParticleGL {
  constructor(canvas, options) {
    this.canvas = canvas;
    //const gl = canvas.getContext("webgl", options);
    this.gl = canvas.getContext("webgl2", options);
    this.isWebGL2 = true;
    if (!this.gl) {
      this.gl = canvas.getContext("webgl", options) || canvas.getContext("experimental-webgl", options);
      this.isWebGL2 = false;
    }
  }
  init() {
    const gl = this.gl;
    //著色器資料
    this.programInfos = {
      particleShader: particleShader(gl),
    };
    //緩衝資料
    this.buffers = { model: modelBuffers(gl) };
    //貼圖
    this.textures = {
      gradientColor: loadTexture(gl, gradientColor),
    };
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    this.particles = [];
  }
  draw(delta) {
    const gl = this.gl;

    const projectionMatrix = mat4.create();
    mat4.ortho(projectionMatrix, 0, ...this.size(), 0, 0.1, 100);
    mat4.translate(projectionMatrix, projectionMatrix, [0.0, 0.0, -1.0]);

    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const modelViewMatrix = mat4.create();

    {
      this.particles.forEach((el, i, ary) => {
        el.update(delta);
        el.lifespan <= 0 && ary.splice(i, 1);
      });

      const bufferData = this.buffers.model;
      const shaderProgram = this.programInfos.particleShader;
      shaderProgram.use();
      shaderProgram.attribSet({
        vertexPosition: bufferData.positionBufferData.buffer,
        textureCoord: bufferData.textureCoordinatesBufferData.buffer,
      });
      shaderProgram.elementSet(bufferData.indicesBufferData.buffer);
      shaderProgram.uniformSet({
        projectionMatrix: projectionMatrix,
        gradientColorSampler: this.textures.gradientColor,
      });

      useTexture(gl, null, false);
      this.particles.forEach((el, i, ary) => {
        const startPos = el.prevPos;
        const endPos = el.pos;
        const thickness = 5 * EasingFunctions.easeOutQuad(el.lifespan / el.maxlife);
        const v = Vector.sub(endPos, startPos);
        const a = Vector.getAngle(v);
        mat4.identity(modelViewMatrix);
        mat4.translate(modelViewMatrix, modelViewMatrix, [...Vector.mix(startPos, endPos, 0.5), 0.0]);
        mat4.rotateZ(modelViewMatrix, modelViewMatrix, a);
        shaderProgram.uniformSet({
          modelViewMatrix: modelViewMatrix,
          size: [Vector.length(v) + thickness * 2 * (1 + 8), thickness * 2 * (1 + 8)],
        });
        shaderProgram.draw(bufferData.indicesBufferData.length);
      });
    }
  }
  size() {
    return [this.canvas.clientWidth, this.canvas.clientHeight];
  }
  fire(pos, velocity, direct, lifespan, thickness, friction) {
    this.particles.push(new Spark(pos, velocity, direct, lifespan, thickness, friction));
  }
}
