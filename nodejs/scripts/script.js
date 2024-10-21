const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
var fs = require("fs");

const MyFunctions = require("./functions.js");

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
  var path = "uploads/array.json";
  MyFunctions.PushMyJsonFile(path, newObj);
});

app.get("/form", (req, res) => {
  MyFunctions.ReadMyFile(res, "../my_files/form.html");
});


app.listen(port, () =>
  console.log("> Server is up and running on port : http://localhost:" + port),
);
