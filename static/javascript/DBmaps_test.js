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
        panControl: true, //enable pan Control
        zoomControl: true, //enable zoom control
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL //zoom control size
        },
        scaleControl: true, // enable scale control
        mapTypeControl: false
    };
    //$('#test').text("Hello");
    map = new google.maps.Map(document.getElementById("map-div"), myOptions);


    $.getJSON("/station/static", function (data) {
        $.getJSON("/station/dynamic", function (dyndata) {
         renderHTML(data, dyndata);
        })
    }).fail(function (msg) {
        console.log('failed', msg);
    });

    // The following group uses the location array to create an array of markers on initialize.


    function renderHTML(bikeObj, dynObj) {
        var largeInfowindow = new google.maps.InfoWindow();
        // var image = "/static/images/marker5.png";
        for (var i = 0; i < bikeObj.length; i++) {
            // console.log(dynObj[i].available_bikes);
            // console.log(bikeObj[i].name);
            // console.log(getObjectKeyIndex(dynObj, bikeObj[i].name));
            var availBikes = dynObj[i].available_bikes;
            var availBikeStands = dynObj[i].available_bike_stands;
            var lngPos = bikeObj[i].position_lng;
            var latPos = bikeObj[i].position_lat;
            // console.log(position);
            var title = bikeObj[i].name;
            var address = bikeObj[i].address;
            var station = bikeObj[i].number;
            // Create a marker per location, and put into markers array.
            //you take the info from here and put into the comment box when you click the marker.

            var percentage10 = bikeObj[i].bike_stands*(10/100);
            var percentage30 = bikeObj[i].bike_stands*(30/100);
            var percentage50 = bikeObj[i].bike_stands*(50/100);
            var percentage80 = bikeObj[i].bike_stands*(80/100);

            //HEAT MAP CONDITIONS
            switch (true){
                case(availBikes == '0'):
                    varIcon = '/static/images/nobikes.png';
                    break;
                case(availBikes < percentage10):
                    varIcon = '/static/images/marker1.png';
                    break;
                case(availBikes < percentage30):
                    varIcon = '/static/images/marker2.png';
                    break;
                case(availBikes < percentage50):
                    varIcon = '/static/images/marker3.png';
                    break;
                case(availBikes < percentage80):
                    varIcon = '/static/images/marker4.png';
                    break;
                default:
                    varIcon = '/static/images/marker5.png';
            }


            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(latPos, lngPos),
                title: title,
                station: station,
                address: address,
                availBikes: availBikes,
                availBikeStands: availBikeStands,
                icon: varIcon,
                animation: google.maps.Animation.DROP,
                id: i
            });


            // console.log(marker);
            // Push the marker to our array of markers.
            markers.push(marker);
            // Create an onclick event to open an infowindow at each marker.
            // marker.addListener('click', toggleBounce);
            marker.addListener("mouseover", function () {
                populateInfoWindow(this, largeInfowindow, '<div /id="showinfo">' +
            'Area: ' + marker.title +
            '<br>Station number: ' + marker.station +
            '<br>Address: ' + marker.address +
            // '<br>Available bikes: ' + marker.availBikes +
            // '<br>Available bike stands: ' + marker.availBikeStands +
            '<br><a /href="#" id="moreInfo">more info</a> ' + '</div>');

            });
            // bounds.extend(markers[i].position);
        }
        //This shows your current location (
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var currentMarker = new google.maps.Marker({
                position: new google.maps.LatLng(pos),
                icon: "/static/images/current.png",
                animation: google.maps.Animation.DROP
            });
            // currentmMarker.addListener("mouseover", function () {
            //     populateInfoWindow(currentMarker, largeInfowindow, 'Location found');
            map.setCenter(pos);
            currentMarker.setMap(map);
            // bounds.extend(currentMarker.position);

        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
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
    // document.getElementById('Yo').addEventListener('click', focus);
}


function getObjectKeyIndex(obj, keyToFind) {
//trying to match the key value name from dynamic with the value for the current static name and return an index
//so can match the correct info on the corresponding markers!
    var i = 0, key;
    for (x = 0; i < obj.length; i++) $.each(obj, function (key, value) {
        // console.log("obj" ,obj[x]);
        // console.log("value",value.name);
        // console.log("keyToFind",keyToFind);
        // console.log("key:", key.Value);
        if (value.name === keyToFind) {
            return i;
        }
        i++
    });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.

function populateInfoWindow(marker, infowindow, html) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        //here is where you can enter all the information you want into the window when you click on the marker
        infowindow.setContent(html);
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

// This function will loop through the listings and hide them all.
function hideListings() {
//    console.log('Goodbye')
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

//This function receives a station from the dropdown menu and zooms in on it
function zoomfocus(station){
    console.log('Hello');
    //Checks what the current icon is for the station
    for (var i = 0; i < markers.length; i++){
        if(markers[i].icon == "/static/images/custom-marker-current.png"){
            markers[i].setIcon("/static/images/marker5.png");
        }
    }
    //takes in the station name as a variable, changes the map focus to the position and change the icon to the current icon
    for (var i = 0; i < markers.length; i++){
       // console.log(markers[i].address)
        if (markers[i].address == station){
            map.setZoom(17);
            map.panTo(markers[i].position);
            markers[i].setIcon("/static/current.png");
            markers[i].setIcon("/static/images/custom-marker-current.png");
        }
    }
}

//This function Filters the dropdown menu for the search bar
function searchFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("search-box");
    filter = input.value.toUpperCase();
    ul = document.getElementById("dropdown-list");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}


//
// //Could use for switching between normal map and heat map
// //$('#onoffswitch').click(function()
// //{
// //     $('#target').toggleClass('show-listings hide-listings'); //Adds 'a', removes 'b' and vice versa
// //});
//
//
// /**
//  * Created by Nikki on 13/03/2017.
//  */

