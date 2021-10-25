const admin = require('firebase-admin');
const qrToImage = require('./qrReader');
const serviceAccount = require('../first-f924f-firebase-adminsdk-swrkz-7007f979ec.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://first-f924f.appspot.com'
});


async function removeFile(filename){
    const bucket = admin.storage().bucket();
    return bucket.file(filename).delete()
}
async function getFilesName(){
    const bucket = admin.storage().bucket();
    let filenames =  await bucket.getFiles();
    return filenames[0]
}
async function getQR(filename){
    const bucket = admin.storage().bucket();
    const options = {
            destination: 'qrImages/' + filename.id
        }
        await bucket.file(filename.id).download(options)
}

module.exports = {
    getQR,
    removeFile,
    getFilesName
}
