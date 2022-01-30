const mysql = require('mysql');

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


const controller = {

	getIndex: function (req, res) {

		let node1isOn = true;
		let node2isOn = true;
		let node3isOn = true;

		// Check node connections
		con1.connect(function (err) {
			if (err)
				node1isOn = false;

			con2.connect(function (err) {
				if (err)
					node2isOn = false;

				con3.connect(function (err) {
					if (err)
						node3isOn = false;


					// If node 1 is online load from node 1
					if (node1isOn)
						con1.query("SELECT * FROM movies LIMIT 100", function (err5, data, fields) {
							if (err5) throw err5;
							res.render('Home', {data});
							console.log(data);

						});

					// If node 2 and 3 are online load from node 2 and 3
					else if (node2isOn && node3isOn)
						con2.query("SELECT * FROM movies LIMIT 50", function (err3, data2, fields) {
							if (err3) throw err3;

							else {


								con3.query("SELECT * FROM movies LIMIT 50", function (err4, data3, fields) {
									if (err4) throw err4;

									data = [];
									data = data.concat(data2, data3);

									res.render('Home', {data});
									console.log(data);
								});
							}


						});

					// else Render error screen
					else
						res.render('Home');

				});
			});
		});
	},

	// TEMPORARY TINAMAD NA KO SORRY

	rowDelete: function (req, res) {
		//Get variables
		let id = req.query.ID;

		let node1isOn = true;
		let node2isOn = true;
		let node3isOn = true;

		// Check node connections
		con1.connect(function (err) {
			if (err)
				node1isOn = false;

			con2.connect(function (err) {
				if (err)
					node2isOn = false;

				con3.connect(function (err) {
					if (err)
						node3isOn = false;


					// If node 1 is online load from node 1
					if (node1isOn)
						con1.query("SELECT * FROM movies LIMIT 100", function (err5, data, fields) {
							if (err5) throw err5;
							res.render('Home', {data});
							console.log(data);

						});

					// If node 2 and 3 are online load from node 2 and 3
					else if (node2isOn && node3isOn)
						con2.query("SELECT * FROM movies LIMIT 50", function (err3, data2, fields) {
							if (err3) throw err3;

							else {


								con3.query("SELECT * FROM movies LIMIT 50", function (err4, data3, fields) {
									if (err4) throw err4;

									data = [];
									data = data.concat(data2, data3);

									res.render('Home', {data});
									console.log(data);
								});
							}


						});

					// else Render error screen
					else
						res.render('Home');

				});
			});
		});

		res.send(true);
	},

}

module.exports = controller;