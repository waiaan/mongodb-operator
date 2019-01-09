const mongoose = require('mongoose');
const { getDataType, readFile, afterOpen } = require('./utils');

const filePath = process.argv[2];
const databaseName = process.argv[3];
const collectionName = process.argv[4];

(async () => {
  let fileDatas = await readFile(filePath);
  fileDatas = JSON.parse(fileDatas);
  const schemaObj = {};
  Object.keys(fileDatas[0]).forEach((key, i, arr) => {
    schemaObj[key] = getDataType(fileDatas[0][key]);
  });
  mongoose.connect('mongodb://127.0.0.1:27017/'+databaseName, { useNewUrlParser: true });
  const db = mongoose.connection;
  db.on('connected', () => {
    console.log('connected');
  });
  const dbObj = await afterOpen(db);
  const cols = dbObj.cols;

  cols.forEach((col, index, cols) => {
    if (col.s.name === collectionName ) {
      col.rename(col.s.name + new Date().getTime());
    }
  })

  const Schema = new mongoose.Schema(schemaObj);
  const Model = mongoose.model(collectionName, Schema,collectionName);
  
  fileDatas.forEach((filedata,index,filedatas) => {
    let model = new Model(filedata);
    model.save();
  })
})()