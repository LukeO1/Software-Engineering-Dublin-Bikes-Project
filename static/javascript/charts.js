
//google.charts.load('current', {packages: ['corechart']});
//google.charts.setOnLoadCallback(drawChart_PerDay);
//
//function drawChart_PerDay() {
//
//    var data = google.visualization.arrayToDataTable([
//     ['Month', 'Bolivia', 'Ecuador', 'Madagascar', 'Papua New Guinea', 'Rwanda', 'Average'],
//     ['2004/05',  165,      938,         522,             998,           450,      614.6],
//     ['2005/06',  135,      1120,        599,             1268,          288,      682],
//     ['2006/07',  157,      1167,        587,             807,           397,      623],
//     ['2007/08',  139,      1110,        615,             968,           215,      609.4],
//     ['2008/09',  136,      691,         629,             1026,          366,      569.6]
//    ]);
//
//    // Set options for Anthony's pie chart.
//    var options = {
//        title:'Chart 1',
//        vAxis: {title: 'Something'},
//        hAxis: {title: 'hah'},
//        seriesType: 'bars',
//        series: {5: {type: 'line'}}
//    };
//
//    // Instantiate and draw the chart for Anthony's pizza.
//    var chart = new google.visualization.ComboChart(document.getElementById('chart-div1'));
//    chart.draw(data, options);
// }

//    google.charts.load('current', {packages: ['corechart']});
//
//    google.charts.setOnLoadCallback(drawChart_PerDay);
////    google.charts.setOnLoadCallback(drawChart2);
//    google.charts.setOnLoadCallback(drawChart3);
///***********************************************************************/
//    function drawChart_PerDay() {
//
//        // Create the data table for Per Day view.
//        //var data = new google.visualization.arrayDataTable();
////        data.addColumn('', 'Topping');
////        data.addColumn('number', 'Slices');
////        data.addRows([
////          ['Mushrooms', 2],
////          ['Onions', 2],
////          ['Olives', 2],
////          ['Zucchini', 0],
////          ['Pepperoni', 3]
////        ]);
//        var data = google.visualization.arrayToDataTable([
//         ['Month', 'Bolivia', 'Ecuador', 'Madagascar', 'Papua New Guinea', 'Rwanda', 'Average'],
//         ['2004/05',  165,      938,         522,             998,           450,      614.6],
//         ['2005/06',  135,      1120,        599,             1268,          288,      682],
//         ['2006/07',  157,      1167,        587,             807,           397,      623],
//         ['2007/08',  139,      1110,        615,             968,           215,      609.4],
//         ['2008/09',  136,      691,         629,             1026,          366,      569.6]
//      ]);
//
//        // Set options for Anthony's pie chart.
//        var options = {
//            title:'Chart 1',
//            vAxis: {title: 'Something'},
//            hAxis: {title: 'hah'},
//            seriesType: 'bars',
//            series: {5: {type: 'line'}}
//            };
//
//        // Instantiate and draw the chart for Anthony's pizza.
//        var chart = new google.visualization.ComboChart(document.getElementById('chart-div1'));
//        chart.draw(data, options);
//      }
//
//
///*
//    function drawChart2() {
//
//        // Create the data table for Anthony's pizza.
//        var data = new google.visualization.DataTable();
//        data.addColumn('string', 'Topping');
//        data.addColumn('number', 'Slices');
//        data.addRows([
//          ['Mushrooms', 2],
//          ['Onions', 2],
//          ['Olives', 2],
//          ['Zucchini', 0],
//          ['Pepperoni', 3]
//        ]);
//
//        // Set options for Anthony's pie chart.
//        var options = {title:'Chart 2'};
//
//        // Instantiate and draw the chart for Anthony's pizza.
//        var chart = new google.visualization.PieChart(document.getElementById('chart-div2'));
//        chart.draw(data, options);
//      }
//
//
//
//    function drawChart3() {
//
//        // Create the data table for Sarah's pizza.
//        var data = new google.visualization.DataTable();
//        data.addColumn('string', 'Topping');
//        data.addColumn('number', 'Slices');
//        data.addRows([
//          ['Mushrooms', 1],
//          ['Onions', 1],
//          ['Olives', 2],
//          ['Zucchini', 2],
//          ['Pepperoni', 1]
//        ]);
//
//        // Set options for Sarah's pie chart.
//        var options = {title:'Chart 3'};
//
//        // Instantiate and draw the chart for Sarah's pizza.
//        var chart = new google.visualization.PieChart(document.getElementById('chart-div3'));
//        chart.draw(data, options);
//      }
//*/