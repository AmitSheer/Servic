const redisRetriever = require('./redisDataRetriever')


async function update(io){
    let data = {
        all: [],
        byDistrict:{

        }
    }
    await redisRetriever.getAllData().then(res=>{
        // console.log(res)
        for (const resKey of Object.values(res)) {
            data.all.push(JSON.parse(resKey))
        }
    })
    let districts = await redisRetriever.getAllDistricts()
    for (const district of districts) {
        data.byDistrict[district] = await redisRetriever.getDistrictData(district)
    }
    return data;
}

module.exports = {
    update
}



//------------
