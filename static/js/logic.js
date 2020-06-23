// API url with our JSON data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// use d# to retrieve our data and add markers and pop up tool tips
d3.json(queryUrl,function(data){
  
  // earthquake radius circle
  function createCircleMarker(feature,latlng){
      let options = {
          radius:feature.properties.mag*2,
          fillColor: chooseColor(feature.properties.mag),
          color: "black",
          weight: .5,
          fillOpacity: 0.6
      }
      return L.circleMarker(latlng, options);

  }

  // pop up labels
  var earthQuakes = L.geoJSON(data,{
      onEachFeature: function(feature,layer){
          layer.bindPopup("Location:"+feature.properties.place + "<br> Magnitude: "+feature.properties.mag+"<br> Time: "+new Date(feature.properties.time));
      },
      pointToLayer: createCircleMarker

  });

  createMap(earthQuakes);

});

  // create map with leaflet and mapbox
  function createMap(earthQuakes) {

    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      id: "mapbox.satellite",
      accessToken: API_KEY
    });
  
    var lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',      maxZoom: 18,
      id: 'mapbox/light-v10',
      accessToken: API_KEY
    });

    var darkmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',      maxZoom: 18,
      id: 'mapbox/dark-v10',
      accessToken: API_KEY
    });
  
    // base maps and layers
    var baseMaps = {
      "Satellite": satellite,
      "Lightmap": lightmap,
      "Darkmap": darkmap
    };
  
    // overlay object
    var overlayMaps = {
      Earthquakes: earthQuakes
    };
  
    // create our map
    var myMap = L.map("map", {
      center: [0,0],
      zoom: 3,
      layers: [lightmap, earthQuakes]
    });
  
    
    // add the layer to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: true
    }).addTo(myMap);

    var info = L.control({
        position: "bottomleft"
    });

    info.onAdd = function(){
        var div = L.DomUtil.create("div","legend");
        return div;
    }

    info.addTo(myMap);
    document.querySelector(".legend").innerHTML=displayLegend();
  }

// magnitude legend colors
  function chooseColor(mag){
    switch(true){
        case (mag<3):
            return "gray";
        case (mag<5):
            return "yellow";
        case (mag<6):
            return "darkorange";
        default:
            return "red";
    };
}

// display magnitude legend
function displayLegend(){
    var legendInfo = [{
        limit: "Mag: 1-3",
        color: "gray"
    },{
        limit:"Mag: 3-5",
        color:"yellow"
    },{
        limit:"Mag: 5-6",
        color:"darkorange"
    },{
        limit:"Mag: 6+",
        color:"red"
    }];

    var header = "<h3>Magnitude</h3><hr>";

    var str = "";
   
    for (i = 0; i < legendInfo.length; i++){
        str += "<p style = \"background-color: "+legendInfo[i].color+"\">"+legendInfo[i].limit+"</p> ";
    }
    return header+str;
}