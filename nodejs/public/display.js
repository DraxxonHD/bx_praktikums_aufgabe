import { PostObjectToServer, FormatObject } from "./tools.js";
import { ChangeMode } from "./select_tools.js";

export { queryForm, LoadTableData, displayArray };

// call the fetchData function when the window loads
window.onload = LoadTableData();

var Tableinformation;

const queryForm = document.getElementById("querie-form");

const table = document.getElementById("table");
table.addEventListener("change", (e) => showColumns(e.target.value));
queryForm.addEventListener("submit", (e) => SendQueryData(e));

// call the fetchData function when the window loads
async function LoadTableData() {
  try {
    const response = await fetch("http://localhost:5000/get-table-details");
    const data = await response.json();
    Tableinformation = data;
    console.log(data);
    showColumns(data[0].name);
    DisplayTableOptions(data);
  } catch (error) {
    console.error("Error loading Tabledata:", error);
    alert("Error loading Tabledata:" + error);
  }
}

async function showColumns(_tableName) {
  try {
    const TableObj = Tableinformation.find((item) => item.name === _tableName);

    const colsnames = document.getElementById("table-cols");
    colsnames.replaceChildren("");
    TableObj.cols.forEach((colsname) => {
      const tablehead = document.createElement("th");
      tablehead.textContent = colsname.toUpperCase();
      colsnames.appendChild(tablehead);
    });
  } catch (error) {
    console.error("Error showing Columns:", error);
    alert("Error showing Columns" + error);
  }
}

async function DisplayTableOptions(_array) {
  try {
    displayWhereOptions("test");

    console.log("DisplayTableOptions");
    const data = _array;
    console.log(data);
    const table = document.getElementById("table");
    table.replaceChildren();
    // const columns = document.getElementById('columns');
    data.forEach((item) => {
      // add options to "from Table"
      const TableOption = document.createElement("option");
      TableOption.value = item.name;
      TableOption.textContent = item.name.toUpperCase();
      table.appendChild(TableOption);
    });
  } catch (error) {
    console.error("Error displaying Tableoptions:", error);
    alert("Error displaying Tableoptions" + error);
  }
}

async function displayArray(_table, _array) {
  try {
    const colsnames = document.getElementById("table-cols");
    const TableObj = Tableinformation.find((item) => item.name === _table);
    //  get the list element
    console.log(_array);
    const list = document.getElementById("array-table");
    list.replaceChildren(colsnames);
    // loop through the array and display each item
    _array.forEach((item) => {
      const tablerow = document.createElement("tr");
      // loop through the array and display details
      TableObj.cols.forEach((cols) => {
        const tabledetail = document.createElement("td");
        const textContent = JSON.stringify(item[cols]);
        if (textContent != undefined) {
          tabledetail.textContent = textContent.replaceAll('"', "");
        }
        tablerow.appendChild(tabledetail);
      });
      list.appendChild(tablerow);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Error fetching data" + error);
  }
}

async function SendQueryData(event) {
  // prevent the default form submission
  event.preventDefault();

  // get the values from form
  const FormDataObj = Object.fromEntries(new FormData(queryForm));
  console.log(FormDataObj);

  const NumberOfWhere =
    document.getElementById("querie-form").querySelector("#where")
      .childElementCount / 2;
  // delete uncessary property and format the data to be sent to the server
  let Data = await FormatObject(FormDataObj)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
      alert("Error formating data" + error);
    });
  switch (FormDataObj.operation) {
    case "select":
      delete FormDataObj.values;
      delete FormDataObj.update;
      delete FormDataObj.insert;
      delete FormDataObj.delete;

      break;
    case "insert":
      delete FormDataObj.select;
      delete FormDataObj.update;
      delete FormDataObj.delete;
      delete FormDataObj.where;
      break;
    case "update":
      delete FormDataObj.select;
      delete FormDataObj.values;
      delete FormDataObj.delete;
      break;
    case "delete":
      delete FormDataObj.select;
      delete FormDataObj.values;
      delete FormDataObj.update;
      break;
    default:
      break;
  }
  console.log(Data);

  // send the data to the server
  PostObjectToServer(
    "http://localhost:5000/execute-query",
    Data,
    (callback_data) => displayArray(FormDataObj.table, callback_data),
    Tableinformation
  );
}

async function displayWhereOptions(_table) {
  console.log("displayWhereOptions");
  console.log(_table);
  console.log(Tableinformation);
  // find table object from Tableinformation array by its name
  const TableObj = Tableinformation.find((item) => item.name === _table);
  const where = document.getElementById("querie-form").querySelector("#where");
  where.replaceChildren();
  let index = 0;
  TableObj.cols.forEach((colsname) => {
    const input = document.createElement("input");
    const select = document.createElement("select");
    const option = document.createElement("option");
    option.textContent = colsname.toUpperCase();
    input.type = "text";
    select.name = `where[${index}][name]`;
    input.name = `where[${index}][value]`;

    select.appendChild(option);
    where.appendChild(select);
    where.appendChild(input);
    index++;
  });
}
