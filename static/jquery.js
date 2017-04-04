/**
 * Created by Nikki on 03/04/2017.
 */
$(document).ready(function () {
    $.ajax({
        url:"page.html",
        success: function(data){
            $('#content').html(data);
        }
    }).error(function(){
        alert('An error occurred');
    }).success(function() {
        alert('Successful load')

    })
});