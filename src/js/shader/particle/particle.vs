attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec2 uSize;
varying vec2 vTextureCoord;
varying vec2 vSize;
void main(void){
  vSize=uSize;
  vTextureCoord=aTextureCoord;
  vec4 pos=uModelViewMatrix*vec4(aVertexPosition*uSize*.5,0.,1.);
  gl_Position=uProjectionMatrix*pos;
}