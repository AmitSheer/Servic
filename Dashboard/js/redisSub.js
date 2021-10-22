var redis = require('redis');
var redisClient = redis.createClient();
var sub = redis.createClient()
var keyPrefix = 'graph.'
sub.subscribe('newPackage');

sub.on("message", function (channel, message) {
    console.log(channel)
    let data = JSON.parse(message);
    redisClient.hmset('data', data.serialNumber,message, function (err, reply) {
        console.log(reply);
    });
    let key = keyPrefix+data.district+'.total'
    redisClient.incr(key, function (err, reply) {
        console.log(reply);
    });
    key = keyPrefix+data.district+'.tax'
    redisClient.hincrby(key,data.taxLevel, 1, function (err, reply) {
        console.log(reply);
    });
    key = keyPrefix+data.district+'.size'
    redisClient.hincrby(key,data.size,1, function (err, reply) {
        console.log(reply);
    });
    console.log(data);
});

sub.on('connect', function() {
    console.log('Reciver connected to Redis');
});
