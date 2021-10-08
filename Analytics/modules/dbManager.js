var mongo = require('./mongo')
var redis = require('./redisGetter')

const redisHashName = "out"
var listeners = []

function subscribe(callback) {
    listeners.push(callback)
}

function notifyAll() {
    for (let i = 0; i < listeners.length; i++) {
        listeners[i]()
    }
}

function retriveData(callback) {
    redis.readAllAndFlush(redisHashName, function (data) {
        if (data.length == 0) {
            //console.log("no update");
            // no new data
            callback()
            return;
        }
        //console.log(data);
        mongo.insertMany(data, function () {
            // just to make sure mongo has processed the data
            setTimeout(() => {
                notifyAll()
                callback()
            }, 250);
        })
    })
}

function checkForChanges(loop, updateIntervalTime) {
    if (loop) {
        setTimeout(() => {
            retriveData(() => {
                checkForChanges(loop, updateIntervalTime)
            })
        }, updateIntervalTime)
    } else {
        retriveData()
    }
}

module.exports = {
    checkForChanges,
    subscribe,
}