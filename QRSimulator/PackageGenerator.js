
// function createRandomPackage(serialNumber){
//     var random = (Math.round(Math.random()*2500))
//     var size = ["small", "medium", "large"]
//     var items = ["phone", "case", "headphones", "computer", "mouse", "keyboard"]
//     var districts = ["North", "South", "Haifa", "Jerusalem", "TelAviv", "Center"]
//     var cities = {
//         "North": ['tveria', 'naaria', 'nazeret', 'tsfat', 'afula'],
//         "South": ['ashdod', 'dimona', 'eilat', 'arad', 'netivot'],
//         "Haifa": ['hedera', 'heifa', 'keriyat yam', 'keriyat motzkin', 'nesher'],
//         "Jerusalem": ['beit shemesh', 'jerusalem'],
//         "TelAviv": ['tel aviv', 'or yehuda', 'ramat asharon', 'hulon', 'herzelia'],
//         "Center": ['ariel', 'hod hasharon', 'elad', 'yavne', 'rehovot', 'petah tikva', 'rosh ahain']
//     }
    
//     var streets = [
//         'haziyonot', 'hanegev', 'avner', 'zaal', 'seora', 'zait', 'tamar', 'rimon', 'kalanit', 'hirus', 'lotem', 'narkis'
//     ]

//     var taxLevel = 0
//     if(random>75 && random<1000)
//         taxLevel = random*0.17
//     else if(random>=1000)
//         taxLevel = random*0.34
// trackingNumber = serialNumber;
// var itemNumber = (random % 3) + 1;
// var itemsList = []
// for (let i = 0; i < itemNumber; i++) {
//     itemsList[i] = items[Math.floor(Math.random()) % (items.length)] 
// }
// var pkgsize =  size[random % 3];
// var district = districts[random % (districts.length)];

// var address = cities[district][random % cities[district].length ] + ", " + streets[random % streets.length] + " " + Math.floor(Math.random() * 100);

// return {trackingNumber, itemsList, pkgsize, taxLevel, address, district}
// }


// module.exports = {
//     createRandomPackage
// };




var size = ["small", "medium", "large"]
var items = ["phone", "case", "headphones", "computer", "mouse", "keyboard",
    "rose berry", "banana", "milk", "avocado", "bread", "flour", "eggs"]
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

var dependencies = {
    "phone": { chance: 0.8, max: 2, items: ["case", "headphones"] },
    "headphones": { chance: 0.2, max: 1, items: ["computer", "phone"] },
    "computer": { chance: 0.9, max: 3, items: ["headphones", "case", "mouse", "microphone"] },
    "keyboard": { chance: 0.5, max: 1, items: ["mouse"] },
    "mouse": { chance: 0.5, max: 1, items: ["keyboard"] },
    "banana": { chance: 0.5, max: 1, items: ["rose berry"] },
    "rose berry": { chance: 0.66, max: 2, items: ["rose berry", "avocado"] },
    "eggs": { chance: 0.6, max: 1, items: ["milk", "flour"] },
    "flour": { chance: 0.6, max: 1, items: ["milk", "eggs"] }
}

var lastAdd = [
    { A: ["eggs", "flour"], B: "milk" },
    { A: ["computer", "keyboard"], B: "mouse" },
    { A: ["coumputer", "mouse"], B: "keyboard" }
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

module.exports = {
    createRandomPackage: createRandomPackage
}

function getRandomItem(arr) {
    var item_index = Math.floor(Math.random() * arr.length)
    return arr[item_index]
}

function addDependencies(item_set, item) {
    item_set.add(item)

    var dependency = dependencies[item];
    if (dependency != undefined) {
        var add = 0;
        while (add < dependency.max) {
            var chance = Math.random();
            if (chance < dependency.chance) {
                break;
            }
            item_set.add(getRandomItem(dependency.items))
            add += 1
        }
    }
}

function createRandomPackage(serialNumber) {
    this.serialNumber = serialNumber;
    this.size = getRandomItem(size)
    var itemNumber = sizeDep.calculateItems(this.size)

    this.items = new Set()
    for (let i = 0; i < itemNumber; i++) {
        //this.itemsList.add(getRandomItem(items))
        addDependencies(this.items, getRandomItem(items))
    }

    for (let i = 0; i < lastAdd.length; i++) {
        var A = lastAdd[i].A
        var B = lastAdd[i].B
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

    this.district = getRandomItem(districts)
    this.address = getRandomItem(cities[this.district]) + ", " + getRandomItem(address) + " " + Math.floor(Math.random() * 100)
}


