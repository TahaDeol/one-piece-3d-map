export let allLocations = [];

export async function loadLocations() {
    const response = await fetch('data/locations.json');
    const locations = await response.json();

    allLocations = locations;
    document.getElementById('counterTotal').textContent = locations.length;
    document.getElementById('counterCurrent').textContent = locations.length;

    return locations;
}
