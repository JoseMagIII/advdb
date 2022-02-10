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

var node1isOn = true;
var node2isOn = true;
var node3isOn = true;

// Check node connections
con1.connect(function (err) {
	if (err)
		node1isOn = false;
});
con2.connect(function (err) {
	if (err)
		node2isOn = false;
});
con3.connect(function (err) {
	if (err)
		node3isOn = false;
});


const controller = {

	// MAKE TRANSACTIONS
	getIndex: function (req, res) {

					// If node 1 is online load from node 1
					if (node1isOn) {
						con1.query("START TRANSACTION", function (err5, data, fields) {
						});
						con1.query("SELECT * FROM movies LIMIT 100", function (err5, data, fields) {
							if (err5) throw err5;
							res.render('Home', {data});
							console.log(data);
						});
						con1.query("COMMIT", function (err5, data, fields) {
						});
					}

					// If node 2 and 3 are online load from node 2 and 3
					else if (node2isOn && node3isOn) {
						con2.query("START TRANSACTION", function (err5, data, fields) {
						});
						con2.query("SELECT * FROM movies LIMIT 50", function (err3, data2, fields) {
							if (err3) throw err3;

							else {
								con2.query("COMMIT", function (err5, data, fields) {
								});

								con3.query("START TRANSACTION", function (err5, data, fields) {
								});
								con3.query("SELECT * FROM movies LIMIT 50", function (err4, data3, fields) {
									if (err4) throw err4;

									data = [];
									data = data.concat(data2, data3);
									res.render('Home', {data});
									console.log(data);
								});
								con3.query("COMMIT", function (err5, data, fields) {
								});
							}
						});
					}

					// else Render error screen
					else
						res.render('Home');

	},


	rowDelete: function (req, res) {
		//Get variables
		let id = req.query.ID;
		let year = req.query.rowYEAR;
		let yearnum = parseInt(year);
		let query = "DELETE FROM movies WHERE id = " + id


					// If node 1 is online load from node 1
					if (node1isOn) {
						con1.query("START TRANSACTION", function (err5, data, fields) {
						});
						con1.query(query, function (err5, result) {
							if (err5) throw err5;

							console.log("Number of records deleted: " + result.affectedRows);
						});
						con1.query("COMMIT", function (err5, data, fields) {
						});

						if(node2isOn && yearnum < 1980)
						{
							con2.query("START TRANSACTION", function (err5, data, fields) {
							});
							con2.query(query, function (err3, result) {
								if (err3) throw err3;

								console.log("Number of records deleted: " + result.affectedRows);
							});
							con2.query("COMMIT", function (err5, data, fields) {
							});
						}

						// ELSE ADD TO TRANSACTIONS TABLE
						else
						if(!node2isOn && yearnum < 1980)
						{
							con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"START TRANSACTION\",\"node2\")", function (err5, result) {
							});
							con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"" + query + "\"" + ", \"node2\")", function (err5, result) {
							});
							con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"COMMIT\", \"node2\")", function (err5, result) {
							});
						}


						if(node3isOn && yearnum >= 1980)
						{
							con3.query("START TRANSACTION", function (err5, data, fields) {
							});
							con3.query(query, function (err, result) {
								if (err) throw err;

								console.log("Number of records deleted: " + result.affectedRows);
							});
							con3.query("COMMIT", function (err5, data, fields) {
							});
						}

						// ELSE ADD TO TRANSACTIONS TABLE
						else
						if(!node3isOn && yearnum >= 1980)
						{
							con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"START TRANSACTION\",\"node3\")", function (err5, result) {
							});
							con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"" + query + "\"" + ", \"node3\")", function (err5, result) {
							});
							con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"COMMIT\", \"node3\")", function (err5, result) {
							});
						}
					}

				else if (node2isOn && node3isOn){

						if(yearnum < 1980)
						{
							con2.query("START TRANSACTION", function (err5, data, fields) {
							});
							con2.query(query, function (err3, result) {
								if (err3) throw err3;

								console.log("Number of records deleted: " + result.affectedRows);
							});
							con2.query("COMMIT", function (err5, data, fields) {
							});

							con2.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"START TRANSACTION\",\"node1\")", function (err5, result) {
							});
							con2.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"" + query + "\"" + ", \"node1\")", function (err5, result) {
							});
							con2.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"COMMIT\", \"node1\")", function (err5, result) {
							});
						}

						else
						if(yearnum >= 1980)
						{
							con3.query("START TRANSACTION", function (err5, data, fields) {
							});
							con3.query(query, function (err, result) {
								if (err) throw err;

								console.log("Number of records deleted: " + result.affectedRows);
							});
							con3.query("COMMIT", function (err5, data, fields) {
							});

							con3.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"START TRANSACTION\",\"node1\")", function (err5, result) {
							});
							con3.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"" + query + "\"" + ", \"node1\")", function (err5, result) {
							});
							con3.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"COMMIT\", \"node1\")", function (err5, result) {
							});
						}

					}
	},


	//controller for view insert page
	viewInsertPage: function(req, res){
		var details = {};
		res.render('Insert', details);
	}

}

module.exports = controller;