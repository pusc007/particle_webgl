import { initShaderProgram, attribFuns, uniformFuns, shaderProgramFun } from "../../glSupply";
import vs from "./particle.vs";
import fs from "./particle.fs";
const shader = (gl, vs, fs) => {
  const shaderProgram = initShaderProgram(gl, vs, fs);
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: attribFuns.attribFloat(gl, shaderProgram, "aVertexPosition", 2),
      textureCoord: attribFuns.attribFloat(gl, shaderProgram, "aTextureCoord", 2),
    },
    uniformLocations: {
      projectionMatrix: uniformFuns.uniformMatrix4fv(gl, shaderProgram, "uProjectionMatrix"),
      modelViewMatrix: uniformFuns.uniformMatrix4fv(gl, shaderProgram, "uModelViewMatrix"),
      gradientColorSampler: uniformFuns.uniformTexture(gl, shaderProgram, "uGradientColorSampler", 0),
      size: uniformFuns.uniform2fv(gl, shaderProgram, "uSize"),
    },
  };
  return programInfo;
};
export default (gl) => {
  return Object.assign(shaderProgramFun(gl, shader, vs, fs), {
    draw(length) {
      //gl.drawElements(gl.TRIANGLES, length, gl.UNSIGNED_INT, 0);
      //gl.drawElements(gl.TRIANGLES, length, gl.UNSIGNED_SHORT, 0);
      gl.drawElements(gl.TRIANGLES, length, gl.UNSIGNED_BYTE, 0);

      //gl.drawArrays(gl.TRIANGLES, 0, length);
    },
  });
};
