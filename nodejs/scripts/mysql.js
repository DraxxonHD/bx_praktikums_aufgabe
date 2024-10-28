var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "yourusername",
    password: "yourpassword",
    database: "mydb"
  });


  
  con.connect((err) => 
    {
        if (err) throw err;
        console.log("Connected!");

        con.query("CREATE DATABASE mydb", (err, result) => 
        {
            if (err) throw err;
            console.log("Database created");
            console.log(result);
        });

        var sql = "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))";
        con.query(sql, (err, result) =>
        {
          if (err) throw err;
          console.log("Table created");
          console.log(result);
        });
        
        var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
        
        con.query(sql, (err, result) =>
        {
            if (err) throw err;
            console.log("1 record inserted");
            console.log(result);
        });
        
        con.query("SELECT * FROM customers", (err, result, fields) =>
        {
          if (err) throw err;
          console.log("Select all records");
          console.log(fields);
          console.log(result);
        });
    });
    
