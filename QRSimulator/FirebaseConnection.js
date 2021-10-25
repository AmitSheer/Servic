//https://javascript.plainenglish.io/how-to-upload-files-to-firebase-storage-in-node-js-e19b2b5e5cf9

const { Storage } = require('@google-cloud/storage');
// const express = require("express");
// const { createRandomPackage } = require('./PackageGenerator');

// const app = new express();

let sendPackageToFirebase = function (serialNumber) {

    const storage = new Storage({
        keyFilename: "first-f924f-firebase-adminsdk-swrkz-7007f979ec.json"
        //goto project settings (wheel at left top)
        //service accounts->click generate new private key
        //you will have a key file downloaded - copy to this folder
    });

    let bucketName = "gs://first-f924f.appspot.com"

    let filename = "./Image/" + serialNumber + '.png';
    console.log("***********************   "+serialNumber+"      "+filename)
    // Testing out upload of file
    const uploadFile = async () => {

        // Uploads a local file to the bucket
        await storage.bucket(bucketName).upload(filename, {
            // Support for HTTP requests made with `Accept-Encoding: gzip`
            gzip: true,
            // By setting the option `destination`, you can change the name of the
            // object you are uploading to a bucket.
            metadata: {
                // Enable long-lived HTTP caching headers
                // Use only if the contents of the file will never change
                // (If the contents will change, use cacheControl: 'no-cache')
                cacheControl: 'public, max-age=31536000',
            },
        });

        console.log(`${filename} uploaded to ${bucketName}.`);
    }

    uploadFile();


}
// app.listen(process.env.PORT || 8088, () => { console.log('node server running'); })
module.exports = {
    sendPackageToFirebase
}