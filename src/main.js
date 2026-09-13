const loadingScreen = document.getElementById('loadingScreen');
const loadingFill = document.getElementById('loadingFill');
const loadingText = document.getElementById('loadingText');

function dismissLoadingScreen() {
    loadingFill.style.width = '100%';
    loadingText.textContent = 'The One Piece is Real!';
    loadingScreen.style.opacity = '0';

    setTimeout(function () {
        loadingScreen.style.display = 'none';
    }, 800);
}

function showLoadError(message) {
    loadingFill.style.width = '0';
    loadingText.textContent = message;
}

async function boot() {
    // viewer.js reads the Cesium global at import time. With static imports a
    // CDN failure would throw before a single line of this file ran, leaving
    // visitors on "Setting sail..." forever. Loading the modules here instead
    // lets that failure be caught and reported.
    let viewer, loadLocations, createMarkers, showPanel, getRestoreLocation, applyFilters;
    try {
        const [viewerMod, locationsMod, markersMod, infoPanelMod, urlStateMod, filtersMod] =
            await Promise.all([
                import('./viewer.js'),
                import('./data/locations.js'),
                import('./markers.js'),
                import('./infoPanel.js'),
                import('./urlState.js'),
                import('./filters.js'),
                import('./search.js'),
                import('./route.js'),
                import('./keyboard.js'),
                import('./mobileMenu.js'),
            ]);
        ({ viewer } = viewerMod);
        ({ loadLocations } = locationsMod);
        ({ createMarkers } = markersMod);
        ({ showPanel } = infoPanelMod);
        ({ getRestoreLocation } = urlStateMod);
        ({ applyFilters } = filtersMod);
    } catch (err) {
        console.error('Failed to load the map engine:', err);
        showLoadError("Couldn't load the map engine. Check your connection and reload the page.");
        return;
    }

    dismissLoadingScreen();

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

boot();
