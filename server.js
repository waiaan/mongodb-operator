const http = require('http');
const mongoose = require('mongoose');
const { port, databaseName, cols, schema, reqUrlMethods } = require(process.argv[2]);
const { afterOpen } = require('./utils');

(async () => {

  mongoose.connect('mongodb://127.0.0.1:27017/' + databaseName, { useNewUrlParser: true });

  const db = mongoose.connection;
  const Schema = new mongoose.Schema(schema);
  const Model = mongoose.model(cols, Schema, cols);

  db.on('connected', (err) => {
    if (err) return console.log('connected: ',err);
    console.log('connected');
  });
  db.on('open', (err) => {
    if (err) return console.log('open: ', err);
    console.log('open');
  })
  


  http.createServer(async (req, res) => {
    const handleReqUrl = reqUrlMethods[req.url];
    res.setHeader('Access-Control-Allow-Origin','*')
    if (handleReqUrl) {
      console.log(1);
      const data = await handleReqUrl(Model);
      res.end(JSON.stringify(data));
    }

  }).listen(port);

})()