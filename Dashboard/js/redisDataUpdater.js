const dataManager = require('./dataManager');
const firebaseReader = require('./firebaseReader')
const qrReader = require('./qrReader')
var alreadyRunning = false
/**
 * update the data saved in redis for dashboard
 * @param package package that needs to be updated
 */
async function updateRedis() {
    if(!alreadyRunning){
        alreadyRunning= true
        firebaseReader.getQR().then((files) => {
            // console.log(files)
            files.forEach((filename) => {
                qrReader.qrToImage(filename).then((data) => {
                    dataManager.updateData(filename.substring(0, filename.length - 4), JSON.parse(data))
                    firebaseReader.removeFile(filename);
                }).catch((err) => {
                    dataManager.updateData(filename.substring(0, filename.length - 4), null)
                    firebaseReader.removeFile(filename);
                }).finally(() => {
                    qrReader.deleteFile(filename);
                    alreadyRunning = false
                });
            });
        });
    }
}

module.exports={
    updateRedis
}