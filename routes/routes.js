const express = require(`express`);

//Reference
//const GameController = require(`../controllers/GameController.js`);

const Controller = require(`../controllers/Controller.js`);

const app = express();

app.get('/', Controller.getIndex);
app.get('/rowDelete', Controller.rowDelete);


app.get("/update", Controller.viewUpdatePage);
app.get('/updateRecord', Controller.updateRecord);
app.get("/insert", Controller.viewInsertPage);
app.get("/insertRecord", Controller.insertRecord);
app.get("/top10", Controller.top10);
app.get("/next", Controller.Next100);
app.get("/prev", Controller.Prev100);
app.get("/searchMovie", Controller.searchMovie);
app.get("/setIsolationLevel", Controller.setIsolationLevel);
//Reference
//app.get(`/addComment`, GameController.addComment);



module.exports = app;