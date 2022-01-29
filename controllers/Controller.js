const mysql = require('mysql');

const controller = {

	getIndex: function(req, res) {

		const con1 = mysql.createConnection({
			host: "node1-2.cjxmg4tjsfwi.ap-southeast-1.rds.amazonaws.com",
			user: "admin",
			password: "password",
			database: "imdb"
		});

		const con2 = mysql.createConnection({
			host: "node2.c0sjx10dpii7.ap-southeast-1.rds.amazonaws.com",
			user: "admin",
			password: "12345678",
			database: "imdb"
		});

		// Add node 3
		const con3 = mysql.createConnection({
			host: "node3.cqjwsskq0j94.ap-southeast-1.rds.amazonaws.com",
			user: "admin",
			password: "password",
			database: "imdb"
		});



		con1.connect(function(err) {
			if (err) {

				// If node 1 is down load from node 2 and 3
				con2.connect(function(err6) {
					if (err6) throw err6;

					else
					con3.connect(function(err2) {
						if (err2) throw err2;

						else
						con2.query("SELECT * FROM movies LIMIT 50", function (err3, data2, fields) {
							if (err3) throw err3;

							else{

								con3.query("SELECT * FROM movies LIMIT 50", function (err4, data3, fields) {
									if (err4) throw err4;

									data = [];
									data = data.concat(data2, data3);

									res.render('Home', {data});
									console.log(data);
								});
							}

						});
					});
				});

			}

			// Load from node 1
			else {
				con1.query("SELECT * FROM movies LIMIT 100", function (err5, data, fields) {
					if (err5) throw err5;
					res.render('Home', {data});
					console.log(data);

				});
			}
		});



	}
}

module.exports = controller;