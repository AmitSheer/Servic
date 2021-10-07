var redis = require('redis');
var client = redis.createClient();

// we use out, as the hash name.

client.on("error", function (error) {
    console.error(error);
});

function addPackage(key, package) {
    client.hmset(key, package.serialNumber, JSON.stringify(package))
}

function addPackages(key, packageArr) {
    for (let i = 0; i < packageArr.length; i++) {
        const element = packageArr[i];
        addPackage(key, element)
    }
}

module.exports = {
    addPackage,
    addPackages
}