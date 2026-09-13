import { viewer } from './viewer.js';

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
    { name: "Loguetown / Polestar Islands", lon: 18.4545, lat: 29.1279 },
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
    { name: "Water Seven", lon: 126.9197, lat: -2.8379 },
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

let routeVisible = false;
let routeEntities = [];
let shipEntity = null;
let shipFrame = null;

function buildRoute() {
    const positions = [];
    routeCoordinates.forEach(point => {
        positions.push(Cesium.Cartesian3.fromDegrees(point.lon, point.lat));
    });
    return positions;
}

function buildLegs() {
    const legs = [];

    // One leg per drawn polyline segment. The ship does not sail from the
    // last stop back to the first: that voyage never happened, and the line
    // isn't drawn, so the animation jumps back to Dawn Island instead.
    for (let i = 0; i < routeCoordinates.length - 1; i++) {
        const from = routeCoordinates[i];
        const to = routeCoordinates[i + 1];

        let dLon = to.lon - from.lon;
        if (dLon > 180) dLon -= 360;
        if (dLon < -180) dLon += 360;

        const dLat = to.lat - from.lat;
        const distance = Math.hypot(dLon, dLat) || 0.0001;

        legs.push({ from, to, dLon, distance });
    }

    return legs;
}

function showRoute() {
    if (shipFrame !== null) return;
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

    routeCoordinates.forEach((stop) => {
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
        // The route may have been hidden before the sprite arrived.
        if (!shipEntity) return;
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 64, 64);
        shipEntity.billboard.image = canvas;
        viewer.scene.requestRender();
    };

    const legs = buildLegs();
    const totalDistance = legs.reduce((sum, leg) => sum + leg.distance, 0);
    const AVERAGE_LEG_MS = 3200;
    const degreesPerMs = totalDistance / (legs.length * AVERAGE_LEG_MS);
    // requestAnimationFrame pauses in background tabs; capping the step keeps
    // the ship from teleporting when the tab comes back.
    const MAX_FRAME_MS = 100;

    let legIndex = 0;
    let progress = 0; // 0..1 along the current leg
    let lastTime = null;

    function step(now) {
        if (lastTime !== null) {
            let remaining = Math.min(now - lastTime, MAX_FRAME_MS) * degreesPerMs;

            // Carry leftover distance across leg boundaries so a slow frame
            // can't skip a short leg.
            while (remaining > 0) {
                const leg = legs[legIndex];
                const legLeft = (1 - progress) * leg.distance;

                if (remaining < legLeft) {
                    progress += remaining / leg.distance;
                    remaining = 0;
                } else {
                    remaining -= legLeft;
                    progress = 0;
                    legIndex = (legIndex + 1) % legs.length;
                }
            }
        }
        lastTime = now;

        const leg = legs[legIndex];
        const lon = leg.from.lon + leg.dLon * progress;
        const lat = leg.from.lat + (leg.to.lat - leg.from.lat) * progress;
        shipEntity.position = Cesium.Cartesian3.fromDegrees(lon, lat);
        viewer.scene.requestRender();

        shipFrame = requestAnimationFrame(step);
    }

    shipFrame = requestAnimationFrame(step);
}

function hideRoute() {
    routeEntities.forEach(e => viewer.entities.remove(e));
    routeEntities = [];
    if (shipEntity) {
        viewer.entities.remove(shipEntity);
        shipEntity = null;
    }
    if (shipFrame !== null) {
        cancelAnimationFrame(shipFrame);
        shipFrame = null;
    }
    viewer.scene.requestRender();
}

function setToggleState(button, active) {
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
    button.textContent = active ? '✖ Hide Route' : '⚓ Straw Hat Route';
}

document.getElementById('routeToggle').addEventListener('click', function () {
    routeVisible = !routeVisible;
    if (routeVisible) {
        showRoute();
    } else {
        hideRoute();
    }
    setToggleState(this, routeVisible);
});

document.getElementById('mobileRouteToggle').addEventListener('click', function () {
    routeVisible = !routeVisible;
    if (routeVisible) {
        showRoute();
    } else {
        hideRoute();
    }
    setToggleState(this, routeVisible);
    setToggleState(document.getElementById('routeToggle'), routeVisible);
});
