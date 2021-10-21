var redis = require('redis');
var client = redis.createClient();

// we use out, as the hash name.

client.on("error", function (error) {
    console.error(error);
});

function readAllAndFlush(key, callback) {
    client
        .multi([
            ["hgetall", key],
            ['del', key]
        ])
        .exec(function (err, replies) {
            var data = []
            if (replies[0] != undefined) {
                for (const key in replies[0]) {
                    data.push(JSON.parse(replies[0][key]))
                }
            }
            callback(data)
        });
}


module.exports = {
    readAllAndFlush,
}