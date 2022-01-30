$(document).ready(function () {

//AJAX for like buttons

    $(".delete").on('click', function () {
        let row = $(this).children("#rowId");
        let ID = row.text()


        $.get('/rowDelete', {ID: ID}, function (result) {
        });
    });

});