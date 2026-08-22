import { viewer } from './viewer.js';
import { setURL, clearURL } from './urlState.js';

export function showPanel(data) {
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

export function hidePanel() {
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

let hoveredEntity = null;

viewer.screenSpaceEventHandler.setInputAction(function (movement) {
    const picked = viewer.scene.pick(movement.endPosition);
    const entity = Cesium.defined(picked) && picked.id && picked.id.label ? picked.id : null;

    if (entity === hoveredEntity) return;

    if (hoveredEntity) {
        hoveredEntity.label.show = false;
    }

    hoveredEntity = entity;

    if (hoveredEntity) {
        hoveredEntity.label.show = true;
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
