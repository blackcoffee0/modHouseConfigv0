// js/HouseBuilder.js
export class HouseBuilder {
    constructor(scene, assetManager) {
        this.scene = scene;
        this.assets = assetManager;

        // Root node dla całego domu - łatwe usuwanie
        this.houseRoot = null;

        // Stałe
        this.WIDTH_FIXED = 6.0;
        this.BOX_HEIGHT = 2.58;
        this.ADDITIONAL_HEIGHT = 1.24;
        this.ROOF_HEIGHT = 1.96;
    }

    build(config) {
        const { depth, floors } = config;

        // 1. CLEANUP: Jeśli dom już istnieje, usuwamy go w całości
        if (this.houseRoot) {
            this.houseRoot.dispose();
        }

        // 2. Tworzymy nowy kontener (pusty punkt w przestrzeni)
        this.houseRoot = new BABYLON.TransformNode("houseRoot", this.scene);

        // 3. Obliczenia wysokości
        let currentWallHeight = this.BOX_HEIGHT;
        if (floors === 2) {
            currentWallHeight += this.ADDITIONAL_HEIGHT;
        }

        // 4. Budowanie elementów (wszystkie podpinamy pod houseRoot)
        this._buildStructure(depth, currentWallHeight);
        this._buildRoof(depth, currentWallHeight);
        this._placePrefabs(depth, floors, currentWallHeight);

        // Zwracamy wysokość szczytu dla kamery
        return currentWallHeight + this.ROOF_HEIGHT;
    }

    _buildStructure(depth, height) {
        const box = BABYLON.MeshBuilder.CreateBox("mainVolume", {
            width: this.WIDTH_FIXED,
            depth: depth,
            height: height
        }, this.scene);

        box.material = this.assets.materials.house;
        box.position.y = height / 2;

        // Przypisanie do rodzica
        box.parent = this.houseRoot;
    }

    _buildRoof(depth, wallHeight) {
        const ridgeY = wallHeight + this.ROOF_HEIGHT;
        const halfW = this.WIDTH_FIXED / 2;
        const halfD = depth / 2;

        // --- Roof Shell (Dark) ---
        const shellPositions = [
            -halfW, wallHeight, halfD,  // 0 front left
            0, ridgeY, halfD,           // 1 front ridge
            halfW, wallHeight, halfD,   // 2 front right
            -halfW, wallHeight, -halfD, // 3 back left
            0, ridgeY, -halfD,          // 4 back ridge
            halfW, wallHeight, -halfD   // 5 back right
        ];
        const shellIndices = [
            0, 3, 4, 0, 4, 1, // lewa
            2, 1, 4, 2, 4, 5  // prawa
        ];

        const shell = new BABYLON.Mesh("roofShell", this.scene);
        const vData = new BABYLON.VertexData();
        vData.positions = shellPositions;
        vData.indices = shellIndices;
        vData.applyToMesh(shell);
        shell.material = this.assets.materials.roofShell;
        shell.parent = this.houseRoot;

        // --- Roof Gables (White) ---
        const gablePositions = [
            -halfW, wallHeight, halfD, 0, ridgeY, halfD, halfW, wallHeight, halfD, // front
            -halfW, wallHeight, -halfD, 0, ridgeY, -halfD, halfW, wallHeight, -halfD // back
        ];
        const gableIndices = [0, 1, 2, 5, 4, 3];

        const gables = new BABYLON.Mesh("roofGables", this.scene);
        const vDataG = new BABYLON.VertexData();
        vDataG.positions = gablePositions;
        vDataG.indices = gableIndices;
        vDataG.applyToMesh(gables);
        gables.material = this.assets.materials.roofGable;
        gables.parent = this.houseRoot;
    }

    _placePrefabs(depth, floors, wallHeight) {
        // Helper do szybkiego ustawiania
        const place = (mesh, x, y, z, rotY = 0) => {
            mesh.position.set(x, y, z);
            mesh.rotation.y = rotY;
            mesh.parent = this.houseRoot; // WAŻNE!
        };

        // Front Door
        const door = this.assets.createDoor(1.0, 2.0);
        place(door, -this.WIDTH_FIXED / 2 - 0.05, 1.0, (-depth / 2 + 2) + 4, Math.PI);

        // Kitchen Window
        const kWin = this.assets.createWindow(1.5, 1.0);
        place(kWin, -this.WIDTH_FIXED / 2 - 0.05, 1.5, (-depth / 2 + 2), 0);

        // Garden Doors
        const gDoor1 = this.assets.createWindow(2.0, 2.0);
        place(gDoor1, this.WIDTH_FIXED / 2 + 0.05, 1.0, (-depth / 2 + 2), Math.PI);

        const gDoor2 = this.assets.createWindow(2.0, 2.0);
        place(gDoor2, this.WIDTH_FIXED / 2 - 2, 1.0, (-depth / 2), Math.PI / 2);

        const gDoorSlim = this.assets.createWindow(1.0, 2.0);
        place(gDoorSlim, this.WIDTH_FIXED / 2 - 1.5, 1.0, (depth / 2), Math.PI / 2);

        // Deck
        const deck = this.assets.createDeck(5.5);
        place(deck, gDoor1.position.x - 0.5, 0.01, gDoor1.position.z - 1.5);

        // --- Second Floor Windows ---
        if (floors === 2) {
            const upY = this.BOX_HEIGHT + 1.0;
            const upWin1 = this.assets.createWindow(1.0, 1.5);
            place(upWin1, this.WIDTH_FIXED / 2 - 2.25, upY, -depth / 2, Math.PI / 2);

            const upWin2 = this.assets.createWindow(1.0, 1.5);
            place(upWin2, -this.WIDTH_FIXED / 2 + 2.25, upY, -depth / 2, Math.PI / 2);

            const upWin3 = this.assets.createWindow(1.5, 1.5);
            place(upWin3, 0, upY, depth / 2, Math.PI / 2);
        }

        // --- Dynamic Extra Windows based on Length ---
        const extraGardenZs = [];
        const extraFrontZs = [];

        if (depth === 12) {
            extraGardenZs.push(depth / 2 - 2.75);
        } else if (depth === 15) {
            extraGardenZs.push(depth / 2 - 2.75, depth / 2 - 2.75 - 5);
            extraFrontZs.push(depth / 2 - 2.75);
        } else if (depth === 18) {
            extraGardenZs.push(depth / 2 - 2.75, depth / 2 - 2.75 - 5);
            extraFrontZs.push(depth / 2 - 2.75, depth / 2 - 2.75 - 5);
        }

        extraGardenZs.forEach(zVal => {
            const w = this.assets.createWindow(1.5, 1.0);
            place(w, this.WIDTH_FIXED / 2 + 0.05, 1.5, zVal, Math.PI);
        });

        extraFrontZs.forEach(zVal => {
            const w = this.assets.createWindow(1.5, 1.0);
            place(w, -this.WIDTH_FIXED / 2 - 0.05, 1.5, zVal, 0);
        });
    }
}