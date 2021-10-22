var redis = require('redis');
var redisClient = redis.createClient();
var keyPrefix = 'graph.'
//delete data from hashmap
//dec all relevant nodes
function updateData(id,data){
    if(data==undefined||data==null){
        redisClient.hmget('data',id,function(err,replay) {
            if (err) {
                // console.log(err)
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
        // console.log(reply);
        key = keyPrefix+data.district+'.size'
        redisClient.hincrby(key,data.size,-1, function (err, reply) {
            // console.log(reply);
            key = keyPrefix+data.district+'.tax'
            redisClient.hincrby(key,data.tax,-1, function (err, reply) {
                // console.log(reply);
            });
        });
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
}

async function getAllDistricts(){
    return await new Promise((resolve,reject)=>{
        redisClient.keys('graph.*.total',function(err,res){
            let districts = []
            for (const resKey of res) {
                districts.push(resKey.substring(6,resKey.length-6))
            }
            resolve(districts)
        })
    })

}

module.exports = {
    updateData,
    getDistrictData,
    getAllData,
    getAllDistricts
}