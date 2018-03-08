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
var weeklyInfo = "/Project2/avg_weeklytrip.csv"

d3.json(urlInfo, function(response) {

    d3.json(urlStatus, function(statusdata) {

        d3.csv(weeklyInfo, function(weeklydata) {

            var stationMarkers=[];
            var noService=[];
            var weeklyHeatMap=[];
            var weeklyHeatMapPickup=[];
            var weeklyHeatMapDropoff=[];

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
                    L.marker([response.data.stations[i].lat, response.data.stations[i].lon])
                        .bindPopup("<b>"+"Station Name: "+"</b>" + response.data.stations[i].name +"<br>"+
                        "<b>"+"Station Capacity: " +"</b>"+ response.data.stations[i].capacity+"<br>"+ "<b>"+"# of bikes available: "+"</b>"+
                    statusdata.data.stations[i].num_bikes_available)//.addTo(albertsMap)
                )
            };
            for (var i = 0; i < response.data.stations.length; i++) {
                if (statusdata.data.stations[i].num_bikes_available < 1) {
                    noService.push(
                        L.marker([response.data.stations[i].lat, response.data.stations[i].lon])
                            .bindPopup("<b>"+"Station Name: "+"</b>" + response.data.stations[i].name +"<br>"+
                            "<b>"+"Station Capacity: " +"</b>"+ response.data.stations[i].capacity+"<br>"+ "<b>"+"# of bikes available: "+"</b>"+
                        statusdata.data.stations[i].num_bikes_available)//.addTo(albertsMap)
                    )
                }
            };

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

            var baseLayers = {
                Light: lightmap,
                Dark: darkmap,
            };
            var overlayLayers = {
                "All Bike Stations": allMarks,
                "Out of Service": outofservice,
                Heatmap: furiousDoan,
                Pickup: pickupHeat,
                Dropoff: dropoffHeat
            };

            L.control
                .layers(baseLayers, overlayLayers) //baseLayers and overlaylayers MUST BE DEFINED ABOVE AND REQUIRED AS ARGUMENTS
                .addTo(albertsMap);

        }) //keep
    }) //keep
}) //keep