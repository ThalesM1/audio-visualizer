import * as THREE from 'three'
import { DoubleSide, Group, LineBasicMaterial, LineSegments, Mesh, MeshPhongMaterial, ShaderMaterial } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Audio from './components/Audio';
import ResizeWatch from './components/resize-watch';
import { frag, vert } from './components/shaders/torus';
import Torus from './components/Torus';



window.resizeWatch = new ResizeWatch();

class WebGl {

  constructor() {



  }
   



  init(){
    // console.log(this.vertShader, this.fragShader);
    // resizeWatch.register(this);

    this.width = 1600;
    this.height = 1600;
    this.aspect = this.width / this.height;

    this.scene = new THREE.Scene();

    this.setProps();

    this.camera = new THREE.PerspectiveCamera(this.props.fov, this.props.aspect, this.props.near, this.props.far);
    // var cameraZ = (this.props.height / 2) / Math.tan((45 * Math.PI / 180) / 2);

    // this.camera.position.set(0, cameraZ/1.8, 0);

    // this.camera.lookAt(this.scene.position);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    var ratio = 1.5;

    this.renderer.setPixelRatio(ratio);

    this.renderer.setClearColor(0x000000, 1);

    document.body.appendChild(this.renderer.domElement);

    this.torus = new Torus(this);


    var control =  new OrbitControls(this.camera, this.renderer.domElement); 

    this.audio = new Audio(this);
    this.audio.init();
    this.resizeUpdate();
  }



  setProps(){
    var width = innerWidth;
    var height = innerHeight;
    var aspect = width / height;

    this.props = {
      width: width,
      height: height,
      aspect: aspect,
      fov: 45,
      left: -width / 2,
      right: width / 2,
      top: height / 2,
      bottom: -height / 2,
      near: 0.1,
      far: 10000,
    };
  };

  resizeUpdate(){
    this.setProps();
    this.renderer.setSize(this.props.width, this.props.height);

    this.camera.aspect = this.props.aspect;

    var cameraZ = (this.props.height / 2) / Math.tan((this.props.fov * Math.PI / 180) / 2);

    this.camera.position.set(-5, -5,-750);
    
    this.camera.lookAt(this.scene.position);

    this.camera.updateProjectionMatrix();
  }

  

  render(){
      if(this.uniforms) this.uniforms.uTick.value += 1;
      this.renderer.render(this.scene, this.camera);
      this.torus.render();
      // this.effect.render();
  }
}

const wb = new WebGl()
wb.init()
wb.render()
  
  
window.onresize = function(){




  wb.resizeUpdate();
  
}
  
  