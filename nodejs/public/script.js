   

var Tableinformation;

async function ChangeDisplayValue(_what, _bool)
{
    _bool? _bool = 'inline': _bool = 'none';
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
const form = document.querySelector("form");
const table = document.getElementById('table');
// add an event listener to the form
form.addEventListener("submit", (e) => SendForm(e));
table.addEventListener("change", (e) => showColumns(e.target.value));



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
            tablehead.textContent = colsname;
            colsnames.appendChild(tablehead);
        }
    )

}

// send the form data to the server
async function SendForm(event) 
{
    // prevent the default form submission
  event.preventDefault();

  const mode = document.getElementById('operation').value;

  // get the values from form
  const FormDataObj = Object.fromEntries(new FormData(form));
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
  try 
  {
    // send the form data to the server
    const response = await fetch("http://localhost:5000/execute-query", {
    method: "POST",
    body: urlEncoded,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
    const data = await response.json();
    displayArray(FormDataObj.table, data);   
 } 
catch (error) 
    {
        console.error('Error sending data:', error);
    }    

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
                TableObj.cols.forEach( cols => {
                    const tabledetail = document.createElement('td');


                    tabledetail.textContent = JSON.stringify(item[cols]);

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
        TableOption.textContent = item.name;
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
