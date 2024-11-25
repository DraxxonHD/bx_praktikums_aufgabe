export { PostObjectToServer };

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
    }
};
