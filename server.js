//express framework
const express = require('express');
const app = express();
const port = process.env.PORT || 8088;

var bodyParser = require('body-parser');

//database connection
var MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
// Use your own mlab account!!!
var mongourl = "mongodb+srv://rockie2695:26762714Rockie@cluster-test-cw81o.gcp.mongodb.net/test?retryWrites=true";
const mongoConectClient = new MongoClient(mongourl, {
    useNewUrlParser: true
})
mongoConectClient.connect(err => {
    if (err) {
        console.log(err)
        res.send({ "error": err });
    }
});

var cors = require('cors')

app.use(cors()) // Use this after the variable declaration
app.use(bodyParser.json());
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
    if (port == 8088) {
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
        let collection = mongoConectClient.db("rockie2695_mongodb").collection("fun_" + req.params.collection);
        if (req.params.collection === "character") {
            req.body.blood = 0
            req.body.lv = 0
            req.body.mana = 0
            req.body.phy = 0
            req.body.soul = 0
            req.body.magic = 0
            req.body.time = Date.now()
        } else if (req.params.collection === "skill") {
            req.body.value = [[0, "magic"], [0, "soul"]]
            req.body.type = [1, 2]
            req.body.lv=0
            req.body.useMana=0
        }
        console.log(req.body)
        insertRecord(collection,
            req.body
            , function (err, result) {
                if (err) {
                    res.send({ "error": err });
                    return;
                } else {
                    let sendValue = result.ops[0]
                    sendValue._id = ObjectId(sendValue._id).toString()
                    res.send({ "ok": sendValue });
                    return;
                }
            }
        )
    }
});
app.post("/delete/:collection", function (req, res) {
    if (!req.body) {
        res.send({ "error": "No input!" });
        return;
    } else {
        let collection = mongoConectClient.db("rockie2695_mongodb").collection("fun_" + req.params.collection);
        let sendValue = req.body
        sendValue._id = ObjectId(sendValue._id)
        deleteRecord(collection,
            sendValue
            , function (err, result) {
                if (err) {
                    res.send({ "error": err });
                    return;
                } else {
                    let sendValue = result.deletedCount
                    res.send({ "ok": sendValue });
                    return;
                }
            }
        )
    }
});
app.post("/update/:collection", function (req, res) {
    if (!req.body) {
        res.send({ "error": "No input!" });
        return;
    } else {
        let collection = mongoConectClient.db("rockie2695_mongodb").collection("fun_" + req.params.collection);
        req.body.query.time = Date.now()
        let query = req.body.query
        let whereCon = req.body.whereCon
        if (typeof whereCon._id != "undefined") { whereCon._id = ObjectId(whereCon._id) }
        updateRecord(collection,
            query, whereCon
            , function (err, result) {
                if (err) {
                    res.send({ "error": err });
                    return;
                } else {
                    if (result.result.ok === 1) {
                        req.body.query._id = whereCon._id.toString()
                        res.send({ "ok": req.body.query });
                    } else {
                        res.send({ "error": "unknow" });
                    }
                    return;
                }
            }
        )
    }
});
app.get("/find/:collection", function (req, res) {
    if (!req.body) {
        res.send({ "error": "No input!" });
        return;
    } else {
        let collection = mongoConectClient.db("rockie2695_mongodb").collection("fun_" + req.params.collection);
        findRecord(collection,
            function (err, result) {
                if (err) {
                    res.send({ "error": err });
                    return;
                } else {
                    res.send({ "ok": result });
                    return;
                }
            }
        )
    }
});
function insertRecord(collection, query, callback) {
    collection.insertOne(query, function (err, result) {
        callback(err, result);
    });
}
function deleteRecord(collection, query, callback) {
    collection.deleteOne(query, function (err, result) {
        callback(err, result);
    });
}
function updateRecord(collection, query, whereCon, callback) {
    collection.updateOne(whereCon, { $set: query }, function (err, result) {
        callback(err, result);
    });
}
function findRecord(collection, callback) {
    collection.find().toArray(function (err, result) {
        callback(err, result)
    })
}
app.get(/.*/, function (req, res) {
    res.status(404).send({ method: req.method, "result": req.url + ' Not Supported' });
});