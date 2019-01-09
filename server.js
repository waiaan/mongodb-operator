const fs = require('fs');
const http = require('http');
const mongoose = require('mongoose');
const { port, databaseName, cols } = require(process.argv[2]);

mongoose.connect('mongodb://127.0.0.1:27017/' + databaseName, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('connected', (err) => {
  if (err) return console.log(err);
  console.log('connected');

});
const Schema = new mongoose.Schema({});
const Model = mongoose.model(cols, Schema);

Model.find({}, (err, data) => {
  if (err) return console.log(err);
  console.log(data);
})

http.createServer((req, res) => {


}).listen(port);