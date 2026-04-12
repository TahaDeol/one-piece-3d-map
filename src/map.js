const loadingScreen = document.getElementById('loadingScreen');
const loadingFill   = document.getElementById('loadingFill');
const loadingText   = document.getElementById('loadingText');

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
const totalSteps    = totalDuration / intervalSpeed;
const increment     = 100 / totalSteps;

const loadingInterval = setInterval(function() {
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
    setTimeout(function() {
      loadingText.textContent = loadingMessages[messageIndex];
      loadingText.style.opacity = '1';
    }, 400);
  }

}, intervalSpeed);

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NTkyZDZhYi03YWZjLTRhMGItYmNjNy0yYWMzMjEwMGY5OGQiLCJpZCI6NDE2MTY3LCJpYXQiOjE3NzU3ODUxMjF9.4yH3waGH3QMFC-dJI21EMZCHEj0-3sohaAaNNmRweyA';

const viewer = new Cesium.Viewer('cesiumContainer', {
  baseLayerPicker:         false,
  geocoder:                false,
  homeButton:              false,
  sceneModePicker:         false,
  navigationHelpButton:    false,
  animation:               false,
  timeline:                false,
  fullscreenButton:        false,
  terrainProvider:         new Cesium.EllipsoidTerrainProvider(),
  imageryProvider:         false,
});

viewer.cesiumWidget.creditContainer.style.display = 'none';
viewer.scene.backgroundColor = Cesium.Color.BLACK;
viewer.scene.skyAtmosphere.show = true;

const imageryProvider = new Cesium.UrlTemplateImageryProvider({
  url: 'tiles/{z}/{x}/{reverseY}.jpg',
  tilingScheme: new Cesium.WebMercatorTilingScheme(),
  minimumLevel: 0,
  maximumLevel: 6,
});

viewer.imageryLayers.addImageryProvider(imageryProvider);

// ============================================
// MARKER COLORS BY REGION
// ============================================
const regionColors = {
  'East Blue':   '#3498db',
  'West Blue':   '#9b59b6',
  'North Blue':  '#2ecc71',
  'South Blue':  '#e67e22',
  'Grand Line':  '#c8a951',
  'New World':   '#e74c3c',
  'Calm Belt':   '#1abc9c',
  'Red Line':    '#e74c3c',
};

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

// ============================================
// LOAD LOCATIONS
// ============================================
async function loadLocations() {
  const response = await fetch('data/locations.json');
  const locations = await response.json();

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
        name:  location.name,
        sea:   location.sea,
        type:  location.type,
        arc:   location.arc,
        notes: location.notes,
      }
    });
  });
}

loadLocations();
// ============================================
// HIDE LOADING SCREEN WHEN GLOBE IS READY
// ============================================
setTimeout(function() {
  clearInterval(loadingInterval);
  loadingFill.style.width   = '100%';
  loadingText.style.opacity = '0';

  setTimeout(function() {
    loadingText.style.opacity = '1';
    loadingText.textContent   = 'The One Piece is Real!';

    setTimeout(function() {
      loadingScreen.style.opacity = '0';
      setTimeout(function() {
        loadingScreen.style.display = 'none';
      }, 800);
    }, 800);
  }, 400);

}, 10000);

// ============================================
// CLICK HANDLER — show info panel
// ============================================
viewer.screenSpaceEventHandler.setInputAction(function(click) {
  const picked = viewer.scene.pick(click.position);

  if (Cesium.defined(picked) && picked.id) {
    const entity = picked.id;
    const props = entity.properties;

    if (!props) return;

    showPanel({
      name:  props.name.getValue(),
      sea:   props.sea.getValue(),
      type:  props.type.getValue(),
      arc:   props.arc.getValue(),
      notes: props.notes.getValue(),
    });

    const position = entity.position.getValue(
      viewer.clock.currentTime
    );

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
// INFO PANEL
// ============================================
function showPanel(data) {
  document.getElementById('panelName').textContent  = data.name;
  document.getElementById('panelSea').textContent   = data.sea;
  document.getElementById('panelType').textContent  = data.type;
  document.getElementById('panelArc').textContent   = data.arc;
  document.getElementById('panelNotes').textContent = data.notes;
  document.getElementById('infoPanel').classList.remove('hidden');
}

function hidePanel() {
  document.getElementById('infoPanel').classList.add('hidden');
}

// ============================================
// OPENING CAMERA ANIMATION
// ============================================
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(0, 0, 62500000),
});

setTimeout(function() {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(138, 50, 3000000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch:   Cesium.Math.toRadians(-75),
      roll:    0,
    },
    duration:       5,
    easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
  });
}, 11000);