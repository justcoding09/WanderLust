document.addEventListener("DOMContentLoaded", () => {
  // Access global variables set in the EJS template
  const token = window.MAP_TOKEN;  // Access token
  const location = window.LISTING_LOCATION;  // Location string
  const title = window.LISTING_TITLE;  // Listing title

  // Check if the required data is available
  if (!token || !location || !title) {
      console.error("Missing required data for the map!");
      return;  // Exit if the necessary data is missing
  }

  // Fetch the geocoding data from LocationIQ API
  fetch(`https://us1.locationiq.com/v1/search?key=${token}&q=${encodeURIComponent(location)}&format=json`)
      .then(res => res.json())
      .then(data => {
          if (data.length === 0) {
              console.error("No results found for the location:", location);
              return;
          }

          const lat = Number(data[0].lat);
          const lon = Number(data[0].lon);

          // Initialize the map at the provided location
          const map = L.map('map').setView([lat, lon], 13);

         // Add the tile layer for the map
          L.tileLayer(`https://tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${token}`, {
              attribution: '&copy; LocationIQ & OpenStreetMap contributors'
          }).addTo(map);

          // Add a marker at the location with a popup showing the listing title
          L.marker([lat, lon]).addTo(map)
              .bindPopup(title)
              .openPopup();
      })
      .catch(err => console.error("Error fetching map data:", err));
});


