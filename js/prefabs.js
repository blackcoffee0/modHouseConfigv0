// ===== MATERIALS FOR PREFABS =====
    // --- WINDOWS (blue panels) ---
    const windowMat = new BABYLON.StandardMaterial("windowMat", scene);
    // przygaszony chłodny niebieski, czytelny
    windowMat.diffuseColor = BABYLON.Color3.FromHexString("#4b6a8c");
    // zero połysku żeby nie było blików
    windowMat.specularColor = new BABYLON.Color3(0, 0, 0);
    // nieprzezroczyste (wygląd płaskiej tafli)
    windowMat.alpha = 1.0;


    // --- DOORS (anthracite panels) ---
    const doorMat = new BABYLON.StandardMaterial("doorMat", scene);
    // ciemny szary / antracyt
    doorMat.diffuseColor = BABYLON.Color3.FromHexString("#2a2d30");
    doorMat.specularColor = new BABYLON.Color3(0, 0, 0);
    doorMat.alpha = 1.0;
    // deck material (wood-like warm brown)
    const deckMat = new BABYLON.StandardMaterial("deckMat", scene);
    deckMat.diffuseColor = BABYLON.Color3.FromHexString("#8b6a40");
    deckMat.specularColor = new BABYLON.Color3(0, 0, 0);

    // ===== PREFABS =====

    // Simple rectangular window prefab (frame + glass) built facing +Z by default.
    // We'll clone & rotate it for different walls.
    function createWindowPrefab(w = 1.5, h = 1.0) {
      // pojedynczy panel, bez ramy
      const panel = BABYLON.MeshBuilder.CreateBox("windowPanel", {
        width: 0.03,   // cienkie w osi X (grubość)
        height: h,
        depth: w
      }, scene);

      panel.material = windowMat;

      // domyślnie będzie stało tak:
      // - wysokość od y=0 do y=h
      panel.position.y = h / 2;

      return panel;
    }

    // Door prefab (2m x 2m style glass door). Same idea.
    function createDoorPrefab(w = 2.0, h = 2.0) {
      const panel = BABYLON.MeshBuilder.CreateBox("doorPanel", {
        width: 0.05,  // trochę grubsze niż okno
        height: h,
        depth: w
      }, scene);

      panel.material = doorMat;
      panel.position.y = h / 2;

      return panel;
    }

    // Deck prefab: simple 3x3 "wood" patch
    function createDeckPrefab(size = 5.5) {
      const deck = BABYLON.MeshBuilder.CreateGround("deckPrefab", {
        width: size,
        height: size
      }, scene);
      deck.material = deckMat;
      deck.position.y = 0.01; // tiny lift over grass
      return deck;
    }