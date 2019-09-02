// Seting up the libraries:
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use('/', bodyParser());

var server = app.listen(3000, function() {
  console.log('The server is running at http//:localhost:' + server.address().port)
});
