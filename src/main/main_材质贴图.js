import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 10);
scene.add(camera);

const wallGeometry = new THREE.PlaneGeometry(5, 5, 500, 500);
const floorGeometry = new THREE.PlaneGeometry(5, 5, 500, 500);

const event = {};
event.onLoad = function () {
  console.log("加载完成");
};
event.onProgress = function (url, num, total) {
  console.log(url, num, total, "加载进度");
};
event.onError = function (url) {
  console.log("错误");
};

// 监听资源加载进度
const loadingManager = new THREE.LoadingManager(
  event.onLoad,
  event.onProgress,
  event.onError
);

const textureLoader = new THREE.TextureLoader(loadingManager);

const wallColorTexture = textureLoader.load("./imgs/wall/color.jpg");
// const wallAoTexture = textureLoader.load("./imgs/wall/ao.jpg");
const wallDispTexture = textureLoader.load("./imgs/wall/disp.jpg");
const wallReflTexture = textureLoader.load("./imgs/wall/refl.jpg");
const wallNrmTexture = textureLoader.load("./imgs/wall/nrm.png");

const floorColorTexture = textureLoader.load("./imgs/floor/color.jpg");
const floorAoTexture = textureLoader.load("./imgs/floor/ao.jpg");
const floorDispTexture = textureLoader.load("./imgs/floor/disp.jpg");
const floorReflTexture = textureLoader.load("./imgs/floor/refl.jpg");
const floorNrmTexture = textureLoader.load("./imgs/floor/nrm.png");

// 构建墙面材质
const wallMaterial = new THREE.MeshStandardMaterial({
  map: wallColorTexture,
  // aoMap: wallAoTexture,
  // aoMapIntensity: 1,
  displacementMap: wallDispTexture,
  displacementScale: 0.1,
  roughnessMap: wallReflTexture,
  roughness: 0.1, // 与roughnessMap相乘
  normalMap: wallNrmTexture,
});

// 构建地板材质
const floorMaterial = new THREE.MeshStandardMaterial({
  map: floorColorTexture,
  aoMap: floorAoTexture,
  aoMapIntensity: 1,
  displacementMap: floorDispTexture,
  displacementScale: 0.01,
  roughnessMap: floorReflTexture,
  roughness: 1, // 与roughnessMap相乘
  normalMap: floorNrmTexture,
});

const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
wall1.position.set(2.5, 2.5, 0);
scene.add(wall1);

const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
wall2.position.set(0, 2.5, 2.5);
wall2.rotation.y = 0.5 * Math.PI;
scene.add(wall2);

const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.set(2.5, 0, 2.5);
floor.rotation.x = -0.5 * Math.PI;
scene.add(floor);

// aoMap环境遮挡贴图需要第二组uv
wallGeometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(wallGeometry.attributes.uv.array, 2)
);

floorGeometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(floorGeometry.attributes.uv.array, 2)
);

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

render();

function render() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
