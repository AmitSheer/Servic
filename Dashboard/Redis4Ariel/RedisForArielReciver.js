var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var redis = require('redis');
var redisClient = redis.createClient();

var sub = redis.createClient()



sub.subscribe('newPackage'); 

app.get('/', (req, res) =>{
    let data = {}
    redisClient.smembers('data',function(error,replay) {
        data.pkgs =replay
        console.log(replay)
    })
    redisClient.keys('graph*',function(error,replay){
        if(error){ res.send(error); }
        replay.forEach(element => {
            redisClient.get(element,function(error,replay){
                data[element] = replay
                console.log(element+':'+replay)
            })
        });
        res.send(data)
    });

})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

sub.on("message", function (channel, message) {
    console.log(channel)
    let data = JSON.parse(message);
    let pkgSerial = data.serialNumber;
    redisClient.sadd('data', message, function (err, reply) {
        console.log(reply);
    });
    let key = 'graph.'+data.district+'.total'
    redisClient.incr(key, function (err, reply) {
        console.log(reply);
    });
    key = 'graph.'+data.district+'.'+data.taxType
    redisClient.incr(key, function (err, reply) {
        console.log(reply);
    });
    key = 'graph.'+data.district+'.'+data.size
    redisClient.incr(key, function (err, reply) {
        console.log(reply);
    });
    console.log(data);
});

sub.on('connect', function() {
    console.log('Reciver connected to Redis');
});


server.listen(6061, function() {
    console.log('reciver is running on port 6061');
});

