const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

class CDataBase {
  constructor(_path) {
    
    console.log("constuctor called");
    if (!fs.existsSync(_path))
    {
      fs.mkdir(_path.substring(0, _path.lastIndexOf("/")), { recursive: true }, (err) => {if (err) console.log(err);});
    }

    this.db = new sqlite3.Database(
      _path,
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (err) => {
        if (err) return console.error(err.message);
      }
    );
  }
  
  async getTables() {
    console.log("getTables called");
    let sql = `SELECT name FROM sqlite_master WHERE type='table'`;
    // first get all tablenames through a promise
    const tables = await new Promise((resolve, reject) => {
      this.db.all(sql, (err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    // then add a new property to each table object to store the column names
    tables.forEach((table) => {
      Object.assign(table, { cols: [] });
    });

    // then loop through each table and set the column names
    for (const tableIndex in tables) {
      sql = `PRAGMA table_info(${tables[tableIndex].name})`;
      const cols = await new Promise((resolve, reject) => {
        this.db.all(sql, (err, rows) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });

      const colsnames = cols.map((col) => col.name);
      tables[tableIndex].cols = colsnames;
    }
    
    return tables;
  }


  createTable(_name, _fields) {
    console.log("create called");
    let sql = `CREATE TABLE IF NOT EXISTS ${_name} ${_fields}`;
    return new Promise((resolve, reject) => {
      this.db.run(sql, (err) => {
        if (err) {
          console.error(err.message);
          reject(new Array(err.message));
        }
        this.getTables().then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.error(err.message);
          reject(new Array(err.message));
        });
      });
    });
  }

  dropTable(_name) {
    console.log("drop called");
    let sql = `DROP TABLE IF EXISTS ${_name}`;
    return new Promise((resolve, reject) => {
    this.db.run(sql, (err) => {
      if (err) {
        console.error(err.message);
        reject(new Array(err.message));
      }
      this.getTables().then((result) => {
          resolve(result);
      })
      .catch((err) => {
        console.error(err.message);
        reject(new Array(err.message));
      });
    });
  });
  }

  insert(_table, _values) {
    console.log("insert called");
    let sql = `INSERT INTO ${_table} VALUES (${_values})`;
    return new Promise((resolve, reject) => {
      this.db.run(sql, (err) => {
        if (err) {
          console.error(err.message);
          // reject(err);
          reject(new Array(err.message));
        }
        
        console.log();
        const changes = this.changes;
        resolve(this.select(_table, "*", ""));
      });
    }
    );
  }

  select(_table, _fields, _where) {
    console.log("select called");

    if (_where == "") {
      _where = "true";
    }

    let sql = `SELECT ${_fields} FROM ${_table} WHERE ${_where}`;
    return new Promise((resolve, reject) => {
      this.db.all(sql, (err, rows) => {
        if (err) {
          console.error(err.message);
          reject(new Array(err.message));
        }
        resolve(rows);
      });
    });
  }

  delete(_table, _where) {
    console.log("delete called");
    let sql = `DELETE FROM ${_table} WHERE ${_where}`;
    return new Promise((resolve, reject) => {
      this.db.run(sql, (err) => {
        if (err) {
          console.error(err.message);
          reject(new Array(err.message));
        }
        resolve(this.select(_table, "*", ""));
      });
    });
  }

  update(_table, _set, _where) {
    console.log("update called");
    let sql = `UPDATE ${_table} SET ${_set} WHERE ${_where}`;
    return new Promise((resolve, reject) => {
      this.db.run(sql, (err) => {
        if (err) {
          console.error(err.message);
          reject(new Array(err.message));
        }
        resolve(this.select(_table, "*", ""));
      });
    });
  }
}
module.exports = CDataBase;
