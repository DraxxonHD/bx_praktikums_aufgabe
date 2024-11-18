var Tableinformation;

async function ChangeDisplayValue(_what, _bool)
{
    _bool? _bool = 'inline-flex': _bool = 'none';
    document.getElementById(_what).style.display = _bool;
    document.querySelector('label[for=' + _what + ']').style.display = _bool;
}

// add an event listener to the operation select element
document.getElementById('operation').addEventListener('change', event => {
    ChangeMode(event.target.value);
});

async function ChangeMode(_operation) {

    console.log("Operation: ",_operation);
    switch (_operation) {
        case 'select':
            ChangeDisplayValue('select', true);
            ChangeDisplayValue('where', true);
            ChangeDisplayValue('values', false);
            ChangeDisplayValue('update', false);
            break;
        case 'insert':
            ChangeDisplayValue('select', false);
            ChangeDisplayValue('where', false);
            ChangeDisplayValue('values', true);
            ChangeDisplayValue('update', false);
            break;
        case 'update':
            ChangeDisplayValue('select', false);
            ChangeDisplayValue('where', true);
            ChangeDisplayValue('values', false);
            ChangeDisplayValue('update', true);
            break;
        case 'delete':
            ChangeDisplayValue('select', false);
            ChangeDisplayValue('where', true);
            ChangeDisplayValue('values', false);
            ChangeDisplayValue('update', false);
            break;
        default:
            break;
    }
};

// get the form element
const createForm = document.getElementById("create-form");
const queryForm = document.getElementById("querie-form");
const table = document.getElementById('table');
// add an event listener to the form
queryForm.addEventListener("submit", (e) => SendQueryData(e));
// add an event listener to the form
createForm.addEventListener("submit", (e) => SendCreateTable(e));
// add an event listener to the add column button
document.getElementById('add-column').addEventListener('click', (e) => AddColumn(e));
// add an event listener to the table select element
table.addEventListener("change", (e) => showColumns(e.target.value));


// add a new column to the form
async function AddColumn(event) {
    const sql_data_types = ['TEXT', 'INTEGER', 'REAL', 'BLOB', 'NULL'];
    const sql_constraints = ['PRIMARY KEY', 'NOT NULL', 'UNIQUE', 'CHECK', 'DEFAULT', 'COLLATE', 'FOREIGN KEY', 'AUTOINCREMENT'];
    // prevent the default form submission
    event.preventDefault();
    console.log("AddColumn");
    console.log(event);
    // get the columns element
    const columns = document.getElementById('columns-to-add');
    // create a new input element
    const div = document.createElement('div');
    const input = document.createElement('input');
    const data_types_selection = document.createElement('select');
    const constraints_selection = document.createElement('select');
    const button = document.createElement('button');
    // set the input type to text
    input.type = 'text';
    input.addEventListener('change', (e) => e.target.name = e.target.value);
    button.textContent = 'X';
    data_types_selection.name = 'data_type';
    constraints_selection.name = 'constraints';
    button.type = 'button';
    button.addEventListener('click', (e) => e.target.parentElement.remove());
    // add the input to the columns element
    sql_data_types.forEach(option => {
        const option_element = document.createElement('option');
        option_element.value = option;
        option_element.textContent = option;
        data_types_selection.appendChild(option_element);
    });
    sql_constraints.forEach(option => {
        const option_element = document.createElement('option');
        option_element.value = option;
        option_element.textContent = option;
        constraints_selection.appendChild(option_element);
    });
    // append the input to the columns element
    div.appendChild(document.createElement('br'));
    div.appendChild(input);
    div.appendChild(data_types_selection);
    div.appendChild(constraints_selection);
    div.appendChild(button);
    columns.appendChild(div);
};
// https://mattstauffer.com/blog/a-little-trick-for-grouping-fields-in-an-html-form/

async function SendCreateTable(event){
    // prevent the default form submission
    event.preventDefault();
    // delete all columns
    const columns = document.getElementById('columns-to-add');
    
    // get the values from form
    const FormDataObj = Object.fromEntries(new FormData(createForm));
    delete FormDataObj['column-name'];
    console.log(FormDataObj);      
    // convert the form data to a URL encoded string
    const urlEncoded = new URLSearchParams(FormDataObj).toString();
    console.log(urlEncoded);
    SendToServer("http://localhost:5000/create-table",
         urlEncoded,
          callback_data => console.log(callback_data));    
}

async function SendToServer(_url, _data, _cb) {
    try
    {
        // send the form data to the server
        const response = await fetch(_url, {
        method: "POST",
        body: _data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
        const data = await response.json();
        _cb(data);
        console.log(data);
    }
    catch (error)
    {
        console.error('Error sending data:', error);
    }
};

async function showColumns(_tableName){
    const TableObj = Tableinformation.find((item) => item.name === _tableName);
    // const columns = document.getElementById('columns');
    // columns.replaceChildren('');
    // const columlist = document.createElement('p');
    // columlist.textContent = TableObj.cols;
    // columns.appendChild(columlist);

    const colsnames = document.getElementById("table-cols");
    colsnames.replaceChildren("");
    TableObj.cols.forEach(colsname => 
        {
            const tablehead = document.createElement("th");
            tablehead.textContent = colsname.toUpperCase();
            colsnames.appendChild(tablehead);
        }
    )

}

// send the form data to the server
async function SendQueryData(event) 
{
    // prevent the default form submission
  event.preventDefault();

  const mode = document.getElementById('operation').value;

  // get the values from form
  const FormDataObj = Object.fromEntries(new FormData(queryForm));
  console.log(FormDataObj);      
  
  // delete uncessary property
  switch (mode) {
      case 'select':
            // delete FormDataObj.columns;
            delete FormDataObj.values;
            delete FormDataObj.update;
            delete FormDataObj.insert;
            delete FormDataObj.delete;
           break;
      case 'insert':
            delete FormDataObj.select;
            delete FormDataObj.update;
            delete FormDataObj.delete;
            delete FormDataObj.where;            
          break;
      case 'update':
            delete FormDataObj.select;
            delete FormDataObj.values;
            delete FormDataObj.delete;
          break;
      case 'delete':
            delete FormDataObj.select;
            delete FormDataObj.values;
            delete FormDataObj.update;
          break;
      default:
          break;
  }
  console.log(FormDataObj);      

  // add the col to where (into one property)  
//   FormDataObj.where = FormDataObj.columns + FormDataObj.where;

  // convert the form data to a URL encoded string
  const urlEncoded = new URLSearchParams(FormDataObj).toString();
    console.log(urlEncoded);
    SendToServer("http://localhost:5000/execute-query",
         urlEncoded,
          callback_data => displayArray(FormDataObj.table, callback_data));
};


async function displayArray(_table, _array) {
    const colsnames = document.getElementById("table-cols");
    const TableObj = Tableinformation.find((item) => item.name === _table);
    //  get the list element
        console.log(_array);
        const list = document.getElementById('array-table');
        list.replaceChildren(colsnames);
            // loop through the array and display each item
            _array.forEach(item => {
                const tablerow = document.createElement('tr');
                // loop through the array and display details
                TableObj.cols.forEach( cols => {
                    const tabledetail = document.createElement('td');

                    const textContent = JSON.stringify(item[cols]);
                    tabledetail.textContent = textContent.replaceAll('"', '');

                    tablerow.appendChild(tabledetail);
                } )
                list.appendChild(tablerow)
            });
}

async function DisplayTableOptions(_array) {
try 
{
    console.log("DisplayTableOptions");
    const data = _array
    console.log(data);
    const table = document.getElementById('table');
    const columns = document.getElementById('columns');
    data.forEach((item) => {
        // add options to "from Table"
        const TableOption = document.createElement('option');
        TableOption.value = item.name;
        TableOption.textContent = item.name.toUpperCase();
        table.appendChild(TableOption);
        // add options to "where column"
        // item.cols.forEach((col) => {
        //     const ColumnOption = document.createElement('option');
        //     ColumnOption.value = col;
        //     ColumnOption.textContent = col;
        //     columns.appendChild(ColumnOption);
        // });
    });
}
catch (error) 
{
    console.error('Error fetching data:', error);
}
}
// call the fetchData function when the window loads        
async function GetTableDetails() {
    try 
    {
        const response = await fetch('http://localhost:5000/get-table-details');
        const data = await response.json();
        Tableinformation = data;
        console.log(data);
        showColumns(data[0].name);
        DisplayTableOptions(data);
    }
    catch (error) 
    {
        console.error('Error fetching data:', error);
    }
    
}

window.onload = GetTableDetails, ChangeMode('select');
// window.onload = ChangeMode('select');
// window.onload = DisplayTableOptions;
