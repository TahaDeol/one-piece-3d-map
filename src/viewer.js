const CESIUM_ION_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NTkyZDZhYi03YWZjLTRhMGItYmNjNy0yYWMzMjEwMGY5OGQiLCJpZCI6NDE2MTY3LCJpYXQiOjE3NzU3ODUxMjF9.4yH3waGH3QMFC-dJI21EMZCHEj0-3sohaAaNNmRweyA';

Cesium.Ion.defaultAccessToken = CESIUM_ION_TOKEN;

export const viewer = new Cesium.Viewer('cesiumContainer', {
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

// Cesium's default wheel-zoom pivots around whatever point is under the
// cursor in both directions, which visibly shifts the globe off-center
// when zooming out from anywhere but dead center. Zooming out here instead
// dollies straight back along the current view direction (globe stays put);
// zooming in still flies toward the point under the cursor.
viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.PINCH];

const zoomCanvas = viewer.scene.canvas;

zoomCanvas.addEventListener('wheel', function (e) {
    e.preventDefault();

    const camera = viewer.camera;
    const height = camera.positionCartographic.height;
    const amount = (Math.min(Math.abs(e.deltaY), 300) / 300) * height * 0.2;

    if (e.deltaY < 0) {
        const rect = zoomCanvas.getBoundingClientRect();
        const cursor = new Cesium.Cartesian2(e.clientX - rect.left, e.clientY - rect.top);
        const target = camera.pickEllipsoid(cursor, viewer.scene.globe.ellipsoid);

        if (target) {
            const direction = Cesium.Cartesian3.subtract(target, camera.position, new Cesium.Cartesian3());
            const distance = Cesium.Cartesian3.magnitude(direction);
            Cesium.Cartesian3.normalize(direction, direction);
            const moveAmount = Math.min(amount, distance * 0.9);
            Cesium.Cartesian3.add(
                camera.position,
                Cesium.Cartesian3.multiplyByScalar(direction, moveAmount, direction),
                camera.position
            );
        } else {
            camera.zoomIn(amount);
        }
    } else {
        camera.zoomOut(amount);
    }
}, { passive: false });

const imageryProvider = new Cesium.UrlTemplateImageryProvider({
    url: 'https://pub-c74d8d872e454a78955377cc3fc0b7f7.r2.dev/{z}/{x}/{reverseY}.jpg',
    tilingScheme: new Cesium.GeographicTilingScheme(),
    minimumLevel: 0,
    maximumLevel: 6,
});

viewer.imageryLayers.addImageryProvider(imageryProvider);

viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(0, 0, 62500000),
});

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
