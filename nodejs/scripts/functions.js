const fs = require("fs");
  
exports.ReadMyFile = (resp, path) =>{
    fs.readFile(path, function (err, data) 
    {
      if (err) 
      {
        resp.writeHead(404, { "Content-Type": "text/html" });
        return resp.end("404 Not Found");
      }
      resp.writeHead(200, { "Content-Type": "text/html" });
      resp.write(data);
      return resp.end();
    });
}

exports.formatFields = (fields) => {
  let formattedFields = "";
  if (!fields || !fields.length) {
    return formattedFields;
  }
  else{
    formattedFields += "(";
    fields.forEach((field, index) => {
      formattedFields += `"${field.name}" ${field.data_type}`;
      if (field.constraints) {
        formattedFields += ` ${field.constraints}`;
      }
      if (index < fields.length - 1) {
        formattedFields += ", ";
      }
    });
    formattedFields += ")";
  }
  return formattedFields;
}
  