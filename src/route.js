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

let routeVisible = false;
let routeEntities = [];
let shipEntity = null;
let shipInterval = null;

function buildRoute() {
    const positions = [];
    routeCoordinates.forEach(point => {
        positions.push(Cesium.Cartesian3.fromDegrees(point.lon, point.lat));
    });
    return positions;
}

function buildLegs() {
    const legs = [];

    for (let i = 0; i < routeCoordinates.length; i++) {
        const from = routeCoordinates[i];
        const to = routeCoordinates[(i + 1) % routeCoordinates.length];

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
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 64, 64);
        shipEntity.billboard.image = canvas;
    };

    const legs = buildLegs();
    const totalDistance = legs.reduce((sum, leg) => sum + leg.distance, 0);
    const TICK_MS = 16;
    const degreesPerTick = totalDistance / (legs.length * (3200 / TICK_MS));

    let legIndex = 0;
    let progress = 0;

    shipInterval = setInterval(function () {
        const leg = legs[legIndex];
        progress += degreesPerTick / leg.distance;

        if (progress >= 1) {
            progress = 0;
            legIndex = (legIndex + 1) % legs.length;
        }

        const current = legs[legIndex];
        const lon = current.from.lon + current.dLon * progress;
        const lat = current.from.lat + (current.to.lat - current.from.lat) * progress;

        shipEntity.position = Cesium.Cartesian3.fromDegrees(lon, lat);
    }, TICK_MS);
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
