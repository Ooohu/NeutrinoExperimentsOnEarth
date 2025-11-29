// Initialize the map
var map = L.map('map', {
    scrollWheelZoom: true,  // zoom with mouse wheel
    tap: false               // optional, avoids issues on mobile
}).setView([0, 0], 2);

// Add a tile layer (you can choose a different one if you prefer)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// ----------------------------
// Load JSON and add markers
// ----------------------------
// Elements
const searchInput = document.getElementById("experiment-search");
const toggleBtnFilter = document.getElementById("toggle-filters");
const filterPanel = document.getElementById("filter-panel");
const energyMinInput = document.getElementById("energy-min");
const energyMaxInput = document.getElementById("energy-max");
const yearMinInput = document.getElementById("year-min");
const yearMaxInput = document.getElementById("year-max");
const resetBtn = document.getElementById("reset-filters");

// Toggle filter panel
toggleBtnFilter.addEventListener("click", () => {
    filterPanel.classList.toggle("expanded");
    toggleBtnFilter.textContent = filterPanel.classList.contains("expanded") ? "Filters ▲" : "Filters ▼";
});

let allMarkers = [];  // store all marker objects

// Load data and add markers
loadMarkerData().then(markerData => {
    allMarkers = markerData.map(marker => addMarkerToMap(marker));
});

// Function to add a single marker to the map
function addMarkerToMap(marker) {
    const popupContent = `<p>${marker.label}</p>`;
    const markerPopup = L.popup().setContent(popupContent);

    const leafletMarker = L.marker([marker.lat, marker.lng])
        .bindPopup(markerPopup)
        .addTo(map)
        .on('mouseover', function() {
            markerPopup.setContent(popupContent);
            this.openPopup();
        })
        .on('mouseout', function() {
            this.closePopup();
        })
        .on('click', function() {
            const imageContent = `<img src="${marker.imagePath}" alt="${marker.label} Image" style="max-width: 120px; height: auto;">`;
            markerPopup.setContent(imageContent);
            this.openPopup();
        });

    // store extra info for filtering
    leafletMarker.data = marker;
    return leafletMarker;
}

// Filtering function
function filterMarkers() {
    const searchText = searchInput.value.toLowerCase();
    const energyMin = parseFloat(energyMinInput.value) || 0;
    const energyMax = parseFloat(energyMaxInput.value) || Infinity;
    const yearMin = parseInt(yearMinInput.value) || 1930;
    const yearMax = parseInt(yearMaxInput.value) || 2045;

    allMarkers.forEach(marker => {
        const m = marker.data;

        // Name filter
        const nameMatch = m.label.toLowerCase().includes(searchText);

        // Energy overlap filter
        const energyOverlap = !(m.Emax < energyMin || m.Emin > energyMax);

        // Year overlap filter
        const yearOverlap = !(m.DataEnd < yearMin || m.DataStart > yearMax);

        if (nameMatch && energyOverlap && yearOverlap) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
}

// Event listeners for search and filters
searchInput.addEventListener("input", filterMarkers);
energyMinInput.addEventListener("input", filterMarkers);
energyMaxInput.addEventListener("input", filterMarkers);
yearMinInput.addEventListener("input", filterMarkers);
yearMaxInput.addEventListener("input", filterMarkers);

// Reset button
resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    energyMinInput.value = "";
    energyMaxInput.value = "";
    yearMinInput.value = "";
    yearMaxInput.value = "";
    filterMarkers();
});
// ----------------------------
// JSON Loader
// ----------------------------
async function loadMarkerData() {
    const response = await fetch('./utility/ExpListConfig.json'); // Directory is respected tot he index.html
    const data = await response.json();

    return data.ExperimentList.map(exp => ({
        lat: exp.Latitude,
        lng: exp.Longitude,
        label: exp.Name,
        imagePath: exp.Logo,
        Dtype: exp.DetectorType || "Unknown",
        Emin: (exp.EnergyMeVMin != null) ? exp.EnergyMeVMin : 0,  // default 0
        Emax: (exp.EnergyMeVMax != null) ? exp.EnergyMeVMax : Infinity, // default Infinity
        DataStart: exp.StartDataTaking || 1930,   // default 1930
        DataEnd: exp.DateofRetirement || 2045     // default 2045
    }));
}

// Hover function
function onMapHover(e) {
    // Display information about the hovered location (customize as needed)
    console.log('Hovered over:', e.latlng);
}

// Add hover event to the map
map.on('mousemove', onMapHover);

