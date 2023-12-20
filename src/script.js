import "./style.css";
import * as THREE from "three";
import { Clock, Material, PointLight } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import {
  GLTFLoader,
  GLTFParser,
} from "three/examples/jsm/loaders/GLTFLoader.js";
import fragment from "./fragment.glsl";
import vertex from "./vertex.glsl";
// import * as dat from 'dat.gui'

//Cursor
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});

// Sizes
const sizes = {
  width: window.innerWidth,
  height: innerHeight,
  pixelRatio: 1,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height);
camera.position.z = 8;

scene.add(camera);

// Controls
const controls = new TrackballControls(camera, canvas);
controls.noPan;
controls.rotateSpeed = 0.1;
controls.dynamicDampingFactor = 0.1;
controls.noZoom = true

//Textures
const textureLoader = new THREE.TextureLoader();

const env_texture = textureLoader.load("/textures/v2.png");

env_texture.mapping = THREE.EquirectangularReflectionMapping;
env_texture.flipY = false;
// env_texture.flipX = true
scene.environment = env_texture;
// scene.background = new THREE.Color(0x151592);
// const matcap1 = textureLoader.load('/textures/matcaps/16.png')
// const matcap2 = textureLoader.load('/textures/matcaps/17.png')
// const matcap3 = textureLoader.load('/textures/matcaps/16.png')

// Materials
// const icoshpere_material = new THREE.MeshMatcapMaterial({matcap : matcap1})
// const circle_material = new THREE.MeshMatcapMaterial({matcap : matcap2})
// const outer_circle_material = new THREE.MeshMatcapMaterial({matcap : matcap3})

// const logo_material = new THREE.MeshStandardMaterial({map : logo_texture})
// logo_material.roughness = 0.2

// console.log(outer_circle_material)

const logo_material = new THREE.MeshStandardMaterial({
  // color : 0xffffff,
  // // map : logo_texture,
  // // normalMap :
  // // displacementMap :
  // // displacementScale :
  // // transparent : false
  // // alphaMap :
  // // wireframe : true
  // envMap :  logo_texture,
  envMapIntensity: 1,
  metalness: 1,
  roughness: 0.08,
});

const params = {
  colors: {
    dark: ["#000073", "#0000c4"],
    light: ["#D8DCE5", "#F4F5F7"],
  },
  wavesAmount: 2,
  wavesSpeed: 100,
  wavesBrightness: 0.65,
  horizontalStretch: 2.0,
  verticalStretch: 1.0,
  noiseStrength: 23.0,
};
const trColors = {
  first: "#000073",
  second: "#0000c4",
  inProgress: false,
};
const createPalette = (colors) => colors.map((color) => new THREE.Color(color));
// Objects
let plane = new THREE.PlaneGeometry(20, 10, 200, 200);
plane.computeBoundingSphere();
plane.center();

let planematerial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { type: "f", value: params.time },
    uResolution: {
      type: "v2",
      value: new THREE.Vector2(
        sizes.width * sizes.pixelRatio,
        sizes.height * sizes.pixelRatio
      ),
    },
    uRatio: { type: "f", value: sizes.width / sizes.height },
    uPalette: { value: createPalette(params.colors.dark) },
    uNoiseStrength: { value: params.noiseStrength },
    uWavesAmount: { value: params.wavesAmount },
    uWavesSpeed: { value: params.wavesSpeed },
    uWavesBrightness: { value: params.wavesBrightness },
    uHorizontalStretch: { value: params.horizontalStretch },
    uVerticalStretch: { value: params.verticalStretch },
  },
  vertexShader: vertex,
  fragmentShader: fragment,
});

let mesh = new THREE.Mesh(plane, planematerial);
mesh.position.z = -1
scene.add(mesh);

//GLTF Loader
let mixer = null;
const gltfloader = new GLTFLoader();
let logo;
gltfloader.load("/models/Star.gltf", (gltf) => {
  logo = gltf.scene.children[0];
  logo.material = logo_material;

  // const icosphere = gltf.scene.children[1]
  // icosphere.material = icoshpere_material

  // const cables = gltf.scene.children[0].children[0]
  // cables.material = outer_circle_material

  // const circle = gltf.scene.children[0].children[1]
  // circle.material = circle_material

  // const outer_circle = gltf.scene.children[0].children[2]
  // outer_circle.material = outer_circle_material
  // gltf.scene.children[1].material = material1

  // mixer = new THREE.AnimationMixer(gltf.scene)

  // const controllerAction = mixer.clipAction(gltf.animations[0])
  // const InnerCircleRotation = mixer.clipAction(gltf.animations[2])
  // const IcosphereAction = mixer.clipAction(gltf.animations[4])
  // IcosphereAction.play()
  // controllerAction.play()
  // InnerCircleRotation.play()

  // console.log(gltf.scene.children)
  scene.add(gltf.scene);
});

//Lights
const ambientlight = new THREE.AmbientLight(0xffffff, 1);
// ambientlight.castShadow = true

const light1 = new THREE.DirectionalLight(0xff932e, 2);
const helper1 = new THREE.DirectionalLightHelper(light1);
light1.position.set(3, 3, 0);

const light2 = new THREE.DirectionalLight(0x397bfe, 10);
const helper2 = new THREE.DirectionalLightHelper(light2);
light2.position.set(-3, 3, 0);

// directionallight.castShadow = true
// directionallight.shadow.mapSize.width = 2048
// directionallight.shadow.mapSize.height = 2048

scene.add(ambientlight, light1, light2);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#000073", 1);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

// Animate
const clock = new THREE.Clock();

const tick = () => { 
    const elapsedTime = clock.getElapsedTime(); 
  mesh.material.uniforms.uPalette.value = createPalette([
    trColors.first,
    trColors.second,
  ]);
  mesh.material.uniforms.uTime.value = elapsedTime / 1000;
  mesh.material.uniforms.uNoiseStrength.value = params.noiseStrength;
  mesh.material.uniforms.uWavesAmount.value = params.wavesAmount;
  mesh.material.uniforms.uWavesSpeed.value = params.wavesSpeed;
  mesh.material.uniforms.uWavesBrightness.value = params.wavesBrightness;
  mesh.material.uniforms.uHorizontalStretch.value = params.horizontalStretch;
  mesh.material.uniforms.uVerticalStretch.value = params.verticalStretch;
  console.log(mesh.material.uniforms)
  
  
  if (logo) {
    logo.rotation.y = 0.2 * elapsedTime;
  }
  // gltf.scene.children[0].rotation.x = cursor.x

  // const deltatime = elapsedTime - previousTime
  // previousTime = elapsedTime

  // if(mixer !== null)
  // {
  //    mixer.update(deltatime)
  // }

  // sphere.position.y = 0.2*Math.sin(elapsedTime)
  // sphere.rotation.y = 0.2*(elapsedTime)

  // spherecage.position.y = 0.2*Math.sin(elapsedTime)
  // spherecage.rotation.y = 0.2*(elapsedTime)

  controls.update();
  // gltfloader.update()

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

//GUI
// const gui = new dat.GUI()

// gui
// .add(mesh.position, 'y')
// .min(-3)
// .max(3)
// .step(0.01)
// .name('position')
// gui
// .add(material, 'wireframe')

// const parameters = {color: 0xff0000}

// gui
// .addColor(parameters, 'color')
// .onChange(() =>
// {
// material.color.set(parameters.color)
// })
