// Initialize Leaflet map
const map = L.map('map', {
    scrollWheelZoom: true,
    tap: false
}).setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Hover function
map.on('mousemove', (e) => console.log('Hovered over:', e.latlng));