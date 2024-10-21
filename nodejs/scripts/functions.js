// const multer = require("multer");
const fs = require("fs");
exports.PushMyJsonFile = function(path, newObj) 
{
    fs.readFile(path, (err, data) => 
      {
        if (err && err.code === 'ENOENT') 
          {
            fs.mkdir(path.substring(0, path.lastIndexOf("/")), { recursive: true }, (err) => {if (err) console.log(err);});
            return fs.writeFile(path, "[" + JSON.stringify(newObj) + "]", (err) => {if (err) console.log(err);});
          } 
        else if (err) console.log(err);
        else 
        {
          try 
          {
            var fileData = JSON.parse(data);
            // console.log(fileData);
            fileData.push(newObj);
            return fs.writeFile(path, JSON.stringify(fileData), (err) => {if (err) console.log(err)},);
          } 
          catch (err) 
          {
            console.log(err);
          }
        }
    });
}
  
exports.ReadMyFile = function(resp, path) 
{
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
  