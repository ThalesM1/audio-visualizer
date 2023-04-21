import * as THREE from 'three'
import { DoubleSide } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


let alt = true;

export default class Torus{
  constructor(webGl){
    this.WebGl = webGl;
    this.init();
 
  }

  init(){




    const _vs = `
    
    
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

  _position *= (1.0 + aFrequency );

  _position += offset;

  _position.xy = calcRotate2D(time * 0.2) * _position.xy;
  



  vec4 mvPos = vec4(_position, 1.0);

  mvPos = modelViewMatrix * mvPos;

  vPos = mvPos.xyz;

  gl_Position =projectionMatrix * mvPos;
}

    
    
    
    `


    const  frag = `
    
    
    
varying vec2 vUv;
varying vec3 vPos;


const vec3 objColor = vec3(0.067,0.329,0.459);

const vec3 hemiLight_g_1 = vec3(1.0,1.0,1.0);
const vec3 hemiLight_s_1 = vec3(0.0,0.0,0.0);
const vec3 hemiLight_g_2 = vec3(1.0,1.0,1.0);
const vec3 hemiLight_s_2 = vec3(1.0,1.0,1.0);




const vec3 dirLight = vec3(0.3);
const vec3 dirLight_2 = vec3(0.15);


const vec3 hemiLightPos_1 = vec3(1.0, 0.0, -1.0);
const vec3 hemiLightPos_2 = vec3(-0.5, 0.5, 1.0);


const vec3 dirLightPos = vec3(-30, 50, 50);
const vec3 dirLightPos_2 = vec3(30, -50, -50);


vec3 calcIrradiance_hemi(vec3 newNormal, vec3 lightPos, vec3 grd, vec3 sky){
  float dotNL = dot(newNormal, normalize(lightPos));
  float hemiDiffuseWeight = 1.5 * dotNL + 0.5;

  return mix(grd, sky, hemiDiffuseWeight);
}

vec3 calcIrradiance_dir(vec3 newNormal, vec3 lightPos, vec3 light){
  float dotNL = dot(newNormal, normalize(lightPos));

  return light * max(0.0, dotNL);
}


void main(){


  
  vec3 _normal = normalize( cross(dFdx(vPos), dFdy(vPos)) );

  vec3 hemiColor = vec3(0.0);
  hemiColor += calcIrradiance_hemi(_normal, hemiLightPos_1, hemiLight_g_1, hemiLight_s_1) * 0.3;
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


    const geometry = this.createGeometry();

    this.uniforms = {
      uRadius: {type: "f", value: this.radius},
      uTick: {type: "f", value: 0}
    }

    const material = new THREE.ShaderMaterial( { 
      vertexShader: _vs,
      fragmentShader: frag,
      extensions:{
        derivatives:true
      },
      uniforms: this.uniforms,
      side: DoubleSide,

     } );

    const torus = new THREE.Mesh( geometry, material );

    this.WebGl.scene.add( torus );
  }


  createGeometry(){
    this.geometry = new THREE.BufferGeometry();

    this.radius = 180 * 1.1;

    const tube = 2.5 * 1.1;

    this.radialSegments = 25;

    this.tubularSegments = 360;

    this.orderNumArray = [];
    const vertices = [];
    const normals = [];
    const radians = [];
    const uvs = [];
    const indices = [];

    for ( let j = 0; j <= this.radialSegments; j ++ ) {
      for ( let i = 0; i <= this.tubularSegments; i ++ ) {
        
      
            this.orderNumArray.push(i);

        
 
        var u = i / this.tubularSegments * Math.PI * 2;
        var v = j / this.radialSegments * Math.PI * 2;


        radians.push(u);

        // vertex

        var vertex = {};

        vertex.x = ( this.radius + tube * Math.cos( v ) ) * Math.cos( u );
        vertex.y = ( this.radius + tube * Math.cos( v ) ) * Math.sin( u );
        vertex.z = tube * Math.sin( v );

        vertices.push( vertex.x, vertex.y, vertex.z );

        // normal

        var center = {};

        center.x = this.radius * Math.cos( u );
        center.y = this.radius * Math.sin( u );

        var normal = {};

        normal.x = vertex.x - center.x;
        normal.y = vertex.y - center.y;
        normal.z = vertex.z - center.z;

        var normalRatio = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);

        // normal.subVectors( , center ).normalize();

        normals.push( normal.x/normalRatio, normal.y/normalRatio, normal.z/normalRatio);

        // uv

        uvs.push( i / this.tubularSegments );
        uvs.push( j / this.radialSegments );

      }
    }

    // indices
    for ( let j = 1; j <= this.radialSegments; j ++ ) {
      for ( let i = 1; i <= this.tubularSegments; i ++ ) {

        // indices

        let a = ( this.tubularSegments + 1 ) * j + i - 1;
        let b = ( this.tubularSegments + 1 ) * ( j - 1 ) + i - 1;
        let c = ( this.tubularSegments + 1 ) * ( j - 1 ) + i;
        let d = ( this.tubularSegments + 1 ) * j + i;

        // faces
        indices.push( a, b, d );
        indices.push( b, c, d );
      }
    }

    this.radians = new THREE.Float32BufferAttribute( radians, 1 );

    this.indices = new ( indices.length > 65535 ? THREE.Uint32BufferAttribute : THREE.Uint16BufferAttribute )( indices, 1 );
    this.positions = new THREE.Float32BufferAttribute( vertices, 3 );
    this.normals = new THREE.Float32BufferAttribute( normals, 3 );
    

    this.uvs = new THREE.Float32BufferAttribute( uvs, 2 );

    this.frequencies = new THREE.BufferAttribute( new Float32Array((this.radialSegments + 1) * (this.tubularSegments + 1)), 1 );

    this.geometry.setIndex(this.indices);
    this.geometry.setAttribute("position", this.positions);
    this.geometry.setAttribute("normal", this.normals);
    this.geometry.setAttribute("uv", this.uvs);

    this.geometry.setAttribute("aFrequency", this.frequencies);
    this.geometry.setAttribute("aRadian", this.radians);

    return this.geometry;
  }




  render(){
    
    this.uniforms.uTick.value++;
    var spectrums = this.WebGl.audio.analyzer.frequencyArray;

    var aFrequency = this.geometry.attributes.aFrequency;
    aFrequency.needsUpdate = true;
 
      for(let i = 0; i < aFrequency.count; i++){
      let num = this.orderNumArray[i];
      if(num === this.tubularSegments) num = 0;
      let spectrum = spectrums[num];
      aFrequency.array[i] = spectrum*2;
    
    
      }
 
    

    



  }

}