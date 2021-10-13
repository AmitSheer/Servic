const admin = require('firebase-admin');
const qrToImage = require('./qrReader');
const serviceAccount = require('./cloudservicesfinalproject-firebase-adminsdk-b4n93-274bc70075.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://cloudservicesfinalproject.appspot.com'
});


function removeFile(filename){
    const bucket = admin.storage().bucket();
    bucket.file(filename).delete().then(function(data) {
        const apiResponse = data[0];
    }).catch((err)=>{
        console.log(err)
    });
}

module.exports = {
    getQR: async ()=> {
    const bucket = admin.storage().bucket();
    let files = await bucket.getFiles();
    let promises =[]
    for (const file of files[0]) {
        const options = {
            destination: 'qrImages/' + file.id
        }
        promises.push(bucket.file(file.id).download(options))
    }
    await Promise.all(promises)
    return files[0].map(file => file.id);
},
    removeFile
}
