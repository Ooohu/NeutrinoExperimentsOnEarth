let allMarkers = []; // store all marker objects

async function loadMarkerData() {
    const response = await fetch('assets/data/ExpListConfig.json');
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

    //Choose a marker

    // Define marker icons, see https://github.com/pointhi/leaflet-color-markers
    // Helper function to create a colored Leaflet marker
    function createMarkerIcon(color) {
        return L.icon({
            iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
    }

    // Create icons
    const greyIcon  = createMarkerIcon('grey');
    const blueIcon  = createMarkerIcon('blue');
    const redIcon   = createMarkerIcon('red');
    const blackIcon = createMarkerIcon('black');


    // Determine which icon to use
    let chosenIcon;
    const dtypeLower = marker.Dtype.toLowerCase();
    if (dtypeLower.includes("cherenkov")) {
        chosenIcon = blueIcon;
    } else if (dtypeLower.includes("scintillator") || dtypeLower.includes("scintillation") || dtypeLower.includes("water")) {
        chosenIcon = blackIcon;
    } else if (dtypeLower.includes("artpc")) {
        chosenIcon = redIcon;
    } else {
        chosenIcon = greyIcon; // default blue Leaflet marker
    }
    //We ust chosenIcon



    const leafletMarker = L.marker([marker.lat, marker.lng], { icon: chosenIcon })
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
            const fallbackImage = "assets/images/404NotFound.jpg";

            const imageContent = `
                <div class="popup-image-container">
                    <img src="${marker.imagePath}"
                        alt="${marker.label} Image"
                        onerror="this.onerror=null; this.src='${fallbackImage}';">
                </div>
            `;

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