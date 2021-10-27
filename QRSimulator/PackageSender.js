var express = require('express');
var server = express(); 
var redis = require('redis');
var redisClient = redis.createClient();
const pGenerator = require("./PackageGenerator")
const qGenerator = require("./qrGenerator")
const fbSender = require("./FirebaseConnection")
var packagesOnTheWay = []


const prefixN = 1000000
function randomIndex(i) {
  var number = i.toString()
  var other = (Math.floor(Math.random() * 8 * prefixN) + prefixN).toString()
  return parseInt(number + other)
}

async function send(id){
    var packageID = randomIndex(id+100)
    var thePackage = new pGenerator.createRandomPackage(packageID);
    console.log(thePackage)
    let stringdata = JSON.stringify(thePackage)
    redisClient.publish("newPackage", stringdata, function () {
    });
    qGenerator.createQR(thePackage)
    packagesOnTheWay[packagesOnTheWay.length] = packageID
}

var i = 1;
while(i<200){
    send(i)
    i++;
}

async function deliver(){
    if(packagesOnTheWay.length==0) {
        console.log("Simulation finished")
        return
    }
    let random = (Math.round(Math.random()*2500))
    if(random%5 == 0 && packagesOnTheWay.length>0){
        let temp = Math.floor(Math.random() * packagesOnTheWay.length);
        let tempi = packagesOnTheWay[temp];
        console.log("+++++++++++++++++++++    "+tempi+"    "+"    "+packagesOnTheWay.length+"   "+temp)
        fbSender.sendPackageToFirebase(tempi)
        packagesOnTheWay.splice(temp, 1);
        console.log("send "+tempi+", curr "+i)
    }
}
setInterval(deliver,50)
setInterval(()=>{
    i++
    if(Math.random()>0.8) send(i)
},50)
console.log('done')