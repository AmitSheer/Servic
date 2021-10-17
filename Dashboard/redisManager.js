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
    redisClient.hincrby(key,data.tax,1, function (err, reply) {
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

//delete data from hashmap
//dec all relevant nodes
function updateData(id,data){
    if(data==undefined||data==null){
        redisClient.hmget('data',id,function(err,replay) {
            if (err) {
                console.log(err)
                return
            }
            data = JSON.parse(replay)
            update(data)
        })
    }else{
        update(data)
    }
}

function update(data){
    redisClient.hdel('data',data.serialNumber)
    let key = keyPrefix+data.district+'.total'
    redisClient.decr(key, function (err, reply) {
        console.log(reply);
    });
    key = keyPrefix+data.district+'.size'
    redisClient.hincrby(key,data.size,-1, function (err, reply) {
        console.log(reply);
    });
    key = keyPrefix+data.district+'.tax'
    redisClient.hincrby(key,data.tax,-1, function (err, reply) {
        console.log(reply);
    });
}
async function getDistrictData(district){
    let total_data={}
    let key = keyPrefix+district+'.total'
    await new Promise((resolve,reject)=>{
        redisClient.get(key, function (err, reply) {
            total_data.total = reply
            key = keyPrefix+district+'.tax'
            redisClient.hgetall(key, function (err, reply) {
                total_data.tax = reply
                key = keyPrefix+district+'.size'
                redisClient.hgetall(key, function (err, reply) {
                    total_data.size = reply
                    resolve(total_data)
                });
            });
        });
    })
    return total_data
}

async function getAllData(){
    return await new Promise((resolve,reject)=>{
        redisClient.hgetall('data',function (err,res){
            resolve(res)
        })
    })
    // let key = keyPrefix+data.district+'.total'
    // redisClient.decr(key, function (err, reply) {
    //     console.log(reply);
    // });
    // key = keyPrefix+data.district+'.'+data.taxType
    // redisClient.decr(key, function (err, reply) {
    //     console.log(reply);
    // });
    // key = keyPrefix+data.district+'.'+data.pkgsize
    // redisClient.decr(key, function (err, reply) {
    //     console.log(reply);
    // });
}

module.exports = {
    updateData,
    getDistrictData,
    getAllData
}