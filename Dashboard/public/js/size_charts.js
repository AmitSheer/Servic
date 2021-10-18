var size_data = {
    default:{
        labels: [
            'Big',
            'Small',
            'Medium'
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
var size_config = {
    default: {
        type: 'pie',
        data: size_data.default,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Size Chart',
                }
            }
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
    size_charts[district].data.datasets[0].data = data
    size_charts[district].update()
}

/**
 * create a new chart for the district
 * @param district
 * @param data
 */
function addSizeChart(district, data){
    let chartId = 'SizeChart_'+district
    size_data[district] = size_data.default
    size_data[district].datasets[0].data = data
    size_config[district] =size_config.default
    size_config[district].data = size_data[district]
    size_charts[district] = new Chart(
        document.getElementById(chartId),
        size_config[district]
    )
}