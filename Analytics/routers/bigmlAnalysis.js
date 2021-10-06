var bigml = require('bigml');
const ObjectsToCsv = require('objects-to-csv');

var controller = require('../controller');
var associationID;
var fs = require('fs');

// Sample data - two columns, three rows:

const name = 'dodgeviper1221'
const hash = '171c42c17dac6044bd998f7a9d8bfc788a86e924'

var connection = new bigml.BigML(name, hash)

const { performance } = require('perf_hooks');
const { throws } = require('assert');

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
    }

    init(callback) {
        var start = performance.now();
        var self = this;
        generate_item_csv(self.csvName, function (instances, numItems, itemTypes) {
            self.numInstances = instances;
            self.numItems = numItems;
            self.ItemTypes = itemTypes;
            // console.log("end of csv" + (performance.now() - start));
            createAssociation(self.csvName, function (associationID) {
                self.associationID = associationID
                // console.log("end of bigml " + (performance.now() - start));
                getAssociationData(self.associationID, function (data) {
                    self.#organizeData(data, callback)
                })
            })
        })
    }

    #organizeData(data, callback) {
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
        this.associationData = {
            items: items,
            rules: rules
        }
        callback()
    }

    #copy(prev) {
        Object.assign(this, prev)
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

function generate_item_csv(fileName, callback) {
    var numItemTypes = new Set();
    var numItems = 0;
    var instances = -1;
    controller.monogoRead(function (data) {
        var itemsRow = []
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
            instances = data.length;
            callback(instances, numItems, numItemTypes)
        })();
        //res.send(items_only)
    })
}

function createAssociation(fileName, callback) {
    console.log("Dummy : " + fileName);
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


module.exports = {
    bigmlAssociation: bigmlAssociation
}