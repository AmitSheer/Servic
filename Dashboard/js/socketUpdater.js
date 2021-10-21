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
    update(io).then(async res=>{
        if(res.all.length!=0&&res.byDistrict !={}){
            data.byDistrict = res.byDistrict
            for (const byDistrictElement in res.byDistrict) {
                data.byDistrict[byDistrictElement].all = res.all.filter((pkg)=>{
                    return pkg.district === byDistrictElement
                })
                if(data.cards[byDistrictElement]==undefined) data.cards[byDistrictElement]= {}
                data.cards[byDistrictElement].districtId=byDistrictElement
                data.cards[byDistrictElement].title= byDistrictElement
                data.cards[byDistrictElement].value= res.byDistrict[byDistrictElement].total
                data.cards[byDistrictElement].fotterIcon= ""
                data.cards[byDistrictElement].fotterText= "נפח ממוצע"
                data.cards[byDistrictElement].icon= "add_shopping_cart"
                data.cards[byDistrictElement].index=4
                data.cards[byDistrictElement].isShow= ''
            }
        }else{
            for (let districtsKey of config.districts) {
                if(data.cards[districtsKey]==undefined) data.cards[districtsKey]= {}
                data.cards[districtsKey]['districtId']=districtsKey
                data.cards[districtsKey]['title']= districtsKey
                data.cards[districtsKey]['value']= 0
                data.cards[districtsKey]['fotterIcon']= ""
                data.cards[districtsKey]['fotterText']= "נפח ממוצע"
                data.cards[districtsKey]['icon']= "add_shopping_cart"
                data.cards[districtsKey]['index']=4
                data.cards[districtsKey]['isShow']= ''
            }
        }
        io.emit('newdata',data)
    })
}
module.exports = {
    updateData
}