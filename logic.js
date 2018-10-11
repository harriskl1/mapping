var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Query url to retrieve earthquake data
d3.json(url, function(data) {
    mapFeatures(data.features);
  });
  
  function mapFeatures(earthquakeData) {
  
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
        "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    }
  
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        var color;
        var r = Math.floor(255-75*feature.properties.mag);
        var g = Math.floor(255-75*feature.properties.mag);
        var b = 255;
        color= "rgb("+r+" ,"+g+","+ b+")"
        
        var geojsonMarkerOptions = {
          radius: 4*feature.properties.mag,
          fillColor: color,
          color: "white",
          weight: 1.5,
          opacity: 1,
          fillOpacity: 0.9
        };
        return L.circleMarker(latlng, geojsonMarkerOptions);
      }
    });
  
    makeMap(earthquakes);
    
  }
  
  function makeMap(earthquakes) {
  
    var baselayer = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1IjoidHAwMDciLCJhIjoiY2ptbzN1aWRmMGo4ejNxbHU0eW56MmcwNyJ9.6b4WaJePjB_n2GWUdUj9TA");
  
    
    var baseMaps = {
      "Street Map": baselayer
    };
  
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    var myMap = L.map("map", {
      center: [
        44.6488, -63.5752
      ],
      zoom: 3,
      layers: [baselayer, earthquakes]
    });
  
  
    function getColor(d) {
        return d < 1 ? 'rgb(255,255,255)' :
            d < 2  ? 'rgb(225,225,225)' :
            d < 3  ? 'rgb(195,195,255)' :
            d < 4  ? 'rgb(165,165,255)' :
            d < 5  ? 'rgb(135,135,255)' :
            d < 6  ? 'rgb(105,105,255)' :
            d < 7  ? 'rgb(75,75,255)' :
            d < 8  ? 'rgb(45,45,255)' :
            d < 9  ? 'rgb(15,15,255)' :
                        'rgb(0,0,255)';
    }
  
   
    var legend = L.control({position: 'topright'});
  
    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
        divisions = [0, 1, 2, 3, 4, 5, 6, 7, 8],
        labels = [];
  
        div.innerHTML+='<strong>Magnitude</strong><br><hr>'
    
        for (var i = 0; i < divisions.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(divisions[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                divisions[i] + (divisions[i + 1] ? '&ndash;' + divisions[i + 1] + '<br>' : '+');
    }
    
    return div;
    };
    
    legend.addTo(myMap);
  
  }