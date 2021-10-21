const QrCode = require('qrcode-reader');
const qr = new QrCode();
const fs = require('fs');
const Jimp = require("jimp");


module.exports = {
    qrToImage: async function (imagePath) {
        const buffer = fs.readFileSync('./qrImages/' + imagePath);
        let image = await Jimp.read(buffer)
        const value = await new Promise((resolve,reject)=>{
            qr.callback =(err,res) => err!=null ? reject(err):resolve(res)
            qr.decode(image.bitmap)
        })
        return value.result
    },
    deleteFile: async function(filename){
        await fs.unlink('./qrImages/'+filename,(err)=>{
            // if(err) console.log(err);
        })
    }
}