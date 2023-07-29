import * as THREE from 'three';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';




const inputPanel = new dat.GUI({ width: 1220 });
const outputPanel = new dat.GUI();

const input = {
  altitude_m: 0,
  mass_kg: 40,
  roh_parachute: 1.1,
  radius_parachute: 50,
  k: 0.7,
  gravity: 9.81,
  thik:15,
};

const output = {
  velocity_mps: 0.0,
  y_m: 0,
  x_m: 0.0,
  status: "sky diving",
  time_s: 0.0,
}


//لوحة الدخل
inputPanel.add(input, 'altitude_m', 0, 5486).step(0.01).onChange(() => {
  skydiver.position.y = input.altitude_m;
  helicopter.position.y = input.altitude_m;
  camera.position.y = input.altitude_m;
  light.position.y=input.altitude_m;

}); //1066m to 5486m irl
inputPanel.add(input, 'radius_parachute', 50, 450).step(1);
inputPanel.add(input, 'roh_parachute', 1.1, 2.6).step(0.1),
  inputPanel.add(input, 'k', 0.7, 1.4).step(0.1),
  inputPanel.add(input, 'mass_kg', 40, 120);
inputPanel.add(input, 'gravity', 0, 20).step(0.1);
inputPanel.add(input, 'thik' ,15,50).step(5).onChange(()=>{
  r=input.thik;
});

//لوحة الخرج
outputPanel.add(output, 'velocity_mps');
outputPanel.add(output, 'y_m');
outputPanel.add(output, 'x_m');
outputPanel.add(output, 'status');
outputPanel.add(output, 'time_s');
outputPanel.hide();

let isSimRunning = false;
let isParachuteOpened = false;
let h0 = input.altitude_m;
let g = 9.81; // m/s^2 
let m_skydriver = input.mass_kg;
let m_parachute = 10;
let m_total = 50;
let k = 1;
let roh_parachute = input.roh_parachute;
let s = 0.8;
let radius = 10;
let a = 0;
let y0 = 0;
let v0 = 0;
let v = 0;
let y = h0;
let w = 10;
let vx=1;
let x0=0;
let x=0;
let tx=0;
let tt=0;
let r=input.thik;
let R=0;

//scene
const scene = new THREE.Scene();


//camera
const camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0.1, 200);
camera.position.set(0, h0, 20);
camera.zoom = 10;
camera.updateProjectionMatrix();

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// إضافة المصدر الضوئي
const color = 0xFFFFFF; // لون الضوء
const intensity = 5; // شدة الضوء
const light = new THREE.PointLight(color, intensity);
light.position.set(-2, h0, 50); // تحديد موقع المصدر الضوئي
scene.add(light);

//Create a helicopter model
var helicopter;
var loader = new GLTFLoader();
loader.load('./helicopter_model/scene.gltf', function (gltf) {
  helicopter = gltf.scene;
  helicopter.position.set(0, h0, 0);
  helicopter.scale.set(15, 15, 15);
  scene.add(helicopter);
});


// Create a skydiver model
var skydiver;
loader.load('./skydiver_model/scene.gltf', function (gltf) {
  skydiver = gltf.scene;
  
  skydiver.position.set(-1, h0, 0);
  skydiver.scale.set(0.6,0.6,0.6);
  skydiver.rotation.z=Math.PI/2;
  scene.add(skydiver);
});
//creat parachut model
var parachute;
loader.load('./parachute_model/scene.gltf', function (gltf) {
  parachute = gltf.scene;
  parachute.visible=false;
  parachute.position.set(-2, h0+4, 0);
  parachute.scale.set(1,1,1);
  scene.add(parachute);
});


//box
const sky = new THREE.Mesh(new THREE.BoxGeometry(window.innerWidth, window.innerHeight * 15, 30), new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('pz.png') }));
scene.add(sky);
sky.position.set(0, h0, -100);

//ground
const ground = new THREE.Mesh(new THREE.BoxGeometry(window.innerWidth, 35, 30), new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('grass1.png') }));
scene.add(ground);
ground.position.set(0, -35 / 2, -100);



//حساب مساحة المظلة 
function swathe_parachute(radius) {
  return (3.14 * radius * radius) / 10000;
}
//حساب حجم المظلة 
function volume_parachute(radius) {
  return ((2 / 3) * 3.14 * ((radius*radius*radius)-(R*R*R))) / 1000000;
}

//حساب كتلة المظلة 
function m_parachutee(roh, radius) {
  return roh * volume_parachute(radius);
}
//حساب مقاومة الهواء 
function fr(k, s, v) {
  return 0.5 * k * 1 * s * v * v;
}
//محصلة القوى 
function sigma(k, s, v, w) {
  return w - fr(k, s, v);
}
function v_after_land(v0,t0){
  return v0-(0.6*g*t0);
}

function openParachute() {
  isParachuteOpened = true;
  parachute.visible=true;
  skydiver.rotation.z= 2*(Math.PI);
  skydiver.position.x=-2;
  s = swathe_parachute(radius);
  k = 1.5;
 
 
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
  if (keyboard['KeyP']) {
    isSimRunning = true;
    inputPanel.hide();
    outputPanel.domElement.style.display = "block";
    skydiver.position.y = input.altitude_m;
    helicopter.position.y = input.altitude_m;
    camera.position.y = input.altitude_m;
    h0 = input.altitude_m;
    y = input.altitude_m;
    k = input.k;
    g = input.gravity;
    m_skydriver = input.mass_kg;
    roh_parachute = input.roh_parachute;
    radius = input.radius_parachute;
    R=radius-r;
    //حساب الكتلة الكلية
    m_parachute = m_parachutee(roh_parachute, radius);
    m_total = (m_parachute) + m_skydriver;
    console.log('m_parachute=' + m_parachute);
    console.log("m_total="+m_total);
    console.log("R="+R);
    //حساب قوة الثقل 
    w = m_total * g;
  }

  if (keyboard['KeyQ']) {
    openParachute();
  }
}




//function that repeats 60 times every second
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  handleKeyboardInput();
  
  if (input.altitude_m > 0 && isSimRunning && vx>0.1) {
    
    if (output.y_m>=0) {
    a = sigma(k, s, v0, w) / m_total;
    console.log("a=" + a);
    console.log("s=" + s);
    output.velocity_mps = v0 + (a * 0.016);
    y = h0 - (y0 + (output.velocity_mps * 0.016));
    skydiver.position.y = output.y_m;
    parachute.position.y=output.y_m;
    light.position.y=output.y_m;
    output.y_m = y;
    console.log("y="+y);


    if (output.y_m > 40) camera.position.y = output.y_m - 20;

    if (output.y_m > 0) {output.time_s += 0.016;
      tt=output.time_s;
    }    
    


    y0 = y0 + (output.velocity_mps * 0.016);
    v0 = output.velocity_mps;
    

  }
  else{
    vx=v_after_land(v0,tx);
    console.log(v_after_land(v0,tx));
    x = x0 + (vx * 0.016);
    x0 = x0 + (vx* 0.016);
    tx+=0.016;
    output.time_s =tt+ tx;
    output.x_m=x;
    output.velocity_mps=vx;
     camera.position.x = x;
     skydiver.position.x=x;
     parachute.rotation.z=(Math.PI)/2;
     parachute.position.x=x;
    console.log("tx="+tx);
    
    console.log("x="+x);
    console.log("vx="+vx);
  
  }
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



