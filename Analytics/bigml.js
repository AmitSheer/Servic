var express = require('express')
var router = express.Router()

var fs = require('fs');
var path = require('path');
var parse = require('csv-parse');
var stringify = require('csv-stringify');
var bigml = require('bigml');
var packageGenerator = require('../QRSimulator/PackageGenerator')
const { route } = require('./home');
const ObjectsToCsv = require('objects-to-csv');

// Sample data - two columns, three rows:



var connection = new bigml.BigML('dodgeviper1221',
  '171c42c17dac6044bd998f7a9d8bfc788a86e924')

// middleware that is specific to this router
router.use(function (req, res, next) {
  //console.log('Time: ', Date.now())
  console.log("jopa");
  next()
})
// define the home page route
router.get('/', function (req, res) {
  res.send('this is the big ml home here we would print statistics')
})

var add_param = function (str, add) {
  console.log(str)
  if (str.length > 0) {
    str += ";"
  }
  str += add;
  console.log(str)
  return str
}

router.get('/dummy_load', function (req, res) {
  //console.log(connection);
  console.log("Dummy");
  var source = new bigml.Source(connection);
  source.create('./public/test.csv', {
    'description': "my assy ass3 ",
    'item_analysis': {
      "separator": ";",
    }
  }, function (error, sourceInfo) {
    if (!error && sourceInfo) {
      console.log(sourceInfo.resource);

      source.update(sourceInfo,
        {
          "description": "my assy ass updated",
          "fields": { "000001": { "optype": "items" } },
          'item_analysis': {
            "separator": ";",
          }
        }, function (error, sourceInfo) {
          if (!error && sourceInfo) {
            var dataset = new bigml.Dataset(connection);
            dataset.create(sourceInfo, function (error, datasetInfo) {
              if (!error && datasetInfo) {
                var association = new bigml.Association(connection);
                association.create(datasetInfo, function (error, associationInfo) {
                  res.send(sourceInfo.resource + " <br><br>" + JSON.stringify(datasetInfo) +
                    " <br><br>" + JSON.stringify(associationInfo))
                });
              }
            });
          }
        })


      // var dataset = new bigml.Dataset(connection);
      // dataset.create(sourceInfo,
      //   { name: 'testDataSet' }, true,
      //   function (error, datasetInfo) {
      //     if (!error && datasetInfo) {

      //       console.log(datasetInfo);
      //     }
      //   });

    }
  });
  //res.send("done")
})

router.get('/dummy_get', function (req, res) {
  var id = req.query.source
  //res.send(id)
  var source = new bigml.Source(connection);
  source.get(id, function (error, resource) {
    if (!error && resource) {
      //console.log(resource);
      res.send(JSON.stringify(resource))
      // var dataset = new bigml.Dataset(connection);
      // dataset.create(id,
      //   function (error, resource2) {
      //     if (!error && resource2) {
      //       console.log("The dataset has been completely created.")
      //       res.send(JSON.stringify(resource2))
      //     }
      //   })
    }
  })
  //res.send("kek")
});


router.get('/association_get', function (req, res) {
  var id = req.query.association
  //res.send(id)

  var association = new bigml.AssociationSet(connection)
  association.create(id, { "000001": ['yoyo', 'puti'] }
    , function (error, resource) {
      if (!error && resource) {
        //console.log(resource);
        association.get(resource, function (error, set2) {
          if (!error && set2) {
            res.send(JSON.stringify(set2))
          }
        })
        // var dataset = new bigml.Dataset(connection);
        // dataset.create(id,
        //   function (error, resource2) {
        //     if (!error && resource2) {
        //       console.log("The dataset has been completely created.")
        //       res.send(JSON.stringify(resource2))
        //     }
        //   })
      }
    })
  //res.send(JSON.stringify(association))
  // for (index = 0; index < associationRules.length; index++) {
  //   response += associationRules[index].describe() + " , ";
  // }
  //res.send(JSON.stringify(associationRules))
});

router.get('/dummy_csv', function (req, res) {
  const data = [];

  for (let index = 0; index < 100; index++) {
    row = "";
    if (index % 2 == 0) {
      if (index % 3 == 0) {
        row = add_param(row, "vala;kek")
        if (index % 5 == 0) {
          row = add_param(row, "banan")
        }
      } else {
        row = add_param(row, "yoyo;tutu")
      }

      if (index % 5 == 0) {
        row = add_param(row, "puti")
      }
    } else {
      if (index % 3 == 0) {
        row = add_param(row, "stysty")
        if (index % 5 == 0) {
          row = add_param(row, "puti")
        }
      } else {
        row = add_param(row, "tutu;yoyo")
      }
    }
    var item = { id: index, products: row };
    // for (let j = 0; j < row.length; j++) {
    //   item["item" + j] = row[j];
    //   //console.log(JSON.stringify(item) + " " + row + " " + row[j]);
    // }
    //console.log(row)
    data.push(item)
  }
  //console.log(JSON.stringify(data));

  // If you use "await", code must be inside an asynchronous function:
  (async () => {
    const csv = new ObjectsToCsv(data);

    // Save to file:
    await csv.toDisk('./public/test.csv');

    // Return the CSV file as string:
    //console.log(await csv.toString());
    res.send(await csv.toString());
  })();
})


router.get('/test', function (req, res) {
  var str = ""
  var packages = []
  for (i = 0; i < 10; i++) {
    var pack = new packageGenerator.createRandomPackage(i);
    packages.push(pack)

    if (i > 0) {
      str += "<br>"
    }
    str += JSON.stringify(pack)
    //var pack = new packageGenerator.
  }
  res.send(str)
})
// define the about route
router.get('/about', function (req, res) {
  res.send('About me, iam cool')
})

module.exports = router