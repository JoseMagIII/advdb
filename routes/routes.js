const express = require(`express`);

//Reference
//const GameController = require(`../controllers/GameController.js`);

const Controller = require(`../controllers/Controller.js`);

const app = express();

app.get('/', Controller.getIndex);
app.get('/rowDelete', Controller.rowDelete);

app.get("/insert", Controller.viewInsertPage);
app.get("/getNode", Controller.getNode);
//Reference
//app.get(`/addComment`, GameController.addComment);

	

module.exports = app;