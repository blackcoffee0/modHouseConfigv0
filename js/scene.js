// ===== BABYLON BASIC SETUP =====
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true
});

const scene = new BABYLON.Scene(engine);
scene.clearColor = BABYLON.Color3.FromHexString("#DDE8F2");

// camera
const camera = new BABYLON.ArcRotateCamera(
    "camera",
    Math.PI / 4,     // alpha
    Math.PI / 3,     // beta
    15,              // radius
    new BABYLON.Vector3(0, 2, 0),
    scene
);
camera.attachControl(canvas, true);

// camera limits
camera.lowerBetaLimit = 0.4;
camera.upperBetaLimit = 1.5;
camera.lowerRadiusLimit = 6;
camera.upperRadiusLimit = 30;
camera.panningSensibility = 0;
camera.wheelDeltaPercentage = 0.02;

// lighting
const hemiLight = new BABYLON.HemisphericLight(
    "hemiLight",
    new BABYLON.Vector3(0, 1, 0),
    scene
);
hemiLight.intensity = 0.9;

// directional light (sun)

const dirLight = new BABYLON.DirectionalLight(
  "dirLight",
  new BABYLON.Vector3(-1, -2, -1),
    scene
);
dirLight.position = new BABYLON.Vector3(20, 40, 20);
dirLight.intensity = 0.5;
dirLight.shadowMinZ = 1;
dirLight.shadowMaxZ = 250;

const dirLight2 = new BABYLON.DirectionalLight(
  "dirLight",
  new BABYLON.Vector3(1, 2, 1),
    scene
);
dirLight2.position = new BABYLON.Vector3(-20, 40, -20);
dirLight2.intensity = 0.5;
dirLight2.shadowMinZ = 1;
dirLight2.shadowMaxZ = 250;

// ground (large plane = surrounding terrain)
const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 100, height: 100 },
    scene
);
const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
groundMat.diffuseColor = BABYLON.Color3.FromHexString("#9da272"); // muted olive green
groundMat.specularColor = new BABYLON.Color3(0, 0, 0);
ground.material = groundMat;




// render loop
engine.runRenderLoop(() => {
    scene.render();
});

// resize
window.addEventListener("resize", () => {
    engine.resize();
});