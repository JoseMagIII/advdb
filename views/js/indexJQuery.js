$(document).ready(function () {

//AJAX for like buttons




    $(".delete").on('click', function () {
        let id = $(this).children("#rowId");
        let year = $(this).children("#rowYear");
        let ID = id.text()
        let rowYEAR = year.text()

        $(this).parent().parent().remove();
       $.get('/rowDelete', {ID: ID, rowYEAR: rowYEAR}, function (result) {
        });
    });

    /**
    $(".btnSearch").on('click', function(){
        let name = $("#txtSearch");
        let movieName = name.val();

        console.log(movieName);
        console.log(name);

        $.get('/searchMovie', {movieName: movieName}, function () {
        });
    });
    **/

    $(".toUpdate").on('click', function () {
        let id = $(this).children("#rowId");
        let name = $(this).children("#rowName");
        let year = $(this).children("#rowYear");
        let rank = $(this).children("#rowRank");
        let ID = id.text()
        let rowNAME = name.text()
        let rowYEAR = year.text()
        let rowRANK = rank.text()

        $.get('/update', {ID: ID, rowNAME: rowNAME, rowYEAR: rowYEAR, rowRANK: rowRANK}, function (result) {
        });
    })
});