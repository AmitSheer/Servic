var socket = io.connect();
function setWs() {
    socket.on('newdata', function (msg) {
        // console.log(msg)
        for (const district in msg.byDistrict) {
            // console.log(district)
            updateSizeChart(district,msg.byDistrict[district].size)
            updateTaxChart(district,msg.byDistrict[district])
        }
    })
}