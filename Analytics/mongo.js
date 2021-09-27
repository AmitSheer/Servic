var express = require('express')
var router = express.Router()

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://michael:the12345@cluster0.12wcz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const db = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Monogo Time: ', Date.now())
    next()
})
// define the home page route
router.get('/', function (req, res) {
    res.send('this would print from mongo server')
})
// define the about route
router.get('/find', function (req, res) {
    db.connect(err => {
        var dbo = db.db("kek");
        dbo.collection("test").find({}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });
    });
})

module.exports = router