import * as THREE from 'three';
import * as dat from 'dat.gui';

let isSimRunning = false;

const inputPanel = new dat.GUI();
const outputPanel = new dat.GUI();

const input = {
  altitude_m: 0,
  mass_kg: 69,
  parachuteMass_kg: 11,
};

const output = {
  velocity_mps: 0.0,
  y_m: input.altitude_m,
  x_m: 0.0,
  skydiverStatus: "sky diving",
}

//لوحة الدخل
inputPanel.add(input, 'altitude_m', 3048, 4572);
inputPanel.add(input, 'mass_kg', 0, 100);
inputPanel.add(input, 'parachuteMass_kg', 7, 11);

//لوحة الخرج
outputPanel.add(output, 'velocity_mps');
outputPanel.add(output, 'y_m');
outputPanel.add(output, 'x_m');
outputPanel.add(output, 'skydiverStatus');
outputPanel.hide();

//scene
const scene = new THREE.Scene();

//camera
const camera = new THREE.OrthographicCamera(1366 / -2, 1366 / 2, 768 / 2, 768 / -2, 0.1, 200);
camera.position.set(0, 200, 20);

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(1366, 768);
document.body.appendChild(renderer.domElement);

// 2D background 
const textureLoader = new THREE.TextureLoader().load("./sky2.jpg");
scene.background = textureLoader;

//skydiver aka red box
const skydiver = new THREE.Mesh(new THREE.BoxGeometry(50, 10, 50), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
scene.add(skydiver);
skydiver.position.set(-200, 0, -200);

//helicopter aka grey box
const helicopter = new THREE.Mesh(new THREE.BoxGeometry(150, 75, 50), new THREE.MeshBasicMaterial({ color: 0x555555 }));
scene.add(helicopter);
helicopter.position.set(-200, 30, -200);

//ground
const ground = new THREE.Mesh(new THREE.BoxGeometry(1366, 10, 400), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
scene.add(ground);
ground.position.set(0, -10, -200);


function updateSpeed(speed) {
  if (output.velocity_mps <= 55) {
    //
  }

}

function openParachute(x, y) {

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

  if (keyboard['KeyS']) {
    // Do something
  }

  if (keyboard['KeyD']) {
    // Do something
  }

  if (keyboard['KeyP']) {
    isSimRunning = true;
    inputPanel.hide();
    outputPanel.domElement.style.display = "block";
    helicopter.position.y = input.altitude_m;
  }
}

//function that repeats 60 times every second
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  handleKeyboardInput();

  if (input.altitude_m > 0 && isSimRunning) {
    input.altitude_m -= output.velocity_mps / 60;
    skydiver.position.set(-200, input.altitude_m, -200);
    //if(output.y_m != 0){
    output.y_m = input.altitude_m;
    //}
    if (output.velocity_mps <= 55) {
      output.velocity_mps += 20 / 60;
    }
    if (output.y_m > 200) {
      camera.position.y = input.altitude_m - 20;
    }
  }
  outputPanel.updateDisplay();
}

animate();

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


// W = m.g
// F_air = 1/2 rho.v^2.cd.A ;
//
// const g = 9.81; // acceleration due to gravity in m/s^2
// const rho = 1.2; // air density in kg/m^3
// const Cd = 0.75; // coefficient of drag (for a skydiver in a belly-to-earth position)