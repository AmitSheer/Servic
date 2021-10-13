var redis = require('redis');
var redisClient = redis.createClient();
var sub = redis.createClient()
var keyPrefix = 'graph.'
sub.subscribe('newPackage');

sub.on("message", function (channel, message) {
    console.log(channel)
    let data = JSON.parse(message);
    redisClient.hmset('data', data.trackingNumber,message, function (err, reply) {
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
    key = keyPrefix+data.district+'.'+data.pkgsize
    redisClient.incr(key, function (err, reply) {
        console.log(reply);
    });
    console.log(data);
});

sub.on('connect', function() {
    console.log('Reciver connected to Redis');
});

//delete data from hashmap
//dec all relevant nodes
function updateData(id,data){
    if(data!=undefined&&data!=null){
        redisClient.hdel('data',data.trackingNumber)
        let key = keyPrefix+data.district+'.total'
        redisClient.decr(key, function (err, reply) {
            console.log(reply);
        });
        key = keyPrefix+data.district+'.'+data.taxType
        redisClient.decr(key, function (err, reply) {
            console.log(reply);
        });
        key = keyPrefix+data.district+'.'+data.pkgsize
        redisClient.decr(key, function (err, reply) {
            console.log(reply);
        });
    }
}

module.exports = {
    updateData
}