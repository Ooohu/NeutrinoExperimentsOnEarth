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
    
    // Get checked marker types
    const checkedTypes = Array.from(document.querySelectorAll('.dtype-filter:checked'))
                              .map(cb => cb.value); // e.g., ["blue", "grey", "black"]


    allMarkers.forEach(marker => {
        const m = marker.data;

        const nameMatch = (m.label?.toLowerCase().includes(searchText)) || (m.generation?.toLowerCase().includes(searchText));
        const energyOverlap = !(m.Emax < energyMin || m.Emin > energyMax);
        const yearOverlap = !(m.DataEnd < yearMin || m.DataStart > yearMax);

        //Check color
        // Color/type filter
        let markerColor = 'grey'; // default
        const dtypeLower = m.Dtype.toLowerCase();
        if (dtypeLower.includes("cherenkov")) {
            markerColor = 'blue';
        } else if (dtypeLower.includes("scintillator") || dtypeLower.includes("scintillation") || dtypeLower.includes("water")) {
            markerColor = 'black';
        } else if (dtypeLower.includes("artpc")) {
            markerColor = 'red';
        }
        console.log("Marker:", m.label, "Type:", m.Dtype, "Color:", markerColor);
        const colorMatch = checkedTypes.includes(markerColor);


        if ( nameMatch && energyOverlap && yearOverlap && colorMatch) {
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
// Event listeners for marker-type checkboxes
const markerTypeCheckboxes = document.querySelectorAll('.dtype-filter');
markerTypeCheckboxes.forEach(cb => {
    cb.addEventListener('change', filterMarkers);
});

// Reset filters
resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    energyMinInput.value = "";
    energyMaxInput.value = "";
    yearMinInput.value = "";
    yearMaxInput.value = "";

    // Check all marker type checkboxes
    const allTypeCheckboxes = document.querySelectorAll('.dtype-filter');
    allTypeCheckboxes.forEach(cb => cb.checked = true);
    
    filterMarkers();
});