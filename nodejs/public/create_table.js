import { PostObjectToServer } from './tools.js';

export { createForm, AddColumn };


const createForm = document.getElementById("create-form");

// add an event listener to the form
createForm.addEventListener("submit", (e) => SendCreateTable(e));
// add an event listener to the add column button
document.getElementById('add-column').addEventListener('click', (e) => AddColumn(e));

// add a new column to the form
async function AddColumn(event) {
    const column_count = document.getElementById('columns-to-add').childElementCount - 1;
    // declare options to choose from
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
    // input.addEventListener('change', (e) => e.target.name = e.target.value);
    input.placeholder = 'Column Name';
    input.name = `column[${column_count}][name]`;
    // add a button to remove itself
    button.textContent = 'X';
    button.addEventListener('click', (e) => e.target.parentElement.remove());
    // assign the name to the input
    
    data_types_selection.name = `column[${column_count}][data_type]`;
    constraints_selection.name = `column[${column_count}][constraints]`;
    button.type = 'button';
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

async function SendCreateTable(event){
    // prevent the default form submission
    event.preventDefault();
    // delete all columns
    const doc_columns = document.getElementById('columns-to-add');
    
    // get the values from form
    const FormDataObj = Object.fromEntries(new FormData(createForm));
    // delete FormDataObj['column-name']; --------------------
    FormDataObj['column-count'] = doc_columns.childElementCount - 1;
    console.log((FormDataObj));      
    // format the data to be sent to the server
    let FormatedObj = new Object({
        table_name: FormDataObj['table-name'],
        columns: new Array(),
    });

    // add the columns to the array
    for (let i = 0; i < FormDataObj['column-count']; i++) {
        FormatedObj.columns.push(new Object({
            name: FormDataObj[`column[${i}][name]`],
            data_type: FormDataObj[`column[${i}][data_type]`],
            constraints: FormDataObj[`column[${i}][constraints]`],
        }));
    }
    // https://stackoverflow.com/questions/56173848/want-to-convert-a-nested-object-to-query-parameter-for-attaching-to-url
    console.log(JSON.stringify(FormatedObj).toString());
    console.log(FormatedObj);
    // [OBJECT OBJECT] !!!
    try {
        // send the data to the server
        PostObjectToServer("http://localhost:5000/create-table",
        FormatedObj,
        callback_data => console.log(callback_data));
        LoadTableData();    
    }
    catch (error) {
        console.log(error);
    }

}