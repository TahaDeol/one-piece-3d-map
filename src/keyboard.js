import { applyFilters, setFilterPanelOpen, toggleFilterPanel } from './filters.js';
import { hidePanel } from './infoPanel.js';
import { closeDrawer } from './mobileMenu.js';
import { closeAllDropdowns } from './search.js';

const searchInput = document.getElementById('searchInput');

function closeEverything() {
    closeAllDropdowns();
    setFilterPanelOpen(false);
    hidePanel();
    closeDrawer();
}

document.addEventListener('keydown', function (e) {
    // Leave browser/OS chords alone (Cmd+F find, Cmd+R reload, Ctrl+C copy...).
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    // Escape works even while typing: it dismisses whatever is open and
    // drops focus so the other shortcuts become available again.
    if (e.key === 'Escape') {
        closeEverything();
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }
        return;
    }

    const tag = document.activeElement.tagName.toLowerCase();
    const typing = tag === 'input' || tag === 'textarea';

    if (e.key === '/' && !typing) {
        e.preventDefault();
        searchInput.focus();
    }

    if ((e.key === 'f' || e.key === 'F') && !typing) {
        toggleFilterPanel();
    }

    if ((e.key === 'r' || e.key === 'R') && !typing) {
        const routeBtn = document.getElementById('routeToggle');
        routeBtn.click();
    }

    if ((e.key === 'c' || e.key === 'C') && !typing) {
        searchInput.blur();
        closeEverything();
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
