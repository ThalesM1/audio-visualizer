export const frag = `

varying vec2 vUv;
varying vec3 vPos;


const vec3 objColor = vec3(1.0);

const vec3 hemiLight_g_1 = vec3(0.898,0.,0.38);
const vec3 hemiLight_s_1 = vec3(0.937,0.796,0.012);
const vec3 hemiLight_g_2 = vec3(0.635,0.043,0.475);
const vec3 hemiLight_s_2 = vec3(0.635,0.043,0.141);



const vec3 dirLight = vec3(0.2);
const vec3 dirLight_2 = vec3(0.15);


const vec3 hemiLightPos_1 = vec3(1.0, 0.0, -1.0);
const vec3 hemiLightPos_2 = vec3(-0.5, 0.5, 1.0);


const vec3 dirLightPos = vec3(-30, 50, 50);
const vec3 dirLightPos_2 = vec3(30, -50, -50);


vec3 calcIrradiance_hemi(vec3 newNormal, vec3 lightPos, vec3 grd, vec3 sky){
  float dotNL = dot(newNormal, normalize(lightPos));
  float hemiDiffuseWeight = 0.5 * dotNL + 0.5;

  return mix(grd, sky, hemiDiffuseWeight);
}

vec3 calcIrradiance_dir(vec3 newNormal, vec3 lightPos, vec3 light){
  float dotNL = dot(newNormal, normalize(lightPos));

  return light * max(0.0, dotNL);
}


void main(){

  vec3 _normal = normalize( cross(dFdx(vPos), dFdy(vPos)) );

  vec3 hemiColor = vec3(0.0);
  hemiColor += calcIrradiance_hemi(_normal, hemiLightPos_1, hemiLight_g_1, hemiLight_s_1) * 0.7;
  hemiColor += calcIrradiance_hemi(_normal, hemiLightPos_2, hemiLight_g_2, hemiLight_s_2) * 0.8;
  
  vec3 dirColor = vec3(0.0);
  dirColor += calcIrradiance_dir(_normal, dirLightPos, dirLight);
  dirColor += calcIrradiance_dir(_normal, dirLightPos_2, dirLight_2);


  vec3 color = objColor * hemiColor;
  
  color += dirColor;

  vec3 offsetColor = vec3(2.0 * 0.2, 2.0 * 1.5, -2.0 * 0.7) * 0.008;

  color += offsetColor;
  color.g = min(0.9, color.g);

  color.r = (color.g == 0.9 && color.r > 0.94) ? 0.94 : color.r;

  color = min(vec3(1.0), color);

  float offsetColor2 = min(0.0, (vPos.x + vPos.y) / 2000.0);
  color -= vec3(offsetColor2) * vec3(-0.3, -1.0, 1.2);

  color = min(vec3(1.0), color + 0.1);

  gl_FragColor = vec4(color, 0.95);
}


`


export const  vert = 
`   
attribute float aFrequency;
attribute float aRadian;

uniform float uRadius;
uniform float uTick;


varying vec2 vUv;
varying vec3 vPos;
varying float vFrequency;


const float PI = 3.1415926;


mat2 calcRotate2D(float _time){
  float _sin = sin(_time);
  float _cos = cos(_time);
  return mat2(_cos, _sin, -_sin, _cos);
}


void main(){
  vUv =  uv;
  vFrequency = min(10.0, aFrequency);

  float time = uTick * 0.005;

  vec3 offset = vec3(cos(aRadian), sin(aRadian), 0.0) * uRadius;

  vec3 _position = position - offset;

  _position *= (1.0 + aFrequency);

  _position += offset;

  _position.xy = calcRotate2D(time * 1.2) * _position.xy;



  vec4 mvPos = vec4(_position, 1.0);

  mvPos = modelViewMatrix * mvPos;

  vPos = mvPos.xyz;

  gl_Position =projectionMatrix * mvPos;
}

    







`


