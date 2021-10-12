var redis = require('redis');
var redisClient = redis.createClient();
var sub = redis.createClient()
var keyPrefix = 'graph.'
// redisClient.exists()
sub.subscribe('newPackage'); 

sub.on("message", function (channel, message) {
    console.log(channel)
    let data = JSON.parse(message);
    let pkgSerial = data.serialNumber;
    redisClient.sadd('data', message, function (err, reply) {
        console.log(reply);
    });
    let key = keyPrefix+data.district+'.total'
    redisClient.incr(key, function (err, reply) {
        console.log(reply);
    });
    key = keyPrefix+data.district+'.'+data.taxType
    redisClient.incr(key, function (err, reply) {
        console.log(reply);
    });
    key = keyPrefix+data.district+'.'+data.size
    redisClient.incr(key, function (err, reply) {
        console.log(reply);
    });
    console.log(data);
});

sub.on('connect', function() {
    console.log('Reciver connected to Redis');
});

// module.exports = redisClient