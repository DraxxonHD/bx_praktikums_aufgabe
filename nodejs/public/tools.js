export { SendToServer };

async function SendToServer(_url, _data, _cb) {
    try
    {
        // send the form data to the server
        const response = await fetch(_url, {
        method: "POST",
        body: _data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
        const data = await response.json();
        _cb(data);
        console.log(data);
    }
    catch (error)
    {
        console.error('Error sending data:', error);
    }
};

