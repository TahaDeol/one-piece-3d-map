import { viewer } from './viewer.js';
import { regionColors } from './config.js';

export function createMarkerCanvas(color) {
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

export function createMarkers(locations) {
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
                name: location.name,
                sea: location.sea,
                type: location.type,
                arc: location.arc,
                notes: location.notes,
            }
        });
    });
}
