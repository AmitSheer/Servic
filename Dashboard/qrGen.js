const QRCode = require('qrcode')

var trackingNumber = 100

// Converting the data into String format

// Converting the data into base64
for (let i = 0; i < 100; i++) {
    var fileName ="./qrImages/"+i+".png"
    let stringdata = JSON.stringify(i)
    QRCode.toFile(fileName,stringdata, function (err, code) {
        if(err) return console.log("error occurred")
        console.log(code)
    })
}
