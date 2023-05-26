import * as THREE from 'three';
import * as dat from 'dat.gui';

let isSimRunning = false;

const inputPanel = new dat.GUI();
const outputPanel = new dat.GUI();

const input = {
    altitude_m: 0,
    mass_kg: 69,
};

const output = {
  velocity_mps : 0.0,
  y_m: input.altitude_m,
  x_m: 0.0,
  skydiverStatus: "sky diving",
  time_s: 0.0,
}

//لوحة الدخل
inputPanel.add(input,'altitude_m', 1000, 4572); //3048m to 4572m irl
inputPanel.add(input,'mass_kg', 40, 120);

//لوحة الخرج
outputPanel.add(output,'velocity_mps');
outputPanel.add(output,'y_m');
outputPanel.add(output,'x_m');
outputPanel.add(output,'skydiverStatus');
outputPanel.add(output,'time_s');
outputPanel.hide();

//scene
const scene = new THREE.Scene();
scene.background = new THREE.TextureLoader().load("sky2.jpg");

//camera
const camera = new THREE.OrthographicCamera(1366/-2, 1366/2, 768/2, 768/-2, 0.1, 200);
camera.position.set(0,200,20);

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( 1366, 768 );
document.body.appendChild( renderer.domElement );

//skydiver aka red box
const skydiver = new THREE.Mesh( new THREE.BoxGeometry( 50, 10, 50 ), new THREE.MeshBasicMaterial( { color: 0xff0000 } ) );
scene.add(skydiver);
skydiver.position.set(-200, 0, -200);

//helicopter aka grey box
const helicopter = new THREE.Mesh( new THREE.BoxGeometry( 150, 75, 50 ), new THREE.MeshBasicMaterial( { color: 0x555555 } ) );
scene.add(helicopter);
helicopter.position.set(-200, 30, -200);

//ground
const ground = new THREE.Mesh(new THREE.BoxGeometry(1366, 10, 50), new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('grsass.jpg')}));
scene.add(ground);
ground.position.set(0,-10,-200);


function updateSpeed(speed){
  if(output.velocity_mps <= 55){
    //
  }

}

function openParachute(x, y){

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
    input.altitude_m -= output.velocity_mps/3;
    output.y_m = input.altitude_m;
    skydiver.position.set(-200, output.y_m, -200);

    if(output.velocity_mps <= 55){
      output.velocity_mps += 20/60;
    }

    if(output.y_m > 200){
      camera.position.y = input.altitude_m - 20;
    }

    if(output.y_m < 0){
      output.y_m = 0;
      skydiver.position.set(-200, output.y_m, -200);
    }
    output.time_s += 1/60;
  } 
  outputPanel.updateDisplay();
}

animate();

// W = m.g
// F_air = 1/2 rho.v^2.cd.A ;
//
// const g = 9.81; // acceleration due to gravity in m/s^2
// const rho = 1.2; // air density in kg/m^3
// const Cd = 0.75; // coefficient of drag (for a skydiver in a belly-to-earth position)