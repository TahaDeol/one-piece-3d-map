import { allLocations } from './data/locations.js';

export function getURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('location');
}

export function setURL(name) {
    const params = new URLSearchParams(window.location.search);
    params.set('location', name);
    window.history.replaceState({}, '', '?' + params.toString());
}

export function clearURL() {
    window.history.replaceState({}, '', window.location.pathname);
}

export function getRestoreLocation() {
    const locationName = getURL();
    if (!locationName) return null;

    return allLocations.find(location =>
        location.name.toLowerCase() === decodeURIComponent(locationName).toLowerCase()
    ) || null;
}
