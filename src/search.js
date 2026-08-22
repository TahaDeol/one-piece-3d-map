import { viewer } from './viewer.js';
import { allLocations } from './data/locations.js';
import { arcOrder } from './config.js';
import { isLocationVisible } from './filters.js';
import { showPanel } from './infoPanel.js';

const spoilerSlider = document.getElementById('spoilerSlider');
const searchInput = document.getElementById('searchInput');
const searchDropdown = document.getElementById('searchDropdown');

searchInput.addEventListener('input', function () {
    const query = this.value.toLowerCase();

    if (query.length < 2) {
        searchDropdown.classList.add('hidden');
        searchDropdown.innerHTML = '';
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
        searchDropdown.classList.add('hidden');
        searchDropdown.innerHTML = '';
        return;
    }

    searchDropdown.innerHTML = '';
    results.slice(0, 8).forEach(location => {
        const item = document.createElement('div');
        item.className = 'searchResult';
        item.innerHTML = `
      <div class="searchResultName">${location.name}</div>
      <div class="searchResultSea">${location.sea} · ${location.type}</div>
    `;

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

            searchDropdown.classList.add('hidden');
            searchDropdown.innerHTML = '';
            searchInput.value = '';
        });

        searchDropdown.appendChild(item);
    });

    searchDropdown.classList.remove('hidden');
});

document.addEventListener('click', function (e) {
    if (!document.getElementById('searchContainer').contains(e.target)) {
        searchDropdown.classList.add('hidden');
        searchDropdown.innerHTML = '';
    }
});

document.getElementById('mobileSearchInput').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const dropdown = document.getElementById('mobileSearchDropdown');

    if (query.length < 2) {
        dropdown.classList.add('hidden');
        dropdown.innerHTML = '';
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

    dropdown.innerHTML = '';
    results.slice(0, 6).forEach(location => {
        const item = document.createElement('div');
        item.className = 'searchResult';

        const nameEl = document.createElement('div');
        nameEl.className = 'searchResultName';
        nameEl.textContent = location.name;

        const seaEl = document.createElement('div');
        seaEl.className = 'searchResultSea';
        seaEl.textContent = `${location.sea} · ${location.type}`;

        item.appendChild(nameEl);
        item.appendChild(seaEl);

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

            dropdown.classList.add('hidden');
            dropdown.innerHTML = '';
            this.value = '';
            document.getElementById('mobileDrawer').classList.add('hidden');
        });

        dropdown.appendChild(item);
    });

    dropdown.classList.remove('hidden');
});
