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


app.get("/sql", (req, res) => {
  MyFunctions.ReadMyFile(res, "../my_htmls/sqlite.html");
});

app.get("/get-table-details", (req, res) => {
  const db = new CDataBase("../database/test.db");
//somehow try to get all infos in one array
  db.getTables().then((result) => {
    // console.log(result);
    res.json(result);
  });
});

app.post("/execute-query", express.urlencoded({extended: false, limit: 10000, parameterLimit: 3,}), (req, res) => {
  // jsonfy the body
  var Object = JSON.parse(JSON.stringify(req.body));
  console.log(Object);
  const db = new CDataBase("../database/test.db");
  db.select(Object.table , Object.select , Object.where).then((result) => {
    // console.log(result);
    res.json(result);
  });
});

app.get("/test", (req, res) => {
  const db = new CDataBase("../database/test.db");
  db.createTable("test", "id INTEGER PRIMARY KEY, name TEXT");
  db.insert("test", "3, 'Sample Name'" );
  db.select("test", "*", "", (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    console.log(result);
    res.json(result);
  });
});



app.listen(port, () =>
  console.log("> Server is up and running on port : http://localhost:" + port),
);
