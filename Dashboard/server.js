const express = require('express')
const app = express();
const socketIO = require('socket.io');
const dbUpdater = require('./js/dataSyncher')
const socketManager = require('./js/socketUpdater')

let data = {
  cards: {}
  ,
  all:[],
  byDistrict: {}
}
// app.use(connectLiveReload())

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
  io.emit('init',data)
});


setInterval(()=>{socketManager.updateData(io,data)},1000)
