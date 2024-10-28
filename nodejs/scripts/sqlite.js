const sqlite3 = require('sqlite3').verbose();

class CDataBase 
{
  constructor(_path)
  {
    console.log("constuctor called"); 
    this.db = new sqlite3.Database(
      _path, 
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, 
      (err) => { if (err) return console.error(err.message); });
      // console.log(this.db);
  }

  createTable(_name, _fields)
  {
    console.log("create called"); 
    let sql = `CREATE TABLE IF NOT EXISTS ${_name} (${_fields})`;
    this.db.run(sql, err => { if (err) return console.error(err.message); });
  }

  insert(_table, _values)
  {
    console.log("insert called"); 
    let sql = `INSERT INTO ${_table} VALUES (${_values})`;
    this.db.run(sql, err => { if (err) return console.error(err.message); });
  }

  select(_table, _fields, _where, _callback)
  {
    console.log("select called"); 

    if (_where == "") 
    {
      _where = "true";
    }

    let sql = `SELECT ${_fields} FROM ${_table} WHERE ${_where}`;

    this.db.all(sql, (err, rows) => 
    { 
      if (err) 
      {
        console.error(err.message); 
        _callback(err, null);
      }
      console.log(rows);
      _callback(null, rows);
    });
  }

}
module.exports = CDataBase; 
