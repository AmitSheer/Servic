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
            // no new data, loop again
            callback()
            return;
        }
        //console.log(data);
        mongo.insertMany(data, function () {
            // just to make sure mongo has processed the data
            setTimeout(() => {
                // new data was added to mongo, now we can recrate the association
                notifyAll()
                callback()
            }, 250);
        })
    })
}

function checkForChanges(loop, updateIntervalTime) {
    // check if redis has new packages, if so insert them into mongoDB,
    // notify the listeners in this case the "analytics tool" that mongo has new data.
    if (loop) {
        setTimeout(() => {
            // w8 for x time then check for redis changes.
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