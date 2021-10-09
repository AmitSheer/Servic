const express = require('express')
const app = express()
const port = 3000


var mongo = require("./modules/mongo")

app.set('view engine', 'ejs')

module.exports = {
    monogoRead: mongo.readAll,
    mongoInsertOne: mongo.insertOne,
    mongoInsertMany: mongo.insertMany,
    getAssociation: getAssociation
}

var analytics = require("./routers/analytics")
var bigmlAnalytics = require('./modules/bigmlAnalysis')
var dbManager = require('./modules/dbManager')

var testBigml = require("./modules/test/bigmlTest")
var testRedis = require('./modules/test/redisTest')
app.set('view engine', 'ejs')
app.use('/test/bigml', testBigml)
app.use('/test/redis', testRedis)
app.use('/', analytics)

app.use(express.static('public'))
app.use(express.static('imported/public'))

function getAssociation(callback) {
    return bigmlAnalytics.getAssociation(callback)
}

function updateAnalytics() {
    bigmlAnalytics.updateAssociation(() => { })
}
dbManager.subscribe(updateAnalytics)
dbManager.checkForChanges(true, 30000)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})