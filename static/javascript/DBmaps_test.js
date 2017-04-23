$(document).ajaxStart(function () {
    $(document.body).css({'cursor': 'wait'})
});
$(document).ajaxComplete(function () {
    $(document.body).css({'cursor': 'default'})
});

var map;
// Create a new blank array for all the listing markers.
var markers = [];
var dynamic_data = [];
//Set global var closestMarker so we can take the Euclidian distance marker put it in the hideStations function
var closestMarker;
//Set global var nameStation to keep track of the marker's name station
var nameStation;

//****************************** GOOGLE MAPS ***************************************//

function myMap() {
    var myOptions = {
        zoom: 13,
        center: {lat: 53.343793, lng: -6.254572},//centerMap,
        panControl: true, //enable pan Control
        zoomControl: true, //enable zoom control
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL //zoom control size
        },
        scaleControl: true, // enable scale control
        mapTypeControl: false
    };

    map = new google.maps.Map(document.getElementById("map-div"), myOptions);


    $.getJSON("/station/static", function (data) {
        // extracting the static data from flask
        $.getJSON("/station/dynamic", function (dyndata) {
            // extracting the dynamic data
            renderHTML(data, dyndata);
            // sending both static and dynamic data into the function renderHTML
            map.setZoom(13)
        })
    }).fail(function (msg) {
        console.log('failed', msg);
    });


    function renderHTML(bikeObj, dynObj) {
        //arsing the static and dynamic data and setting them to markers
        for (var i = 0; i < bikeObj.length; i++) {
            for (var j = 0; j < dynObj.length; j++) {
                if (bikeObj[i].name == dynObj[j].name) {
                    var availBikes = dynObj[j].available_bikes;
                    var availBikeStands = dynObj[j].available_bike_stands;
                }
            }
            var lngPos = bikeObj[i].position_lng;
            var latPos = bikeObj[i].position_lat;
            var title = bikeObj[i].name;
            var address = bikeObj[i].address;
            var station = bikeObj[i].number;
            var info = new google.maps.InfoWindow({content: '<p><b>Address: </b>' + address + '<br>' + '<b>Available Bikes:</b> ' + availBikes + '<br>' + '<b>Free Stands:</b> ' + availBikeStands + '</p>'});
            // Create a marker per location, and put into markers array.
            //you take the info from here and put into the comment box when you click the marker.

            var percentage10 = bikeObj[i].bike_stands * (10 / 100);
            var percentage30 = bikeObj[i].bike_stands * (30 / 100);
            var percentage50 = bikeObj[i].bike_stands * (50 / 100);
            var percentage80 = bikeObj[i].bike_stands * (80 / 100);
            //calculating the percentage of bikes at a particular station.

            //HEAT MAP CONDITIONS
            switch (true) {
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

            //setting marker information
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(latPos, lngPos),
                title: title,
                station: station,
                address: address,
                availBikes: availBikes,
                availBikeStands: availBikeStands,
                icon: varIcon,
                animation: google.maps.Animation.DROP,
                id: i,
                info: info
            });

            //Create the event listeners for hover and click for the marker
            google.maps.event.addListener(marker, 'mouseover', function () {
                this.info.open(map, this);
            });
            google.maps.event.addListener(marker, 'mouseout', function () {
                this.info.close();
            });
            google.maps.event.addListener(marker, 'click', function () {
                //Change nameStation global var with the name of the new clicked marker's station
                document.getElementById("googleChartBottom").style.height = "320px";
                nameStation = this.title;
                nameStation = nameStation.replace("'", "%27");
                // console.log("Station is:", nameStation);
                googleChartsToday();
            });
            //when user clicks the marker the google charts information will come up from the bottom of the window.
            // marker.addListener('click', function () {
            //
            // });

            // Push the marker to our array of markers.
            markers.push(marker);

        }
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);

    }

// ********************** LEGEND ***************

    var icons = {
        '0': {
            name: '0%',
            icon: '/static/images/nobikes.png'
        },
        '1': {
            name: '< 10%',
            icon: '/static/images/marker1.png'
        },
        '2': {
            name: '< 30%',
            icon: '/static/images/marker2.png'
        },
        '3': {
            name: '< 50%',
            icon: '/static/images/marker3.png'
        },
        '4': {
            name: '< 80%',
            icon: '/static/images/marker4.png'
        },
        '5': {
            name: '< 100%',
            icon: '/static/images/marker5.png'
        }
    };

    var legend = document.getElementById('legend');
    for (var key in icons) {
        var type = icons[key];
        var name = type.name;
        var icon = type.icon;
        var div = document.createElement('div');
        div.innerHTML = '<img src="' + icon + '"> ' + name;
        legend.appendChild(div);
    }

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(legend);

    //we/*weather icon on the map!!*/ var weatherInfo = document.getElementById('weatherInfo');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(weatherInfo);


    //********* LEGEND END *******


    document.getElementById('location-button').addEventListener('click', showCurrentLocation);
    document.getElementById('eloc-button').addEventListener('click', EuclidianLocation);
    document.getElementById('show-listings').addEventListener('click', showListings);
    document.getElementById('hide-listings').addEventListener('click', hideListings);

    //Code to run the charts
    google.charts.load('current', {packages: ['corechart']});

}

//********************** END OF GOOGLE MAPS FUNCTION*************************

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    try {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    } catch (err) {
        console.log("Not working because it's not running on HTTPS, to use geolocation please run the app on local host. Go into the Flask App called DB_connection_app.py and change from host=0.0.0.0 to your local host")
    }
}


//This function receives a station from the dropdown menu and zooms in on it
function zoomfocus(station) {
    //Checks what the current icon is for the station
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].icon == "/static/images/custom-marker-current.png") {
            markers[i].setIcon("/static/images/marker5.png");
        }
    }
    //takes in the station name as a variable, changes the map focus to the position and change the icon to the current icon
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);

        if (markers[i].address == station) {
            map.setZoom(17);
            map.panTo(markers[i].position);
            markers[i].setIcon("/static/current.png");
            markers[i].setIcon("/static/images/custom-marker-current.png");
        }
    }
}

//this function calculates and displays the closest station to the users current location
function EuclidianLocation() {
    var closestmarkerPosition;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setZoom(13);
                var min = 10000000000000000;
                var closestStation = "";
                var PI = Math.PI;
                // Calculation to find the distance between each station and the users location
                for (var i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                    var R = 6371e3; //  radius of the earth in metres
                    var φ1 = pos.lat * (PI / 180);
                    var φ2 = markers[i].getPosition().lat() * (PI / 180);
                    var Δφ = (markers[i].getPosition().lat() - pos.lat) * (PI / 180);
                    var Δλ = (markers[i].getPosition().lng() - pos.lng) * (PI / 180);

                    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                        Math.cos(φ1) * Math.cos(φ2) *
                        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    var d = R * c;

                    if (d < min) {
                        min = d;
                        closestmarker = markers[i];
                        closestmarkerPosition = markers[i].position;
                    }
                }
                closestMarker = new google.maps.Marker({
                    position: closestmarkerPosition,
                    map: map,
                    icon: "/static/images/closestLocation.png",
                    animation: google.maps.Animation.DROP
                });
                //info window content for this marker
                var content = '<p><b>Address: </b>' + closestmarker.address + '<br>' + '<b>Available Bikes:</b> ' + closestmarker.availBikes + '<br>' + '<b>Free Stands:</b> ' + closestmarker.availBikeStands + '</p>';
                google.maps.event.addListener(closestMarker, 'click', function () {
                    //Change nameStation global var with the name of the new clicked marker's station
                    nameStation = closestmarker.address;
                    nameStation = nameStation.replace("'", "%27");
                    // console.log("Station is:", nameStation);
                    document.getElementById("googleChartBottom").style.height = "300px";
                    googleChartsToday();
                });
                var infowindow = new google.maps.InfoWindow();

                google.maps.event.addListener(closestMarker, 'mouseover', (function (closestMarker, content, infowindow) {
                    return function () {
                        infowindow.setContent(content);
                        infowindow.open(map, closestMarker);
                    };
                })(closestMarker, content, infowindow));
                google.maps.event.addListener(closestMarker, 'mouseout', (function (closestMarker, content, infowindow) {
                    return function () {
                        infowindow.close();
                    };
                })(closestMarker, content, infowindow));

                map.setCenter(closestmarkerPosition);
            }, function () {
                try {
                    handleLocationError(true, infoWindow, map.getCenter());
                }
                catch (err) {
                    console.log("Not working because it's not running on HTTPS, to use geolocation please run the app on local host. Go into the Flask App called DB_connection_app.py and change from host=0.0.0.0 to your local host")
                }
            }
        );
    }

    else {
        try {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
        catch (err) {
            console.log("Not working because the browser doesn't support Geolocation")
        }
    }

}

//this function displays the users current location
function showCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setZoom(14);
                var currentMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(pos),
                    icon: "/static/images/current.png",
                    animation: google.maps.Animation.DROP
                });
                map.setCenter(pos);
                currentMarker.setMap(map);
            }, function () {
                try {
                    handleLocationError(true, infoWindow, map.getCenter());
                }
                catch (err) {
                    console.log("Not working because it's not running on HTTPS, to use geolocation please run the app on local host. Go into the Flask App called DB_connection_app.py and change from host=0.0.0.0 to your local host")
                }
            }
        );
    }

    else {
        try {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
        catch (err) {
            console.log("Not working because the browser doesn't support Geolocation")
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


//*********************** WEATHER SIDEBAR************************************//


function openNav() {
    document.getElementById("weather-div").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

//*********************** GOOGLECHARTS BOTTOM BAR ************************************//

function closeNav2() {
    document.getElementById("googleChartBottom").style.height = "0";
}
/******************************GOOGLECHARTS*******************************/

//Shows today's data once user clicks on View Today button
function googleChartsToday() {
    var info_url = "/chartTodayView/detailedInformation/" + nameStation;
    $.getJSON(info_url, function (fullDetails) {
        html = "<p>Number: " + fullDetails[0].number + "</p><p>Address: " + fullDetails[0].address + "</p><p>Status: " + fullDetails[1].status
            + "</p><p>Total Bike Stands: " + fullDetails[0].bike_stands + "</p><p>Available Bikes: " + fullDetails[1].available_bikes
            + "</p><p>Available Bike Stands: " + fullDetails[1].available_bike_stands
            + "</p><p>Banking: " + fullDetails[0].banking + "</p><p>Bonus: " + fullDetails[0].bonus + "</p>";
        document.getElementById("station-info-div").innerHTML = html;
    });
    // console.log('inside google charts - today', nameStation);
    var url = "/chartTodayView/" + nameStation;
    $.getJSON(url, function (todayData) {
        // console.log('IMMA HERE in the event handler - today');
        google.charts.setOnLoadCallback(drawChart_bike(todayData));
        google.charts.setOnLoadCallback(drawChart_stand(todayData));
    });
}

$("#chart-div2").css('cursor', 'wait');
$("#chart-div1").css('cursor', 'wait');
//Shows daily data once user clicks on View Daily button
function googleChartsDaily(dayNumber) {
    // console.log('inside google charts - daily', nameStation, dayNumber)
    var url = "/chartDailyView/" + nameStation + "/" + dayNumber;
    // console.log(url);
    $.getJSON(url, function (dailyData) {
        // console.log('IMMA HERE in the event handler - daily');
        google.charts.setOnLoadCallback(drawChart_bike(dailyData));
        google.charts.setOnLoadCallback(drawChart_stand(dailyData));
    });
}

//Shows weekly data once user clicks on View Weekly button
function googleChartsWeekly() {
    // console.log('inside google charts - weekly', nameStation)
    var url = "/chartWeekView/" + nameStation;
    // console.log(url);
    $.getJSON(url, function (weeklyData) {
        // console.log('IMMA HERE in the event handler - weekly');
        google.charts.setOnLoadCallback(drawChartWeek_bike(weeklyData));
        google.charts.setOnLoadCallback(drawChartWeek_stand(weeklyData));
    });

}

//Creates a ONE-WEEKDAY chart for avalaible_bikes
function drawChart_bike(dyndata) {
    // console.log('Inside drawchart_bike, draws the map');

    var table_Data = new google.visualization.DataTable();

    table_Data.addColumn('string', 'Time');
    table_Data.addColumn('number', 'Bikes Available');

    // console.log("Checking index - of interval", dyndata[0].intervals*1000);
    for (var i = 0; i < dyndata.length; i++) {
        date = new Date(dyndata[i].intervals * 1000);
        table_Data.addRow([date.getHours() + ":00", dyndata[i].available_bikes]);
    }


    var options = {
        title: 'Daily Averages - Available Bikes',
        vAxis: {title: 'Availability'},
        hAxis: {title: 'Time of Day'},
        seriesType: 'bars',
        legend: {position: 'none'}
    };

    var chart = new google.visualization.ComboChart(document.getElementById('chart-div1'));
    chart.draw(table_Data, options);

}

//Creates a ONE-DAY chart for avalaible_bike_stands
function drawChart_stand(dyndata) {
    // console.log('Inside drawchart_bike, draws the map');

    var table_Data = new google.visualization.DataTable();

    table_Data.addColumn('string', 'Time');
    table_Data.addColumn('number', 'Bikes Stands Available');

    // console.log("Checking index - of interval", dyndata[0].intervals*1000);
    for (var i = 0; i < dyndata.length; i++) {
        date = new Date(dyndata[i].intervals * 1000);
        table_Data.addRow([date.getHours() + ":00", dyndata[i].available_bike_stands]);
    }


    var options = {
        title: 'Daily Averages - Available Bike Stands',
        vAxis: {title: 'Availability'},
        hAxis: {title: 'Time of Day'},
        seriesType: 'bars',
        legend: {position: 'none'}
    };

    var chart = new google.visualization.ComboChart(document.getElementById('chart-div2'));
    chart.draw(table_Data, options);

}

//Creates a WEEK chart for avalaible_bikes
function drawChartWeek_bike(dyndata) {
    // console.log('Inside drawChartWeek_bike, draws the map');

    var table_Data = new google.visualization.DataTable();

    table_Data.addColumn('string', 'Day of the Week');
    table_Data.addColumn('number', '00:00-06:00');
    table_Data.addColumn('number', '06:00-12:00');
    table_Data.addColumn('number', '12:00-18:00');
    table_Data.addColumn('number', '18:00-00:00');

    // console.log("Checking index - of interval", dyndata[0][0].intervals * 1000)
    for (var i = 0; i < dyndata.length; i++) {
        table_Data.addRow([dyndata[i][0].week_day, dyndata[i][0].available_bikes, dyndata[i][1].available_bikes, dyndata[i][2].available_bikes, dyndata[i][3].available_bikes]);
    }


    var options = {
        title: 'Weekly Averages - Bikes Available',
        vAxis: {title: 'Availability'},
        hAxis: {title: 'Time of Day'},
        seriesType: 'bars',
        legend: {position: 'none'}
    };

    var chart = new google.visualization.ComboChart(document.getElementById('chart-div1'));
    chart.draw(table_Data, options);

}

//Creates a WEEK chart for avalaible_bikes
function drawChartWeek_stand(dyndata) {
    // console.log('Inside drawchart_bike, draws the map');

    var table_Data = new google.visualization.DataTable();

    table_Data.addColumn('string', 'Day of the Week');
    table_Data.addColumn('number', '00:00-06:00');
    table_Data.addColumn('number', '06:00-12:00');
    table_Data.addColumn('number', '12:00-18:00');
    table_Data.addColumn('number', '18:00-00:00');

    // console.log("Checking index - of interval", dyndata[0][0].intervals * 1000);
    for (var i = 0; i < dyndata.length; i++) {
        table_Data.addRow([dyndata[i][0].week_day, dyndata[i][0].available_bike_stands, dyndata[i][1].available_bike_stands, dyndata[i][2].available_bike_stands, dyndata[i][3].available_bike_stands]);
    }


    var options = {
        title: 'Weekly Averages - Bike Stands Available',
        vAxis: {title: 'Availability'},
        hAxis: {title: 'Time of Day'},
        seriesType: 'bars',
        legend: {position: 'none'}
    };

    var chart = new google.visualization.ComboChart(document.getElementById('chart-div2'));
    chart.draw(table_Data, options);

}

function closeNav() {
    document.getElementById("weather-div").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

//*************************** HIDE/SHOW BUTTON ************************

function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        // bounds.extend(markers[i].position);
    }
    // map.fitBounds(bounds);
}

// This function will loop through the listings and hide them all.
function hideListings() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    closestMarker.setMap(null);
}
