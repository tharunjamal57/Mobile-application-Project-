export default function geocodeLatLng(geocoder, map, infowindow) {
    const input = document.getElementById("latlng").value;
    const latlngStr = input.split(",", 2);
    const latlng = {
      lat: parseFloat(latlngStr[0]),
      lng: parseFloat(latlngStr[1]),
    };
  
    geocoder
      .geocode({ location: latlng })
      .then((response) => {
        if (response.results[0]) {
          map.setZoom(11);
  
          const marker = new google.maps.Marker({
            position: latlng,
            map: map,
          });
  
          infowindow.setContent(response.results[0].formatted_address);
          infowindow.open(map, marker);
        } else {
          window.alert("No results found");
        }
      })
      .catch((e) => window.alert("Geocoder failed due to: " + e));
  }