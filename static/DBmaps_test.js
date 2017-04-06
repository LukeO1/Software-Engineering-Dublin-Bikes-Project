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
        zoom: 12,
        center: {lat: 53.343793, lng: -6.254572},//centerMap,
        // panControl: true, //enable pan Control
        // zoomControl: true, //enable zoom control
        // zoomControlOptions: {
        //     style: google.maps.ZoomControlStyle.SMALL //zoom control size
        // },
        // scaleControl: true, // enable scale control
        // mapTypeControl: false
    };
    //$('#test').text("Hello");
    map = new google.maps.Map(document.getElementById("map"), myOptions);

    // document.getElementById("moreInfo").addEventListener("mouseover", mouseOver);
    // document.getElementById("moreInfo").addEventListener("mouseout", mouseOut);
    //
    // function mouseover(){
    //     $.getJSON("/station/dynamic", function (data) {
    //         console.log("station data", data);
    //         ('#moreinfo').html(data)
    //     }).fail(function (msg) {
    //         console.log('failed', msg);
    //     });
    //
    // }


        // $.getJSON("/station/dynamic", function (data) {
        //     console.log('station data', data);
        //     // dynamic(data);
        // }).fail(function (msg) {
        //     console.log('failed', msg);
        // })
    // });
    //
    map = new google.maps.Map(document.getElementById("map-div"), myOptions);

    $.getJSON("/station/static", function (data) {
        // console.log('station data', data);
        renderHTML(data);
    }).fail(function (msg) {
        console.log('failed', msg);
    });

    // The following group uses the location array to create an array of markers on initialize.

    //marker icon for the current location
    var image = "/static/custom-marker-current.png";
    var currentMarker = new google.maps.Marker({
        position: {lat: 53.3415, lng: -6.25685},
        map: map,
        icon: image
    });
            //marker icon for the current location
//    var image = "/static/custom-marker-current.png";
//    var currentMarker = new google.maps.Marker({
//        position: {lat: 53.3415, lng: -6.25685},
//        map: map,
//        icon: image
//    });

    //changing icon image for all the marker
    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    var icons = {
        bikes: {
            icon: iconBase + "/static/custom-marker.png"
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

    var features = [
        {
            position: new google.maps.LatLng(53.341, -6.26229),
            type: 'bikes'
        }
        // ,{
        //     position: new google.maps.LatLng(-33.91727341958453, 151.23348314155578),
        //     type: 'library'
        //   }
    ];

    for (var i = 0, feature; feature = features[i]; i++) {
        addMarker(feature);
    }

    function renderHTML(bikeObj) {
        var largeInfowindow = new google.maps.InfoWindow();
        var image = "/static/custom-marker.png";
        for (var i = 0; i < bikeObj.length; i++) {
            var lngPos = bikeObj[i].position_lng;
            var latPos = bikeObj[i].position_lat;
            // console.log(position);
            var title = bikeObj[i].name;
            var address = bikeObj[i].address;
            var station = bikeObj[i].number;
            // Create a marker per location, and put into markers array.
            //you take the info from here and put into the comment box when you click the marker.
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(latPos, lngPos),
                title: title,
                station: station,
                address: address,
                icon: image,
                animation: google.maps.Animation.DROP,
                id: i
            });
            // console.log(marker);
            // Push the marker to our array of markers.
            markers.push(marker);
            // Create an onclick event to open an infowindow at each marker.
            // marker.addListener('click', toggleBounce);
            marker.addListener('click', function () {
                populateInfoWindow(this, largeInfowindow);

            });
            // bounds.extend(markers[i].position);
        }

        // Extend the boundaries of the map for each marker
        // map.fitBounds(bounds);

        // console.log(markers[3].title);
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);

//        function focus(zoomed){
//            console.log('Hello')
//            for (var i = 0; i < markers.length; i++){
//                // console.log(markers[i].address)
//                if (markers[i].address == zoomed){
//                //map.setZoom(17);
//                map.panTo(markers[i].position)
//                }
//            }
//        }
    }
    document.getElementById('show-listings').addEventListener('click', showListings);
    document.getElementById('hide-listings').addEventListener('click', hideListings);
    document.getElementById('Yo').addEventListener('click', focus);
}
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.

function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        //here is where you can enter all the information you want into the window when you click on the marker
        infowindow.setContent('<div /id="showinfo">' +
            'Area: ' + marker.title +
            '<br>Station number: ' + marker.station +
            '<br>Address: ' + marker.address +
            '<br><a /href="#" id="moreInfo">more info</a> ' + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
            infowindow.setMarker = null;
        });
    }
}


function showListings() {
    // console.log(markers[3].title);
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);


    }
    map.fitBounds(bounds);
}


// function toggleBounce() {
//   if (marker.getAnimation() !== null) {
//     marker.setAnimation(null);
//   } else {
//     marker.setAnimation(google.maps.Animation.BOUNCE);
//   }
// }
// This function will loop through the listings and hide them all.
function hideListings() {
    console.log('Goodbye')
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

//This function receives a station from the dropdown menu and zooms in on it
function zoomfocus(station){
    console.log('Hello')
    //Checks what the current icon is for the station
    for (var i = 0; i < markers.length; i++){
        if(markers[i].icon == "/static/custom-marker-current.png"){
            markers[i].setIcon("/static/custom-marker.png");
        }
    }
    //takes in the station name as a variable, changes the map focus to the position and change the icon to the current icon
    for (var i = 0; i < markers.length; i++){
       // console.log(markers[i].address)
        if (markers[i].address == station){
            map.setZoom(17);
            map.panTo(markers[i].position);
            markers[i].setIcon("/static/custom-marker-current.png");
        }
    }
}

//Could use for switching between normal map and heat map
//$('#onoffswitch').click(function()
//{
//     $('#target').toggleClass('show-listings hide-listings'); //Adds 'a', removes 'b' and vice versa
//});


/**
 * Created by Nikki on 13/03/2017.
 */