$(document).ready(function () {

//AJAX for like buttons

    $(window).on( "load", function() {
        $.get('/getNode', function (result) {
            alert(result)
        });
    });


    $(".delete").on('click', function () {
        let id = $(this).children("#rowId");
        let year = $(this).children("#rowYear");
        let ID = id.text()
        let rowYEAR = year.text()

        $(this).parent().parent().remove();
        $.get('/rowDelete', {ID: ID, rowYEAR: rowYEAR}, function (result) {
        });
    });

});