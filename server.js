//express framework
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

var bodyParser = require('body-parser');

//database connection
var MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
// Use your own mlab account!!!
var mongourl = "mongodb+srv://rockie2695:26762714Rockie@cluster-test-cw81o.gcp.mongodb.net/test?retryWrites=true";
const mongoConectClient = new MongoClient(mongourl, {
    useNewUrlParser: true
});

var cors = require('cors')

app.use(cors()) // Use this after the variable declaration
app.use(bodyParser.json());
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

app.post("/insert/:collection", function (req, res) {
    if (!req.body) {
        res.send({ "error": "No input!" });
        return;
    } else {
        console.log(req.body)
        mongoConectClient.connect(err => {
            if (err) {
                console.log(err)
            } else {
                let collection = mongoConectClient.db("rockie2695_mongodb").collection("fun_"+req.params.collection);
                insert(collection,
                    req.body
                    , function (err, result) {
                        if (err) {
                            res.send({ "error": err });
                        } else {
                            res.send({ "ok": result.ops[0] });
                        }
                    })
            }
        })
    }
});

function insert(collection, query, callback) {
    collection.insertOne(query, function (err, result) {
        callback(err, result);
    });
}