import * as THREE from 'three';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import TextSprite from '@seregpie/three.text-sprite';



const inputPanel = new dat.GUI({width: 300 });
inputPanel.hide();
const outputPanel = new dat.GUI({width:400});
// // إنشاء كائن GUI جديد
 var gui = new dat.GUI();
gui.domElement.style.position='fixed';
gui.hide();
// إنشاء كائن يحتوي على الخيارات التي سيتم عرضها في القائمة المنسدلة
var options = {
  Option1: function() {
    shape_of_parachute=false;
    console.log("shapw="+ shape_of_parachute);
    console.log("Option 1 selected");
  },
  Option2: function() {
    shape_of_parachute=true;
    console.log("shapw="+ shape_of_parachute);
    console.log("Option 2 selected");
  },
};
// إضافة قائمة منسدلة إلى GUI
var opstion_1=gui.add(options, "Option1").name("شكل المظلة نصف كرة ").onChange(()=>{
  panlecolor=11;
  changecolor();
});
var opstion_2=gui.add(options, "Option2").name("شكل المظلة  مستطيل ").onChange(()=>{
  panlecolor=22;
  changecolor();
});

const input = {
  altitude_m: 0,
  mass_kg: 40,
  radius_parachute: 50,
  k: 0.7,
  gravity: 9.81,
  thik:15,
  per_tall:100,
  per_wid:30,
  parachute_tall:100,
  parachute_width:20,
  per_thik:25,

  roh_1: () => {
    roh_parachute=1.15;
    console.log("roh 1")
},
roh_2: () => {
  
  roh_parachute=1.40;
  console.log("roh 2")
},
roh_3: () => {
  
  roh_parachute=1.45;
  console.log("roh 3")
},
roh_4: () => {
  
  roh_parachute=1.95;
  console.log("roh 4")
},
roh_5: () => {
  
  roh_parachute=2.6;
  console.log("roh 5")
},
roh_6: () => {
  roh_parachute=1.3;
  console.log("roh 6")
},
};
const rohs = gui.addFolder('المادة المصنوع منها المظلة ');
rohs.open();
rohs.hide();

const output = {
  velocity_mps: 0.0,
  y_m: 0,
  x_m: 0.0,
  status: "sky diving",
  time_s: 0.0,
  mtotal:0.0,
  mparachute:0.0,
  mpersone:0.0,
  statle:0.0,
  rparachute:0.0,
  sparachute:0.0,
  vpatachute:0.0,
  rohparachute:0.00,
  spersone:0.0,
  fr:0,
  mg:0,
 sigma:0,
 mv:0,
 
}

var roh_1=rohs.add(input, 'roh_1').name('نايلون').onChange(()=>{
  panlecolor=1;
  changecolor();
  
});

var roh_2=rohs.add(input, 'roh_2').name('بولستر').onChange(()=>{
  panlecolor=2;
  changecolor();
  
});
var roh_3=rohs.add(input, 'roh_3').name('الكيفلار').onChange(()=>{
  panlecolor=3;
  changecolor();
  
});
var roh_4=rohs.add(input, 'roh_4').name('كاربون فايبر').onChange(()=>{
  panlecolor=4;
  changecolor();
  
});
var roh_5=rohs.add(input, 'roh_5').name('ألياف زجاجية').onChange(()=>{
  panlecolor=5;
  changecolor();
  
});
var roh_6=rohs.add(input, 'roh_6').name('البولي بوريتين').onChange(()=>{
  panlecolor=6;
  changecolor();
  
});
//لوحة الدخل
inputPanel.add(input, 'altitude_m', 0, 5486).step(0.01).name("ارتفاع الطائرة").onChange(() => {
  skydiver.position.y = input.altitude_m;
  helicopter.position.y = input.altitude_m;
  camera.position.y = input.altitude_m;
  light.position.y=input.altitude_m;

});
inputPanel.add(input, 'radius_parachute', 50, 450).step(1).name(" نصف قطر المظلة بال سم");
  inputPanel.add(input, 'k', 0.7, 1.4).step(0.1).name("ثابت السحب ");
  inputPanel.add(input, 'mass_kg', 40, 1000).step(1).name("وزن المظلي بالكيلو ");
inputPanel.add(input, 'gravity', 0, 20).step(0.1).name(" قوة الجاذبية ");
inputPanel.add(input, 'thik' ,0,200).step(1).name("ثخانة المظلة بال سم ").onChange(()=>{
  r=input.thik;
});
inputPanel.add(input,'parachute_tall',0,1000).step(1).name("طول المظلة المستطيلة  بال سم");
inputPanel.add(input,'parachute_width',0,1000).step(1).name(" عرض المظلة المستطيلة  بال سم");
inputPanel.add(input,'per_tall',0,200).step(1).name("طول الشخص  بال سم");
inputPanel.add(input,'per_wid',3,200).step(1).name("عرض الشخص  بال سم");
inputPanel.add(input,'per_thik',5,200).step(1).name("ثخانة الشخص بال سم ");
//لوحة الخرج

outputPanel.add(output, 'time_s').name(' الزمن الحالي بالثانية');
outputPanel.add(output, 'velocity_mps').name(" السرعة متر/ثانية^2");
outputPanel.add(output, 'y_m').name(' بالمترyموضع الجسم الحالي على ');
outputPanel.add(output, 'x_m').name(' بالمترxموضع الجسم الحالي على');
outputPanel.add(output,'fr' ).step(0.001).name('Nقوة مقاومة الهواء');
outputPanel.add(output, 'mg').step(0.001).name(' Nقوة الثقالة ');
outputPanel.add(output, 'sigma').step(0.1).name('Nمحصلة القوى');
outputPanel.add(output, 'mv').step(0.1).name('تناقص السرعة ');
outputPanel.add(output,'statle').step(0.001).name('مساحة السطح المجابه للهواء بالمتر');
outputPanel.add(output, 'sparachute').step(0.001).name('مساحة المظلة بالمتر ');
outputPanel.add(output, 'spersone').step(0.001).name(' المساحة الحالية للشخص بالمتر');
outputPanel.add(output,'mtotal' ).step(0.001).name('الوزن الكلي بالكيلو');
outputPanel.add(output,'mparachute' ).step(0.001).name('وزن المظلة');
outputPanel.add(output,'mpersone' ).step(0.001).name('وزن الشخص بالكيلو');
outputPanel.add(output,'rohparachute' ).step(0.001).name('الكتلة الحجمية للمظلة ');
outputPanel.add(output,'vpatachute' ).step(0.00001).name('حجم المظلة بالمتر^3 ');
outputPanel.add(output, 'status').name('حالة المظلي بعد الهبوط');
outputPanel.hide();

let panlecolor=0;
let shape_of_parachute= false;
let isSimRunning = false;
let isParachuteOpened = false;
let h0 = input.altitude_m;
let g = 9.81; // m/s^2 
let m_skydriver = input.mass_kg;
let m_parachute = 10;
let m_total = 50;
let k = 1;
let roh_parachute =1.15;
let s = (input.per_tall*input.per_wid)/10000;
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
const light = new THREE.PointLight(color, intensity);//نوع الضوء 
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

//شاشة الترحيب

const testt = new THREE.Mesh(new THREE.BoxGeometry(window.innerWidth, window.innerHeight, 30), new THREE.MeshBasicMaterial({ color:0x000000}));
scene.add(testt);
testt.position.set(0, 200, -10);
/////////////////////نص الترحيب


let sprite = new TextSprite( {
                               text: 'هذه محاكاة لهبوط مظلي\n الهدف منها مراقبة تغيير سرعة سقوط المظلي بتغيير ابعاد المظلة و المظلي\n sلذلك لتبدأ بهذه المحاكاة عليك الضغط على \nو من ثم اختيار المدخلات\n و نحيطك علما أن ارتفاع الطائرة من المدخلات الاجبارية فلن تبدا المحاكات اذا كان الارتفاع صفر\n P بعد اختيار المدخلات اضغط  \n Qليبدا المظلي بالسقوط و لفتح المظلة في اي لحظة اضغط',
                          alignment: 'center',
                         fontFamily: 'Arial, Helvetica, sans-serif',
                           fontSize: 4.8,
                              color: '#FFFFFF' } );
 sprite.position.set(0,0,10);
scene.add( sprite );
//شاشة توقف ناجح

const testt1 = new THREE.Mesh(new THREE.BoxGeometry(window.innerWidth, window.innerHeight, 30), new THREE.MeshBasicMaterial({ color:0x00FF00}));
scene.add(testt1);
testt1.position.set(0, 200, -100);
//////////////////نص توقف ناجح

let sprite1 = new TextSprite( {
                               text: 'مرحى\nاختيارك موفق فقد هبط المظلي بامان \n مرتينH ولمعرفة مدخلاتك اضغط على  ',
                          alignment: 'center',
                         fontFamily: 'Arial, Helvetica, sans-serif',
                           fontSize: 4.8,
                              color: '#000000' } );
 sprite1.position.set(0,0,-100);
scene.add( sprite1 );

//شاشة توقف غير ناجح 

const testt2 = new THREE.Mesh(new THREE.BoxGeometry(window.innerWidth, window.innerHeight, 30), new THREE.MeshBasicMaterial({ color:0xFF0000}));
scene.add(testt2);
testt2.position.set(0, 200, -100);
//////////////////نص توقف مع اصابة 

let sprite2 = new TextSprite( {
                               text:'اوبس\nلقد هبط المظلي بسرعة عالية \nفتعرض لاصابة خطرة \n F5مرتين ولاعادة التجربة Hلمعرفة المدخلات و المخرجات اضغط ',
                          alignment: 'center',
                         fontFamily: 'Arial, Helvetica, sans-serif',
                           fontSize: 4.8,
                              color: '#000000' } );
 sprite2.position.set(0,0,-100);
scene.add( sprite2 );
/////////////////نص توقف مع موت 

let sprite3 = new TextSprite( {
  text:'للأسف\nلقد هبط المظلي بسرعة هستيرية \nفتعرض للموت \n F5مرتين ولاعادة التجربة Hلمعرفة المدخلات و المخرجات اضغط ',
alignment: 'center',
fontFamily: 'Arial, Helvetica, sans-serif',
fontSize: 4.8,
 color: '#000000' } );
sprite3.position.set(0,0,-100);
scene.add( sprite3 );

//creat parachut model
var parachute;
loader.load('./parachute_model/scene.gltf', function (gltf) {
  parachute = gltf.scene;
  parachute.visible=false;
  parachute.position.set(-2, h0+4, 0);
  parachute.scale.set(1,1,1);
  scene.add(parachute);
});


//sky back ground
const sky = new THREE.Mesh(new THREE.BoxGeometry(window.innerWidth, window.innerHeight, 30), new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('pz.png') }));
scene.add(sky);
sky.position.set(0, 200, -100);
//sky2
const sky2 = new THREE.Mesh(new THREE.BoxGeometry(window.innerWidth, window.innerHeight*5, 20), new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('pz.png') }));
scene.add(sky2);
sky2.position.set(0, 580, -120);
//sky3
const sky3 = new THREE.Mesh(new THREE.BoxGeometry(window.innerWidth, window.innerHeight*4, 19), new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('pz.png') }));
scene.add(sky3);
sky3.position.set(0, 2500, -120);
//sky4
const sky4 = new THREE.Mesh(new THREE.BoxGeometry(window.innerWidth, window.innerHeight*4, 18), new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('pz.png') }));
scene.add(sky4);
sky4.position.set(0, 4050, -120);

//ground
const ground = new THREE.Mesh(new THREE.BoxGeometry(window.outerWidth, 35, 30), new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('grass1.png') }));
scene.add(ground);
ground.position.set(0, -35 / 2, -100);

//تغيير لون الخيار 
function changecolor(){
  if (panlecolor==1){ roh_1.__li.style.backgroundColor = '#FF0022';
  roh_2.__li.style.backgroundColor = '#1A1A1A';
  roh_3.__li.style.backgroundColor = '#1A1A1A';
  roh_4.__li.style.backgroundColor = '#1A1A1A';
  roh_5.__li.style.backgroundColor = '#1A1A1A';
  roh_6.__li.style.backgroundColor = '#1A1A1A';
}
  else if (panlecolor==2){roh_2.__li.style.backgroundColor = '#FF0022';
     roh_1.__li.style.backgroundColor = '#1A1A1A';
     roh_3.__li.style.backgroundColor = '#1A1A1A';
     roh_4.__li.style.backgroundColor = '#1A1A1A';
     roh_5.__li.style.backgroundColor = '#1A1A1A';
     roh_6.__li.style.backgroundColor = '#1A1A1A';}
  else if (panlecolor==3){roh_3.__li.style.backgroundColor = '#FF0022';
  roh_2.__li.style.backgroundColor = '#1A1A1A';
  roh_1.__li.style.backgroundColor = '#1A1A1A';
  roh_4.__li.style.backgroundColor = '#1A1A1A';
  roh_5.__li.style.backgroundColor = '#1A1A1A';
  roh_6.__li.style.backgroundColor = '#1A1A1A';}
  else if (panlecolor==4){roh_4.__li.style.backgroundColor = '#FF0022';roh_2.__li.style.backgroundColor = '#1A1A1A';
  roh_3.__li.style.backgroundColor = '#1A1A1A';
  roh_1.__li.style.backgroundColor = '#1A1A1A';
  roh_5.__li.style.backgroundColor = '#1A1A1A';
  roh_6.__li.style.backgroundColor = '#1A1A1A';}
  else if (panlecolor==5){roh_5.__li.style.backgroundColor = '#FF0022';roh_2.__li.style.backgroundColor = '#1A1A1A';
  roh_3.__li.style.backgroundColor = '#1A1A1A';
  roh_4.__li.style.backgroundColor = '#1A1A1A';
  roh_1.__li.style.backgroundColor = '#1A1A1A';
  roh_6.__li.style.backgroundColor = '#1A1A1A';}
  else if (panlecolor==6){roh_6.__li.style.backgroundColor = '#FF0022';roh_2.__li.style.backgroundColor = '#1A1A1A';
  roh_3.__li.style.backgroundColor = '#1A1A1A';
  roh_4.__li.style.backgroundColor = '#1A1A1A';
  roh_5.__li.style.backgroundColor = '#1A1A1A';
  roh_1.__li.style.backgroundColor = '#1A1A1A';}
  else if(panlecolor==11){opstion_1.__li.style.backgroundColor = '#FF0022';
  opstion_2.__li.style.backgroundColor = '#1A1A1A';}
  else if(panlecolor==22){opstion_2.__li.style.backgroundColor = '#FF0022';
  opstion_1.__li.style.backgroundColor = '#1A1A1A';}
  else return;
}

//حساب مساحة المظلة 
function swathe_parachute(radius) {
  if (shape_of_parachute==false){
  return (3.14 * radius * radius) / 10000;
  }
  else if(shape_of_parachute==true){
    return (input.parachute_tall*input.parachute_width)/10000;
  }
  else return 0;
}
//حساب حجم المظلة 
function volume_parachute(radius) {
  if(shape_of_parachute==false){
  return ((2 / 3) * 3.14 * ((radius*radius*radius)-(R*R*R))) / 1000000;
}else if(shape_of_parachute==true){
  return (input.parachute_tall*input.parachute_width*input.thik)/1000000;
}else return 0;

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
  output.sparachute=s;
  output.spersone=(input.per_wid*input.per_thik)/10000;
  output.statle=(s)+((input.per_wid*input.per_thik)/10000);
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
  if(keyboard['KeyS']){
    testt.position.z=-200;
    inputPanel.domElement.style.display = "block";
    rohs.domElement.style.display = "block";
    gui.domElement.style.display = "block";
    sprite.position.z=-100;
  }
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
    output.mpersone=input.mass_kg;
    output.rohparachute=roh_parachute;
    console.log("roh="+roh_parachute);
    output.rparachute=input.radius_parachute;
    output.spersone=((input.per_tall*input.per_wid)/10000);
    m_skydriver = input.mass_kg;
    radius = input.radius_parachute;
    R=radius-r;
    //حساب الكتلة الكلية
    m_parachute = m_parachutee(roh_parachute, radius);
    output.vpatachute=volume_parachute(radius);
    output.mparachute=m_parachute;
    m_total = (m_parachute) + m_skydriver;
    output.mtotal=m_total;
    console.log('m_parachute=' + m_parachute);
    console.log("m_total="+m_total);
    console.log("R="+R);
    //حساب قوة الثقل 
    w = m_total * g;
    output.mg = w;
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
    output.sigma=a*m_total;
    output.fr=fr(k,s,v0);
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
   
    if(8.94<v0 && v0<=17.88){
      output.status='اصابة خطرة'
  testt2.position.z=-10
  sprite2.position.z=10
  }
    if(v0>17.88){output.status='الموت';
  testt2.position.z=-10;
  sprite3.position.z=10;

  }
  else{
  if(v0<8.94)output.status="الهبوط امن";
  camera.position.x = x;
    vx=v_after_land(v0,tx);
    output.mv=(0.6*g*tx);
    console.log(v_after_land(v0,tx));
    x = x0 + (vx * 0.016);
    x0 = x0 + (vx* 0.016);
    tx+=0.016;
    output.time_s =tx+tt;
    output.x_m=x;
    output.velocity_mps=vx;
     
     skydiver.position.x=x;
     sprite1.position.x=x-2;
     sprite2.position.x=x-2;
     sprite3.position.x=x-2;
     parachute.rotation.z=(Math.PI)/2;
     parachute.position.x=x;
    if(vx>0&&vx<0.1&&v0<8.94){
      testt1.position.z=-10;
      sprite1.position.z=10;
    }
  }
  
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



