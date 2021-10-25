var socket = io.connect();
var tables = {}
var dataset ={}
socket.on('init',(data)=>{
    for (const byDistrictElement of Object.entries(data.cards)) {

        dataset[byDistrictElement[0]] = byDistrictElement[1].all
        if ( $.fn.dataTable.isDataTable( '#pkgTable_'+byDistrictElement[0]) ) {
            updateTable(byDistrictElement,byDistrictElement[1])
        }
        else {
            tables[byDistrictElement[0]] = $('#pkgTable_'+byDistrictElement[0]).DataTable({
                data: dataset[byDistrictElement[0]],
                columns:[
                    {
                        data: "serialNumber",
                        title: 'Package Id'
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
                        data: "address",
                        title: 'Address'
                    },
                    {
                        data:"taxLevel",
                        title: 'Tax'
                    }
                ],
                "scrollY": "50vh",
                "scrollX": "100%",
                "scrollCollapse": false,
                "paging": false,
            });
        }

    }

})
function setWs(){

    socket.on('newdata', function (msg) {
        for (const district in msg.cards) {
            updateTable(district,msg)
        }
    })
}


function updateTable(district,data){
    if(data.byDistrict[district]!=undefined){
        document.querySelector('.pkg-total [district="'+district+'"] .value').innerHTML = data.byDistrict[district]['total'] ? data.byDistrict[district].total : 0
        updateSizeChart(district, data.byDistrict[district].size)
        updateTaxChart(district, data.byDistrict[district])
        dataset[district] = data.byDistrict[district].all
    }else{
        document.querySelector('.pkg-total [district="'+district+'"] .value').innerHTML = 0
        updateSizeChart(district, {size:{}})
        updateTaxChart(district, {tax:{}})
        dataset[district] = {}
    }
    if(tables[district]!=undefined){
        tables[district].clear()
        tables[district].rows.add(dataset[district])
        tables[district].draw(false)
    }
}

function hideGraphs(district){
    $(document).ready(($)=>{
        if(!$('[district="'+district+'"]').hasClass('active')){
            $('[district="'+district+'"]').addClass('active')
            let statusCards = $('.graphsbox')
            for (let i = 0; i < statusCards.length; i++) {
                if(statusCards[i].id!==district){
                    $('[district="'+statusCards[i].id+'"]').removeClass('active')
                    if($(statusCards[i]).hasClass('show')){
                        $('#'+statusCards[i].id).collapse('toggle')
                    }
                }
            }
        }else{
            $('[district="'+district+'"]').removeClass('active')
        }
    })
}