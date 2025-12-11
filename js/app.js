// js/app.js
import { SceneManager } from './SceneManager.js';
import { AssetManager } from './AssetManager.js';
import { HouseBuilder } from './HouseBuilder.js';

// 1. Inicjalizacja silnika i sceny
const appScene = new SceneManager("renderCanvas");

// 2. Inicjalizacja assetów (materiały)
const assets = new AssetManager(appScene.scene);

// 3. Inicjalizacja budowniczego
const builder = new HouseBuilder(appScene.scene, assets);

// 4. Obsługa UI
const lengthSelect = document.getElementById("lengthSelect");
const floorsRadios = document.querySelectorAll('input[name="floors"]');
const statWidthEl = document.getElementById("statWidth");
const statLengthEl = document.getElementById("statLength");
const statFloorsEl = document.getElementById("statFloors");
const statAreaEl = document.getElementById("statArea");
const applyBtn = document.getElementById("applyBtn");

function getFloorsOption() {
    for (const r of floorsRadios) {
        if (r.checked) return parseInt(r.value, 10);
    }
    return 1;
}

function updateStats(depth, floors) {
    const usableFloors = (floors === 2) ? 2 : 1;
    // Stała szerokość 6.0 z HouseBuilder (można by eksportować, ale tu hardcodujemy dla UI)
    const area = 6.0 * depth * usableFloors;

    statWidthEl.textContent = "6.0 m";
    statLengthEl.textContent = depth + " m";
    statFloorsEl.textContent = usableFloors.toString();
    statAreaEl.textContent = area.toFixed(0);
}

function applyConfig() {
    const depth = parseFloat(lengthSelect.value);
    const floors = getFloorsOption();

    // Budujemy dom
    const peakHeight = builder.build({ depth, floors });

    // Aktualizujemy kamerę, żeby patrzyła na środek wysokości
    appScene.updateCameraTarget(peakHeight * 0.55);

    // Aktualizujemy tekst w UI
    updateStats(depth, floors);
}

// Event Listeners
applyBtn.addEventListener("click", applyConfig);

// Start
applyConfig();