const fs = require('fs');

module.exports = {
  getDataType(data) {
    const str = Object.prototype.toString.call(data);
    return Object.prototype.toString.call(str).split(' ')[1].split(']')[0]
  },
  readFile(path) {
    return new Promise((res, rej) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          rej(err);
        } else {
          res(data.toString());
        }
      })
    })
  },
  afterOpen(db) {
    return new Promise((res, rej) => {
      db.on('open', async () => {
        res({
          cols: await db.db.collections()
        })
      })
    })
  }
}