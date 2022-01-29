const mysql = require('mysql');

const controller = {

	getIndex: function(req, res) {

		const con1 = mysql.createConnection({
			host: "node1.cjxmg4tjsfwi.ap-southeast-1.rds.amazonaws.com",
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
			host: "node1.cjxmg4tjsfwi.ap-southeast-1.rds.amazonaws.com",
			user: "admin",
			password: "password",
			database: "imdb"
		});

		// Load from node 1
		con1.connect(function(err) {
			if (err) {

				// If node 1 is down load from node 2 and 3
				con2.connect(function(err) {
					if (err) throw err;

					con2.connect(function(err) {
						if (err) throw err;

						con2.query("SELECT * FROM movies LIMIT 100", function (err, data2, fields) {
							if (err) throw err;

							else{

								con3.query("SELECT * FROM movies LIMIT 100", function (err, data3, fields) {
									if (err) throw err;

									data = data2 + data3;

									res.render('Home', {data});
									console.log(data);
								});
							}

						});
					});
				});
			}


			else {
				con1.query("SELECT * FROM movies LIMIT 100", function (err, data, fields) {
					if (err) throw err;
					res.render('Home', {data});
					console.log(data);

				});
			}
		});



	}
}

module.exports = controller;