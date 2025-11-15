let allMarkers = []; // store all marker objects

async function loadMarkerData() {
    const response = await fetch('./utility/ExpListConfig.json');
    const data = await response.json();

    return data.ExperimentList.map(exp => ({
        lat: exp.Latitude,
        lng: exp.Longitude,
        label: exp.Name,
        generation:exp.Generations,
        imagePath: exp.Logo,
        Dtype: exp.DetectorType || "Unknown",
        Emin: exp.EnergyMeVMin ?? 0,
        Emax: exp.EnergyMeVMax ?? Infinity,
        DataStart: exp.StartDataTaking || 1930,
        DataEnd: exp.DateofRetirement || 2045
    }));
}

// Add a single marker
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

    leafletMarker.data = marker; // attach data for filtering
    return leafletMarker;
}

// Load all markers
async function initMarkers() {
    const markerData = await loadMarkerData();
    allMarkers = markerData.map(addMarkerToMap);
}