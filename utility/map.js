// Initialize the map
var map = L.map('map').setView([0, 0], 2);

// Add a tile layer (you can choose a different one if you prefer)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Sample data for markers (you can replace this with your own data)
var markerData = [
    {lat: 41.83754684962796, lng: -88.26958093726991, label: 'MicroBooNE', imagePath: 'https://microboone-exp.fnal.gov/public/approved_plots/plots/3004/thumbs/kalekologo_noshadow_thumb.png'},//, imageWidth: 120},
    {lat: 38.57799080399165, lng: -121.4880515238307, label: 'APS April 2024'},
    {lat: 41.8395656, lng: -88.2702022, label: 'NOvA', imagePath: 'https://novaexperiment.fnal.gov/wp-content/uploads/2018/05/NOvA-s.jpg'},
    // Add more markers as needed
];

//THE INPUT KEY IS THE ABOVE
// Add markers to the map with pop up
markerData.forEach(function(marker) {
var popupContent = '<p>' + marker.label + '</p>';
    var markerPopup = L.popup().setContent(popupContent);

    L.marker([marker.lat, marker.lng])
        .bindPopup(markerPopup)
        .addTo(map)
        .on('mouseover', function() {//Action 1: mouseover
    markerPopup.setContent(popupContent);
            this.openPopup();
        })
        .on('mouseout', function() {//Action 2: mouseout
            this.closePopup();
        })
  .on('click', function() {//Action 3: Click
            // Handle click event (show image or perform other actions)
     var imageContent = '<img src="' + marker.imagePath + '" alt="' + marker.label + ' Image" style="max-width: 120px; height: auto; ">';
            markerPopup.setContent(imageContent);
    this.openPopup();
        });
});

// Hover function
function onMapHover(e) {
    // Display information about the hovered location (customize as needed)
    console.log('Hovered over:', e.latlng);
}

// Add hover event to the map
map.on('mousemove', onMapHover);
