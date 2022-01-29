const mysql = require('mysql');

const controller = {

	getIndex: function(req, res) {

		const con = mysql.createConnection({
			host: "node1.cjxmg4tjsfwi.ap-southeast-1.rds.amazonaws.com",
			user: "admin",
			password: "password",
			database: "imdb"
		});

		con.connect(function(err) {
			if (err) throw err;

			con.query("SELECT * FROM movies", function (err, data, fields) {
				if (err) throw err;
				res.render('Home', {data});
				console.log(data);
			});
		});


	}
}

module.exports = controller;