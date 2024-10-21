const sqlite3 = require('sqlite3').verbose();


class CDataBase 
{
  constructor(_path, _resp)
  {
    console.log("constuctor called"); 
    this.response = _resp;
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

  select(_table, _fields, _where)
  {
    let results;
    console.log("select called"); 
    let sql = `SELECT ${_fields} FROM ${_table} WHERE ${_where}`;
    this.db.all(
      sql, 
      [], 
      (err, rows) => 
        { if (err) return console.error(err.message); 
          rows.forEach(rows => 
            { 
              console.log(rows);
              results = JSON.parse(JSON.stringify(rows));
            }); 
        });
        
    this.response.json(results);
  }

}
module.exports = CDataBase; 
