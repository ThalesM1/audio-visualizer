

import { GUI } from 'dat.gui';




export default class Controls{
    constructor(analyzer){
      this.analyzer = analyzer;
      this.props = {
        // start: 1,
        end: 600,
        scaleSize: 4.0,
  
        isNo: true,
        isLinear: false,
        isCubic: false,
        isCosine: false,
        isHermite: false,
        isTrilinear:false,
        tension: 0,
        bias: 0
      };
  
      this.init();
    }
  
    init(){
  
  
      this.gui = new GUI({width: 400});
      // this.gui.remember(this.controls);
  
      // this.gui.add(this.props, "start", 1, 90).name("start frequency").onChange(this.changeFunc.bind(this));
      this.gui.add(this.props, "end", 200, 2000).name("Frequências").onChange(this.changeFreq.bind(this));
      this.gui.add(this.props, "scaleSize", 1/7 * 10, 1/2 * 10).name("Escala");
  
  
      // about interpolation : http://paulbourke.net/miscellaneous/interpolation/
      this.gui_type = this.gui.addFolder('Modelo de Interpolação');
      this.gui_type.open();
      this.gui_type.add(this.props, "isNo").name("Nenhuma").listen().onChange(this.changeType1.bind(this));
      this.gui_type.add(this.props, "isLinear").name("Linear ").listen().onChange(this.changeType2.bind(this));
      this.gui_type.add(this.props, "isCubic").name("Cúbica").listen().onChange(this.changeType3.bind(this));
      this.gui_type.add(this.props, "isCosine").name("Cossenoide").listen().onChange(this.changeType4.bind(this));
      this.gui_type.add(this.props, "isTrilinear").name("Experimental").listen().onChange(this.changeType6.bind(this));
      // this.gui_type.add(this.props, "isHermite").name("hermite interpolation").listen().onChange(this.changeType5.bind(this));
    }
  
    changeFreq(value){
  
      this.analyzer.setRange();
      
    }
  
    changeType1(){
      this.props.isNo = true;
      this.props.isLinear = false;
      this.props.isCubic = false;
      this.props.isCosine = false;
      this.props.isHermite = false;
      this.props.isTrilinear =false
      this.removeHermite();
    }
  
    changeType2(){
      this.props.isNo = false;
      this.props.isLinear = true;
      this.props.isCubic = false;
      this.props.isCosine = false;
      this.props.isHermite = false;
      this.props.isTrilinear =false
      this.removeHermite();
  
    }
  
    changeType3(){
      this.props.isNo = false;
      this.props.isLinear = false;
      this.props.isCubic = true;
      this.props.isCosine = false;
      this.props.isHermite = false;
      this.props.isTrilinear =false
      this.removeHermite();
  
  
  
    }
  
    changeType4(){
      this.props.isNo = false;
      this.props.isLinear = false;
      this.props.isCubic = false;
      this.props.isCosine = true;
      this.props.isHermite = false;
      this.props.isTrilinear =false
      this.removeHermite();
    }
  
    changeType5(){
      this.props.isNo = false;
      this.props.isLinear = false;
      this.props.isCubic = false;
      this.props.isCosine = false;
      this.props.isHermite = true;
      this.props.isTrilinear =false
      this.addHermite();
    }
    changeType6(){
      this.props.isNo = false;
      this.props.isLinear = false;
      this.props.isCubic = false;
      this.props.isCosine = false;
      this.props.isHermite = false;
      this.props.isTrilinear =true
      this.removeHermite();
    }
  
    addHermite(){
      if(this.gui_hermite){
        this.gui_hermite.domElement.setAttribute("style", "display: block");
        return;
      }
  
      this.gui_hermite = this.gui.addFolder('parms of hermite');
      // console.log(this.gui_hermite);
      this.gui_hermite.open();
  
      /*
        Tension: 1 is high, 0 normal, -1 is low
        Bias: 0 is even,
        positive is towards first segment,
        negative towards the other
      */
  
  
  
      this.gui_hermite.add(this.props, "tension", -1, 1).name("hermite tension");
      this.gui_hermite.add(this.props, "bias", -5, 5).name("hermite bias");
        
  
    }
  
    removeHermite(){
      if(this.gui_hermite) this.gui_hermite.domElement.setAttribute("style", "display: none");
    }
  }