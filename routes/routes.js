const express = require(`express`);

//Reference
//const GameController = require(`../controllers/GameController.js`);

const Controller = require(`../controllers/Controller.js`);

const app = express();

app.get('/', Controller.getIndex);
app.get('/rowDelete', Controller.rowDelete);
app.get('/rowUpdate', Controller.rowUpdate);

app.get("/update", Controller.viewUpdatePage);
app.get("/insert", Controller.viewInsertPage);
app.get("/getNode", Controller.getNode);
app.get("/top10", Controller.top10);
app.get("/next", Controller.Next100);
app.get("/prev", Controller.Prev100);
app.get("/searchMovie", Controller.searchMovie);
//Reference
//app.get(`/addComment`, GameController.addComment);



module.exports = app;