var express = require('express');
const { route } = require('./home');
var router = express.Router()

var controller = require('../controller');
const Library = require('bigml/lib/Library');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    //console.log('Time: ', Date.now())
    next()
})
// define the home page route
router.get('/', function (req, res) {
    var li = controller.createBigmlInterface()
    li.init(function (result) {
        var data = {
            num_records: li.numInstances,
            products_count: li.numItems,
            product_type_count: li.ItemTypes.size,
            rules: li.associationData.rules,
        }
        console.log(li.associationID);
        console.log(li.associationData)
        res.render('pages/dashboard', data)
    })
})
// define the about route
router.get('/about', function (req, res) {
    res.send('About me, iam cool')
})

module.exports = router