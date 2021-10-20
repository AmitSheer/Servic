var size_data = {
    default:{
        labels: [
            'Large',
            'Medium',
            'Small'
        ],
        datasets: [{
            label: 'Package Size',
            data: [300, 50, 100],
            backgroundColor: [
                'rgb(113,50,252)',
                'rgb(211,54,235)',
                '#ab47bc'
            ],
            hoverOffset: 4
        }]
    }
};
var size_config = {
    default: {
        type: 'pie',
        data: size_data.default,
        options: {
            legend: {
                labels: {
                    fontColor: "blue",
                    fontSize: 18
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Size Chart',
                }
            },
            animation: false,
        }
    }
};
var size_charts = {
};

/**
 * will update the data viewed in chart
 * @param district the district to update the chart of
 * @param data the updated data
 */
function updateSizeChart(district, data){
    if(size_charts[district]!=undefined){
        parseSizeData(district,data)
        size_charts[district].update()
    }else{
        addSizeChart(district,data)
    }
}

function parseSizeData(district,data){
    let parseData = [0,0,0]
    if(data['large']!=undefined){
        parseData[0] = data['large']
    }
    if(data['medium']!=undefined){
        parseData[1] = data['medium']
    }
    if(data['small']!=undefined){
        parseData[2] = data['small']
    }
    size_data[district].datasets[0].data = parseData
}

/**
 * create a new chart for the district
 * @param district
 * @param data
 */
function addSizeChart(district, data){
    if(tax_charts[district]==undefined) {
        let chartId = 'SizeChart_'+district
        size_data[district] = size_data.default
        parseSizeData(district,data)
        // size_data[district].datasets[0].data = data
        size_config[district] =size_config.default
        size_config[district].data = size_data[district]
        size_charts[district] = new Chart(
            document.getElementById(chartId),
            size_config[district]
        )
    }
}
