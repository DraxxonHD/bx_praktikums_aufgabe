export { PostObjectToServer, FormatObject };

async function PostObjectToServer(_url, _data, _cb) {
  try {
    // send the form data to the server
    const response = await fetch(_url, {
      method: "POST",
      body: JSON.stringify(_data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    _cb(data);
    console.log(data);
  } catch (error) {
    console.error("Error sending data:", error);
    alert("Error sending data" + error);
  }
}

async function FormatObject(_data) {
  // example data
  // operation:"select"
  // select:"*"
  // table:"test"
  // where[0][name]:"ID"
  // where[0][value]:""
  // where[1][name]:"NAME"
  // where[1][value]:""
  console.log("Formatting Object...");

  return new Promise((resolve, reject) => {
    try {
      // declare the formatted object
      let formattedData = new Object();
      // regex to check for brackets
      const hasBrackets = new RegExp(/([a-zA-z0-9])*\[.*?\]+/);
      // get the keys of the given object
      const datakeys = Object.keys(_data);
      // get the keys with brackets
      const BracketKeys = datakeys.filter((key) => hasBrackets.test(key));
      // get the keys without brackets
      const noBracketKeys = datakeys.filter((key) => !hasBrackets.test(key));
      // add the keys without brackets to object first
      for (let i = 0; i < noBracketKeys.length; i++) {
        formattedData[noBracketKeys[i]] = _data[noBracketKeys[i]];
      }
      // loop through the keys with brackets
      for (let key of BracketKeys) {
        // get the base keyname without the brackets
        const baseKey = key.replace(/\[.*?\]/g, "");
        // if the keyname is not in the object, add it
        if (formattedData[baseKey] === undefined) {
          formattedData[baseKey] = new Array();
        }
        // get the array index
        const index = key.match(/\d+/g);
        // replace everything except the key name
        const TEMPindexKey = key.match(/\[[a-zA-z]+\]/g);
        const indexKey = TEMPindexKey[0].replace(/\[|\]/g, "");

        // if index matches array index, add key value pair to object
        if (formattedData[baseKey][index] === undefined) {
          console.log("index does not exist");
          formattedData[baseKey].push(new Object());
          formattedData[baseKey][index][indexKey] = _data[key];
        }
        // if key exists, add key value pair to object in the array
        else {
          console.log("index exists");
          console.log(key);
          formattedData[baseKey][index][indexKey] = _data[key];
        }
      }
      resolve(formattedData);
    } catch (error) {
      reject(error);
    }
  });
}
