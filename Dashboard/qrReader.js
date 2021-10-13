var QrCode = require('qrcode-reader');
var qr = new QrCode();

var fs = require('fs');


var Jimp = require("jimp");

module.exports = {
    qrToImage:  function (imagePath){
        var buffer = fs.readFileSync(__dirname + '\\'+imagePath);
        Jimp.read(buffer, function(err, image) {
            if (err) {
                console.error(err);
                fs.rm(__dirname + '\\'+imagePath)
            }
            var qr = new QrCode();
            qr.callback = function(err, value) {
                if (err) {
                    console.error(err);
                    // TODO handle error
                }
                console.log(value.result);
                console.log(value);
            };
            qr.decode(image.bitmap);
        });
    }
}