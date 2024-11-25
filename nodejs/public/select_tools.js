export { ChangeMode };


window.onload = ChangeMode('select');
// get the form element
// add an event listener to the table select element

async function ChangeDisplayValue(_what, _bool)
{
    _bool? _bool = 'inline-flex': _bool = 'none';
    document.getElementById(_what).style.display = _bool;
    document.querySelector('label[for=' + _what + ']').style.display = _bool;
}

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


    // add an event listener to the operation select element
document.getElementById('operation').addEventListener('change', event => {
    ChangeMode(event.target.value);
});

