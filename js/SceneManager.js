// js/SceneManager.js
export class SceneManager {
    constructor(canvasId) {
        const canvas = document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true
        });

        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = BABYLON.Color3.FromHexString("#DDE8F2");

        this._createCamera(canvas);
        this._createLights();
        this._createGround();

        // Render loop
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        // Resize
        window.addEventListener("resize", () => this.engine.resize());
        window.addEventListener("orientationchange", () => setTimeout(() => this.engine.resize(), 100));
    }

    _createCamera(canvas) {
        this.camera = new BABYLON.ArcRotateCamera(
            "camera",
            Math.PI / 4, Math.PI / 3, 15,
            new BABYLON.Vector3(0, 2, 0),
            this.scene
        );
        this.camera.attachControl(canvas, true);
        this.camera.lowerBetaLimit = 0.4;
        this.camera.upperBetaLimit = 1.5;
        this.camera.lowerRadiusLimit = 10;
        this.camera.upperRadiusLimit = 30;
        this.camera.wheelDeltaPercentage = 0.02;
    }

    _createLights() {
        const hemiLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), this.scene);
        hemiLight.intensity = 0.9;

        const dirLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-1, -2, -1), this.scene);
        dirLight.position = new BABYLON.Vector3(20, 40, 20);
        dirLight.intensity = 0.5;

        const dirLight2 = new BABYLON.DirectionalLight("dirLight2", new BABYLON.Vector3(1, 2, 1), this.scene);
        dirLight2.position = new BABYLON.Vector3(-20, 40, -20);
        dirLight2.intensity = 0.5;
    }

    _createGround() {
        const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, this.scene);
        const groundMat = new BABYLON.StandardMaterial("groundMat", this.scene);
        groundMat.diffuseColor = BABYLON.Color3.FromHexString("#9da272");
        groundMat.specularColor = new BABYLON.Color3(0, 0, 0);
        ground.material = groundMat;
    }

    updateCameraTarget(yHeight) {
        this.camera.setTarget(new BABYLON.Vector3(0, yHeight, 0));
    }
}