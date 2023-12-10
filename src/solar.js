import * as THREE from 'three';
import { SphereGeometry } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  Earth,
  Jupiter,
  Mars,
  Mercury,
  Neptune,
  Pluto,
  Saturn,
  SaturnRing,
  Stars,
  Sun,
  Uranus,
  UranusRing,
  Venus,
} from './assets/assetsList';

const planets = {
  mercury: {
    size: 3.2,
    texture: Mercury,
    position: 28,
    mapSunRotateY: 0.004,
    planetRotateY: 0.04,
  },
  venus: {
    size: 5.8,
    texture: Venus,
    position: 44,
    mapSunRotateY: 0.002,
    planetRotateY: 0.015,
  },
  earth: {
    size: 6,
    texture: Earth,
    position: 62,
    mapSunRotateY: 0.02,
    planetRotateY: 0.01,
  },
  mars: {
    size: 4,
    texture: Mars,
    position: 78,
    mapSunRotateY: 0.018,
    planetRotateY: 0.008,
  },
  jupiter: {
    size: 12,
    texture: Jupiter,
    position: 100,
    mapSunRotateY: 0.04,
    planetRotateY: 0.002,
  },
  saturn: {
    size: 10,
    texture: Saturn,
    position: 138,
    ring: {
      innerRadius: 10,
      outerRadius: 20,
      ringTexture: SaturnRing,
    },
    mapSunRotateY: 0.038,
    planetRotateY: 0.0009,
  },
  uranus: {
    size: 7,
    texture: Uranus,
    position: 176,
    ring: {
      innerRadius: 7,
      outerRadius: 12,
      ringTexture: UranusRing,
    },
    mapSunRotateY: 0.03,
    planetRotateY: 0.0004,
  },
  neptune: {
    size: 7,
    texture: Neptune,
    position: 200,
    mapSunRotateY: 0.032,
    planetRotateY: 0.0001,
  },
  pluto: {
    size: 2.8,
    texture: Pluto,
    position: 216,
    mapSunRotateY: 0.008,
    planetRotateY: 0.00007,
  },
};

// adding render method
const renderer = new THREE.WebGLRenderer();

// setting size for the render
renderer.setSize(window.innerWidth, window.innerHeight);

// appending renderer domElement t0 body
document.body.appendChild(renderer.domElement);

/**
 *  1. adding a camera
 *  2. adding a scene
 */

// 1. adding camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// 2. adding a scene
const scene = new THREE.Scene();

// adding orbit
const orbit = new OrbitControls(camera, renderer.domElement);

// update camera position
camera.position.set(-90, 140, 140);
// update the orbit
orbit.update();

// adding light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// adding cube texture loader
const cubeTextureLoader = new THREE.CubeTextureLoader();
// adding stars to the background
scene.background = cubeTextureLoader.load([
  Stars,
  Stars,
  Stars,
  Stars,
  Stars,
  Stars,
]);

// adding textureLoader
const textureLoader = new THREE.TextureLoader();

// creating sun sphere
const sunMap = textureLoader.load(Sun);
sunMap.colorSpace = THREE.SRGBColorSpace;
const sunGeometry = new SphereGeometry(16, 30, 30);
const sunMaterail = new THREE.MeshBasicMaterial({
  map: sunMap,
});
const sunSphere = new THREE.Mesh(sunGeometry, sunMaterail);
scene.add(sunSphere);

const createPlanet = (sizeOfPlanet, texture, position, ring) => {
  const planetMap = textureLoader.load(texture);

  planetMap.colorSpace = THREE.SRGBColorSpace;
  const planetGeometry = new THREE.SphereGeometry(sizeOfPlanet, 30, 30);
  const planetMaterial = new THREE.MeshStandardMaterial({
    map: planetMap,
  });
  const mesh = new THREE.Mesh(planetGeometry, planetMaterial);

  // adding an 3D Object
  const obj = new THREE.Object3D();
  // adding mesh to 3D object
  obj.add(mesh);

  // checking if ring present
  if (ring) {
    const ringMap = textureLoader.load(ring.ringTexture);
    ringMap.colorSpace = THREE.SRGBColorSpace;
    // creating ring Geometry
    const ringGeometry = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    // creating ring Material
    const ringMaterial = new THREE.MeshBasicMaterial({
      map: ringMap,
      side: THREE.DoubleSide,
    });
    // adding ring Geometry & Material to Mesh
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    // adding rind Mesh to 3D object
    obj.add(ringMesh);

    ringMesh.position.x = position;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }

  scene.add(obj);
  mesh.position.x = position;

  return { mesh, obj };
};

const planetsList = [];

Object.entries(planets).forEach(([key, value]) => {
  // create a planet
  const planet = createPlanet(
    value.size,
    value.texture,
    value.position,
    value.ring
  );
  // adding planet to the list
  planetsList.push({
    planetElement: planet,
    mapSunRotateY: value.mapSunRotateY,
    planetRotateY: value.planetRotateY,
  });
});

// adding custom light - if you are using Standard Material
const pointLight = new THREE.PointLight(0xffffff, 20000, 900);
scene.add(pointLight);

const animate = () => {
  // linking scene with camera
  sunSphere.rotateY(0.005);
  // adding rotation to the planet
  planetsList.forEach((planet) => {
    planet.planetElement.mesh.rotateY(planet.mapSunRotateY);
    planet.planetElement.obj.rotateY(planet.planetRotateY);
  });

  renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = this.window.innerWidth / this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(this.window.innerWidth, this.window.innerHeight);
});
