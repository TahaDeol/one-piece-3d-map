import { applyFilters } from './filters.js';
import { hidePanel } from './infoPanel.js';

const searchInput = document.getElementById('searchInput');
const searchDropdown = document.getElementById('searchDropdown');
const filterContent = document.getElementById('filterContent');

document.addEventListener('keydown', function (e) {
    const tag = document.activeElement.tagName.toLowerCase();
    const typing = tag === 'input' || tag === 'textarea';

    if (e.key === '/' && !typing) {
        e.preventDefault();
        searchInput.focus();
    }

    if ((e.key === 'f' || e.key === 'F') && !typing) {
        filterContent.classList.toggle('hidden');
    }

    if ((e.key === 'r' || e.key === 'R') && !typing) {
        const routeBtn = document.getElementById('routeToggle');
        routeBtn.click();
    }

    if ((e.key === 'c' || e.key === 'C') && !typing) {
        searchInput.blur();
        searchDropdown.classList.add('hidden');
        searchDropdown.innerHTML = '';
        filterContent.classList.add('hidden');
        hidePanel();
        searchInput.value = '';
    }

    if ((e.key === 'h' || e.key === 'H') && !typing) {
        const uiElements = [
            document.getElementById('searchContainer'),
            document.getElementById('filterPanel'),
            document.getElementById('locationCounter'),
            document.getElementById('controlsLegend'),
            document.getElementById('spoilerPanel'),
            document.getElementById('routeToggle'),
        ];

        const isHidden = uiElements[0].style.display === 'none';
        uiElements.forEach(el => {
            el.style.display = isHidden ? '' : 'none';
        });
    }

    if (e.key === 'ArrowRight' && !typing) {
        const slider = document.getElementById('spoilerSlider');
        slider.value = Math.min(parseInt(slider.value) + 1, parseInt(slider.max));
        applyFilters();
    }

    if (e.key === 'ArrowLeft' && !typing) {
        const slider = document.getElementById('spoilerSlider');
        slider.value = Math.max(parseInt(slider.value) - 1, parseInt(slider.min));
        applyFilters();
    }
});
