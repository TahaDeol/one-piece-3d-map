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

// The markup carries placeholder min/max/value; the real range is whatever
// arcOrder says, so adding an arc can't leave the sliders one step short.
[spoilerSlider, mobileSpoilerSlider].forEach(slider => {
    slider.max = arcOrder.length - 1;
    slider.value = arcOrder.length - 1;
});

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

    // Both sliders and labels are driven from here so desktop input,
    // mobile input, and keyboard arrows all leave the two in agreement.
    const current = arcOrder[sliderIndex];
    const label = arcDisplayNames[current] || current;
    spoilerArc.textContent = label;
    mobileSpoilerSlider.value = sliderIndex;
    mobileSpoilerArc.textContent = label;

    const visibleCount = viewer.entities.values.filter(e =>
        e.properties && e.show !== false).length;

    document.getElementById('counterCurrent').textContent = visibleCount;

    viewer.scene.requestRender();
}

filterToggle.addEventListener('click', function () {
    filterContent.classList.toggle('hidden');
});

// applyFilters() reads only the desktop .filterCheck boxes, so the two
// checkbox sets are mirrored on every change. Mobile search reads the
// .mobileFilterCheck set, so both must agree or search and map diverge.
function syncCheckbox(source, targetClass) {
    const target = document.querySelector(
        `.${targetClass}[data-group="${source.dataset.group}"][value="${source.value}"]`
    );
    if (target) target.checked = source.checked;
}

function setAllCheckboxes(checked) {
    document.querySelectorAll('.filterCheck, .mobileFilterCheck').forEach(cb => cb.checked = checked);
    applyFilters();
}

document.querySelectorAll('.filterCheck').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        syncCheckbox(this, 'mobileFilterCheck');
        applyFilters();
    });
});

selectAllBtn.addEventListener('click', () => setAllCheckboxes(true));
deselectAllBtn.addEventListener('click', () => setAllCheckboxes(false));

spoilerSlider.addEventListener('input', applyFilters);

mobileSpoilerSlider.addEventListener('input', function () {
    spoilerSlider.value = this.value;
    applyFilters();
});

document.querySelectorAll('.mobileFilterCheck').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        syncCheckbox(this, 'filterCheck');
        applyFilters();
    });
});
