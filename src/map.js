Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NTkyZDZhYi03YWZjLTRhMGItYmNjNy0yYWMzMjEwMGY5OGQiLCJpZCI6NDE2MTY3LCJpYXQiOjE3NzU3ODUxMjF9.4yH3waGH3QMFC-dJI21EMZCHEj0-3sohaAaNNmRweyA'

const viewer = new Cesium.Viewer('cesiumContainer', {

  // Turn off all the default Earth UI elements
  baseLayerPicker:   false,
  geocoder:          false,
  homeButton:        false,
  sceneModePicker:   false,
  navigationHelpButton: false,
  animation:         false,
  timeline:          false,
  fullscreenButton:  false,

  // Turn off default Earth imagery for now
  imageryProvider: false,

  // Turn off real world terrain
  terrainProvider: new Cesium.EllipsoidTerrainProvider(),
});

viewer.CesiumWidget._cesiumWidget.creditsContainer.style.display = 'none';

viewer.scene.backgroundColor = Cesium.Color.BLACK;

viewer.scene.skyAtmosphere.show = true;

//TEST - basic color to the globe to check if working
viewer.scene.globe.baseColor = Cesium.Color.DARKBLUE;

viewer.camara.setView({
    destination: Cesium.Cartesian3.fromDegrees(
        0,
        20,
        20000000
    )
});

