// import needed packages
const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
const path = require("path");
// custom imports
const MyFunctions = require("./functions.js");
const CDataBase = require("./sqlite.js");

// make public folder
app.use(express.static(path.join(__dirname, "..", "public")), express.json());
// for root
app.get("/", (req, res) => {
  res.send("Hello Worlds!");
});

// set restrictions
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
  MyFunctions.ReadMyFile(res, "../public/form.html");
});

app.get("/sql", (req, res) => {
  MyFunctions.ReadMyFile(res, "../public/sqlite.html");
});

app.post(
  "/create-table",
  express.urlencoded({ extended: false, limit: 10000, parameterLimit: 10 }),
  (req, res) => {
    const db = new CDataBase("../database/test.db");
    var Body = req.body;
    switch (Body.operation) {
      case "drop":
        db.dropTable(Body.table_name).then((result) => {
          console.log(result);
          res.json(result);
        });
        break;
      case "create":
        db.createTable(Body.table_name, MyFunctions.formatFields(Body.columns))
          .then((result) => {
            console.log(result);
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
            res.json(err);
            res.status(400).send(err);
          });
        break;
      default:
        res.status(400).send("Bad Request");
    }

    console.log(Body);
  }
);

app.get("/get-table-details", (req, res) => {
  const db = new CDataBase("../database/test.db");
  //somehow try to get all infos in one array
  db.getTables().then((result) => {
    // console.log(result);
    res.json(result);
  })
  .catch((err) => {
    console.log(err);
    res.json(err);
  });
});

app.post(
  "/execute-query",
  express.urlencoded({ extended: false, limit: 10000, parameterLimit: 4 }),
  (req, res) => {
    // jsonfy the body
    const Object = req.body;
    console.log(Object);
    const db = new CDataBase("../database/test.db");
    let where = "";
    // format the where clause
    for (x of req.body.where) {
      if (x.value != "") {
        where += `${x.name} ${x.value}`;
      }
    }

    switch (Object.operation) {
      case "select":
        db.select(Object.table, Object.select ?? "*", where)
          .then((result) => {
            console.log(result);
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
            res.json(err);
          });
        break;
      case "insert":
        db.insert(Object.table, Object.values)
          .then((result) => {
            console.log(result);
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
            res.json(err);
          });
        break;
      case "update":
        db.update(Object.table, Object.update, where)
          .then((result) => {
            console.log(result);
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
            res.json(err);
          });
        break;
      case "delete":
        db.delete(Object.table, where)
          .then((result) => {
            console.log(result);
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
            res.json(err);
          });
        break;
      default:
        res.status(400).send("Bad Request");
    }
  }
);

app.listen(port, () =>
  console.log("> Server is up and running on port : http://localhost:" + port)
);
