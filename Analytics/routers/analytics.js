var express = require('express');
var router = express.Router()

var controller = require('../controller');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    //console.log('Time: ', Date.now())
    next()
})
// define the home page route
router.get('/', function (req, res) {
    var li = controller.getAssociation(
        function (result) {
            var data = {
                num_records: li.numInstances,
                products_count: li.numItems,
                product_type_count: li.ItemTypes.size,
                rules: li.associationData.rules,
                items: { items: li.associationData.items }
            }
            //console.log(data.items);
            // console.log(li.associationID);
            // console.log(li.associationData)
            res.render('pages/dashboard', data)
        })
})
// define the about route
router.get('/about', function (req, res) {
    res.send('About me, iam cool')
})

module.exports = router