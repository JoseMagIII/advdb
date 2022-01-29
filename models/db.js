const mysql = require('mysql');

const con = mysql.createConnection({
    host: "node1.cjxmg4tjsfwi.ap-southeast-1.rds.amazonaws.com",
    user: "admin",
    password: "password",
    database: "imdb"
});

// Load from node 1
con.connect(function(err) {
    if (err) throw err;

    con.query("SELECT * FROM movies", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });

});
