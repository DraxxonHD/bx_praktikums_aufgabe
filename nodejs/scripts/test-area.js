const CDataBase = require("./sqlite.js");

const db = new CDataBase("../database/test.db");

async function Test() {
  const table = await db.getTables();
  console.log("table", table);
}

Test();
