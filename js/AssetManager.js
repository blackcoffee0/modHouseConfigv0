// js/AssetManager.js
export class AssetManager {
    constructor(scene) {
        this.scene = scene;
        this.materials = {};
        this._initMaterials();
    }

    _initMaterials() {
        // House Body
        const houseMat = new BABYLON.StandardMaterial("houseMat", this.scene);
        houseMat.diffuseColor = BABYLON.Color3.FromHexString("#ffffff");
        houseMat.specularColor = new BABYLON.Color3(0, 0, 0);
        this.materials.house = houseMat;

        // Roof Dark
        const roofShellMat = new BABYLON.StandardMaterial("roofShellMat", this.scene);
        roofShellMat.diffuseColor = BABYLON.Color3.FromHexString("#4a4a4a");
        roofShellMat.specularColor = new BABYLON.Color3(0, 0, 0);
        this.materials.roofShell = roofShellMat;

        // Roof Gables (White)
        const roofGableMat = new BABYLON.StandardMaterial("roofGableMat", this.scene);
        roofGableMat.diffuseColor = BABYLON.Color3.FromHexString("#ffffff");
        roofGableMat.specularColor = new BABYLON.Color3(0, 0, 0);
        this.materials.roofGable = roofGableMat;

        // Window (Blue)
        const windowMat = new BABYLON.StandardMaterial("windowMat", this.scene);
        windowMat.diffuseColor = BABYLON.Color3.FromHexString("#4b6a8c");
        windowMat.specularColor = new BABYLON.Color3(0, 0, 0);
        this.materials.window = windowMat;

        // Door (Anthracite)
        const doorMat = new BABYLON.StandardMaterial("doorMat", this.scene);
        doorMat.diffuseColor = BABYLON.Color3.FromHexString("#2a2d30");
        doorMat.specularColor = new BABYLON.Color3(0, 0, 0);
        this.materials.door = doorMat;

        // Deck (Wood)
        const deckMat = new BABYLON.StandardMaterial("deckMat", this.scene);
        deckMat.diffuseColor = BABYLON.Color3.FromHexString("#8b6a40");
        deckMat.specularColor = new BABYLON.Color3(0, 0, 0);
        this.materials.deck = deckMat;
    }

    createWindow(w = 1.5, h = 1.0) {
        const panel = BABYLON.MeshBuilder.CreateBox("window", { width: 0.03, height: h, depth: w }, this.scene);
        panel.material = this.materials.window;
        panel.position.y = h / 2;
        return panel;
    }

    createDoor(w = 2.0, h = 2.0) {
        const panel = BABYLON.MeshBuilder.CreateBox("door", { width: 0.05, height: h, depth: w }, this.scene);
        panel.material = this.materials.door;
        panel.position.y = h / 2;
        return panel;
    }

    createDeck(size = 5.5) {
        const deck = BABYLON.MeshBuilder.CreateGround("deck", { width: size, height: size }, this.scene);
        deck.material = this.materials.deck;
        deck.position.y = 0.01;
        return deck;
    }
}