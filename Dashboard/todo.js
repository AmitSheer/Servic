// TODO: change the ui to new schema
// TODO: change data in Dashboard/arieldashboard2021withws/public/js/material-dashboard.js to load from my data read from file/database(redis)
// TODO: add websocket to receive data from server(link https://www.pubnub.com/blog/nodejs-websocket-programming-examples/
//                                                 or transmit json over websocket https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications )
//TODO: read from firebase the image and remove it from firebase
//TODO: connect to firebase -> read list of images -> for each image download -> delete image from firebase 
//      -> update ad-hoc data -> if updated data send updated data to ui -> move in redis from hot to cold 

const express = require('express')
const app = express();
const socketIO = require('socket.io');
const path = require('path');
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.get('/test', (req, res) => {

})

const server = express()
    .use(app)
    .listen(3001, () => console.log(`Listening Socket on http://localhost:3001`));

const io = socketIO(server);
setInterval(()=>{io.emit('newdata', '1')},1000)
