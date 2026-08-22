import { viewer } from './viewer.js';
import { arcOrder, arcDisplayNames } from './config.js';

const filterToggle = document.getElementById('filterToggle');
const filterContent = document.getElementById('filterContent');
const selectAllBtn = document.getElementById('selectAllBtn');
const deselectAllBtn = document.getElementById('deselectAllBtn');
const spoilerSlider = document.getElementById('spoilerSlider');
const spoilerArc = document.getElementById('spoilerArc');
const mobileSpoilerSlider = document.getElementById('mobileSpoilerSlider');
const mobileSpoilerArc = document.getElementById('mobileSpoilerArc');

export function isLocationVisible(location, { checkedSeas, checkedTypes, allowedArcs, showCanon, showFiller }) {
    const isFiller = location.arc.toLowerCase().includes('filler');
    const inArcRange = allowedArcs.includes(location.arc);
    const arcMatch = (isFiller && showFiller) || (!isFiller && showCanon && inArcRange);

    return checkedSeas.includes(location.sea) &&
        checkedTypes.includes(location.type) &&
        arcMatch;
}

export function applyFilters() {
    const sliderIndex = parseInt(spoilerSlider.value);
    const allowedArcs = arcOrder.slice(0, sliderIndex + 1);
    const checkedSeas = [...document.querySelectorAll('.filterCheck[data-group="sea"]:checked')].map(cb => cb.value);
    const checkedTypes = [...document.querySelectorAll('.filterCheck[data-group="type"]:checked')].map(cb => cb.value);
    const showFiller = document.querySelector('.filterCheck[data-group="arc"][value="filler"]').checked;
    const showCanon = document.querySelector('.filterCheck[data-group="arc"][value="canon"]').checked;

    viewer.entities.values.forEach(entity => {
        if (!entity.properties) return;

        entity.show = isLocationVisible({
            sea: entity.properties.sea.getValue(),
            type: entity.properties.type.getValue(),
            arc: entity.properties.arc.getValue(),
        }, { checkedSeas, checkedTypes, allowedArcs, showCanon, showFiller });
    });

    const current = arcOrder[sliderIndex];
    spoilerArc.textContent = arcDisplayNames[current] || current;

    const visibleCount = viewer.entities.values.filter(e =>
        e.properties && e.show !== false).length;

    document.getElementById('counterCurrent').textContent = visibleCount;
}

filterToggle.addEventListener('click', function () {
    filterContent.classList.toggle('hidden');
});

document.querySelectorAll('.filterCheck').forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
});

selectAllBtn.addEventListener('click', function () {
    document.querySelectorAll('.filterCheck').forEach(cb => cb.checked = true);
    applyFilters();
});

deselectAllBtn.addEventListener('click', function () {
    document.querySelectorAll('.filterCheck').forEach(cb => cb.checked = false);
    applyFilters();
});

spoilerSlider.addEventListener('input', applyFilters);

mobileSpoilerSlider.addEventListener('input', function () {
    spoilerSlider.value = this.value;
    mobileSpoilerArc.textContent = arcDisplayNames[arcOrder[parseInt(this.value)]] || arcOrder[parseInt(this.value)];
    applyFilters();
});

document.querySelectorAll('.mobileFilterCheck').forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
});
