// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

function drawChart(){
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'stands');
    data.addColumn('number', 'Bikes')
    data.addRows([
        [9, 1]
        [8, 2]
        [7, 3]
    ])
}

var options = {'title':'Bike Occupancy Chart','Width':400,'height':300};

var chart = new google.visualization.BarChart(document.getElementById('chart-div'));
chart.draw(data, options)
}

