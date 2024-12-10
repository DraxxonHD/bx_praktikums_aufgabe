export { PostObjectToServer, FormatObject };

async function PostObjectToServer(_url, _data, _cb) {
    try
    {
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
    }
    catch (error)
    {
        console.error('Error sending data:', error);
        alert("Error sending data" + error);
    }
};

async function FormatObject(_data) {
    // operation:"select"
    // select:"*"
    // table:"test"
    // where[0][name]:"ID"
    // where[0][value]:""
    // where[1][name]:"NAME"
    // where[1][value]:""
    let formattedData = new Object();
    const hasBrackets = new RegExp(/([a-zA-z0-9])*\[.*?\]+/);
    return new Promise((resolve, reject) => {
        try {
            console.log("Formatting Object...");
            const datakeys = Object.keys(_data);
            console.log(datakeys);
            const BracketKeys = datakeys.filter(key => hasBrackets.test(key));
            const noBracketKeys = datakeys.filter(key => !hasBrackets.test(key));
            console.log(BracketKeys);
            console.log(noBracketKeys);
            // add keys without bracket to object
            for (let i = 0; i < noBracketKeys.length; i++) {
                formattedData[noBracketKeys[i]] = _data[noBracketKeys[i]];
            }
            // add keys with backet to object
            // for (let i = 0; i < BracketKeys.length; i++) {
            //     let key = BracketKeys[i].replaceAll(/\[.*?\]/g, '');
            //     console.log(key);
            //     if (formattedData[key] === undefined) {
            //         formattedData[key] = new Array();
            //     }
            //     formattedData[key].push(new Object({
            //         name: _data[`where[${i}][name]`],
            //         value: _data[`where[${i}][value]`],
            //     }));
            // }

            // const indexRegEx = new RegExp(/\[[0-9]+\]/g);
            for (let key of BracketKeys) {
                // get the keyname without the brackets
                let keyName = key.replace(/\[.*?\]/g, '');
                // if the keyname is not in the object, add it
                if (formattedData[keyName] === undefined) {
                    formattedData[keyName] = new Array();
                }
                // push the object with its key to the array
                console.log(key);
                console.log(_data[key]);
                // add key value pair !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                formattedData[keyName].push(new Object(_data[key]));
                console.log(formattedData);
            }
            resolve(formattedData);            
        }
        catch (error) {
            console.error('Error formatting data:', error);
            alert("Error formatting data" + error);
            reject(error);
        }
    });
}
