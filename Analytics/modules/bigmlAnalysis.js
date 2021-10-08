var bigml = require('bigml');
const ObjectsToCsv = require('objects-to-csv');

var controller = require('../controller');
var associationID;
// Sample data - two columns, three rows:

const name = 'dodgeviper1221'
const hash = '171c42c17dac6044bd998f7a9d8bfc788a86e924'

const UPDATED = -3
const ALREADY_UP_TO_DATE = -2
const ERROR = -1

var connection = new bigml.BigML(name, hash)

const { performance } = require('perf_hooks');
const { throws } = require('assert');
const csvName = "packages.csv"

class bigmlAssociation {
    constructor(csvName) {
        //this.connection = new bigml.BigML(name, hash)
        this.ItemTypes = -1
        this.numInstances = -1
        this.numItems = -1
        this.csvName = csvName
        this.associationID = undefined
        this.associationData = undefined
        this.next = undefined
        this.callbacks = []
        this.onupdate = false
    }

    subscribe(callback) {
        this.callbacks.push(callback)
    }

    update(callback) {
        var start = performance.now();
        var self = this;
        this.subscribe(callback)
        generate_item_csv(self.numInstances, self.csvName, function (response, instances, numItems, itemTypes) {
            if (response == ALREADY_UP_TO_DATE) {
                if (self.onupdate) {
                    return;
                }
                self.#notifyAll();
                //callback()
                return;
            }
            //self.callbacks.push(callback)
            self.onupdate = true
            self.numInstances = instances;
            self.numItems = numItems;
            self.ItemTypes = itemTypes;
            // console.log("end of csv" + (performance.now() - start));
            createAssociation(self.csvName, function (associationID) {
                self.associationID = associationID
                // console.log("end of bigml " + (performance.now() - start));
                getAssociationData(self.associationID, function (data) {
                    self.#organizeData(data, self.numItems)
                })
            })
        })
    }

    #organizeData(data, totalItems) {
        // var self = this
        var items = []
        var i = 0
        for (const property in data.items) {
            var obj = data.items[property]
            var item = {
                name: obj.name,
                count: obj.count,
                index: i
            }
            items.push(item)
            i++;
        }

        var rules = []
        for (const property in data.rules) {
            var obj = data.rules[property]
            var item = {
                iteml: getItems(obj.lhs, items),
                itemr: getItems(obj.rhs, items),
                confidence: obj.confidence,
                correlation: obj.leverage,
                support: obj.support[0],
                coverage: obj["lhs_cover"][0],
            }
            rules.push(item)
        }

        items = []
        //console.log(data.fields['00000'].summary);
        var ditems = data.fields['000000'].summary.items;
        for (let i = 0; i < ditems.length; i++) {
            const element = ditems[i];
            items.push({
                name: element[0],
                presence: element[1],
                relativePresence: element[1] / totalItems
            })
        }
        this.associationData = {
            items: items,
            rules: rules
        }
        //callback()
        this.#notifyAll();
    }

    #notifyAll() {
        console.log("was called");
        this.onupdate = false
        for (let i = 0; i < this.callbacks.length; i++) {
            this.callbacks[i]();
        }
        this.callbacks = []
    }
}

function getItems(itemIndexArr, itemsArr) {
    var itemNames = []
    for (let i = 0; i < itemIndexArr.length; i++) {
        const j = itemIndexArr[i]
        itemNames.push(itemsArr[j].name)
    }
    return itemNames
}

var add_param = function (str, add) {
    if (str.length > 0) {
        str += ";"
    }
    str += add;
    return str
}

function generate_item_csv(prevLength, fileName, callback) {
    var numItemTypes = new Set();
    var numItems = 0;
    var instances = -1;
    controller.monogoRead(function (data) {
        var itemsRow = []
        console.log(data.length + " " + prevLength);
        if (data.length == prevLength) {
            callback(ALREADY_UP_TO_DATE)
            return;
        }
        //console.log(data.length);
        for (let i = 0; i < data.length; i++) {
            var items = data[i].items;
            var row = ""
            for (let j = 0; j < items.length; j++) {
                row = add_param(row, items[j])
                numItemTypes.add(items[j])
                numItems += 1;
            }
            itemsRow.push({ products: row })
        }

        (async () => {
            const csv = new ObjectsToCsv(itemsRow);
            // Save to file:
            await csv.toDisk('./public/' + fileName);
            callback(UPDATED, data.length, numItems, numItemTypes)
        })();
        //res.send(items_only)
    })
}

function createAssociation(fileName, callback) {
    // console.log("Dummy : " + fileName);
    var source = new bigml.Source(connection);
    var start = performance.now();
    source.create('./public/' + fileName, {
        'description': "package items only",
        'item_analysis': {
            "separator": ";",
        },
    }, function (error, sourceInfo) {
        if (!error && sourceInfo) {
            //console.log(sourceInfo.resource);
            //console.log("create source " + (performance.now() - start));
            start = performance.now();
            source.update(sourceInfo,
                {
                    "fields": { "000000": { "optype": "items" } },
                }, function (error, sourceInfo) {
                    if (!error && sourceInfo) {
                        //console.log("update source " + (performance.now() - start));
                        start = performance.now();
                        var dataset = new bigml.Dataset(connection);
                        dataset.create(sourceInfo, function (error, datasetInfo) {
                            if (!error && datasetInfo) {
                                var association = new bigml.Association(connection);
                                association.create(datasetInfo, function (error, associationInfo) {
                                    // res.send(sourceInfo.resource + " <br><br>" + JSON.stringify(datasetInfo) +
                                    //     " <br><br>" + JSON.stringify(associationInfo))
                                    associationID = associationInfo.resource
                                    callback(associationID)
                                    //console.log("resource created " + (performance.now() - start));
                                });
                            }
                        });
                    }
                })

        }
    });
}

function getAssociationData(associationID, callback) {
    var associationGet = new bigml.Model(connection)
    console.log(associationID);
    associationGet.get(associationID, true,
        'only_model=true;limit=-1', function (error, association) {
            if (!error && association) {
                //console.log(JSON.stringify(association.object.associations));
                callback(association.object.associations)
            }
        })
}

var association = new bigmlAssociation(csvName)
association.update(function () {
    // initialized
})

function getAssociation(callback) {
    association.update(callback);
    return association;
}

module.exports = {
    getAssociation: getAssociation
}