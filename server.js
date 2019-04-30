//express framework
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

//database connection
var MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
// Use your own mlab account!!!
var mongourl = "mongodb+srv://rockie2695:26762714Rockie@cluster-test-cw81o.gcp.mongodb.net/test?retryWrites=true";
const mongoConectClient = new MongoClient(mongourl, {
    useNewUrlParser: true
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
    if (port == 8080) {
        /*(async () => {
            // Specify app arguments
            await open('http://localhost:' + port, {
                app: "chrome"
            });
        })();*/
    }
});

app.post("/insert", function (req, res) {
    if (!req.body) {
        res.send('No input!');
        return;
    }
    res.send('Yes input!');
});
