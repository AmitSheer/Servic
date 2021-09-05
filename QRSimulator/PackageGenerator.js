const { random } = require("faker");
var faker = require("faker");

faker.seed(10);

var random = Math.random()
var size = {0: "small", 1: "medium", 2: "large"}
var items = {0: "phone", 1: "case", 2: "headphones", 3: "computer", 4: "mouse", 5: "keyboard"}
var districts = {0: "North", 1: "South", 2: "Haifa", 3: "Jerusalem", 4: "TelAviv", 5: "Center"}


function createRandomPackage(serialNumber){
    this.trackingNuber = serialNumber;
    var itemNumber = (random % 3) + 1

    for (let i = 0; i < itemNumber; i++) {
        this.itemsList[i] = items[random % (items.size())] 
    }

    this.size =  size[random % 3],
    this.address = faker.address.cityName.findName(),
    this.district = districts[random % (districts.size())]
};


// Iteration
// This code runs twenty times
// It produces each time different data
for (i = 0; i < 20; i++) {

    var package = new createRandomPackage(i)

// לבדיקה שלנו
	console.log(package.trackingNuber); // Outputs a random name
	console.log(package.itemsList); // Outputs a random email
	console.log(package.size); // Outputs the random product name generated
	console.log(package.address); // Produces a random company name

    var secondsToWait = 1000;
    setTimeout(packageSender(package), secondsToWait*1000);
}

function packageSender(package){

}
