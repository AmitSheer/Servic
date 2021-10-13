const QRCode = require('qrcode')

var trackingNumber = 100

// Converting the data into String format
let stringdata = JSON.stringify(trackingNumber)

// Converting the data into base64
var fileName ="./"+trackingNumber+".png"
QRCode.toFile(fileName,stringdata, function (err, code) {
    if(err) return console.log("error occurred")
    console.log(code)
})