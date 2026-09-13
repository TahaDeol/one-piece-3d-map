export let allLocations = [];

export async function loadLocations() {
    const response = await fetch('data/locations.json');
    if (!response.ok) {
        throw new Error(`locations.json request failed with HTTP ${response.status}`);
    }
    const locations = await response.json();

    allLocations = locations;
    document.getElementById('counterTotal').textContent = locations.length;
    document.getElementById('counterCurrent').textContent = locations.length;

    return locations;
}
