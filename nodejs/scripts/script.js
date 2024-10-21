const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
// var fs = require("fs");
// const sqlite3 = require('sqlite3').verbose();



const MyFunctions = require("./functions.js");
const CDataBase = require("./sqlite.js");


app.use(cors());



app.get("/", (req, res) => {
  res.send("Hello World!");
});


const middle = express.urlencoded({
  extended: false,
  limit: 10000,
  parameterLimit: 3,
});

app.post("/form/upload", middle, (req, res) => {
  var newObj = JSON.parse(JSON.stringify(req.body));
  // console.log(newObj.name);
  console.log(req.body);
  var path = "../uploads/array.json";
  MyFunctions.PushMyJsonFile(path, newObj);
});

app.get("/form", (req, res) => {
  MyFunctions.ReadMyFile(res, "../my_htmls/form.html");
});


app.get("/test", (req, res) => {
  const db = new CDataBase("../database/test.db", res);
  db.createTable("test", "id INTEGER PRIMARY KEY, name TEXT");
  // db.insert("test", "1, 'John'");
  // db.insert("test", "2, 'Doe'");
  db.select("test", "*", "test.id=1");
  db.select("test", "*", "test.id=2");  

});


app.listen(port, () =>
  console.log("> Server is up and running on port : http://localhost:" + port),
);
