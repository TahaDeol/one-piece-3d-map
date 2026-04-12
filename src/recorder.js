Cesium.Ion.defaultAccessToken = 'YOUR_TOKEN_HERE';

const viewer = new Cesium.Viewer('cesiumContainer', {
  baseLayerPicker:      false,
  geocoder:             false,
  homeButton:           false,
  sceneModePicker:      false,
  navigationHelpButton: false,
  animation:            false,
  timeline:             false,
  fullscreenButton:     false,
  terrainProvider:      new Cesium.EllipsoidTerrainProvider(),
  imageryProvider:      false,
});

viewer.cesiumWidget.creditContainer.style.display = 'none';
viewer.scene.backgroundColor = Cesium.Color.BLACK;

const imageryProvider = new Cesium.UrlTemplateImageryProvider({
  url: 'tiles/{z}/{x}/{reverseY}.jpg',
  tilingScheme: new Cesium.WebMercatorTilingScheme(),
  minimumLevel: 0,
  maximumLevel: 6,
});

viewer.imageryLayers.addImageryProvider(imageryProvider);

viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(0, 20, 20000000)
});

// ============================================
// STATE
// ============================================
let locations = [];
let pendingCoords = null;
let markers = [];

// ============================================
// UI ELEMENTS
// ============================================
const form       = document.getElementById('form');
const instruction = document.getElementById('instruction');
const saveBtn    = document.getElementById('saveBtn');
const cancelBtn  = document.getElementById('cancelBtn');
const exportBtn  = document.getElementById('exportBtn');
const importBtn  = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');
const countEl    = document.getElementById('count');
const listEl     = document.getElementById('locationList');

// ============================================
// GLOBE CLICK — record coordinates
// ============================================
viewer.screenSpaceEventHandler.setInputAction(function(click) {
  const ray = viewer.camera.getPickRay(click.position);
  const coords = viewer.scene.globe.pick(ray, viewer.scene);

  if (!coords) return;

  const cartographic = Cesium.Cartographic.fromCartesian(coords);
  const lon = Cesium.Math.toDegrees(cartographic.longitude);
  const lat = Cesium.Math.toDegrees(cartographic.latitude);

  pendingCoords = { lon: parseFloat(lon.toFixed(4)), lat: parseFloat(lat.toFixed(4)) };

  // Show the form
  form.classList.remove('hidden');
  instruction.textContent = `Pinned at ${pendingCoords.lon}, ${pendingCoords.lat} — fill in details`;
  document.getElementById('name').focus();

}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

// ============================================
// SAVE LOCATION
// ============================================
saveBtn.addEventListener('click', function() {
  const name = document.getElementById('name').value.trim();
  if (!name) {
    alert('Please enter a location name');
    return;
  }
  if (!pendingCoords) return;

  const location = {
    id: Date.now(),
    name: name,
    lon: pendingCoords.lon,
    lat: pendingCoords.lat,
    sea: document.getElementById('sea').value,
    type: document.getElementById('type').value,
    arc: document.getElementById('arc').value.trim(),
    notes: document.getElementById('notes').value.trim(),
  };

  locations.push(location);
  addMarker(location);
  addToList(location);
  resetForm();
});

// ============================================
// CANCEL
// ============================================
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
  form.classList.add('hidden');
  instruction.textContent = 'Click anywhere on the globe to pin a location';
  document.getElementById('name').value = '';
  document.getElementById('arc').value = '';
  document.getElementById('notes').value = '';
  pendingCoords = null;
}

// ============================================
// ADD MARKER TO GLOBE
// ============================================
function addMarker(location) {
  const entity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(location.lon, location.lat),
    billboard: {
      image: createMarkerCanvas(),
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      scale: 0.5,
    },
    label: {
      text: location.name,
      font: '12px Georgia',
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -20),
    }
  });
  markers.push({ id: location.id, entity });
}

function createMarkerCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 20;
  canvas.height = 20;
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.arc(10, 10, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#c8a951';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();
  return canvas;
}

// ============================================
// ADD TO SIDEBAR LIST
// ============================================
function addToList(location) {
  countEl.textContent = locations.length;
  const li = document.createElement('li');
  li.id = `item-${location.id}`;
  li.innerHTML = `
    <div>
      <strong>${location.name}</strong><br>
      <span>${location.sea} · ${location.type}</span>
    </div>
    <button class="delete-btn" onclick="deleteLocation(${location.id})">✕</button>
  `;
  listEl.appendChild(li);
}

// ============================================
// DELETE LOCATION
// ============================================
function deleteLocation(id) {
  locations = locations.filter(l => l.id !== id);
  const markerEntry = markers.find(m => m.id === id);
  if (markerEntry) {
    viewer.entities.remove(markerEntry.entity);
    markers = markers.filter(m => m.id !== id);
  }
  const li = document.getElementById(`item-${id}`);
  if (li) li.remove();
  countEl.textContent = locations.length;
}

// ============================================
// EXPORT JSON
// ============================================
exportBtn.addEventListener('click', function() {
  const json = JSON.stringify(locations, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'locations.json';
  a.click();
  URL.revokeObjectURL(url);
});

// ============================================
// IMPORT EXISTING JSON
// ============================================
importBtn.addEventListener('click', () => importFile.click());

importFile.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(event) {
    const imported = JSON.parse(event.target.result);
    imported.forEach(location => {
      locations.push(location);
      addMarker(location);
      addToList(location);
    });
  };
  reader.readAsText(file);
});