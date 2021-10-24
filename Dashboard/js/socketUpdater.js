const redisRetriever = require('./dataManager')
const config = require("../config.json");

async function update(){
    let data = {
        all: [],
        byDistrict:{

        }
    }
    await redisRetriever.getAllData().then(res=>{
        if(res==null){
            res={}
        }
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

async function updateData(io,data){
    let updatedData = data
    update(io).then(async res=>{
        if(res.all.length!=0&&res.byDistrict !={}){
            updatedData.byDistrict = res.byDistrict
            for (const byDistrictElement in res.byDistrict) {
                updatedData.byDistrict[byDistrictElement].all = res.all.filter((pkg)=>{
                    return pkg.district === byDistrictElement
                })
                if(updatedData.cards[byDistrictElement]==undefined) updatedData.cards[byDistrictElement]= {}
                updatedData.cards[byDistrictElement].districtId=byDistrictElement
                updatedData.cards[byDistrictElement].title= byDistrictElement
                updatedData.cards[byDistrictElement].value= res.byDistrict[byDistrictElement].total
                updatedData.cards[byDistrictElement].fotterIcon= ""
                updatedData.cards[byDistrictElement].fotterText= "נפח ממוצע"
                updatedData.cards[byDistrictElement].icon= "add_shopping_cart"
                updatedData.cards[byDistrictElement].index=4
                updatedData.cards[byDistrictElement].isShow= ''
            }
        }else{
            updatedData.all = res.all
            updatedData.byDistrict = res.byDistrict
            for (let districtsKey of config.districts) {
                if(updatedData.cards[districtsKey]==undefined) updatedData.cards[districtsKey]= {}
                updatedData.cards[districtsKey]['districtId']=districtsKey
                updatedData.cards[districtsKey]['title']= districtsKey
                updatedData.cards[districtsKey]['value']= 0
                updatedData.cards[districtsKey]['fotterIcon']= ""
                updatedData.cards[districtsKey]['fotterText']= "נפח ממוצע"
                updatedData.cards[districtsKey]['icon']= "add_shopping_cart"
                updatedData.cards[districtsKey]['index']=4
                updatedData.cards[districtsKey]['isShow']= ''
            }
        }
        io.emit('newdata',updatedData)
    })
}
module.exports = {
    updateData
}