var sfCoords = [37.7749, -122.4194];
var mapZoomLevel = 12;


var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ.T6YbdDixkOBWH_k9GbS8JQ", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ.T6YbdDixkOBWH_k9GbS8JQ", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18
});

var albertsMap = L.map("map-id", {
    center: sfCoords,
    zoom: 13
});

lightmap.addTo(albertsMap);

var urlInfo = "https://gbfs.fordgobike.com/gbfs/en/station_information.json";
var urlStatus = "https://gbfs.fordgobike.com/gbfs/en/station_status.json";
var weeklyInfo = "/static/Project2/avg_weeklytrip.csv"
var carshareURL = "/static/Project2/carshare.csv"

d3.json(urlInfo, function(error, response) {
    if (error) {console.log(error); return (error);}
    d3.json(urlStatus, function(error, statusdata) {
        if (error) {console.log(error); return (error);}
        d3.csv(weeklyInfo, function(error, weeklydata) {
            if (error) {console.log(error); return (error);}
            d3.csv(carshareURL, function(error, carsharedata) {
                if (error) {console.log(error); return (error);}

            var carshareCoords=[];
            var carshareMarkers=[];
            var stationMarkers=[];
            var noService=[];
            var weeklyHeatMap=[];
            var weeklyHeatMapPickup=[];
            var weeklyHeatMapDropoff=[];
            
            console.log(carsharedata);
            for (var i = 0; i<carsharedata.length; i++) {
                
                var something = carsharedata[i].Geom.replace(")", "").replace("(", "").replace(",", "");
                var coordsplit = something.split(" ");
                // console.log(coordsplit);
                // console.log(typeof(coordsplit[1]));
                var newcoordsplit = coordsplit.map(parseFloat);
                // console.log(coordsplit.map(parseFloat));
                // console.log(typeof(newcoordsplit[1]));
                carshareCoords.push(newcoordsplit);
            };

            console.log(carshareCoords);
            console.log(carshareCoords.length);
            console.log(carsharedata.length);


            var greenIcon = new L.Icon({
                iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              });

            var redIcon = new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            var orangeIcon = new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            var yellowIcon = new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });


            for (var i=0; i< weeklydata.length; i++) {
                var stopnumber = +weeklydata[i].pickdrop_scaled;
                for (var j=0; j<stopnumber; j++) {
                    weeklyHeatMap.push([weeklydata[i].latitude, weeklydata[i].longitude]);
                }
            };
            for (var i=0; i< weeklydata.length; i++) {
                var stopnumber = +weeklydata[i].pickups_scaled;
                for (var j=0; j<stopnumber; j++) {
                    weeklyHeatMapPickup.push([weeklydata[i].latitude, weeklydata[i].longitude]);
                }
            };
            for (var i=0; i< weeklydata.length; i++) {
                var stopnumber = +weeklydata[i].dropoffs_scaled;
                for (var j=0; j<stopnumber; j++) {
                    weeklyHeatMapDropoff.push([weeklydata[i].latitude, weeklydata[i].longitude]);
                }
            };
            for (var i = 0; i < response.data.stations.length; i++) {
                stationMarkers.push(
                    L.marker([response.data.stations[i].lat, response.data.stations[i].lon], {icon: greenIcon})
                        .bindPopup("<b>"+"Station Name: "+"</b>" + response.data.stations[i].name +"<br>"+
                        "<b>"+"Station Capacity: " +"</b>"+ response.data.stations[i].capacity+"<br>"+ "<b>"+"# of bikes available: "+"</b>"+
                    statusdata.data.stations[i].num_bikes_available)//.addTo(albertsMap)
                )
            };
            for (var i = 0; i < response.data.stations.length; i++) {
                if (statusdata.data.stations[i].num_bikes_available < 1) {
                    noService.push(
                        L.marker([response.data.stations[i].lat, response.data.stations[i].lon], {icon: redIcon})
                            .bindPopup("<b>"+"Station Name: "+"</b>" + response.data.stations[i].name +"<br>"+
                            "<b>"+"Station Capacity: " +"</b>"+ response.data.stations[i].capacity+"<br>"+ "<b>"+"# of bikes available: "+"</b>"+
                        statusdata.data.stations[i].num_bikes_available)//.addTo(albertsMap)
                    )
                }
            };
            for (var i =0; i<carshareCoords.length;i++) {
                carshareMarkers.push(L.marker(carshareCoords[i], {icon: orangeIcon}).bindPopup("<b>"+carsharedata[i]['Carshare Organization']+"</b>"+"<br>"+carsharedata[i].Address)
                )
            }

            var furiousDoan = L.heatLayer(weeklyHeatMap, {
                radius: 10,
                blur: 20
            });
            var pickupHeat = L.heatLayer(weeklyHeatMapPickup, {
                radius: 9,
                blur: 20
            });
            var dropoffHeat = L.heatLayer(weeklyHeatMapDropoff, {
                radius: 9,
                blur: 20
            });
            var allMarks = L.layerGroup(stationMarkers);
            var outofservice = L.layerGroup(noService);
            var zipcar = L.layerGroup(carshareMarkers);

            var baseLayers = {
                Light: lightmap,
                Dark: darkmap,
            };
            var overlayLayers = {
                "All Bike Stations": allMarks,
                "Out of Service": outofservice,
                Heatmap: furiousDoan,
                Pickup: pickupHeat,
                Dropoff: dropoffHeat,
                "City Carshare": zipcar
            };

            L.control
                .layers(baseLayers, overlayLayers) //baseLayers and overlaylayers MUST BE DEFINED ABOVE AND REQUIRED AS ARGUMENTS
                .addTo(albertsMap);

            //Marker Colors



        }) //keep
        }) //keep
    }) //keep
}) //keep