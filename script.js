var Player = {
  speed:0.02,
  rotationSpeed:0.01,
  cameraMovement:new THREE.Vector3(0,0,0),
  cameraRotation:new THREE.Vector3(0,0,0)
}
var keysPressed = {
};
var cursorPosition = {x:0,y:0};
document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);
function onMouseUpdate(e) {
  cursorPosition.x = e.pageX - (window.innerWidth/2);
  cursorPosition.y = e.pageY - (window.innerHeight/2);
}

document.addEventListener('keydown', function (e) {
  	e = e || window.event;

    keysPressed[e.code] = true;

});
document.addEventListener('keyup', (e) => {
  keysPressed[e.code] = false;
});


var time = 0;

var scene = new THREE.Scene();
scene.background = new THREE.Color(0x10182D);
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({alpha:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var light = new THREE.DirectionalLight( 0xf0f0f0 );
light.position.set(-1,2,2).normalize();
scene.add(light)

var planet = createSphere(1.6);
scene.add(planet);
var moon = createSphere(0.3,0x7F7CFF);
scene.add(moon);
var amogs = createSphere(0.5,0x7F7CFF,{x:2,y:2,z:-3});
scene.add(amogs);
resetCamera();


function createSphere(radius,color = 0xff528e,center = {x:0,y:0,z:0}) {
  var geometry = new THREE.SphereGeometry(radius,96,48);

  var pos = geometry.attributes.position;
  var smoothness = radius;
  for (var i = 0; i < pos.count; i++) {
    var x = pos.getX(i);
    var y = pos.getY(i);
    var z = pos.getZ(i);
    x += (Math.random()/smoothness) / 20;
    y += (Math.random()/smoothness) / 20;
    z += (Math.random()/smoothness) / 20;
    pos.setXYZ(i, x, y, z);
  }

  var material = new THREE.MeshPhongMaterial({
    color:color,
    shininess:0,
    flatShading:1,
    emissive:0x4b4c77,
    specular:0x000000,
    map: new THREE.TextureLoader().load("resources/img/terrain.png")
  });
  var sphere = new THREE.Mesh(geometry,material);
  sphere.position.x = center.x;
  sphere.position.y = center.y;
  sphere.position.z = center.z;
  return sphere;
}
function orbitObject(satellite,parent,orbit,speed) {
  satellite.position.x = orbit * Math.cos(time / 1000 * speed);
  satellite.position.y = orbit * Math.sin(time / 1000 * speed);
}
function rotateObject(mesh,speedX = 0,speedY = 0,speedZ = 0) {
  mesh.rotation.x += speedX / 1000;
  mesh.rotation.y += speedY / 1000;
  mesh.rotation.y += speedZ / 1000;
}
function resetCamera() {
  camera.position.x = 2;
  camera.position.y = 0;
  camera.position.z = 5;
  camera.rotation.x = 0;
  camera.rotation.y = 0;
  camera.rotation.z = 0;
}
function updateCamera() {
  Player.cameraAcceleration = new THREE.Vector3(
    keysPressed.KeyD ? Player.accel : keysPressed.KeyA ? -Player.accel : Player.decel,
    keysPressed.Space ? Player.accel : keysPressed.ShiftLeft ? -Player.accel : Player.decel,
    keysPressed.KeyS ? Player.accel : keysPressed.KeyW ? -Player.accel : Player.decel,
  );
  if (keysPressed.KeyQ) {
    Player.cameraRotation = new THREE.Vector3(
      cursorPosition.y / -100000,
      cursorPosition.x / -100000,
      0,
    );
  } else {
    Player.cameraRotation = new THREE.Vector3(0,0,0);
  }
  if (keysPressed.KeyR) {
    resetCamera();
  }

  Player.cameraSpeed = new THREE.Vector3(
    clamp(Player.cameraSpeed.x, 0, Player.maxAccel),
    clamp(Player.cameraSpeed.y, 0, Player.maxAccel),
    clamp(Player.cameraSpeed.z, 0, Player.maxAccel),
  )

  camera.position.x += Player.cameraSpeed.x;
  camera.position.y += Player.cameraSpeed.y;
  camera.position.z += Player.cameraSpeed.z;
  camera.rotation.x += Player.cameraRotation.x;
  camera.rotation.y += Player.cameraRotation.y;
  camera.rotation.z += Player.cameraRotation.z;
}
function clamp(number, min, max) {
   return Math.max(min, Math.min(number, max));
 }
function animate() {
  orbitObject(moon,planet,2.5,10);
  rotateObject(moon,3,2)
  updateCamera();
  time += 1;

	requestAnimationFrame(animate);
	renderer.render(scene,camera);
};

animate();
