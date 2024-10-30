const CDataBase = require("./sqlite.js");

const db = new CDataBase("../database/test.db");

function getTables() {
  return new Promise((resolve, reject) => {
    db.getTables((tables) => {
      if (tables) {
        resolve(tables);
      } else {
        reject("Error fetching tables");
      }
    });
  });
}

async function Test() {
  try {
    const tables = await getTables();
    console.log("TableInfo", tables);
  } catch (error) {
    console.error(error);
  }
}

Test();

// const CDataBase = require("./sqlite.js");

// const db = new CDataBase("../database/test.db");

// //somehow try to get all infos in one array

// var TableInfos = [];

// function Test(_callback)
// {
//     db.getTables( (tables) =>
//     {
//         // console.log("tables");
//         // console.log(tables);
//         tables.map( (oneTable) =>
//         {
//             // console.log("oneTable");
//             // console.log(oneTable.name);
//             let TableName = oneTable.name;
//             TableInfos.push({name: TableName, cols: []});
//         })
//         // console.log("TableInfos");
//         // console.log(TableInfos);
//         _callback(TableInfos);
//     });

// }

// function TestTwo(_callback)
// {
//     Test((Tables) =>
//     {
//         // console.log("Tables");
//         // console.log(Tables);
//         Tables.map( (Table) =>
//         {
//             db.getColumnNames(Table.name, (Columns) =>
//             {
//                 // console.log("Columns");
//                 // console.log(Columns);
//                 Columns.map( (oneCol) =>
//                 {
//                     // console.log("oneCol");
//                     // console.log(oneCol.name);
//                     Table.cols.push(oneCol.name);
//                     // console.log("TableInfos");
//                     // console.log(TableInfos);

//                     // TEMPORARY IDEA
//                     if (TableInfos[TableInfos.length -1].cols != false)
//                     {

//                         _callback(TableInfos);
//                     }
//                 });
//             });

//         });
//     });
// }

// TestTwo((TableInfos) =>
// {
//         console.log("TableInfos");
//         console.log(TableInfos);
// });
