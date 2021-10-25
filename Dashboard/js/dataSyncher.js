const dataManager = require('./redisManager');
const firebaseReader = require('./firebaseReader')
const qrReader = require('./qrReader')
let alreadyRunning = false;


/**
 * update the data saved in redis for dashboard
 * @param package package that needs to be updated
 */
async function updateRedis() {
    if(!alreadyRunning){
        alreadyRunning= true
        let files = await firebaseReader.getFilesName()
        Promise.allSettled(files.map((async (filename)=>{
            await firebaseReader.getQR(filename)
            let data
            try {
                data = await qrReader.qrToImage(filename.id)
            }catch(e){
                data = null
            }
            if(data!=null){
                dataManager.updateData(filename.id.substring(0, filename.id.length - 4), JSON.parse(data))
            }else{
                dataManager.updateData(filename.id.substring(0, filename.id.length - 4), data)
            }
            await firebaseReader.removeFile(filename.id);
            await qrReader.deleteFile(filename.id);
        }))).then((res)=>{
            alreadyRunning = false
        })
    }
}

setInterval(updateRedis,5000)