var express = require('express')
var router = express.Router()

module.exports = router

var redisAdder = require('../redisAdder')
var redisGetter = require('../redisGetter')
var packageGenerator = require('../PackageGenerator')

const redisKey = "out"

const prefixN = 1000000
function randomIndex(i) {
    var number = i.toString()
    var other = (Math.floor(Math.random() * 8 * prefixN) + prefixN).toString()
    return parseInt(number + other)
}

router.get('/add', function (req, res) {
    var packge = new packageGenerator.createRandomPackage(randomIndex(-1))
    redisAdder.addPackage(redisKey, packge)
    res.send(JSON.stringify(packge) + "<br>pushed one random package to redis!")
})

router.get('/add/:numPackages', function (req, res) {
    var arr = []
    for (let i = 0; i < req.params.numPackages; i++) {
        var package = new packageGenerator.createRandomPackage(randomIndex(i))
        arr.push(package)
    }
    redisAdder.addPackages(redisKey, arr)
    res.send(JSON.stringify(arr) + "<br>pushed " + req.params.numPackages + " new random packages, into redis")
})

router.get('/get', function (req, res) {
    redisGetter.readAllAndFlush(redisKey, function (reply) {
        // if (reply == undefined) {
        //     res.send("no new data")
        // } else {
        //     var s = ""
        //     for (const key in reply) {
        //         s += JSON.stringify(reply[key]) + "<br>"
        //     }
        //     res.send(s)
        // }
        res.send(reply)
    })
})
