var redis = require('redis');
var redisClient = redis.createClient();
var sub = redis.createClient()
var keyPrefix = 'graph.'
sub.subscribe('newPackage');

sub.on("message", function (channel, message) {
    console.log(channel)
    let data = JSON.parse(message);
    redisClient.hmset('data', data.trackingNumber,data, function (err, reply) {
        console.log(reply);
    });
    let key = data.district+'.total'
    redisClient.incr(key, function (err, reply) {
        console.log(reply);
    });
    key = data.district+'.'+data.taxType
    redisClient.incr(key, function (err, reply) {
        console.log(reply);
    });
    key = data.district+'.'+data.pkgsize
    redisClient.incr(key, function (err, reply) {
        console.log(reply);
    });
    console.log(data);
});

sub.on('connect', function() {
    console.log('Reciver connected to Redis');
});

// module.exports = redisClient