
function createRandomPackage(serialNumber){
    var random = (Math.round(Math.random()*2500))
    var size = ["small", "medium", "large"]
    var items = ["phone", "case", "headphones", "computer", "mouse", "keyboard"]
    var districts = ["North", "South", "Haifa", "Jerusalem", "TelAviv", "Center"]
    var streets = ["A", "B", "C", "D", "E", "H"]
    var taxLevel = 0
    if(random>75 && random<1000)
        taxLevel = random*0.17
    else if(random>=1000)
        taxLevel = random*0.34
trackingNumber = serialNumber;
var itemNumber = (random % 3) + 1;
var itemsList = []
for (let i = 0; i < itemNumber; i++) {
    itemsList[i] = items[random % (items.length)] 
}
var pkgsize =  size[random % 3];
var address = streets[random%6];
var district = districts[random % (districts.length)];
return {trackingNumber, itemsList, pkgsize, taxLevel, address, district}
}


module.exports = {
    createRandomPackage
};






