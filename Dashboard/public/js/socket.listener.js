var socket = io.connect();
var table
var dataset
socket.on('init',(data)=>{
    dataset = data.all
    table = $('#pkgTable').DataTable({
        data: dataset,
        columns:[
            {
                data: "serialNumber",
                title: 'Package Tracking Id'
            },
            {
                data:"size",
                title: 'Size'
            },
            {
                data:"items",
                title: 'Items'
            },
            {
                data:"district",
                title: 'District'
            },
            {
                data: "address",
                title: 'Address'
            },
            {
                data:"tax",
                title: 'Tax'
            }
        ],
        "scrollY": "50vh",
        "scrollX": "100%",
        "scrollCollapse": false,
        "paging": false,
    });
})

function setWs() {
    socket.on('newdata', function (msg) {
        for (const district in msg.byDistrict) {
            document.querySelector('.pkg-total[district="'+district+'"] .value').text = msg.byDistrict[district].total
            updateSizeChart(district, msg.byDistrict[district].size)
            updateTaxChart(district, msg.byDistrict[district])
        }
        dataset = msg.all
        table.clear()
        table.rows.add(dataset)
        table.draw(false)
    })
}