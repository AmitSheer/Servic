const admin = require('firebase-admin');
const qrToImage = require('./qrReader');
const serviceAccount = require('../cloudservicesfinalproject-firebase-adminsdk-b4n93-274bc70075.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://cloudservicesfinalproject.appspot.com'
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
//     getQR: async (fileName)=> {
//     const bucket = admin.storage().bucket();
//     let files = await bucket.getFiles();
//     let promises =[]
//     for (const file of files[0]) {
//         const options = {
//             destination: 'qrImages/' + file.id
//         }
//         promises.push(bucket.file(file.id).download(options))
//     }
//     await Promise.allSettled(promises)
//     return files[0].map(file => file.id);
// },
    removeFile,
    getFilesName
}
