import * as THREE from 'three';
import { SphereGeometry } from 'three';
import { GridHelper } from 'three';
import { PlaneGeometry } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const renderer = new THREE.WebGLRenderer();

// settings the render to occupy the whole screen
renderer.setSize(window.innerWidth, window.innerHeight);

// inject the space
document.body.appendChild(renderer.domElement);

//creating a scene
const scene = new THREE.Scene();

// creating a camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// mouse event
const orbit = new OrbitControls(camera, renderer.domElement);

// linking co-ordinates
const axesHelper = new THREE.AxesHelper(6);
// 5 - length of the axes

// add axeshelper to scene
scene.add(axesHelper);

// update the position of camera (x, y , z)
camera.position.set(-10, 30, 30);

// update orbit to change the position of camera
orbit.update();

//adding box to the scene
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
const box = new THREE.Mesh(boxGeometry, boxMaterial);

//adding box to scene
scene.add(box);

// sorrounded material
const planeGeometry = new PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 'white',
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

// adding plane to scene
scene.add(plane);

// make the grid match the plane
plane.rotation.x = -0.5 * Math.PI;

// adding grid Helper
// 1st params -  30 - increasing the surface(size) of grid
// 2nd params - 100 - make the grid to smaller squares
const gridHelper = new GridHelper(30);

// adding grid helper to scene
scene.add(gridHelper);

//adding sphere to scene
const sphereGeometry = new SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 'blue',
  wireframe: true,
});

// checking with Standard  material
// standard does not have light source - need to provide light
// const sphereMaterial = new THREE.MeshStandardMaterial({
//   color: 'blue',
//   wireframe: false,
// });

// checking with Lambert  material
// standard does not have light source - need to provoide light
// const sphereMaterial = new THREE.MeshLambertMaterial({
//   color: 'blue',
//   wireframe: false,
// });

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

// add sphere to scene
scene.add(sphere);

// change the position of sphere
sphere.position.x = -10;
// another way - use set method
sphere.position.set(-10, 10, 0);

// making sphere to bounce
let step = 0;
let speed = 0.01;

//geometric transformation
const animateBox = (time) => {
  box.rotation.x = time / 1000;
  box.rotation.y = time / 1000;

  step += speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step));
  // linking scene with camera
  renderer.render(scene, camera);
};

renderer.setAnimationLoop(animateBox);

// // linking scene with camera
// renderer.render(scene, camera);
