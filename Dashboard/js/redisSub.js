const redis = require('redis');
const redisClient = redis.createClient();
const sub = redis.createClient();
const keyPrefix = 'graph.';
sub.subscribe('newPackage');

sub.on("message", function (channel, message) {
    let data = JSON.parse(message);
    redisClient.hmset('data', data.serialNumber,message, function (err, reply) {
    });
    let key = keyPrefix+data.district+'.total'
    redisClient.incr(key, function (err, reply) {
    });
    key = keyPrefix+data.district+'.tax'
    redisClient.hincrby(key,data.taxLevel, 1, function (err, reply) {
    });
    key = keyPrefix+data.district+'.size'
    redisClient.hincrby(key,data.size,1, function (err, reply) {
    });
});

sub.on('connect', function() {
    console.log('Reciver connected to Redis');
});
