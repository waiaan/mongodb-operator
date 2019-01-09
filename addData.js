const fs = require('fs');
const mongoose = require('mongoose');
console.log(process.argv);
const filePath = process.argv[2];
const databaseName = process.argv[3];
const collectionName = process.argv[4];

const getDataType = (data) => {
  const str = Object.prototype.toString.call(data);
  return Object.prototype.toString.call(str).split(' ')[1].split(']')[0]
}
const readFile = (path) => {
  return new Promise((res,rej) => {
    fs.readFile(path,(err,data) => {
      if (err) {
        rej(err);
      } else {
        res(data.toString());
      }
    })
  })
}
const afterOpen = (db) => {
  return new Promise((res,rej) => {
    db.on('open', async () => {
      res({
        cols:await db.db.collections()
      })
    })
  })
}
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
    if (col.s.name === collectionName + 's' || col.s.name === collectionName ) {
      const data=col.rename(col.s.name + new Date().getTime());
    }
  })

  const Schema = new mongoose.Schema(schemaObj);
  const Model = mongoose.model(collectionName, Schema);
  
  fileDatas.forEach((filedata,index,filedatas) => {
    let model = new Model(filedata);
    model.save();
  })
})()