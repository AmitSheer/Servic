var express = require('express');
var server = express(); 
var redis = require('redis');
var redisClient = redis.createClient();
const pGenerator = require("./PackageGenerator")
const qGenerator = require("./qrGenerator")




// server.get('/', function (req, res) {
    var serialNumber = 1;
//    while (true) {
        var thePackage = pGenerator.createRandomPackage(serialNumber);
        console.log(thePackage)
        let stringdata = JSON.stringify(thePackage)
        redisClient.set(serialNumber, stringdata, function (err, reply) {
            console.log(reply);
        });
        redisClient.publish("newPackage", "newPackage", function () {
        });

        qGenerator.createQR(thePackage);


        serialNumber++;
        // var secondsToWait = 100;
        // setTimeout(packageSender(thePackage), secondsToWait*1000);
//   }
// });

// in the lines below we connect to the redis' server
// redisClient.on('connect', function () {
//     console.log('Sender connected to Redis');
// });


// in the lines below we connect to the node's server
// server.listen(6062, function () {
//     console.log('Sender is running on port 6062');
// });