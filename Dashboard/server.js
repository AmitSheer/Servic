const express = require('express')
const app = express();
const socketIO = require('socket.io');
require('./js/redisSub')
const dbUpdater = require('./js/redisDataUpdater')
const socketManager = require('./js/socketUpdater')
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const $ = require('jquery')
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 10);
});
let data = {
  cards: {}
  ,
  all:[],
  byDistrict: {}
}
app.use(connectLiveReload())

app.use(express.static('public'))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render("pages/dashboard", data)
})


const server = express()
  .use(app)
  .listen(3001, () => console.log(`Listening Socket on http://localhost:3000`));

const io = socketIO(server)
io.on('connection', (socket) => {
  io.to(socket.id).emit('init',data)
});


setInterval(()=>{socketManager.updateData(io,data)},1000)
setInterval(()=>dbUpdater.updateRedis(),5000)