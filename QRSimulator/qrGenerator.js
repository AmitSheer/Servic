//https://www.geeksforgeeks.org/generate-a-qr-code-in-node-js/

// Require the package
const QRCode = require('qrcode')
const fbSender = require("./FirebaseConnection")

module.exports = {
    createQR: function(randomPackage){
    // Creating the data
        var trackingNumber = randomPackage.trackingNumber
 
    // Converting the data into String format
    let stringdata = JSON.stringify(randomPackage)
    
    // Converting the data into base64
    var fileName ="./"+trackingNumber+".png"
    QRCode.toFile(fileName,stringdata, function (err, code) {
        if(err) return console.log("error occurred")
    
        })
        fbSender.sendPackageToFirebase(randomPackage.serialNumber)
    }
}