const redisRetriever = require('./redisDataRetriever')


async function update(io){
    let data = {
        all: await redisRetriever.getAllData(),
        byDistrict:{

        }
    }
    let districts = await redisRetriever.getAllDistricts()
    for (const district of districts) {
        data.byDistrict[district] = await redisRetriever.getDistrictData(district)
    }
    io.emit('newData',data)
    return data;
}

module.exports = {
    update
}



//------------
