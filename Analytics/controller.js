const express = require('express')
const app = express()
const port = 3000


var mongo = require("./routers/mongo")

app.set('view engine', 'ejs')

module.exports = {
    monogoRead: mongo.readAll,
    mongoInsertOne: mongo.insertOne,
    mongoInsertMany: mongo.insertMany,
    createBigmlInterface: createBigmlInterface
}

var bigml = require("./routers/bigml")
var analytics = require("./routers/analytics")
var bigmlAnalytics = require('./routers/bigmlAnalysis')
var redis = require('./routers/redisAdder')

app.set('view engine', 'ejs')

app.use('/mongo', mongo.router)
app.use('/bigml', bigml)
app.use('/', analytics)

app.use(express.static('public'))

function createBigmlInterface(callback) {
    return bigmlAnalytics.getAssociation(callback)
}

var obj = {
    serialNumber: 0,
    text: "kek"
}
app.get('/test', function (req, res) {
    redis.addPackage("out", obj)
    obj.serialNumber++
    res.send("sent to redis")
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})