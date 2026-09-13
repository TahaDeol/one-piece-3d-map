import { viewer } from './viewer.js';
import { allLocations } from './data/locations.js';
import { arcOrder } from './config.js';
import { isLocationVisible } from './filters.js';
import { showPanel } from './infoPanel.js';
import { closeDrawer } from './mobileMenu.js';

const spoilerSlider = document.getElementById('spoilerSlider');
const searchInput = document.getElementById('searchInput');
const searchDropdown = document.getElementById('searchDropdown');
const mobileSearchInput = document.getElementById('mobileSearchInput');
const mobileSearchDropdown = document.getElementById('mobileSearchDropdown');

// ---- Combobox plumbing shared by the desktop and mobile dropdowns ----
// The filtering logic below is intentionally duplicated per platform (see
// CLAUDE.md); only the DOM/keyboard helpers are shared.

// Uses textContent so a name can never be interpreted as markup.
function createResultItem(location, idPrefix) {
    const item = document.createElement('div');
    item.className = 'searchResult';
    item.id = `${idPrefix}-${location.id}`;
    item.setAttribute('role', 'option');
    item.setAttribute('aria-selected', 'false');

    const nameEl = document.createElement('div');
    nameEl.className = 'searchResultName';
    nameEl.textContent = location.name;

    const seaEl = document.createElement('div');
    seaEl.className = 'searchResultSea';
    seaEl.textContent = `${location.sea} · ${location.type}`;

    item.appendChild(nameEl);
    item.appendChild(seaEl);
    return item;
}

function openDropdown(input, dropdown) {
    dropdown.classList.remove('hidden');
    input.setAttribute('aria-expanded', 'true');
}

function closeDropdown(input, dropdown) {
    dropdown.classList.add('hidden');
    dropdown.innerHTML = '';
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
}

export function closeAllDropdowns() {
    closeDropdown(searchInput, searchDropdown);
    closeDropdown(mobileSearchInput, mobileSearchDropdown);
}

function setActiveOption(input, dropdown, index) {
    const options = dropdown.querySelectorAll('.searchResult');
    options.forEach((option, i) => {
        option.classList.toggle('active', i === index);
        option.setAttribute('aria-selected', String(i === index));
    });

    if (index >= 0 && options[index]) {
        input.setAttribute('aria-activedescendant', options[index].id);
        options[index].scrollIntoView({ block: 'nearest' });
    } else {
        input.removeAttribute('aria-activedescendant');
    }
}

// Focus stays in the input; ArrowUp/ArrowDown move the highlight, Enter
// selects it (or the first result if nothing is highlighted). Escape is
// handled globally in keyboard.js.
function attachComboboxKeys(input, dropdown) {
    input.addEventListener('keydown', function (e) {
        if (dropdown.classList.contains('hidden')) return;

        const options = dropdown.querySelectorAll('.searchResult');
        if (options.length === 0) return;

        const current = [...options].findIndex(option => option.classList.contains('active'));

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveOption(input, dropdown, (current + 1) % options.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            // With nothing highlighted, ArrowUp starts from the last result.
            setActiveOption(input, dropdown, current < 0 ? options.length - 1 : (current - 1 + options.length) % options.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            options[current >= 0 ? current : 0].click();
        }
    });
}

attachComboboxKeys(searchInput, searchDropdown);
attachComboboxKeys(mobileSearchInput, mobileSearchDropdown);

// ---- Desktop search ----

searchInput.addEventListener('input', function () {
    const query = this.value.toLowerCase();

    if (query.length < 2) {
        closeDropdown(searchInput, searchDropdown);
        return;
    }

    const sliderIndex = parseInt(spoilerSlider.value);
    const allowedArcs = arcOrder.slice(0, sliderIndex + 1);
    const checkedSeas = [...document.querySelectorAll('.filterCheck[data-group="sea"]:checked')].map(cb => cb.value);
    const checkedTypes = [...document.querySelectorAll('.filterCheck[data-group="type"]:checked')].map(cb => cb.value);
    const showFiller = document.querySelector('.filterCheck[data-group="arc"][value="filler"]').checked;
    const showCanon = document.querySelector('.filterCheck[data-group="arc"][value="canon"]').checked;

    const results = allLocations.filter(location =>
        location.name.toLowerCase().includes(query) &&
        isLocationVisible(location, { checkedSeas, checkedTypes, allowedArcs, showCanon, showFiller })
    );

    if (results.length === 0) {
        closeDropdown(searchInput, searchDropdown);
        return;
    }

    searchDropdown.innerHTML = '';
    results.slice(0, 8).forEach(location => {
        const item = createResultItem(location, 'searchOption');

        item.addEventListener('click', function () {
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(
                    location.lon,
                    location.lat,
                    3000000
                ),
                duration: 2,
            });

            showPanel({
                name: location.name,
                sea: location.sea,
                type: location.type,
                arc: location.arc,
                notes: location.notes,
            });

            closeDropdown(searchInput, searchDropdown);
            searchInput.value = '';
        });

        searchDropdown.appendChild(item);
    });

    openDropdown(searchInput, searchDropdown);
});

document.addEventListener('click', function (e) {
    if (!document.getElementById('searchContainer').contains(e.target)) {
        closeDropdown(searchInput, searchDropdown);
    }
});

// ---- Mobile search ----
mobileSearchInput.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const dropdown = mobileSearchDropdown;

    if (query.length < 2) {
        closeDropdown(mobileSearchInput, dropdown);
        return;
    }

    const sliderIndex = parseInt(spoilerSlider.value);
    const allowedArcs = arcOrder.slice(0, sliderIndex + 1);
    const checkedSeas = [...document.querySelectorAll('.mobileFilterCheck[data-group="sea"]:checked')].map(cb => cb.value);
    const checkedTypes = [...document.querySelectorAll('.mobileFilterCheck[data-group="type"]:checked')].map(cb => cb.value);
    const showFiller = document.querySelector('.mobileFilterCheck[data-group="arc"][value="filler"]').checked;
    const showCanon = document.querySelector('.mobileFilterCheck[data-group="arc"][value="canon"]').checked;

    const results = allLocations.filter(location =>
        location.name.toLowerCase().includes(query) &&
        isLocationVisible(location, { checkedSeas, checkedTypes, allowedArcs, showCanon, showFiller })
    );

    if (results.length === 0) {
        closeDropdown(mobileSearchInput, dropdown);
        return;
    }

    dropdown.innerHTML = '';
    results.slice(0, 6).forEach(location => {
        const item = createResultItem(location, 'mobileSearchOption');

        item.addEventListener('click', function () {
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(
                    location.lon,
                    location.lat,
                    3000000
                ),
                duration: 2,
            });

            showPanel({
                name: location.name,
                sea: location.sea,
                type: location.type,
                arc: location.arc,
                notes: location.notes,
            });

            closeDropdown(mobileSearchInput, dropdown);
            // `this` here is the clicked row, not the input; the old code
            // set this.value and never actually cleared the box.
            mobileSearchInput.value = '';
            closeDrawer();
        });

        dropdown.appendChild(item);
    });

    openDropdown(mobileSearchInput, dropdown);
});
