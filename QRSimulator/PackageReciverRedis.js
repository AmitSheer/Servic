var express = require('express');
var server = require('http').Server(express);
var redis = require('redis');
var redisClient = redis.createClient();


redisClient.on("newPackage", function (channel, package) {
    var data = JSON.parse(package);
    redisClient.set(serialNumber, data);
});

server.listen(6061, function() {
    console.log('reciver is running on port 6061');
});