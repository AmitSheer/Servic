var size = ["small", "medium", "large"]
var districts = ["North", "South", "Haifa", "Jerusalem", "TelAviv", "Center"]
var cities = {
    "North": ['tveria', 'naaria', 'nazeret', 'tsfat', 'afula'],
    "South": ['ashdod', 'dimona', 'eilat', 'arad', 'netivot'],
    "Haifa": ['hedera', 'heifa', 'keriyat yam', 'keriyat motzkin', 'nesher'],
    "Jerusalem": ['beit shemesh', 'jerusalem'],
    "TelAviv": ['tel aviv', 'or yehuda', 'ramat asharon', 'hulon', 'herzelia'],
    "Center": ['ariel', 'hod hasharon', 'elad', 'yavne', 'rehovot', 'petah tikva', 'rosh ahain']
}

var address = [
    'haziyonot', 'hanegev', 'avner', 'zaal', 'seora', 'zait', 'tamar', 'rimon', 'kalanit', 'hirus', 'lotem', 'narkis'
]

var sizeDep = {
    "small": { min: 1, extra: 1 },
    "medium": { min: 2, extra: 2 },
    "large": { min: 3, extra: 2 },

    calculateItems: function (type) {
        var t = sizeDep[type]
        var n = t.min + Math.floor(Math.random() * (t.extra + 1))
        return n
    }
}

function getRandomElementFromArr(arr) {
    var item_index = Math.floor(Math.random() * arr.length)
    return arr[item_index]
}

function addItemAndCommonItems(item_set, item) {
    item_set.add(item.name)

    var dependency = item.commonList
    if (dependency != undefined) {
        var add = 0;
        while (add < dependency.max_common) {
            var chance = Math.random();
            if (chance > dependency.proba - dependency.reduced_proba * add) {
                break;
            }
            item_set.add(getRandomElementFromArr(dependency.items))
            add += 1
        }
    }
}

function calculatePrice(item_set) {
    var price = 0;
    for (let i = 0; i < item_set.length; i++) {
        const item_name = item_set[i]
        var item = undefined;
        for (let i = 0; i < itemsData.items.length; i++) {
            const element = itemsData.items[i];
            if (element.name == item_name) {
                item = element
                break
            }
        }
        if (item == undefined) {
            // if the item doesn't exist on its own ( the item is only comming along something )
            price += Math.random() * 100;
            continue;
        }
        price += item.price + (Math.random() - 0.5) * 2 * item.price_var;
    }
    return Math.floor(price)
}

const fs = require('fs');
const path = require('path');
let rawdata = fs.readFileSync(path.resolve(__dirname, 'items.json'));
let itemsData = JSON.parse(rawdata);

// console.log(itemsData);

module.exports = {
    createRandomPackage: createRandomPackage
}

function createRandomPackage(serialNumber) {
    this.serialNumber = serialNumber;
    this.size = getRandomElementFromArr(size)
    var itemNumber = sizeDep.calculateItems(this.size)


    //this.taxLevel = Math.random() * Math.random() * 1000

    this.items = new Set()
    //console.log(itemsData);
    for (let i = 0; i < itemNumber; i++) {
        //this.itemsList.add(getRandomItem(items))
        addItemAndCommonItems(this.items, getRandomElementFromArr(itemsData.items))
    }

    for (let i = 0; i < itemsData.strictly_common.length; i++) {
        var A = itemsData.strictly_common[i].A
        var B = itemsData.strictly_common[i].B
        if (this.items.has(B)) {
            continue;
        }
        var skip = false
        for (let index = 0; index < A.length; index++) {
            const element = A[index];
            if (!this.items.has(element)) {
                skip = true
                break;
            }
        }
        if (!skip) {
            this.items.add(B)
        }
    }
    this.items = Array.from(this.items)

    var price = calculatePrice(this.items)
    // just because 500 is to little distance with 250 and 1000 there is more variation
    this.taxLevel = price < 250 ? "free" : price < 1000 ? "vat" : "all";
    this.district = getRandomElementFromArr(districts)
    this.address = getRandomElementFromArr(cities[this.district]) + ", " + getRandomElementFromArr(address) + " " + Math.floor(Math.random() * 100)
}


