import { viewer } from './viewer.js';
import { loadLocations } from './data/locations.js';
import { createMarkers } from './markers.js';
import { showPanel } from './infoPanel.js';
import { getRestoreLocation } from './urlState.js';
import { applyFilters } from './filters.js';
import './search.js';
import './route.js';
import './keyboard.js';
import './mobileMenu.js';

const loadingScreen = document.getElementById('loadingScreen');
const loadingFill = document.getElementById('loadingFill');
const loadingText = document.getElementById('loadingText');

loadingFill.style.width = '100%';
loadingText.textContent = 'The One Piece is Real!';
loadingScreen.style.opacity = '0';

setTimeout(function () {
    loadingScreen.style.display = 'none';
}, 800);

async function init() {
    const locations = await loadLocations();
    createMarkers(locations);

    const restoreLocation = getRestoreLocation();
    if (restoreLocation) {
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
                restoreLocation.lon,
                restoreLocation.lat,
                3000000
            ),
            duration: 2,
        });

        showPanel({
            name: restoreLocation.name,
            sea: restoreLocation.sea,
            type: restoreLocation.type,
            arc: restoreLocation.arc,
            notes: restoreLocation.notes,
        });
    }

    applyFilters();
}

init();
