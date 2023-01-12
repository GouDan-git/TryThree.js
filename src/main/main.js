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

const floorGeometry = new THREE.PlaneGeometry(5, 5, 500, 500);
const floorMaterial = new THREE.MeshStandardMaterial();
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.set(0, -1, 0);
floor.rotation.x = -0.5 * Math.PI;
// 4.设置平面能够接收阴影
floor.receiveShadow = true;
scene.add(floor);

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
// 3.设置物体能够投射阴影
sphere.castShadow = true;
scene.add(sphere);

const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
// 2.设置光照投射阴影
directionalLight.castShadow = true;
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

// 1.开启场景中的阴影贴图
renderer.shadowMap.enabled = true;

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
