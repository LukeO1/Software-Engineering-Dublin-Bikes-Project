//static dublin bikes info
// var dublinObj;
/**
 * Created by Nikki on 03/04/2017.
 */

var map;
// Create a new blank array for all the listing markers.
var markers = [];

function myMap() {
    //var centerMap = new google.maps.LatLng(53.343793, -6.254572)
    var myOptions = {
        zoom: 14,
        center: {lat: 53.343793, lng: -6.254572},//centerMap,
        panControl: true, //enable pan Control
        zoomControl: true, //enable zoom control
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL //zoom control size
        },
        scaleControl: true, // enable scale control
        mapTypeControl: false
    };
    //$('#test').text("Hello");
    map = new google.maps.Map(document.getElementById("Gmap"), myOptions);
    //
    $.getJSON("/station/static", function (data) {
        // console.log('station data', data);
        renderHTML(data);
    }).fail(function (msg) {
        console.log('failed', msg);
    });
    // The following group uses the location array to create an array of markers on initialize.

    //changing icon image for the marker
    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    var icons = {
        bikes: {
            icon: iconBase + 'custom-marker.jpg'
        }
        // ,
        // library: {
        //     icon: iconBase + 'library_maps.png'
        // },
        // info: {
        //     icon: iconBase + 'info-i_maps.png'
        // }
    };

    function addMarker(feature) {
        var marker = new google.maps.Marker({
            position: feature.position,
            icon: icons[feature.type].icon,
            map: map
        });
    }

    function renderHTML(bikeObj) {
        var largeInfowindow = new google.maps.InfoWindow();

        for (var i = 0; i < bikeObj.length; i++) {
            console.log("{lat: " + bikeObj[i].position_lat + ", lng: " + bikeObj[i].position_lng + "}");
            // console.log(bikeObj.length);
            // Get the position from the location array.
            var lngPos = bikeObj[i].position_lng;
            var latPos = bikeObj[i].position_lat;
            // console.log(position);
            var title = bikeObj[i].name;
            // var address = bikeObj[i].address;
            var station = bikeObj[i].number;
            // console.log(title, address, station);
            // Create a marker per location, and put into markers array.
            //you take the info from here and put into the comment box when you click the marker.
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(latPos, lngPos),
                title: title,
                station: station,
                // address: address,
                animation: google.maps.Animation.DROP,
                id: i
            });
            // console.log(marker);
            // Push the marker to our array of markers.
            markers.push(marker);
            // Create an onclick event to open an infowindow at each marker.
            marker.addListener('click', function () {
                populateInfoWindow(this, largeInfowindow);
            });
            // bounds.extend(markers[i].position);
        }

        // Extend the boundaries of the map for each marker
        // map.fitBounds(bounds);
    }

    document.getElementById('show-listings').addEventListener('click', showListings);
    document.getElementById('hide-listings').addEventListener('click', hideListings);
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        //here is where you can enter all the information you want into the window when you click on the marker
        infowindow.setContent('<div>' + 'Area: ' + marker.title + '<br>Station number: ' + marker.station + '<br>Address: ' + marker.address + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
            infowindow.setMarker = null;
        });
    }
}

function showListings() {
    console.log(markers[3].title);
    // var bounds = new google.maps.LatLngBounds();
    // // Extend the boundaries of the map for each marker and display the marker
    // for (var i = 0; i < markers.length; i++) {
    //     markers[i].setMap(map);
    //     bounds.extend(markers[i].position);
    // }
    // map.fitBounds(bounds);
}

// This function will loop through the listings and hide them all.
function hideListings() {
    // for (var i = 0; i < markers.length; i++) {
    //     markers[i].setMap(null);
    // }
}


/**
 * Created by Nikki on 13/03/2017.
 */