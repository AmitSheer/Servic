const express = require('express')
const app = express()
const port = 3000


var home = require("./home")
var mongo = require("./mongo")

app.set('view engine', 'ejs')

app.use('/', home)
app.use('/mongo', mongo)

app.use(express.static('public'))

// app.get('/', (req, res) => {
//     var data = { size: 6 };
//     res.render('pages/table', data)
// })

app.get('/getTable', function (req, res) {
    //var data = { size: parseInt(req.query.mSize) };
    //res.render('pages/table', data)
});

app.get('/getTable2', function (req, res) {
    var size = parseInt(req.query.mSize);
    var table = "<table>"
    for (var i = 1; i < size + 1; i++) {
        table += "<tr>"
        for (var j = 1; j < size + 1; j++) {
            table += "<td>" + i * j + "</td>"
        }
        table += "</tr>"
    }
    table += "</table>"


    res.send(table)
})


// const { MongoClient } = require('mongodb');
// const uri = "mongodb+srv://michael:the12345@cluster0.12wcz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const db = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// db.connect(err => {
//     var dbo = db.db("kek");
//     dbo.collection("test").find({}).toArray(function (err, result) {
//         if (err) throw err;
//         console.log(result);
//         db.close();
//     });
// });


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})