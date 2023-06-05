import * as THREE from 'three';
import * as dat from 'dat.gui';

let isSimRunning = false;

let isParachuteOpened = false;

const inputPanel = new dat.GUI();
const outputPanel = new dat.GUI();

const input = {
    altitude_m: 1000,
    mass_kg: 70,
}

const output = {
  velocity_mps : 0.0,
  y_m: input.altitude_m,
  x_m: 0.0,
  status: "sky diving",
  time_s: 0.0,
}

//لوحة الدخل
inputPanel.add(input,'altitude_m', 1066, 5486); //1066m to 5486m irl
inputPanel.add(input,'mass_kg', 40, 120);

//لوحة الخرج
outputPanel.add(output,'velocity_mps');
outputPanel.add(output,'y_m');
outputPanel.add(output,'x_m');
outputPanel.add(output,'status');
outputPanel.add(output,'time_s');
outputPanel.hide();

const g = 9.81; // m/s^2 
let w = input.mass_kg*g;
let k = 1 ; // for an average skydiver in a belly-to-earth position
let s = 0.7 // for an average skydiver in a belly-to-earth position
let rho = 1.225 * Math.pow((1 - 0.0065 * output.y_m / 288.15), (9.81 / (287.05 * 0.0065) - 1));
let termVelocity = Math.sqrt((2 * w) / (rho * s * k));
let F_air = 1/2* rho * output.velocity_mps * k * s;

//scene
const scene = new THREE.Scene();
scene.background = new THREE.TextureLoader().load("sky2.jpg");

//camera
const camera = new THREE.OrthographicCamera(1366/-2, 1366/2, 768/2, 768/-2, 0.1, 50);
camera.position.set(0,200,40);

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( 1366, 768 );
document.body.appendChild( renderer.domElement );

//skydiver aka red box
const skydiver = new THREE.Mesh( new THREE.BoxGeometry( 50, 10, 0 ), new THREE.MeshBasicMaterial( { color: 0xff0000 } ) );
scene.add(skydiver);
skydiver.position.set(-200, 0, 0);

//helicopter aka grey box
const helicopter = new THREE.Mesh( new THREE.BoxGeometry( 150, 75, 0 ), new THREE.MeshBasicMaterial( { color: 0x555555 } ) );
scene.add(helicopter);
helicopter.position.set(-200, 30, 0);

//ground
const ground = new THREE.Mesh(new THREE.BoxGeometry(1366, 10, 0), new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('grsass.jpg')}));
scene.add(ground);
ground.position.set(0,-10,0);


function updateSpeed(){
  if(output.velocity_mps < termVelocity){
    //
  }

}

function openParachute(){
  isParachuteOpened = true;
  s = 25;
  k = 0.5;
}

//keyboard state
var keyboard = {};

// is key pressed at the moment?
window.addEventListener('keydown', function(event) {
    keyboard[event.code] = true;
});

window.addEventListener('keyup', function(event) {
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

  if (keyboard['KeyS']) {
      // Do something
  }

  if (keyboard['KeyD']) {
      // Do something
  }

  if(keyboard['KeyP']){
    isSimRunning = true;
    inputPanel.hide();
    outputPanel.domElement.style.display = "block";
    helicopter.position.y = input.altitude_m;
  }
}

//function that repeats 60 times every second
function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  handleKeyboardInput();
  
  if(input.altitude_m > 0 && isSimRunning ){
    output.y_m = input.altitude_m - 0.5 * g *Math.pow(output.time_s,2); // ht = 1/2.g.t^2
    skydiver.position.y= output.y_m;

    output.velocity_mps = g *output.time_s; // vt = g.t
    
    if(output.y_m > 200){ //move the camera
      camera.position.y = output.y_m - 20;
    }
    if(output.y_m < 0){ //y stops at zero
      output.y_m = 0;
      skydiver.position.y= output.y_m;
    }
    if(output.y_m > 0){ //update time
      output.time_s += 1/60;
    }
  } 
  outputPanel.updateDisplay();
  //cancelAnimationFrame(animationId);
}

animate();

// k = 1 for an average skydiver in a belly-to-earth position | k = 0.5 for an average rounded parachute
// s = 0.8 for an average skydiver in a belly-to-earth position | s = 25  for an average rounded parachute
// rho = 1.225 * (1 - 0.0065 * input.altitude_m / 288.15)^(9.81 / (287.05 * 0.0065) - 1)



