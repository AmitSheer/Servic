const express = require('express')
const app = express();
const socketIO = require('socket.io');

app.use(express.static('public'))

const server = express()
  .use(app)
  .listen(3000, () => console.log(`Listening Socket on 3000`));

  app.get('/data', (req, res) => {
    io.emit('newdata',{data:"hello"})
  })


