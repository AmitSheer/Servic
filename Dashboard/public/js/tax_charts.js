var tax_data = {
    default:{
        labels: [
            'vat',
            'shipment',
            'All'
        ],
        datasets: [{
            data: [300, 50, 100],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
        }]
    }
};
var tax_config = {
    default: {
        type: 'pie',
        data: tax_data.default,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Tax Chart'
                }
            }
        }
    }
};
var tax_charts = {
};

/**
 * will update the data viewed in chart
 * @param district the district to update the chart of
 * @param data the updated data
 */
function updateTaxChart(district, data){
    if(tax_charts[district]!=undefined){
        parseTaxData(district,data)
        tax_charts[district].update()
    }else{
        addTaxChart(district,data)
    }
}

function parseTaxData(district,data){
    let parseData = [0,0,0]
    if(data.large!=undefined){
        parseData[0] = data.large
    }
    if(data.medium!=undefined){
        parseData[1] = data.medium
    }
    if(data.small!=undefined){
        parseData[2] = data.small
    }
    tax_data[district].datasets[0].data = parseData
}
/**
 * create a new chart for the district
 * @param district
 * @param data
 */
function addTaxChart(district, data){
    if(tax_charts[district]==undefined) {
        let chartId = 'TaxChart_' + district
        tax_data[district] = tax_data.default
        parseTaxData(district,data)
        // tax_data[district].datasets[0].data = data
        tax_config[district] = tax_config.default
        tax_config[district].data = tax_data[district]
        tax_charts[district] = new Chart(
            document.getElementById(chartId),
            tax_config[district]
        )
    }
}