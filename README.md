# mongodb-operator

#### before use:
```js
npm install mongoose --save
```

## addData.js
read a file and add its content to mongodb database
#### usage
```js
node .\addData.js <filepath> <database name> <collection name>
```
#### example
```js
node .\addData.js C:\Users\Administrator\Desktop\users.json blog user
```

## server.js
create a HTTP Sever for mongodb database
#### usage
```js
node .\server.js <path of databaseConfig.js>
```
#### example
```js
node .\server.js C:\Users\Administrator\Desktop\databaseConfig.js
```

## databaseConfig.js
file created for the config of server.js on your own
#### example
```js
module.exports = {
  port: 8080,                            //running port for server
  databaseName: 'blog',                  //Database name for mongodb
  cols: 'user',                          //Collection name for mongodb
  schema: {                              //Schema for mongodb
    username: String 
  },
  reqUrlMethods:{                        // define functions for different http request url
    '/listAllUsers':async (model)=>{
      const data = await model.find();
      return data;
    },
  }
}
```
