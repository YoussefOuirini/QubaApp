// Seting up the libraries:
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var mongo = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

app.use('/', bodyParser());

var server = app.listen(3000, function() {
  console.log('The server is running at http//:localhost:' + server.address().port)
});
