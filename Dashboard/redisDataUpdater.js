// const redis = require('redis');
// const redisSub = require('./redisSub');
// const redisClient = redis.createClient();
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
            firebaseReader.removeFile(filename)
            //update redis
            //              .then delete from firebase
            // console.log(data);
        }).catch((err)=>{

            console.log(err)
        }).finally(()=>{
            // qrReader.deleteFile(filename);
        });
    });
});