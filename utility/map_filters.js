// DOM elements
const searchInput = document.getElementById("experiment-search");
const energyMinInput = document.getElementById("energy-min");
const energyMaxInput = document.getElementById("energy-max");
const yearMinInput = document.getElementById("year-min");
const yearMaxInput = document.getElementById("year-max");
const resetBtn = document.getElementById("reset-filters");

// Filter markers based on search and range
function filterMarkers() {
    const searchText = searchInput.value.toLowerCase();
    const energyMin = parseFloat(energyMinInput.value) || 0;
    const energyMax = parseFloat(energyMaxInput.value) || Infinity;
    const yearMin = parseInt(yearMinInput.value) || 1930;
    const yearMax = parseInt(yearMaxInput.value) || 2045;

    allMarkers.forEach(marker => {
        const m = marker.data;

        const nameMatch = (m.label?.toLowerCase().includes(searchText)) || (m.generation?.toLowerCase().includes(searchText));
        const energyOverlap = !(m.Emax < energyMin || m.Emin > energyMax);
        const yearOverlap = !(m.DataEnd < yearMin || m.DataStart > yearMax);

        if (nameMatch && energyOverlap && yearOverlap) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
}

// Event listeners
searchInput.addEventListener("input", filterMarkers);
energyMinInput.addEventListener("input", filterMarkers);
energyMaxInput.addEventListener("input", filterMarkers);
yearMinInput.addEventListener("input", filterMarkers);
yearMaxInput.addEventListener("input", filterMarkers);

// Reset filters
resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    energyMinInput.value = "";
    energyMaxInput.value = "";
    yearMinInput.value = "";
    yearMaxInput.value = "";
    filterMarkers();
});