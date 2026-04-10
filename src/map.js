Cesium.Ion.defaultAccessToken = 'YOUR_TOKEN_HERE';

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

viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(
    0,
    20,
    20000000
  )
});