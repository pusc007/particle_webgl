precision highp float;
varying vec2 vTextureCoord;
varying vec2 vSize;
uniform sampler2D uGradientColorSampler;

float distLine(vec2 p,vec2 a,vec2 b,float w){
  vec2 pa=p-a;
  vec2 ba=b-a;
  float t=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);
  return length(pa-ba*t)/w;
}

/*vec4 drawLight(float d){
  float highColorRate=smoothstep(1.,0.,d);
  float baseColorRate=smoothstep(1.,0.,d/4.);
  float glowColorRate=smoothstep(1.,0.,d/8.);
  float endColorRate=smoothstep(1.,0.,d/16.);
  vec4 highColor=vec4(1.,1.,1.,1.);
  vec4 baseColor=vec4(.35,.98,.98,1.);
  vec4 glowColor=vec4(.28,.73,.78,1.);
  vec4 endColor=vec4(.2,.25,.91,1.);
  vec4 color=mix(.5*baseColor,highColor,highColorRate)*endColorRate;
  color=mix(.25*glowColor,color,baseColorRate)*endColorRate;
  color=mix(.125*endColor,color,glowColorRate)*endColorRate;
  return color;
}
vec4 distLightLine(vec2 p,vec2 a,vec2 b,float w){
  float d=distLine(p,a,b,w);
  return drawLight(d);
}*/

float drawLight(float d,float power){
  float f=1.;
  float a=1.;
  const int N=3;
  float maxF=pow(2.,float(N));
  for(int i=0;i<N;i++){
    a*=.5;
    float colorRate=smoothstep(1.,0.,2.*a*d);
    float rate=pow(colorRate,a*maxF);
    f=mix(a,f,rate);
  }
  f*=power*smoothstep(1.,0.,d/maxF);
  return f;
}
vec4 distLightPoint(float d,float power,sampler2D gradientColorSampler){
  float f=drawLight(d,power);
  return vec4(f*texture2D(gradientColorSampler,vec2(f,0.)));
}
vec4 distLightLine(vec2 p,vec2 a,vec2 b,float w,float power,sampler2D gradientColorSampler){
  float d=distLine(p,a,b,w);
  float f=drawLight(d,power);
  return vec4(f*texture2D(gradientColorSampler,vec2(f,0.)));
}

void main(void){
  vec4 color=vec4(0.);
  vec2 aspectRatio=vec2(vSize.x/vSize.y,1.);
  
  vec2 coord=vTextureCoord*aspectRatio;
  vec2 startPos=vec2(0.,.5)*aspectRatio+vec2(aspectRatio.y*.5,0.);
  vec2 endPos=vec2(1.,.5)*aspectRatio-vec2(aspectRatio.y*.5,0.);
  float r=aspectRatio.y*.5/16.;
  color+=distLightLine(coord,startPos,endPos,r,1.,uGradientColorSampler);
  gl_FragColor=color;
}