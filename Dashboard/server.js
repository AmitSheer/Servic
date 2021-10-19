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
  ],
  all:[],
  byDistrict: {}
}

const port=3000;
app.use(connectLiveReload())

app.use(express.static('public'))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render("pages/dashboard", data)
})


const server = express()
  .use(app)
  .listen(3000, () => console.log(`Listening Socket on http://localhost:3000`));

const io = socketIO(server);

//------------
io.on('connection', (socket) => {
  console.log(data.byDistrict)
  io.to(socket.id).emit('init',data.byDistrict)
});
//-----------
async function updateData(){
  socketManager.update(io).then(res=>{
    io.emit('newdata',res)
    // console.log(res)
    data = res
    data.all = res.all
    data.cards = []
    for (const byDistrictElement in res.byDistrict) {
      data.cards.push({districtId:byDistrictElement, title: byDistrictElement, value: res.byDistrict[byDistrictElement].total, unit: "חבילות", fotterIcon: "", fotterText: "נפח ממוצע", icon: "add_shopping_cart" , index:4,isShow: '' })
    }
  })
}
updateData()

setInterval(updateData,5000)