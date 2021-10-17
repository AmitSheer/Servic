const redisSub = require('./redisManager');
const firebaseReader = require('./firebaseReader')
const qrReader = require('./qrReader')

/**
 * update the data saved in redis for dashboard
 * @param package package that needs to be updated
 */
// async function updateRedis(){

firebaseReader.getQR().then((files)=>{
    console.log(files)
    files.forEach((filename)=>{
        qrReader.qrToImage(filename).then((data)=>{
            redisSub.updateData(filename.substring(0,filename.length-4),JSON.parse(data))
            // firebaseReader.removeFile(filename)
            //update redis
            //              .then delete from firebase
            // console.log(data);
        }).catch((err)=>{
            //use qr id as delete
            console.log(err)
        }).finally(()=>{
            // qrReader.deleteFile(filename);
        });
    });
});