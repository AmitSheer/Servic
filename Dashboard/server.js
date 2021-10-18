const express = require('express')
const app = express();
const socketIO = require('socket.io');
require('./js/redisSub')
const socketManager = require('./js/socketUpdater')
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");
const { render } = require('ejs');
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 10);
});
let data = {
  cards: [
  ]
}

// let data = {
//   cards:[]
// }

const port=3000;
app.use(connectLiveReload())

app.use(express.static('public'))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render("pages/dashboard", data)
})

app.get('/update', (req, res) => {
  // data.cards.push({districtId:"test", title: "צהוב קצין", value: 90000, unit: "חבילות", fotterIcon: "", fotterText: "נפח ממוצע", icon: "add_shopping_cart" })
  // page.render("pages/dashboard", data);
  io.emit('newdata',"oga boga")
  res.send(page);
})

app.get('/setData/:districtId/:value', function (req, res) {
  io.emit('newdata',{districtId:req.params.districtId,value:req.params.value})
  res.send(req.params.value)
})


const server = express()
  .use(app)
  .listen(3000, () => console.log(`Listening Socket on http://localhost:3000`));

const io = socketIO(server);

//------------
io.on('connection', (socket) => {
  console.log("new connection")
  // socket.on('newdata', (msg) => {
  //   console.log(msg);
  //   io.emit('newdata', msg);
  // });
});
//-----------
async function updateData(){
  socketManager.update(io).then(res=>{
    console.log(res)
    data = {
      cards: []
    }
    for (const byDistrictElement in res.byDistrict) {
      data.cards.push({districtId:byDistrictElement, title: byDistrictElement, value: res.byDistrict[byDistrictElement].total, unit: "חבילות", fotterIcon: "", fotterText: "נפח ממוצע", icon: "add_shopping_cart" , index:4,isShow: '' })
    }
  })
}
updateData(io)

// setInterval(updateData,500)