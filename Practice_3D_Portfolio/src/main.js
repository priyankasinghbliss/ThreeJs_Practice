import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. Create a scene
const scene = new THREE.Scene();


// 2. Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.setZ(30);

// 3. Create an Object
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// 4. Add lights
const pointLight = new THREE.PointLight(0xFFFFFF, 250);
pointLight.position.set(0, 0, 0);
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 2);
scene.add(pointLight, ambientLight);
//const lightHelper = new THREE.PointLightHelper(pointLight);
//scene.add(lightHelper);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

// Function to generate stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(300).fill().forEach(addStar);

// Add a background texture

//const spaceTexture = new THREE.TextureLoader().load('src/assets/space.jpg');
//scene.background = spaceTexture;

// Use onLoad() callback to ensure texture is loaded
const loader = new THREE.TextureLoader();
loader.load('src/assets/space.jpg', function(texture) {
  texture.encoding = THREE.sRGBEncoding;
  scene.background = texture;
});

// Avatar

const avatarTexture = new THREE.TextureLoader().load('src/assets/avatar.jpg');
const avatar = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: avatarTexture })
)

scene.add(avatar);

// Moon
const moonTexture = new THREE.TextureLoader().load('src/assets/moon.jpg');
const normalTexture = new THREE.TextureLoader().load('src/assets/normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(1.5, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);
moon.position.z = 60;
moon.position.setX(-2);

// 5. Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;

// 6. Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// 7. Animate
function animate() {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
  renderer.render(scene, camera);
}

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  
  // Move the camera based on scroll position
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  avatar.rotation.y += 0.01;
  avatar.rotation.z += 0.01;

  camera.position.z = t * -0.01 + 30;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

animate();