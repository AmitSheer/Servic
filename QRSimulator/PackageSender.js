var express = require('express');
var server = express(); 
var redis = require('redis');
var redisClient = redis.createClient();
const pGenerator = require("./PackageGenerator")
const qGenerator = require("./qrGenerator")
const fbSender = require("./FirebaseConnection")
var packagesOnTheWay = []


const prefixN = 1000000
function randomIndex(i) {
  var number = i.toString()
  var other = (Math.floor(Math.random() * 8 * prefixN) + prefixN).toString()
  return parseInt(number + other)
}


// server.get('/', function (req, res) {
    var i = 1;
//    while (true) {
    while(i<20){
        var packageID = randomIndex(i+100)

        var thePackage = new pGenerator.createRandomPackage(packageID);
        console.log(thePackage)
        let stringdata = JSON.stringify(thePackage)
        redisClient.publish("newPackage", stringdata, function () {
        });

        qGenerator.createQR(thePackage)
        // fbSender.sendPackageToFirebase(i)
        packagesOnTheWay[packagesOnTheWay.length] = packageID

        var random = (Math.round(Math.random()*2500))
        if(random%2 == 0 && packagesOnTheWay.length>0){
            var temp = Math.floor(Math.random()*packagesOnTheWay.length)
            // if(temp = 0) temp = 1
            // var index = packagesOnTheWay.length % (temp)
            var tempi = packagesOnTheWay[temp]
            console.log("+++++++++++++++++++++    "+tempi+"    "+"    "+packagesOnTheWay.length+"   "+temp)
            fbSender.sendPackageToFirebase(tempi)
            packagesOnTheWay.splice(temp, 1);
            console.log("send "+tempi+", curr "+i)
        }
        i++;

        // var secondsToWait = 100;
        // setInterval(checkPackages, secondsToWait*1000)
        // await sleep(2000);

        
        // setTimeout(, secondsToWait*1000);
  }
// });

// in the lines below we connect to the redis' server
// redisClient.on('connect', function () {
//     console.log('Sender connected to Redis');
// });


// in the lines below we connect to the node's server
// server.listen(6062, function () {
//     console.log('Sender is running on port 6062');
// });