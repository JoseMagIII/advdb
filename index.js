const dotenv = require('dotenv');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const routes = require(`./routes/routes.js`);
const mysql = require('mysql');



const app = express()
app.set(`view engine`, `hbs`);

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static("views"));


// Ignore this
// app.use(session({
//     secret: 'project-session',
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({ mongoUrl: 'mongodb+srv://apdevUSER:easypassword@apdev-cluster.cpgyh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' })
// }))

app.use(`/`, routes);
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static("public"));

app.use(express.urlencoded({extended: true}));

dotenv.config();
port = process.env.PORT || 3000;
hostname = 0.0.0.0;


app.listen(port, hostname, function () {
	console.log('Server running at:');
	console.log('http://' + hostname + ':' + port);

})
