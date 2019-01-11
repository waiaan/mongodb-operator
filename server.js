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
    if (err) return console.log('connected: ', err);
    console.log('connected');
  });
  db.on('open', (err) => {
    if (err) return console.log('open: ', err);
    console.log('open');
  })



  http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      const handleReqUrl = reqUrlMethods[req.url];
      if (handleReqUrl) {
        let data = '';
        if (body==='') {
          data = await handleReqUrl(Model);
        } else {
          data = await handleReqUrl(Model,JSON.parse(body));
        }
        res.end(JSON.stringify(data));
      } else {
        res.end();
      }
    })
  }).listen(port);

})()