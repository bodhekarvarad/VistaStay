
	// TO MAKE THE MAP APPEAR YOU MUST

const e = require("connect-flash");

	// ADD YOUR ACCESS TOKEN FROM
  let mapToken =mapToken;
	// https://account.mapbox.com
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });
  console.log(coordinates);
const marker = new mapboxgl.Marker({color:"red"})
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({ offset:25 }) // add popups
.setHTML('<h4>${listing.location}</h4><p>This is the location of the listing.</p>'))
.addTo(map);