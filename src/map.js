const CESIUM_ION_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NTkyZDZhYi03YWZjLTRhMGItYmNjNy0yYWMzMjEwMGY5OGQiLCJpZCI6NDE2MTY3LCJpYXQiOjE3NzU3ODUxMjF9.4yH3waGH3QMFC-dJI21EMZCHEj0-3sohaAaNNmRweyA';

const regionColors = {
    'East Blue': '#3498db',
    'West Blue': '#9b59b6',
    'North Blue': '#2ecc71',
    'South Blue': '#e67e22',
    'Grand Line': '#c8a951',
    'New World': '#000000',
    'Calm Belt': '#ffffff',
    'Red Line': '#e74c3c',
};

const arcOrder = [
    'Romance Dawn',
    'N/a - Vivre Card',
    'One Piece Novel ZORO',
    'Orange Town',
    'Syrup Village',
    'Baratie',
    'Arlong Park',
    'Loguetown',
    'Reverse Mountain',
    'Whisky Peak',
    'Little Garden',
    'Drum Island',
    'Alabasta',
    "One Piece Ace's Story",
    'Jaya',
    'Skypiea',
    'Long Ring Long Land',
    'Water Seven',
    'Enies Lobby',
    'Post-Enies Lobby',
    'Thriller Bark',
    'Sabaody Archipelago',
    'Amazon Lily',
    'Impel Down',
    'Marineford',
    'Post-War',
    'Fish Man Island',
    'Punk Hazard',
    'Dressrosa',
    'Zou',
    'Whole Cake Island',
    'Levely',
    'Wano',
    'Egghead',
    'Elbaf',
];

const arcDisplayNames = {
    'N/a - Vivre Card': 'Romance Dawn Arc',
    'One Piece Novel ZORO': 'Romance Dawn Arc',
    "One Piece Ace's Story": 'Alabasta Arc',
    'Romance Dawn': 'Romance Dawn Arc',
    'Orange Town': 'Orange Town Arc',
    'Syrup Village': 'Syrup Village Arc',
    'Baratie': 'Baratie Arc',
    'Arlong Park': 'Arlong Park Arc',
    'Loguetown': 'Loguetown Arc',
    'Reverse Mountain': 'Reverse Mountain Arc',
    'Whisky Peak': 'Whisky Peak Arc',
    'Little Garden': 'Little Garden Arc',
    'Drum Island': 'Drum Island Arc',
    'Alabasta': 'Alabasta Arc',
    'Jaya': 'Jaya Arc',
    'Skypiea': 'Skypiea Arc',
    'Long Ring Long Land': 'Long Ring Long Land Arc',
    'Water Seven': 'Water Seven Arc',
    'Enies Lobby': 'Enies Lobby Arc',
    'Post-Enies Lobby': 'Post-Enies Lobby Arc',
    'Thriller Bark': 'Thriller Bark Arc',
    'Sabaody Archipelago': 'Sabaody Archipelago Arc',
    'Amazon Lily': 'Amazon Lily Arc',
    'Impel Down': 'Impel Down Arc',
    'Marineford': 'Marineford Arc',
    'Post-War': 'Post-War Arc',
    'Fish Man Island': 'Fish-Man Island Arc',
    'Punk Hazard': 'Punk Hazard Arc',
    'Dressrosa': 'Dressrosa Arc',
    'Zou': 'Zou Arc',
    'Whole Cake Island': 'Whole Cake Island Arc',
    'Levely': 'Levely Arc',
    'Wano': 'Wano Arc',
    'Egghead': 'Egghead Arc',
    'Elbaf': 'Elbaf Arc',
};

const routeCoordinates = [
    { name: "Dawn Island", lon: 135.6185, lat: 53.4484 },
    { name: "Goat Island", lon: 129.1846, lat: 60.8883 },
    { name: "Shells Town / G-153", lon: 124.9745, lat: 61.706 },
    { name: "Organ Island / Orange Town", lon: 100.9968, lat: 51.4648 },
    { name: "Island of Rare Animals", lon: 93.8014, lat: 47.2183 },
    { name: "Syrup Village", lon: 76.4342, lat: 47.6978 },
    { name: "Baratie", lon: 71.4185, lat: 33.4255 },
    { name: "Cocoyashi Village", lon: 45.9788, lat: 49.6104 },
    { name: "Arlong Park", lon: 44.1468, lat: 52.0139 },
    { name: "Lougetown / Polestar Islands", lon: 18.4545, lat: 29.1279 },
    { name: "Reverse Mountain", lon: 8.1496, lat: -0.1209 },
    { name: "Twins Cape", lon: 17.9137, lat: -2.8461 },
    { name: "Whisky Peak", lon: 26.4407, lat: 3.7836 },
    { name: "Little Garden", lon: 36.2148, lat: 6.6161 },
    { name: "Drum Island / Sakura Kingdom", lon: 48.1504, lat: 7.919 },
    { name: "Alabasta Kingdom", lon: 65.6264, lat: 10.1258 },
    { name: "Mock Town", lon: 80.5633, lat: 2.2498 },
    { name: "Jaya", lon: 81.9664, lat: 1.0779 },
    { name: "Angel Island", lon: 92.4054, lat: 0.4848 },
    { name: "Skypiea", lon: 90.7117, lat: 3.7079 },
    { name: "Long Ring Long Land", lon: 99.9722, lat: -3.8285 },
    { name: "Shift Station", lon: 120.1383, lat: -6.6994 },
    { name: "Water 7", lon: 126.9197, lat: -2.8379 },
    { name: "Enies Lobby", lon: 143.534, lat: -8.7942 },
    { name: "Thriller Bark", lon: 141.3863, lat: 0.4635 },
    { name: "Flying Fish Raider Base", lon: 154.4179, lat: -0.3794 },
    { name: "Sabaody Archipelago", lon: 160.7084, lat: -2.573 },
    { name: "Fish Man Island", lon: 172.8767, lat: -1.7366 },
    { name: "Punk Hazard", lon: -156.9298, lat: -8.3585 },
    { name: "Dressrosa Kingdom", lon: -125.568, lat: -5.5422 },
    { name: "Green Bit", lon: -121.2503, lat: -1.2621 },
    { name: "Zou", lon: -88.4948, lat: -8.8164 },
    { name: "Whole Cake Island", lon: -98.6784, lat: 5.1292 },
    { name: "Wano Kingdom", lon: -68.5807, lat: 6.6363 },
    { name: "Egghead Island", lon: -65.3558, lat: -0.6844 },
    { name: "Elbaf Island", lon: -51.2569, lat: 1.5331 },
];

let allLocations = [];

let routeVisible = false;
let routeEntities = [];
let shipEntity = null;
let shipInterval = null;

const loadingScreen = document.getElementById('loadingScreen');
const loadingFill = document.getElementById('loadingFill');
const loadingText = document.getElementById('loadingText');

const searchInput = document.getElementById('searchInput');
const searchDropdown = document.getElementById('searchDropdown');
const filterPanel = document.getElementById('filterPanel');

const filterToggle = document.getElementById('filterToggle');
const filterContent = document.getElementById('filterContent');
const selectAllBtn = document.getElementById('selectAllBtn');
const deselectAllBtn = document.getElementById('deselectAllBtn');

const spoilerSlider = document.getElementById('spoilerSlider');
const spoilerArc = document.getElementById('spoilerArc');

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerClose = document.getElementById('drawerClose');

const mobileSpoilerSlider = document.getElementById('mobileSpoilerSlider');
const mobileSpoilerArc = document.getElementById('mobileSpoilerArc');

filterPanel.style.marginTop = '107px';

// ============================================
// LOADING SCREEN
// ============================================

const loadingMessages = [
    'Hoisting the sails...',
    'Entering the Grand Line...',
    'Finding the Poneglyphs...',
    'Braving the New World...',
    'Locating Laugh Tale...',
];

let messageIndex = 0;
let progress = 0;

const totalDuration = 10000;
const intervalSpeed = 750;
const totalSteps = totalDuration / intervalSpeed;
const increment = 100 / totalSteps;

const loadingInterval = setInterval(function () {
    progress += increment;
    if (progress > 100) progress = 100;
    loadingFill.style.width = progress + '%';

    const newIndex = Math.min(
        Math.floor((progress / 100) * loadingMessages.length),
        loadingMessages.length - 1
    );

    if (newIndex !== messageIndex) {
        messageIndex = newIndex;
        loadingText.style.opacity = '0';
        setTimeout(function () {
            loadingText.textContent = loadingMessages[messageIndex];
            loadingText.style.opacity = '1';
        }, 400);
    }
}, intervalSpeed);

setTimeout(function () {
    clearInterval(loadingInterval);
    loadingFill.style.width = '100%';
    loadingText.style.opacity = '0';

    setTimeout(function () {
        loadingText.style.opacity = '1';
        loadingText.textContent = 'The One Piece is Real!';

        setTimeout(function () {
            loadingScreen.style.opacity = '0';
            setTimeout(function () {
                loadingScreen.style.display = 'none';
            }, 800);
        }, 800);
    }, 400);
}, 10000);

// ============================================
// 3D GLOBE SETUP
// ============================================

Cesium.Ion.defaultAccessToken = CESIUM_ION_TOKEN;

const viewer = new Cesium.Viewer('cesiumContainer', {
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
    terrainProvider: new Cesium.EllipsoidTerrainProvider(),
    imageryProvider: false,
});

viewer.cesiumWidget.creditContainer.style.display = 'none';
viewer.scene.backgroundColor = Cesium.Color.BLACK;
viewer.scene.skyAtmosphere.show = true;

const imageryProvider = new Cesium.UrlTemplateImageryProvider({
    url: 'https://pub-71040b0ef3cc4043989f738f9235afb9.r2.dev/{z}/{x}/{reverseY}.jpg',
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    minimumLevel: 0,
    maximumLevel: 6,
});

viewer.imageryLayers.addImageryProvider(imageryProvider);

viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(0, 0, 62500000),
});

setTimeout(function () {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(138, 50, 3000000),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-75),
            roll: 0,
        },
        duration: 5,
        easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
    });
}, 11000);

// ============================================
// MARKERS & LOCATIONS
// ============================================

function createMarkerCanvas(color) {
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 24;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(12, 12, 9, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    return canvas;
}

async function loadLocations() {
    const response = await fetch('data/locations.json');
    const locations = await response.json();

    allLocations = locations;
    document.getElementById('counterTotal').textContent = locations.length;
    document.getElementById('counterCurrent').textContent = locations.length;

    locations.forEach(location => {
        const color = regionColors[location.sea] || '#ffffff';

        viewer.entities.add({
            id: String(location.id),
            position: Cesium.Cartesian3.fromDegrees(location.lon, location.lat),
            billboard: {
                image: createMarkerCanvas(color),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                scale: 0.6,
            },
            label: {
                text: location.name,
                font: '11px Georgia',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -22),
                show: false,
            },
            properties: {
                name: location.name,
                sea: location.sea,
                type: location.type,
                arc: location.arc,
                notes: location.notes,
            }
        });
    });

    restoreURL();
}

// ============================================
// INFO PANEL
// ============================================

function showPanel(data) {
    document.getElementById('panelName').textContent = data.name;
    document.getElementById('panelSea').textContent = data.sea;
    document.getElementById('panelType').textContent = data.type;
    document.getElementById('panelArc').textContent = data.arc;
    document.getElementById('panelNotes').textContent = data.notes;
    setURL(data.name);
    const panel = document.getElementById('infoPanel');
    setTimeout(function () {
        panel.classList.add('visible');
    }, 10);
}

function hidePanel() {
    const panel = document.getElementById('infoPanel');
    panel.classList.remove('visible');
    clearURL();
}

viewer.screenSpaceEventHandler.setInputAction(function (click) {
    const picked = viewer.scene.pick(click.position);

    if (Cesium.defined(picked) && picked.id) {
        const entity = picked.id;
        const props = entity.properties;

        if (!props) return;

        showPanel({
            name: props.name.getValue(),
            sea: props.sea.getValue(),
            type: props.type.getValue(),
            arc: props.arc.getValue(),
            notes: props.notes.getValue(),
        });

        const position = entity.position.getValue(viewer.clock.currentTime);
        const cartographic = Cesium.Cartographic.fromCartesian(position);
        const lon = Cesium.Math.toDegrees(cartographic.longitude);
        const lat = Cesium.Math.toDegrees(cartographic.latitude);

        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(lon, lat, 3000000),
            duration: 2,
        });
    } else {
        hidePanel();
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

// ============================================
// URL STATE
// ============================================

function getURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('location');
}

function setURL(name) {
    const params = new URLSearchParams(window.location.search);
    params.set('location', name);
    window.history.replaceState({}, '', '?' + params.toString());
}

function clearURL() {
    window.history.replaceState({}, '', window.location.pathname);
}

async function restoreURL() {
    const locationName = getURL();
    if (!locationName) return;

    const location = allLocations.find(location =>
        location.name.toLowerCase() === decodeURIComponent(locationName).toLowerCase()
    );

    if (!location) return;

    setTimeout(function () {
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
                location.lon,
                location.lat,
                3000000
            ),
            duration: 2,
        });

        showPanel({
            name: location.name,
            sea: location.sea,
            type: location.type,
            arc: location.arc,
            notes: location.notes,
        });
    }, 11010);
}

// ============================================
// FILTER PANEL
// ============================================

function applyFilters() {
    const sliderIndex = parseInt(spoilerSlider.value);
    const allowedArcs = arcOrder.slice(0, sliderIndex + 1);
    const checkedSeas = [...document.querySelectorAll('.filterCheck[data-group="sea"]:checked')].map(cb => cb.value);
    const checkedTypes = [...document.querySelectorAll('.filterCheck[data-group="type"]:checked')].map(cb => cb.value);
    const showFiller = document.querySelector('.filterCheck[data-group="arc"][value="filler"]').checked;
    const showCanon = document.querySelector('.filterCheck[data-group="arc"][value="canon"]').checked;

    viewer.entities.values.forEach(entity => {
        if (!entity.properties) return;

        const sea = entity.properties.sea.getValue();
        const type = entity.properties.type.getValue();
        const arc = entity.properties.arc.getValue();

        const isFiller = arc.toLowerCase().includes('filler');
        const inArcRange = allowedArcs.includes(arc);
        const arcMatch = (isFiller && showFiller) || (!isFiller && showCanon && inArcRange);

        entity.show = checkedSeas.includes(sea) &&
            checkedTypes.includes(type) &&
            arcMatch;
    });

    const current = arcOrder[sliderIndex];
    spoilerArc.textContent = arcDisplayNames[current] || current;

    const visibleCount = viewer.entities.values.filter(e =>
        e.properties && e.show !== false).length;

    document.getElementById('counterCurrent').textContent = visibleCount;
}

filterToggle.addEventListener('click', function () {
    filterContent.classList.toggle('hidden');
});

document.querySelectorAll('.filterCheck').forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
});

selectAllBtn.addEventListener('click', function () {
    document.querySelectorAll('.filterCheck').forEach(cb => cb.checked = true);
    applyFilters();
});

deselectAllBtn.addEventListener('click', function () {
    document.querySelectorAll('.filterCheck').forEach(cb => cb.checked = false);
    applyFilters();
});

spoilerSlider.addEventListener('input', applyFilters);

// ============================================
// SEARCH BAR
// ============================================

searchInput.addEventListener('input', function () {
    const query = this.value.toLowerCase();

    if (query.length < 2) {
        searchDropdown.classList.add('hidden');
        searchDropdown.innerHTML = '';
        filterPanel.style.marginTop = '107px';
        return;
    }

    const sliderIndex = parseInt(spoilerSlider.value);
    const allowedArcs = arcOrder.slice(0, sliderIndex + 1);
    const showFiller = document.querySelector('.filterCheck[data-group="arc"][value="filler"]').checked;

    const results = allLocations.filter(location => {
        const isFiller = location.arc.toLowerCase().includes('filler');
        const inArcRange = allowedArcs.includes(location.arc);
        const arcVisible = (isFiller && showFiller) || (!isFiller && inArcRange);
        return location.name.toLowerCase().includes(query) && arcVisible;
    });

    if (results.length === 0) {
        searchDropdown.classList.add('hidden');
        searchDropdown.innerHTML = '';
        filterPanel.style.marginTop = '107px';
        return;
    }

    searchDropdown.innerHTML = '';
    results.slice(0, 8).forEach(location => {
        const item = document.createElement('div');
        item.className = 'searchResult';
        item.innerHTML = `
      <div class="searchResultName">${location.name}</div>
      <div class="searchResultSea">${location.sea} · ${location.type}</div>
    `;

        item.addEventListener('click', function () {
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(
                    location.lon,
                    location.lat,
                    3000000
                ),
                duration: 2,
            });

            showPanel({
                name: location.name,
                sea: location.sea,
                type: location.type,
                arc: location.arc,
                notes: location.notes,
            });

            searchDropdown.classList.add('hidden');
            searchDropdown.innerHTML = '';
            searchInput.value = '';
        });

        searchDropdown.appendChild(item);
    });

    searchDropdown.classList.remove('hidden');

    const dropdownBottom = searchDropdown.getBoundingClientRect().bottom;
    const searchTop = document.getElementById('searchContainer').getBoundingClientRect().top;
    const offset = dropdownBottom - searchTop + 45;
    filterPanel.style.marginTop = offset + 'px';
    filterPanel.style.transition = 'margin-top 0.2s ease';
});

document.addEventListener('click', function (e) {
    if (!document.getElementById('searchContainer').contains(e.target)) {
        searchDropdown.classList.add('hidden');
        searchDropdown.innerHTML = '';
        filterPanel.style.marginTop = '107px';
    }
});

// ============================================
// STRAW HAT ROUTE
// ============================================

function buildRoute() {
    const positions = [];
    routeCoordinates.forEach(point => {
        positions.push(Cesium.Cartesian3.fromDegrees(point.lon, point.lat));
    });
    return positions;
}

function showRoute() {
    if (shipInterval) return;
    const positions = buildRoute();

    const routeLine = viewer.entities.add({
        polyline: {
            positions: positions,
            width: 2,
            material: new Cesium.PolylineDashMaterialProperty({
                color: Cesium.Color.fromCssColorString('#f0d080'),
                dashLength: 20,
            }),
            clampToGround: false,
        }
    });
    routeEntities.push(routeLine);

    routeCoordinates.forEach((stop, index) => {
        const dot = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(stop.lon, stop.lat),
            point: {
                pixelSize: 6,
                color: Cesium.Color.fromCssColorString('#f0d080'),
                outlineColor: Cesium.Color.fromCssColorString('#2c1508'),
                outlineWidth: 1,
            },
        });
        routeEntities.push(dot);
    });

    shipEntity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(
            routeCoordinates[0].lon,
            routeCoordinates[0].lat
        ),
        billboard: {
            image: (() => {
                const canvas = document.createElement('canvas');
                canvas.width = 64;
                canvas.height = 64;
                return canvas;
            })(),
            scale: 1.5,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
        }
    });

    const img = new Image();
    img.src = 'assets/straw-hat-jolly-roger.png';
    img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 64, 64);
        shipEntity.billboard.image = canvas;
    };

    let currentStop = 0;
    let nextStop = 1;
    let progress = 0;
    const STEP = 0.005;

    shipInterval = setInterval(function () {
        progress += STEP;

        if (progress >= 1) {
            progress = 0;
            currentStop = nextStop;
            nextStop = (nextStop + 1) % routeCoordinates.length;
        }

        const from = routeCoordinates[currentStop];
        const to = routeCoordinates[nextStop];

        const lon = from.lon + (to.lon - from.lon) * progress;
        const lat = from.lat + (to.lat - from.lat) * progress;

        shipEntity.position = Cesium.Cartesian3.fromDegrees(lon, lat);
    }, 16);
}

function hideRoute() {
    routeEntities.forEach(e => viewer.entities.remove(e));
    routeEntities = [];
    if (shipEntity) {
        viewer.entities.remove(shipEntity);
        shipEntity = null;
    }
    if (shipInterval) {
        clearInterval(shipInterval);
        shipInterval = null;
    }
}

document.getElementById('routeToggle').addEventListener('click', function () {
    routeVisible = !routeVisible;
    if (routeVisible) {
        showRoute();
        this.classList.add('active');
        this.textContent = '✖ Hide Route';
    } else {
        hideRoute();
        this.classList.remove('active');
        this.textContent = '⚓ Straw Hat Route';
    }
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', function (e) {
    const tag = document.activeElement.tagName.toLowerCase();
    const typing = tag === 'input' || tag === 'textarea';

    if (e.key === '/' && !typing) {
        e.preventDefault();
        searchInput.focus();
    }

    if ((e.key === 'f' || e.key === 'F') && !typing) {
        filterContent.classList.toggle('hidden');
    }

    if ((e.key === 'r' || e.key === 'R') && !typing) {
        const routeBtn = document.getElementById('routeToggle');
        routeBtn.click();
    }

    if ((e.key === 'c' || e.key === 'C') && !typing) {
        searchInput.blur();
        searchDropdown.classList.add('hidden');
        searchDropdown.innerHTML = '';
        filterPanel.style.marginTop = '107px';
        filterContent.classList.add('hidden');
        hidePanel();
        searchInput.value = '';
    }

    if ((e.key === 'h' || e.key === 'H') && !typing) {
        const uiElements = [
            document.getElementById('searchContainer'),
            document.getElementById('filterPanel'),
            document.getElementById('locationCounter'),
            document.getElementById('controlsLegend'),
            document.getElementById('spoilerPanel'),
            document.getElementById('routeToggle'),
        ];

        const isHidden = uiElements[0].style.display === 'none';
        uiElements.forEach(el => {
            el.style.display = isHidden ? '' : 'none';
        });
    }

    if (e.key === 'ArrowRight' && !typing) {
        const slider = document.getElementById('spoilerSlider');
        slider.value = Math.min(parseInt(slider.value) + 1, parseInt(slider.max));
        applyFilters();
    }

    if (e.key === 'ArrowLeft' && !typing) {
        const slider = document.getElementById('spoilerSlider');
        slider.value = Math.max(parseInt(slider.value) - 1, parseInt(slider.min));
        applyFilters();
    }
});

// ============================================
// MOBILE MENU
// ============================================

mobileMenuBtn.addEventListener('click', function () {
    mobileDrawer.classList.remove('hidden');
});

drawerClose.addEventListener('click', function () {
    mobileDrawer.classList.add('hidden');
});

document.getElementById('mobileRouteToggle').addEventListener('click', function () {
    routeVisible = !routeVisible;
    if (routeVisible) {
        showRoute();
        this.classList.add('active');
        this.textContent = '✖ Hide Route';
        document.getElementById('routeToggle').classList.add('active');
        document.getElementById('routeToggle').textContent = '✖ Hide Route';
    } else {
        hideRoute();
        this.classList.remove('active');
        this.textContent = '⚓ Straw Hat Route';
        document.getElementById('routeToggle').classList.remove('active');
        document.getElementById('routeToggle').textContent = '⚓ Straw Hat Route';
    }
});

mobileSpoilerSlider.addEventListener('input', function () {
    spoilerSlider.value = this.value;
    mobileSpoilerArc.textContent = arcDisplayNames[arcOrder[parseInt(this.value)]] || arcOrder[parseInt(this.value)];
    applyFilters();
});

document.getElementById('mobileSearchInput').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const dropdown = document.getElementById('mobileSearchDropdown');

    if (query.length < 2) {
        dropdown.classList.add('hidden');
        dropdown.innerHTML = '';
        return;
    }

    const sliderIndex = parseInt(spoilerSlider.value);
    const allowedArcs = arcOrder.slice(0, sliderIndex + 1);
    const showFiller = document.querySelector('.mobileFilterCheck[data-group="arc"][value="filler"]').checked;

    const results = allLocations.filter(location => {
        const isFiller = location.arc.toLowerCase().includes('filler');
        const inArcRange = allowedArcs.includes(location.arc);
        const arcVisible = (isFiller && showFiller) || (!isFiller && inArcRange);
        return location.name.toLowerCase().includes(query) && arcVisible;
    });

    dropdown.innerHTML = '';
    results.slice(0, 6).forEach(location => {
        const item = document.createElement('div');
        item.className = 'searchResult';

        const nameEl = document.createElement('div');
        nameEl.className = 'searchResultName';
        nameEl.textContent = location.name;

        const seaEl = document.createElement('div');
        seaEl.className = 'searchResultSea';
        seaEl.textContent = `${location.sea} · ${location.type}`;

        item.appendChild(nameEl);
        item.appendChild(seaEl);

        item.addEventListener('click', function () {
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(
                    location.lon,
                    location.lat,
                    3000000
                ),
                duration: 2,
            });

            showPanel({
                name: location.name,
                sea: location.sea,
                type: location.type,
                arc: location.arc,
                notes: location.notes,
            });

            dropdown.classList.add('hidden');
            dropdown.innerHTML = '';
            this.value = '';
            mobileDrawer.classList.add('hidden');
        });

        dropdown.appendChild(item);
    });

    dropdown.classList.remove('hidden');
});

document.querySelectorAll('.mobileFilterCheck').forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
});

loadLocations();
applyFilters();