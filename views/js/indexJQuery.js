$(document).ready(function () {

//AJAX for like buttons

    $(window).on( "load", function() {
        $.get('/getNode', function (result) {
            alert(result)
        });

        $.get('/getNodeStatus', function (result) {
            if (result[0]) {
                $('#node1').prop('checked', true);
            }
            if (result[1]) {
                $('#node2').prop('checked', true);
            }
            if (result[2]) {
                $('#node3').prop('checked', true);
            }
        });
        console.log("LOADED");
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

        $.get('/update', {ID: ID, rowNAME: rowNAME, rowYEAR: rowYEAR, rowRANK: rowRANK}, function () {
        });
    });

    $(".nodes").on('click', function () {
        let node = $(this).parent().text().trim();
        
        $.get('/disableNode', {node: node}, function () {
        });
    });

    $("select.isolationLevels").on('change', function () {
        let selectedLevel = $(this).children("option:selected").text();

        console.log(selectedLevel);
        $.get('/setIsolationLevel', {selectedLevel: selectedLevel}, function (result) {
        });

        });

});