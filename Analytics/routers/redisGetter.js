var redis = require('redis');
var client = redis.createClient();

// we use out, as the hash name.

client.on("error", function (error) {
    console.error(error);
});

function readAll() {

}

module.exports = {
    addPackage,
    addPackages
}