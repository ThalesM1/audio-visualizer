
import * as THREE from 'three'
import { DoubleSide, Group, LineBasicMaterial, LineSegments, Mesh, MeshPhongMaterial, ShaderMaterial } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Analyzer from './Analyzer';



export default class Audio {
 
 



    constructor(webgl){
        this.webgl = webgl;
        this.torus = this.webgl.torus;
        this.audioContext = (window.AudioContext) ? new AudioContext : new webkitAudioContext;
        this.fileReader  = new FileReader;
        this.isReady = false;
      this.count = 0;
  

      this.startEle = document.getElementById('start');
      this.playEle = document.getElementById('play');
      this.loadingEle = document.getElementById('loading');
  
  
   }
  
  
  
    init( ){
  
   
       this.analyzer = new Analyzer(this, 0.9,4.5)
     
      this.render();  
      this.loadAudio();
      

      this.playEle.addEventListener("click", function(){
        if(this.isReady) return;
        this.source.start(0);
        this.isReady = true;
        this.startEle.classList.add("isHidden");
      }.bind(this))
  
   
          
  
    }
  

  loadAudio(){
  
      var _this = this;
  
      var request = new XMLHttpRequest();
  
  
      request.open('GET', 'justice.txt', true)
      request.responseType = "arraybuffer";
  
  
      request.onload= function() {
        _this.audioContext.decodeAudioData(request.response, function(buffer){
          console.log(buffer, 'buffer')
          _this.loadingEle.classList.add("isHidden");
          _this.playEle.classList.remove("isHidden");
  
          _this.connectNode(buffer);
        });
      }.bind(this);
     
  
      
      request.send()
    }
   
    connectNode(buffer){
      if(this.source) {
        this.source.stop();
      }
  
      this.source = this.audioContext.createBufferSource();
    
  
      this.source.connect(this.analyzer.analyser);    
      this.source.connect(this.audioContext.destination);  
      this.source.buffer = buffer;
      this.source.loop = true;
    };
    
    render(){
      
      
        this.analyzer.update()
        this.webgl.render();
    requestAnimationFrame(this.render.bind(this));
      }
    
  }
  
  
  
