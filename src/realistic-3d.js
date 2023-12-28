import * as THREE from 'three';
import { SphereGeometry } from 'three';
import { MeshStandardMaterial } from 'three';
import { Mesh } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

// creating kitchenHDR image
// adding import.meta.url to have the HDR to parcel on save
const kitchenHDR = new URL(
  './assets/hdr-image/MR_INT-003_Kitchen_Pierre.hdr',
  import.meta.url
);

const industrialWindow = new URL(
  './assets/hdr-image/MR_INT-006_LoftIndustrialWindow_Griffintown.hdr',
  import.meta.url
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sets the color of the background
renderer.setClearColor(0xfefefe);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Sets orbit control to move the camera around
const orbit = new OrbitControls(camera, renderer.domElement);

// Camera positioning
camera.position.set(0, 0, 7);
orbit.update();

// renderer.outputEncoding = THREE.sRGBEncoding;

// tone mapping - adjust image tone to get better image results
renderer.toneMapping = THREE.ACESFilmicToneMapping;

// adjust exposure to tonemapping
renderer.toneMappingExposure = 1.8;

// creating instance of rgbe loader
// callback function
const rgbeLoader = new RGBELoader();
rgbeLoader.load(kitchenHDR, (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  // add light to spheres
  scene.environment = texture;

  const sphereGeometry_1 = new SphereGeometry(1, 60, 60);
  const sphereMaterial_1 = new MeshStandardMaterial({
    // removing roughness in the material
    roughness: 0,
    // make metalistic appearence - transparent
    metalness: 1,
    color: 0xffea00, // yellow
  });

  const sphere_1 = new Mesh(sphereGeometry_1, sphereMaterial_1);
  scene.add(sphere_1);

  sphere_1.position.x = 1.5;

  const sphereGeometry_2 = new SphereGeometry(1, 60, 60);
  const sphereMaterial_2 = new MeshStandardMaterial({
    // removing roughness in the material
    roughness: 0,
    // make metalistic appearence - transparent
    metalness: 1,
    color: 0x00ff00, // green
    envMap: texture,
  });

  const sphere_2 = new Mesh(sphereGeometry_2, sphereMaterial_2);
  scene.add(sphere_2);
  sphere_2.position.x = -1.5;

  const sphereGeometry_3 = new SphereGeometry(1, 60, 60);
  const sphereMaterial_3 = new MeshStandardMaterial({
    // removing roughness in the material
    roughness: 0,
    // make metalistic appearence - transparent
    metalness: 0.8,
    color: 0x00ff00, // green
    envMap: texture,
  });

  const sphere_3 = new Mesh(sphereGeometry_3, sphereMaterial_3);
  //   scene.add(sphere_3);
  sphere_3.position.x = -4.5;
});

function animate() {
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
