import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入gsap动画库
import gsap from "gsap";
// 导入dat.gui（ui界面控制库）
import * as dat from "dat.gui";

// 1.创建场景
const scene = new THREE.Scene();

// 2.创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// 3.设置相机位置
camera.position.set(0, 0, 10);
scene.add(camera);

// 4.添加几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

// 5.定义材质
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

// 6.根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

// 7.将物体添加到场景
scene.add(cube);

// 8.初始化渲染器
const renderer = new THREE.WebGLRenderer();

// 9.设置渲染尺寸
renderer.setSize(window.innerWidth, window.innerHeight);

// 10.将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

// 11.创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，让控制器更具真实感
controls.enableDamping = true;

// 12. 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 13.物体缩放
cube.scale.set(1, 2, 2);

// 14.设置动画
const animate1 = gsap.to(cube.position, {
  x: 5, // 修改属性
  duration: 5, // 动画时长
  ease: "power1.inOut", // 动画执行曲线
  repeat: -1, // 设置重复次数，-1为一直循环
  yoyo: true, // 往返运动
  delay: 2, // 延迟
  onStart: () => {
    // 动画开始回调
    console.log("动画开始");
  },
  onComplete: () => {
    // 动画结束回调
    console.log("动画完成");
  },
});
gsap.to(cube.rotation, { x: Math.PI * 2, duration: 5, ease: "power1.inOut" });

// 15.控制动画
window.addEventListener("keydown", (e) => {
  if (e.code !== "Space") return;
  if (animate1.isActive()) {
    // 暂停
    animate1.pause();
  } else {
    // 恢复
    animate1.resume();
  }
});

// 16.监听页面大小，更新渲染画面
window.addEventListener("resize", () => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新摄像机的投影矩阵
  camera.updateProjectionMatrix();
  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});

// 17.控制页面全屏
// window.addEventListener("dblclick", () => {
//   if (document.fullscreenElement) {
//     document.exitFullscreen();
//   } else {
//     renderer.domElement.requestFullscreen();
//   }
// });

// 18.gui属性控制器 修改物体位置
const gui = new dat.GUI();
gui
  .add(cube.position, "x")
  .min(0)
  .max(5)
  .step(0.01)
  .name("x轴坐标")
  .onFinishChange((value) => {
    console.log(value);
  });

// 19.修改物体颜色
const params = {
  color: "#ffff00",
  fn: () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      renderer.domElement.requestFullscreen();
    }
  },
};
gui.addColor(params, "color").onChange((value) => {
  cube.material.color.set(value);
});

// 20.添加控件文件夹
const folder = gui.addFolder("设置立方体");

// 21.控制物体显隐
folder.add(cube, "visible").name("是否显示");

// 22.控制wireframe
folder.add(cube.material, "wireframe");

// 23.控制全屏
gui.add(params, "fn").name("全屏");

// 使用渲染器，通过相机将场景渲染进来
render();

function render() {
  controls.update(); // 设置阻尼后每次渲染都需要update
  renderer.render(scene, camera);
  // 渲染下一帧的时候调用render函数
  requestAnimationFrame(render);
}
