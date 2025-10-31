// ===== UI / LOGIC =====
const lengthSelect = document.getElementById("lengthSelect");
const floorsRadios = document.querySelectorAll('input[name="floors"]');

const statWidthEl = document.getElementById("statWidth");
const statLengthEl = document.getElementById("statLength");
const statFloorsEl = document.getElementById("statFloors");
const statAreaEl = document.getElementById("statArea");

function getFloorsOption() {
    for (const r of floorsRadios) {
        if (r.checked) return parseInt(r.value, 10);
    }
    return 1;
}

function applyConfig() {
    const depthMeters = parseFloat(lengthSelect.value);
    const floorsOption = getFloorsOption();

    // build / rebuild house and example prefabs
    buildHouse({ depthMeters, floorsOption });

    // update summary UI
    const usableFloors = (floorsOption === 2) ? 2 : 1;
    const area = WIDTH_FIXED * depthMeters * usableFloors;

    statWidthEl.textContent = WIDTH_FIXED + " m";
    statLengthEl.textContent = depthMeters + " m";
    statFloorsEl.textContent = usableFloors.toString();
    statAreaEl.textContent = area.toFixed(0);
}

// Apply button
document.getElementById("applyBtn").addEventListener("click", applyConfig);

// ===== INITIAL SCENE STATE =====
applyConfig(); // default: 12 m, single floor