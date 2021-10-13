const admin = require('firebase-admin');
const qrToImage = require('./qrReader');
const serviceAccount = require('./cloudservicesfinalproject-firebase-adminsdk-b4n93-973e1d7417.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://cloudservicesfinalproject.appspot.com'
});


const bucket = admin.storage().bucket();
console.log(bucket)
bucket.list
bucket.getFiles(function(err, files){
    if(err) return console.log(err);
    for (let i = 0; i < files.length; i++) {
        bucket.file(files[i].id).download(files[i].id).then(()=>{
            qrToImage.qrToImage(files[i].id)
        })
        //do update on redis here
        console.log(files[i])
    }
})