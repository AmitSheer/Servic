var express = require('express')
var router = express.Router()

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://michael:the12345@cluster0.12wcz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const db = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const collectionName = "packages"
const dbName = "test"

const { performance } = require('perf_hooks');
const { emit } = require('process');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Monogo Time: ', Date.now())
    next()
})
// define the home page route
router.get('/', function (req, res) {
    readData(function (data) {
        res.send(data)
    })
})

function readData(callback) {
    //var start = performance.now()
    db.connect(err => {
        var dbo = db.db(dbName);
        dbo.collection(collectionName).find({}).toArray(function (err, result) {
            if (err) throw err;
            callback(result)
            db.close();
            //console.log("time elpassed : " + (performance.now() - start));
        });
    });
}

function insertOne(dataObj, callback) {
    db.connect(err => {
        var dbo = db.db(dbName);
        dbo.collection(collectionName).insertOne(dataObj, function (err, res) {
            if (err) {
                callback(err)
                return;
            }
            callback("successfuly inserted!");
            db.close();
        });
    });
}

function insertMany(dataObjArr, callback) {
    db.connect(err => {
        var dbo = db.db(dbName);
        dbo.collection(collectionName).insertMany(dataObjArr, function (err, res) {
            if (err) {
                callback(err)
                return;
            }
            callback("Number of documents inserted: " + res.insertedCount);
            db.close();
        });
    });
}

module.exports = {
    router: router,
    readAll: readData,
    insertOne: insertOne,
    insertMany: insertMany
}