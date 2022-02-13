const mysql = require('mysql');

const con1 = mysql.createConnection({
	host: "node1.ckcjtnmnctpq.ap-southeast-1.rds.amazonaws.com",
	user: "admin",
	password: "password",
	database: "imdb"
});

const con2 = mysql.createConnection({
	host: "node2.c0sjx10dpii7.ap-southeast-1.rds.amazonaws.com",
	user: "admin",
	password: "password",
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

var offset = 0;

function checknode1(err){
	if (err)
		node1isOn = false;

	else
		node1isOn = true;
}

function checknode2(err){
	if (err)
		node2isOn = false;

	else
		node2isOn = true;
}
function checknode3(err){
	if (err)
		node3isOn = false;

	else
		node3isOn = true;
}

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

function sortItems(array) {
	for (let i = 0; i < 199; i++) {

		for (let j = 0; j < 199; j++) {
			add1 = j+1
			if(add1 == 200)
				add1 = 199
			if (array[j].id > array[add1].id) {
				let temp = array[j];
				array[j] = array[add1];
				array[add1] = temp;
			}
		}
	}
	return array.splice(0, 100);
}

function sorItemstop10(array) {
	for (let i = 0; i < 20; i++) {

		for (let j = 0; j < 19; j++) {
			if (array[j].id > array[j + 1].id) {
				let temp = array[j];
				array[j] = array[j + 1];
				array[j + 1] = temp;
			}
		}
	}
	return array.splice(0, 10);
}


const controller = {



	// MAKE TRANSACTIONS
	getIndex: function (req, res) {
		offset = 0;
		// Add Recovery

		// Check if recovery tables are empty
		con1.query("SELECT * FROM RECOVERY", function (err5, data, fields) {
			if (err5) throw err5;
		//	console.log(data);

		});

		con2.query("SELECT * FROM RECOVERY", function (err5, data, fields) {
			if (err5) throw err5;
		//	console.log(data);
		});

		con3.query("SELECT * FROM RECOVERY", function (err5, data, fields) {
			if (err5) throw err5;
		//	console.log(data);
		});


					// If node 1 is online load from node 1
					if (node1isOn) {

						// Recover to/from node 2
						if(node2isOn)
						{
							con2.query("SELECT * FROM RECOVERY", function (err5, data, fields) {
								checknode2(err5);

								data.forEach(function(ROW) {
									con1.query(ROW.QUERY, function (err5, data, fields) {
										checknode1(err5);
									});
								});

								if(node2isOn)
								con2.query("TRUNCATE TABLE RECOVERY", function (err5, data, fields) {
									checknode2(err5);
								});
							});
						}

						// Recover from node 3
						if(node3isOn)
						{

							con3.query("SELECT * FROM RECOVERY", function (err5, data, fields) {
								checknode3(err5);

								data.forEach(function(ROW) {
									con1.query(ROW.QUERY, function (err5, data, fields) {
										checknode1(err5);
									});
								});
								if(node1isOn)
								con3.query("TRUNCATE TABLE RECOVERY", function (err5, data, fields) {
									checknode3(err5);
								});
							});
						}

						if(node2isOn && node3isOn)
						{
							con1.query("SELECT * FROM RECOVERY", function (err5, data, fields) {
								checknode1(err5);

								data.forEach(function(ROW) {


									if(ROW.NODE == "node2")
									con2.query(ROW.QUERY, function (err5, data, fields) {
										checknode2(err5);
									});

									else
									con3.query(ROW.QUERY, function (err5, data, fields) {
										checknode3(err5);
									});
								});

								if(node1isOn)
								con1.query("TRUNCATE TABLE RECOVERY", function (err5, data, fields) {
								});
							});
						}

						if(node1isOn) {
							con1.query("START TRANSACTION", function (err5, data, fields) {
								checknode1(err5);
							});
							if(node1isOn)
							con1.query("SELECT * FROM movies LIMIT 100", function (err5, data, fields) {
								checknode1(err5);
								res.render('Home', {data});
							});
							con1.query("COMMIT", function (err5, data, fields) {
								checknode1(err5);
							});
						}
					}


					// If node 2 and 3 are online load from node 2 and 3
					if (!node1isOn && node2isOn && node3isOn) {

						con2.query("START TRANSACTION", function (err5, data, fields) {
							checknode2(err5);
						});

						con2.query("SELECT * FROM movies LIMIT 100", function (err3, data2, fields) {
							checknode2(err3);

						con2.query("COMMIT", function (err5, data, fields) {
							checknode2(err5);
						});

							if(node2isOn) {

								con3.query("START TRANSACTION", function (err5, data, fields) {
									checknode3(err5);
								});
								if(node3isOn)
								con3.query("SELECT * FROM movies LIMIT 100", function (err4, data3, fields) {
									checknode3(err4);

									data = [];
									data = data.concat(data3, data2);
									// D KO ALAM PANO ISORT YUNG DATA
									data = sortItems(data)
									res.render('Home', {data});
								});
								con3.query("COMMIT", function (err5, data, fields) {
									checknode3(err5);
								});
							}
						});
					}

					// else Render error screen
					if((!node1isOn && !node2isOn && !node3isOn) || (!node1isOn && !node2isOn && node3isOn) || (!node1isOn && node2isOn && !node3isOn))
						res.render('Home');

	},

	Next100: function (req, res) {

		offset = offset+100;
		// If node 1 is online load from node 1
		if (node1isOn) {

			con1.query("START TRANSACTION", function (err5, data, fields) {
				checknode1(err5);
			});
			if(node1isOn)
			con1.query("SELECT * FROM movies LIMIT 100 OFFSET " + offset, function (err5, data, fields) {
				checknode1(err5);
				res.render('Home', {data});
			});
			con1.query("COMMIT", function (err5, data, fields) {
				checknode1(err5);
			});
		}

		// If node 2 and 3 are online load from node 2 and 3
		 if (!node1isOn && node2isOn && node3isOn) {
			offsethere = offset/2

			con2.query("START TRANSACTION", function (err5, data, fields) {
				checknode2(err5);
			});
			con2.query("SELECT * FROM movies LIMIT 100 OFFSET " + offsethere, function (err3, data2, fields) {
				checknode2(err3);

			con2.query("COMMIT", function (err5, data, fields) {
			});

				if(node2isOn) {

					con3.query("START TRANSACTION", function (err5, data, fields) {
						checknode3(err5);
					});
					if(node3isOn)
					con3.query("SELECT * FROM movies LIMIT 100 OFFSET " + offsethere, function (err4, data3, fields) {
						checknode3(err4);

						data = [];
						data = data.concat(data3, data2);
						// D KO ALAM PANO ISORT YUNG DATA
						data = sortItems(data)
						res.render('Home', {data});
					});
					con3.query("COMMIT", function (err5, data, fields) {
						checknode3(err5);
					});
				}
			});
		}

		// else Render error screen
		if((!node1isOn && !node2isOn && !node3isOn) || (!node1isOn && !node2isOn && node3isOn) || (!node1isOn && node2isOn && !node3isOn))
			res.render('Home');
	},

	Prev100: function (req, res) {

		offset = offset-100;
		if(offset < 0)
			offset = 0;

		// If node 1 is online load from node 1
		if (node1isOn) {

			con1.query("START TRANSACTION", function (err5, data, fields) {
				checknode1(err5);
			});
			if(node1isOn)
				con1.query("SELECT * FROM movies LIMIT 100 OFFSET " + offset, function (err5, data, fields) {
					checknode1(err5);
					res.render('Home', {data});
				});
			con1.query("COMMIT", function (err5, data, fields) {
				checknode1(err5);
			});
		}

		// If node 2 and 3 are online load from node 2 and 3
		if (!node1isOn && node2isOn && node3isOn) {
			offsethere = offset/2

			con2.query("START TRANSACTION", function (err5, data, fields) {
				checknode2(err5);
			});
			con2.query("SELECT * FROM movies LIMIT 100 OFFSET " + offsethere, function (err3, data2, fields) {
				checknode2(err3);

				con2.query("COMMIT", function (err5, data, fields) {
				});

				if(node2isOn) {

					con3.query("START TRANSACTION", function (err5, data, fields) {
						checknode3(err5);
					});
					if(node3isOn)
						con3.query("SELECT * FROM movies LIMIT 100 OFFSET " + offsethere, function (err4, data3, fields) {
							checknode3(err4);

							data = [];
							data = data.concat(data3, data2);
							// D KO ALAM PANO ISORT YUNG DATA
							data = sortItems(data)
							res.render('Home', {data});
						});
					con3.query("COMMIT", function (err5, data, fields) {
						checknode3(err5);
					});
				}
			});
		}

		// else Render error screen
		if((!node1isOn && !node2isOn && !node3isOn) || (!node1isOn && !node2isOn && node3isOn) || (!node1isOn && node2isOn && !node3isOn))
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
							checknode1(err5);
						});

						if(node1isOn)
						con1.query(query, function (err5, result) {
							checknode1(err5);

							console.log("Number of records deleted: " + result.affectedRows);
						});
						con1.query("COMMIT", function (err5, data, fields) {
							checknode1(err5);
						});

						if(node2isOn && yearnum < 1980)
						{
							con2.query("START TRANSACTION", function (err5, data, fields) {
								checknode2(err5);
							});

							if(node2isOn)
							con2.query(query, function (err3, result) {
								checknode2(err3);

								console.log("Number of records deleted: " + result.affectedRows);
							});
							con2.query("COMMIT", function (err5, data, fields) {
								checknode2(err5);
							});

							// Add to recovery if node2 becomes offline
							if(!node2isOn)
							{
								con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"START TRANSACTION\",\"node2\")", function (err5, result) {
								});
								con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"" + query + "\", \"node2\")", function (err5, result) {
								});
								con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"COMMIT\", \"node2\")", function (err5, result) {
								});
							}
						}

						// ELSE ADD TO TRANSACTIONS TABLE
						else
						if(!node2isOn && yearnum < 1980)
						{
							con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"START TRANSACTION\",\"node2\")", function (err5, result) {
							});
							con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"" + query + "\", \"node2\")", function (err5, result) {
							});
							con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"COMMIT\", \"node2\")", function (err5, result) {
							});
						}


						if(node3isOn && yearnum >= 1980)
						{
							con3.query("START TRANSACTION", function (err5, data, fields) {
								checknode3(err5);
							});
							if(node3isOn)
							con3.query(query, function (err, result) {
								checknode3(err);

								console.log("Number of records deleted: " + result.affectedRows);
							});
							con3.query("COMMIT", function (err5, data, fields) {
								checknode3(err5);
							});

							if(!node3isOn)
							{
								con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"START TRANSACTION\",\"node3\")", function (err5, result) {
								});
								con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"" + query + "\", \"node3\")", function (err5, result) {
								});
								con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"COMMIT\", \"node3\")", function (err5, result) {
								});
							}
						}

						// ELSE ADD TO TRANSACTIONS TABLE
						else
						if(!node3isOn && yearnum >= 1980)
						{
							con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"START TRANSACTION\",\"node3\")", function (err5, result) {
							});
							con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"" + query + "\", \"node3\")", function (err5, result) {
							});
							con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"COMMIT\", \"node3\")", function (err5, result) {
							});
						}
					}

				else if (node2isOn && node3isOn){

						if(yearnum < 1980)
						{
							con2.query("START TRANSACTION", function (err5, data, fields) {
								checknode2(err5);
							});
							con2.query(query, function (err3, result) {
								checknode2(err3);

								console.log("Number of records deleted: " + result.affectedRows);
							});
							con2.query("COMMIT", function (err5, data, fields) {
								checknode2(err5);
							});

							con2.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"START TRANSACTION\",\"node1\")", function (err5, result) {
							});
							con2.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"" + query + "\", \"node1\")", function (err5, result) {
							});
							con2.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"COMMIT\", \"node1\")", function (err5, result) {
							});
						}

						else
						if(yearnum >= 1980)
						{
							con3.query("START TRANSACTION", function (err5, data, fields) {
								checknode3(err5);
							});
							con3.query(query, function (err, result) {
								checknode3(err);

								console.log("Number of records deleted: " + result.affectedRows);
							});
							con3.query("COMMIT", function (err5, data, fields) {
								checknode3(err5);
							});

							con3.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"START TRANSACTION\",\"node1\")", function (err5, result) {
							});
							con3.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"" + query + "\", \"node1\")", function (err5, result) {
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
	},

	insertRecord: function (req, res) {
		//Get variables
		var details = {};
		let idNum = 0;
		let movieName = req.query.movieName;
		let year = req.query.year;
		let rank = req.query.rank;
		let yearnum = parseInt(year);
		let query = "";

					// If node 1 is online load from node 1
					if (node1isOn) {
						//generate id number
						con1.query("START TRANSACTION", function (err5, data, fields) {
						});
						con1.query("SELECT (MAX(id)+1) as id FROM movies;", function (err5, data, fields) {
							if (err5) throw err5;
							idNum = data[0].id;
							query = "INSERT INTO movies VALUES ('" + idNum + "', '" + movieName + "', '" + year + "', '" + rank + "');";
						
						//insert new record to node 1
						con1.query(query, function (err5, result) {

							console.log("1 New record added! " + idNum + ", " + movieName + ", " + year + ", " + rank);
						});
						con1.query("COMMIT", function (err5, data, fields) {
						});

						if(node2isOn && yearnum < 1980)
						{
							con2.query("START TRANSACTION", function (err5, data, fields) {
							});
							con2.query(query, function (err3, result) {

								console.log("2 New record added! " + idNum + ", " + movieName + ", " + year + ", " + rank);
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
							con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"" + query + "\", \"node2\")", function (err5, result) {
							});
							con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"COMMIT\", \"node2\")", function (err5, result) {
							});
						}


						if(node3isOn && yearnum >= 1980)
						{
							con3.query("START TRANSACTION", function (err5, data, fields) {
							});
							con3.query(query, function (err, result) {

								console.log("3 New record added! " + idNum + ", " + movieName + ", " + year + ", " + rank);
							});
							con3.query("COMMIT", function (err5, data, fields) {
							});
						}

						// ELSE ADD TO RECOVERY TABLE
						else
						if(!node3isOn && yearnum >= 1980)
						{
							con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"START TRANSACTION\",\"node3\")", function (err5, result) {
							});
							con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"" + query + "\", \"node3\")", function (err5, result) {
							});
							con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"COMMIT\", \"node3\")", function (err5, result) {
							});
						}

						details.idNum = idNum;
						details.movieName = movieName;
						details.year = year;
						details.rank = rank;
						res.render('insertSuccess', details);
					});
					}


				//executes if node1 is offline
				else if (node2isOn && node3isOn){
					//generate highest id number from node 2
					con2.query("START TRANSACTION", function (err5, data, fields) {
					});
					con2.query("SELECT (MAX(id)+1) as id FROM movies;", function (err5, data, fields) {
						if (err5) throw err5;
							let idNum2 = data[0].id;
							//let query = "INSERT INTO movies VALUES ('" + idNum + "', '" + movieName + "', '" + year + "', '" + rank + "');";
					con2.query("COMMIT", function (err5, data, fields) {
					});

					//generate highest id number from node 3
					con3.query("START TRANSACTION", function (err5, data, fields) {
					});
					con3.query("SELECT (MAX(id)+1) as id FROM movies;", function (err5, data, fields) {
						if (err5) throw err5;
							let idNum3 = data[0].id;
							//let query = "INSERT INTO movies VALUES ('" + idNum + "', '" + movieName + "', '" + year + "', '" + rank + "');";
					con3.query("COMMIT", function (err5, data, fields) {
					});

					//compare which has the higher id number from nodes 2 and 3
					if(parseInt(idNum2) > parseInt(idNum3))
						idNum = idNum2;
					else
						idNum = idNum3
					
					query = "INSERT INTO movies VALUES ('" + idNum + "', '" + movieName + "', '" + year + "', '" + rank + "');";

						//insert new record to node 2 if year is below 1980
						if(yearnum < 1980)
						{
							con2.query("START TRANSACTION", function (err5, data, fields) {
							});
							con2.query("INSERT INTO movies VALUES ('" + idNum + "', '" + movieName + "', '" + year + "', '" + rank + "');", function (err3, result) {
								console.log("4 New record added! " + idNum + ", " + movieName + ", " + year + ", " + rank);
							});
							con2.query("COMMIT", function (err5, data, fields) {
							});

							con2.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"START TRANSACTION\",\"node1\")", function (err5, result) {
							});
							con2.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"" + query + "\", \"node1\")", function (err5, result) {
							});
							con2.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"COMMIT\", \"node1\")", function (err5, result) {
							});
						}

						//insert new record to node 3 if year is equal or greater than 1980
						else
						if(yearnum >= 1980)
						{
							con3.query("START TRANSACTION", function (err5, data, fields) {
							});
							con3.query("INSERT INTO movies VALUES ('" + idNum + "', '" + movieName + "', '" + year + "', '" + rank + "');", function (err, result) {
								console.log("5 New record added! " + idNum + ", " + movieName + ", " + year + ", " + rank);
							});
							con3.query("COMMIT", function (err5, data, fields) {
							});

							con3.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"START TRANSACTION\",\"node1\")", function (err5, result) {
							});
							con3.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"" + query + "\", \"node1\")", function (err5, result) {
							});
							con3.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"COMMIT\", \"node1\")", function (err5, result) {
							});
						}

						details.idNum = idNum;
						details.movieName = movieName;
						details.year = year;
						details.rank = rank;
						res.render('insertSuccess', details);
					}); // end 2
					}); // end 3
					}
	},

	getNode: function(req, res){
		if(node1isOn)
			res.send('You are accessing the data from Node 1');

		else
		if(node2isOn && node3isOn)
			res.send('You are accessing the data from Nodes 2 and 3');

		else
			res.send('All nodes are offline');

	},

	top10: function(req, res){
		if(node1isOn) {
			con1.query("START TRANSACTION", function (err5, data, fields) {
			});
			con1.query("SELECT * FROM imdb.movies ORDER BY `rank` DESC LIMIT 10;", function (err5, data, fields) {
				if (err5) throw err5;

				res.render('Home', {data});
			con1.query("COMMIT", function (err5, data, fields) {
			});
			});
		}

		else
		if(node2isOn && node3isOn)
		{
			con2.query("START TRANSACTION", function (err5, data, fields) {
			});
			con2.query("SELECT * FROM imdb.movies ORDER BY `rank` DESC LIMIT 10;", function (err5, data1, fields) {
				if (err5) throw err5;
			con2.query("COMMIT", function (err5, data, fields) {
			});

				con3.query("START TRANSACTION", function (err5, data, fields) {
				});
				con3.query("SELECT * FROM imdb.movies ORDER BY `rank` DESC LIMIT 10;", function (err5, data2, fields) {
					if (err5) throw err5;

					data = [];
					data = data.concat(data1, data2);

					data = sorItemstop10(data);
					res.render('Home', {data});
				});
				con3.query("COMMIT", function (err5, data, fields) {
				});
			});
		}
	},

	searchMovie: function (req, res){

		search = req.param("searchname");
		console.log(search);

		if(node1isOn) {

			con1.query("START TRANSACTION", function (err5, data, fields) {
			});
			con1.query("SELECT * FROM imdb.movies WHERE `name` LIKE \"" + search + "%\";", function (err5, data, fields) {
				if (err5) throw err5;

				res.render('Home', {data});
				con1.query("COMMIT", function (err5, data, fields) {
				});
			});
		}

		else if(node2isOn && node3isOn){
			con2.query("START TRANSACTION", function (err5, data, fields) {
			});
			con2.query("SELECT * FROM imdb.movies WHERE `name` LIKE \"" + search + "%\";", function (err5, data1, fields) {
				if (err5) throw err5;
				con2.query("COMMIT", function (err5, data, fields) {
				});

				con3.query("START TRANSACTION", function (err5, data, fields) {
				});
				con3.query("SELECT * FROM imdb.movies WHERE `name` LIKE \"" + search + "%\";", function (err5, data2, fields) {
					if (err5) throw err5;

					data = [];
					data = data.concat(data1, data2);

					res.render('Home', {data});
				});
				con3.query("COMMIT", function (err5, data, fields) {
				});
			});
		}
	},

	viewUpdatePage: function (req, res) {
		let idNum = req.param("id");
		let movieName = req.param("movie");
		let year = req.param("year");
		let rank = req.param("rank");
		let details = {};

		console.log(movieName);
		details.idNum = idNum;
		details.name = movieName;
		details.year = year;
		details.rank = rank;

		res.render('Update', details);
	},

	updateRecord: function (req, res) {
		//Get variables
		let details = {};
		let idNum = req.query.idNum;
		let movieName = req.query.name;
		let year = req.query.year;
		let rank = req.query.rank;
		if (rank == '') {
			rank = "NULL";
		}
		let yearnum = parseInt(year);
		let query = "UPDATE movies SET name = '" + movieName + "', " + "year = " + year + ", " + 
					"`rank` = " + rank + " WHERE id = " + idNum + ";";



		// If node 1 is online load from node 1
		if (node1isOn) {
			con1.query("START TRANSACTION", function (err5, data, fields) {
			});
			con1.query(query, function (err5, result) {
				if (err5) throw err5;

				console.log("Updated record with " + idNum + " to " + movieName + ", " + year + ", " + rank);
			});
			con1.query("COMMIT", function (err5, data, fields) {
			});

			if(node2isOn && yearnum < 1980)
			{
				con2.query("START TRANSACTION", function (err5, data, fields) {
				});
				con2.query(query, function (err3, result) {
					if (err3) throw err3;

					console.log("Updated record with " + idNum + " to " + movieName + ", " + year + ", " + rank);
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
				con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"" + query + "\", \"node2\")", function (err5, result) {
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

					console.log("Updated record with " + idNum + " to " + movieName + ", " + year + ", " + rank);
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
				con1.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"" + query + "\", \"node3\")", function (err5, result) {
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

					console.log("Updated record with " + idNum + " to " + movieName + ", " + year + ", " + rank);
				});
				con2.query("COMMIT", function (err5, data, fields) {
				});

				con2.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"START TRANSACTION\",\"node1\")", function (err5, result) {
				});
				con2.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"" + query + "\", \"node1\")", function (err5, result) {
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

					console.log("Updated record with " + idNum + " to " + movieName + ", " + year + ", " + rank);
				});
				con3.query("COMMIT", function (err5, data, fields) {
				});

				con3.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"START TRANSACTION\",\"node1\")", function (err5, result) {
				});
				con3.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"" + query + "\", \"node1\")", function (err5, result) {
				});
				con3.query("INSERT INTO RECOVERY (QUERY, NODE) VALUES (\"COMMIT\", \"node1\")", function (err5, result) {
				});
			}

		}

		details.idNum = idNum;
		details.name = movieName;
		details.year = year;
		details.rank = rank;
		console.log("NAME: " + movieName + " " + details.name);

		res.render('updateSuccess', details);
	}

}

module.exports = controller;