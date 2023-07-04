import * as THREE from 'three';
import * as dat from 'dat.gui';


let isSimRunning = false;

let isParachuteOpened = false;

const inputPanel = new dat.GUI({width:1220});
const outputPanel = new dat.GUI();

const input = {
    altitude_m: 0,
    mass_kg: 69,
};

const output = {
  velocity_mps: 0.0,
  y_m: 0,
  x_m: 0.0,
  status: "sky diving",
  time_s: 0.0,
}


//لوحة الدخل
inputPanel.add(input, 'altitude_m', 0, 5486).step(0.01).onChange(()=>{
skydiver.position.y=input.altitude_m;
helicopter.position.y=input.altitude_m;
camera.position.y=input.altitude_m;

}); //1066m to 5486m irl
inputPanel.add(input, 'mass_kg', 40, 120);

//لوحة الخرج
outputPanel.add(output, 'velocity_mps');
outputPanel.add(output, 'y_m');
outputPanel.add(output, 'x_m');
outputPanel.add(output, 'status');
outputPanel.add(output, 'time_s');
outputPanel.hide();
let h0=input.altitude_m;
const g = 9.81; // m/s^2 
let w = input.mass_kg*g;
let k = 1 ; // for an average skydiver in a belly-to-earth position
let s = 25; // for an average skydiver in a belly-to-earth position
//let rho = 1.225 * Math.pow((1 - 0.0065 * input.altitude_m / 288.15), (9.81 / (287.05 * 0.0065) - 1));
//let drag = 1/2* rho * output.velocity_mps * k * s;
// rho = 1.225 * (1 - 0.0065 * y(t)/288.15) ^ (g / (287.05 * 0.0065) - 1)
let a = 0;
let y0 = 0;
let v0 = 0;
let v=0;
let y=h0;

//scene
const scene = new THREE.Scene();
scene.background = new THREE.TextureLoader().load("sky2.jpg");

//camera
const camera = new THREE.OrthographicCamera(window.innerWidth/-2, window.innerWidth/2, window.innerHeight/2, window.innerHeight/-2, 0.1, 200);
camera.position.set(-150,h0,20);
camera.zoom = 10;
camera.updateProjectionMatrix();

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//helicopter aka grey box
const helicopter = new THREE.Mesh( new THREE.BoxGeometry( 30, 6), new THREE.MeshBasicMaterial( { color: 0x555555 } ) );
scene.add(helicopter);
helicopter.position.set(-200, h0, 0);

//skydiver aka red box
const skydiver = new THREE.Mesh( new THREE.BoxGeometry( 2, 1 ), new THREE.MeshBasicMaterial( { color: 0xff0000 } ) );
scene.add(skydiver);
skydiver.position.set(-200, h0, 0);

//ground
const ground = new THREE.Mesh(new THREE.BoxGeometry(window.innerWidth, 15, 50), new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('grsass.jpg')}));
scene.add(ground);
ground.position.set(0,-15/2,-200);

function rho(preY){
  return (1.225 * Math.pow((1 - 0.0065 * preY / 288.15), (9.81 / (287.05 * 0.0065) - 1)));
}

function drag(rho, preV, k, s){
  return 1/2 * rho * preV * k * s;
}

function forces(fr,w){
  return  w - fr;
}

function openParachute() {
  isParachuteOpened = true;
  s = 25;
  k = 0.5;
  skydiver.material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
}

//keyboard state
var keyboard = {};

// is key pressed at the moment?
window.addEventListener('keydown', function (event) {
  keyboard[event.code] = true;
});

window.addEventListener('keyup', function (event) {
  keyboard[event.code] = false;
});

//keyboard input
function handleKeyboardInput() {
  // Check if key is pressed

  if (keyboard['KeyW']) {
    // Do something
  }

  if (keyboard['KeyA']) {
    // Do something
  }

  if (keyboard['KeyD']) {
    // Do something
  }

  if (keyboard['KeyS']) {
    // Do something
  }

  if (keyboard['KeyP']) {
    isSimRunning = true;
    inputPanel.hide();
    outputPanel.domElement.style.display = "block";
    skydiver.position.y=input.altitude_m;
    helicopter.position.y = input.altitude_m; 
    camera.position.y=input.altitude_m;
    h0=input.altitude_m;
    y=input.altitude_m;
  }

  if (keyboard['KeyQ']) {
    openParachute();
  }
}
let acc=0;

//function that repeats 60 times every second
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  handleKeyboardInput();
  
  if(input.altitude_m > 0 && isSimRunning && y>0){
    
    a = forces(drag(rho(y0), v0, k, s), w) / input.mass_kg;
    console.log("t="+output.time_s);
    acc=acc+1;
    console.log("acc="+acc);

    output.velocity_mps = v0 + (a * 0.016);
   y= h0 - (y0 +( output.velocity_mps * 0.016));
    console.log("a = "+ a);
    skydiver.position.y = output.y_m;
    output.y_m =y;
    
    if(output.y_m > 40) camera.position.y = output.y_m - 20;
    
    if(output.y_m > 0) output.time_s += 0.016;

    y0 = y0 +( output.velocity_mps * 0.016);
    v0 = output.velocity_mps;
  }
  outputPanel.updateDisplay();
  //cancelAnimationFrame(animationId);
}

animate();






//make the canvas responsive
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// k = 1 for an average skydiver in a belly-to-earth position | k = 0.5 for an average rounded parachute
// s = 0.8 for an average skydiver in a belly-to-earth position | s = 25  for an average rounded parachute
// rho = 1.225 * (1 - 0.0065 * input.altitude_m / 288.15)^(9.81 / (287.05 * 0.0065) - 1)



