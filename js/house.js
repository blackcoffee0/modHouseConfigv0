// ===== CONSTANTS =====
const WIDTH_FIXED = 6.0;          // meters (always 6 m)
const BOX_HEIGHT = 2.58;          // base wall height in meters
const ADDITIONAL_HEIGHT = 1.24;   // extra wall for the "two-floor volume"
const ROOF_HEIGHT = 1.96;         // peak above top wall (ridge height above wall)

// ===== HOUSE GEOMETRY BUILDER =====
let houseMesh = null;
let roofShell = null;
let roofGables = null;

function createRoofShell(width, depth, wallHeight, roofHeight, scene, mat) {
    const ridgeY = wallHeight + roofHeight;

    // 4 vertices of simple gable roof (no overhangs)
    const positions = [
        -width / 2, wallHeight, depth / 2,   // 0 front left eave
        0, ridgeY, depth / 2,   // 1 front ridge
        width / 2, wallHeight, depth / 2,   // 1 front right eave
        -width / 2, wallHeight, -depth / 2,   // 2 back left eave
        0, ridgeY, -depth / 2,  // 2 back ridge
        width / 2, wallHeight, -depth / 2    // 3 back right eave
    ];

    const indices = [
        // lewa połac
        0, 3, 4,
        0, 4, 1,
        // prawa połac
        2, 1, 4,
        2, 4, 5
    ];

    const mesh = new BABYLON.Mesh("roofShell", scene);
    const vData = new BABYLON.VertexData();
    vData.positions = positions;
    vData.indices = indices;
    vData.applyToMesh(mesh);

    mesh.material = mat;
    return mesh;
}

function createRoofGables(width, depth, wallHeight, roofHeight, scene, mat) {
    const ridgeY = wallHeight + roofHeight;

    const positions = [
        // front
        -width / 2, wallHeight, depth / 2,  // 0
        0, ridgeY, depth / 2,  // 1
        width / 2, wallHeight, depth / 2,  // 2
        // back
        -width / 2, wallHeight, -depth / 2,  // 3
        0, ridgeY, -depth / 2,  // 4
        width / 2, wallHeight, -depth / 2   // 5
    ];

    const indices = [
        // front
        0, 1, 2,
        // back
        5, 4, 3
    ];

    const mesh = new BABYLON.Mesh("roofGables", scene);
    const vData = new BABYLON.VertexData();
    vData.positions = positions;
    vData.indices = indices;
    vData.applyToMesh(mesh);

    mesh.material = mat;
    return mesh;
}

/*    // Full roof prefab (triangular prism shape)
    function createRoof(width, depth, wallHeight, roofHeight) {
      const ridgeY = wallHeight + roofHeight;
 
      // 6 vertices of triangular prism roof
      const positions = [
        -width/2, wallHeight,  depth/2,   // 0 front left eave
         0,       ridgeY,      depth/2,   // 1 front ridge
         width/2, wallHeight,  depth/2,   // 2 front right eave
 
        -width/2, wallHeight, -depth/2,   // 3 back left eave
         0,       ridgeY,     -depth/2,   // 4 back ridge
         width/2, wallHeight, -depth/2    // 5 back right eave
      ];
 
      const indices = [
        // front triangle
        0,1,2,
        // back triangle
        5,4,3,
        // left roof face
        0,3,4,
        0,4,1,
        // right roof face
        2,1,4,
        2,4,5,
        // underside
        0,2,5,
        0,5,3
      ];
 
      const mesh = new BABYLON.Mesh("roof", scene);
      const vData = new BABYLON.VertexData();
      vData.positions = positions;
      vData.indices = indices;
 
      // Let Babylon's default normal handling shade it in-engine.
      // (We intentionally do NOT set vData.normals or vData.uvs to stay close
      //  to how you said it "looks best".)
      vData.applyToMesh(mesh);
 
      // roof material (dark roof color)
      const roofMat = new BABYLON.StandardMaterial("roofMat", scene);
      roofMat.diffuseColor = BABYLON.Color3.FromHexString("#4a4a4a");
      roofMat.specularColor = new BABYLON.Color3(0,0,0);
      mesh.material = roofMat;
 
      return mesh;
    }
*/
let doorMesh = null;
let kitchenWinMesh = null;
let gardenDoor1Mesh = null;
let gardenDoor2Mesh = null;
let gardenDoorSlimMesh = null;
let deck1Mesh = null;
let upperWindow1Mesh = null;
let upperWindow2Mesh = null;
let upperWindow3Mesh = null;
let extraWindows = [];

function buildHouse(config) {
    const depth = config.depthMeters;
    const floorsOption = config.floorsOption;

    // wall height before roof
    let wallHeight = BOX_HEIGHT;
    if (floorsOption === 2) {
        wallHeight += ADDITIONAL_HEIGHT;
    }

    // cleanup old geometry and prefabs
    if (houseMesh) {
        houseMesh.dispose();
        houseMesh = null;
    }
    if (roofShell) {
        roofShell.dispose();
        roofShell = null;
    }
    if (roofGables) {
        roofGables.dispose();
        roofGables = null;
    }
    if (doorMesh) {
        doorMesh.dispose();
        doorMesh = null;
    }
    if (kitchenWinMesh) {
        kitchenWinMesh.dispose();
        kitchenWinMesh = null;
    }
    if (gardenDoor1Mesh) {
        gardenDoor1Mesh.dispose();
        gardenDoor1Mesh = null;
    }
    if (gardenDoor2Mesh) {
        gardenDoor2Mesh.dispose();
        gardenDoor2Mesh = null;
    }
    if (gardenDoorSlimMesh) {
        gardenDoorSlimMesh.dispose();
        gardenDoorSlimMesh = null;
    }
    if (deck1Mesh) {
        deck1Mesh.dispose();
        deck1Mesh = null;
    }
    if (upperWindow1Mesh) {
        upperWindow1Mesh.dispose();
        upperWindow1Mesh = null;
    }
    if (upperWindow2Mesh) {
        upperWindow2Mesh.dispose();
        upperWindow2Mesh = null;
    }
    if (upperWindow3Mesh) {
        upperWindow3Mesh.dispose();
        upperWindow3Mesh = null;
    }
    if (extraWindows && extraWindows.length) {
        extraWindows.forEach(m => { if (m) { m.dispose(); } });
        extraWindows = [];
    }

    // main house volume
    houseMesh = BABYLON.MeshBuilder.CreateBox("house", {
        width: WIDTH_FIXED,
        depth: depth,
        height: wallHeight
    }, scene);

    const houseMat = new BABYLON.StandardMaterial("houseMat", scene);
    houseMat.diffuseColor = BABYLON.Color3.FromHexString("#ffffff"); // pure white body
    houseMat.specularColor = new BABYLON.Color3(0, 0, 0);
    houseMesh.material = houseMat;

    // floor align
    houseMesh.position.y = wallHeight / 2;

    // roof
    // --- create roof parts ---
    const roofShellMat = new BABYLON.StandardMaterial("roofShellMat", scene);
    roofShellMat.diffuseColor = BABYLON.Color3.FromHexString("#4a4a4a"); // ciemny dach
    roofShellMat.specularColor = new BABYLON.Color3(0, 0, 0);

    const roofGableMat = new BABYLON.StandardMaterial("roofGableMat", scene);
    roofGableMat.diffuseColor = BABYLON.Color3.FromHexString("#ffffff"); // kolor ścian
    roofGableMat.specularColor = new BABYLON.Color3(0, 0, 0);

    roofShell = createRoofShell(WIDTH_FIXED, depth, wallHeight, ROOF_HEIGHT, scene, roofShellMat);
    roofGables = createRoofGables(WIDTH_FIXED, depth, wallHeight, ROOF_HEIGHT, scene, roofGableMat);


    // camera target ~ center height
    const peakHeight = wallHeight + ROOF_HEIGHT;
    camera.setTarget(new BABYLON.Vector3(0, peakHeight * 0.55, 0));

    // ===== EXAMPLE PLACEMENT OF PREFABS =====
    // You can delete these clones or move them around manually.
    // They show how to start placing your library parts.

    // example window on long front wall …
    doorMesh = createDoorPrefab(1.0, 2.0).clone("frontDoor");
    doorMesh.position.x = -WIDTH_FIXED / 2 - 0.05;
    doorMesh.position.y = 1.0;
    doorMesh.position.z = (-depth / 2 + 2) + 1 + 3;
    doorMesh.rotation.y = Math.PI;

    kitchenWinMesh = createWindowPrefab(1.5, 1.0).clone("kitchenWin");
    kitchenWinMesh.position.x = -WIDTH_FIXED / 2 - 0.05;
    kitchenWinMesh.position.y = 1.5;
    kitchenWinMesh.position.z = (-depth / 2 + 2);
    kitchenWinMesh.rotation.y = 0;

    gardenDoor1Mesh = createWindowPrefab(2.0, 2.0).clone("gardenDoor");
    gardenDoor1Mesh.position.x = WIDTH_FIXED / 2 + 0.05;
    gardenDoor1Mesh.position.y = 1;
    gardenDoor1Mesh.position.z = (-depth / 2 + 2);
    gardenDoor1Mesh.rotation.y = Math.PI;

    gardenDoor2Mesh = createWindowPrefab(2.0, 2.0).clone("gardenDoor");
    gardenDoor2Mesh.position.x = WIDTH_FIXED / 2 - 2;
    gardenDoor2Mesh.position.y = 1;
    gardenDoor2Mesh.position.z = (-depth / 2);
    gardenDoor2Mesh.rotation.y = Math.PI / 2;

    gardenDoorSlimMesh = createWindowPrefab(1.0, 2.0).clone("gardenDoor");
    gardenDoorSlimMesh.position.x = WIDTH_FIXED / 2 - 1.5;
    gardenDoorSlimMesh.position.y = 1;
    gardenDoorSlimMesh.position.z = (depth / 2);
    gardenDoorSlimMesh.rotation.y = Math.PI / 2;

    deck1Mesh = createDeckPrefab(5.5).clone("deck1");
    deck1Mesh.position.x = gardenDoor1Mesh.position.x - 0.5;
    deck1Mesh.position.z = gardenDoor1Mesh.position.z - 1.5;
    deck1Mesh.position.y = 0.01;
    if (floorsOption === 2) {
        // Create 3 new windows for upper floor
        upperWindow1Mesh = createWindowPrefab(1.0, 1.5).clone("upperWin1");
        upperWindow1Mesh.position.x = WIDTH_FIXED / 2 - 2.25;
        upperWindow1Mesh.position.y = BOX_HEIGHT + 1.0; // Position above first floor
        upperWindow1Mesh.position.z = (-depth / 2);
        upperWindow1Mesh.rotation.y = Math.PI / 2;

        upperWindow2Mesh = createWindowPrefab(1.0, 1.5).clone("upperWin2");
        upperWindow2Mesh.position.x = -(WIDTH_FIXED / 2) + 2.25;
        upperWindow2Mesh.position.y = BOX_HEIGHT + 1.0;
        upperWindow2Mesh.position.z = (-depth / 2);
        upperWindow2Mesh.rotation.y = Math.PI / 2;

        upperWindow3Mesh = createWindowPrefab(1.5, 1.5).clone("upperWin3");
        upperWindow3Mesh.position.x = 0
        upperWindow3Mesh.position.y = BOX_HEIGHT + 1.0;
        upperWindow3Mesh.position.z = (depth / 2);
        upperWindow3Mesh.rotation.y = Math.PI / 2;
    }
    // --- add extra windows depending on house length (depth) ---
    // rules from user:
    // 9m - no changes
    // 12m - add one normal window (like kitchen) on garden side
    // 15m - 2 windows on garden side and 1 on front
    // 18m - 3 windows on garden and 2 on front
    const extraGardenZs = [];
    const extraFrontZs = [];
    if (depth === 12) {
        extraGardenZs.push(depth / 2 - 2.75); // center on garden side
    } else if (depth === 15) {
        extraGardenZs.push(depth / 2 - 2.75, depth / 2 - 2.75 - 5); // two spaced on garden side
        extraFrontZs.push(depth / 2 - 2.75); // one on front
    } else if (depth === 18) {
        extraGardenZs.push(depth / 2 - 2.75, depth / 2 - 2.75 - 5); // three on garden side
        extraFrontZs.push(depth / 2 - 2.75, depth / 2 - 2.75 - 5); // two on front
    }
    // create garden-side windows (x = positive side)
    extraGardenZs.forEach((zVal, idx) => {
        const w = createWindowPrefab(1.5, 1.0).clone("extraGardenWin_" + idx);
        w.position.x = WIDTH_FIXED / 2 + 0.05;
        w.position.y = 1.5;
        w.position.z = zVal;
        w.rotation.y = Math.PI;
        extraWindows.push(w);
    });

    // create front-side windows (x = negative/front side)
    extraFrontZs.forEach((zVal, idx) => {
        const w = createWindowPrefab(1.5, 1.0).clone("extraFrontWin_" + idx);
        w.position.x = -WIDTH_FIXED / 2 - 0.05;
        w.position.y = 1.5;
        w.position.z = zVal;
        w.rotation.y = 0;
        extraWindows.push(w);
    });
    const peak = wallHeight + ROOF_HEIGHT;
    camera.setTarget(new BABYLON.Vector3(0, peak * 0.55, 0));
}