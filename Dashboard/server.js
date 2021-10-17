const express = require('express')
const app = express();
const socketIO = require('socket.io');
const redisSub = require('./redisManager')
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");
const { render } = require('ejs');
const liveReloadServer = livereload.createServer();
var socket_list = []
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 10);
});
let data = {
  cards: [
    {districtId:"haifa", title: "חיפה", value: 500, unit: "חבילות", fotterIcon: "", fotterText: "נפח ממוצע", icon: "content_copy", index:1, isShow: 'show'},
    {districtId:"dan", title: "דן", value: 1500, unit: "חבילות", fotterIcon: "", fotterText: "נפח ממוצע", icon: "store", index:2 ,isShow: ''},
    {districtId:"central", title: "מרכז", value: 3500, unit: "חבילות", fotterIcon: "", fotterText: "נפח ממוצע", icon: "info_outline" , index:3, isShow: '' },
    {districtId:"south", title: "דרום", value: 700, unit: "חבילות", fotterIcon: "", fotterText: "נפח ממוצע", icon: "add_shopping_cart" , index:4,isShow: '' }
  ]
}

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
  socket_list.push(socket)
  // socket.on('newdata', (msg) => {
  //   console.log(msg);
  //   io.emit('newdata', msg);
  // });
});
//-----------

