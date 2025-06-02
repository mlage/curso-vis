import * as d3 from 'd3';


const tooltip = d3.select('#tooltip');


export async function loadChart(data, margins = { left: 80, right: 30, top: 40, bottom: 80 }) {

    await loadWeekdayPatternChart(data, margins);
    await loadTipByHourChart(data, margins);
}


async function loadWeekdayPatternChart(data, margins) {
    const svg = d3.select('#scatterPlot');
    if (!svg.node()) return;

    const width = +svg.node().clientWidth - margins.left - margins.right;
    const height = +svg.node().clientHeight - margins.top - margins.bottom;


    const processedData = [];
    
    data.forEach(d => {
        const pickupDate = new Date(d.lpep_pickup_datetime);
        const hour = pickupDate.getHours();
        const dayOfWeek = pickupDate.getDay(); // 0 = domingo, 6 = sábado
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const dayType = isWeekend ? 'Fim de Semana' : 'Dia de Semana';
        
        processedData.push({
            hour: hour,
            dayType: dayType,
            isWeekend: isWeekend
        });
    });


    const hourlyData = [];
    for (let hour = 0; hour < 24; hour++) {
        const weekdayCount = processedData.filter(d => d.hour === hour && !d.isWeekend).length;
        const weekendCount = processedData.filter(d => d.hour === hour && d.isWeekend).length;
        
        hourlyData.push({
            hour: hour,
            weekday: weekdayCount,
            weekend: weekendCount
        });
    }


    const xScale = d3.scaleLinear()
        .domain([0, 23])
        .range([0, width]);

    const maxCount = d3.max(hourlyData, d => Math.max(d.weekday, d.weekend));
    const yScale = d3.scaleLinear()
        .domain([0, maxCount * 1.1])
        .range([height, 0]);


    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d => `${d}h`);
    
    const groupX = svg.selectAll('#scatter-axisX').data([0]);
    groupX.join('g')
        .attr('id', 'scatter-axisX')
        .attr('class', 'x axis')
        .attr('transform', `translate(${margins.left}, ${height + margins.top})`)
        .call(xAxis);


    svg.selectAll('.x-label').data([0]).join('text')
        .attr('class', 'x-label')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2 + margins.left)
        .attr('y', height + margins.top + 50)
        .text('Horário do Dia')
        .style('font-size', '14px')
        .style('fill', '#333');

    const yAxis = d3.axisLeft(yScale);
    const groupY = svg.selectAll('#scatter-axisY').data([0]);
    groupY.join('g')
        .attr('id', 'scatter-axisY')
        .attr('class', 'y axis')
        .attr('transform', `translate(${margins.left}, ${margins.top})`)
        .call(yAxis);


    svg.selectAll('.y-label').data([0]).join('text')
        .attr('class', 'y-label')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2 - margins.top)
        .attr('y', margins.left - 50)
        .text('Número de Corridas')
        .style('font-size', '14px')
        .style('fill', '#333');


    svg.selectAll('.chart-title').data([0]).join('text')
        .attr('class', 'chart-title')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2 + margins.left)
        .attr('y', margins.top - 10)
        .text('Padrão de Corridas: Dias de Semana vs Fim de Semana')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .style('fill', '#333');


    const selection = svg.selectAll('#scatter-group').data([0]);
    const cGroup = selection.join('g')
        .attr('id', 'scatter-group')
        .attr('transform', `translate(${margins.left}, ${margins.top})`);


    const weekdayLine = d3.line()
        .x(d => xScale(d.hour))
        .y(d => yScale(d.weekday));


    cGroup.selectAll('.weekday-line').data([hourlyData]).join('path')
        .attr('class', 'weekday-line')
        .attr('d', weekdayLine)
        .attr('fill', 'none')
        .attr('stroke', '#2E86AB')
        .attr('stroke-width', 3);


    const weekendLine = d3.line()
        .x(d => xScale(d.hour))
        .y(d => yScale(d.weekend));


    cGroup.selectAll('.weekend-line').data([hourlyData]).join('path')
        .attr('class', 'weekend-line')
        .attr('d', weekendLine)
        .attr('fill', 'none')
        .attr('stroke', '#A23B72')
        .attr('stroke-width', 3);


    cGroup.selectAll('.weekday-dot')
        .data(hourlyData)
        .join('circle')
        .attr('class', 'weekday-dot')
        .attr('cx', d => xScale(d.hour))
        .attr('cy', d => yScale(d.weekday))
        .attr('r', 4)
        .attr('fill', '#2E86AB')



    cGroup.selectAll('.weekend-dot')
        .data(hourlyData)
        .join('circle')
        .attr('class', 'weekend-dot')
        .attr('cx', d => xScale(d.hour))
        .attr('cy', d => yScale(d.weekend))
        .attr('r', 4)
        .attr('fill', '#A23B72')


    const legend = cGroup.selectAll('.legend').data([0]).join('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width - 200}, 20)`);


    legend.selectAll('.legend-weekday').data([0]).join('g')
        .attr('class', 'legend-weekday')
        .call(g => {
            g.selectAll('line').data([0]).join('line')
                .attr('x1', 0).attr('x2', 20)
                .attr('y1', 0).attr('y2', 0)
                .attr('stroke', '#2E86AB')
                .attr('stroke-width', 3);
            g.selectAll('text').data([0]).join('text')
                .attr('x', 25).attr('y', 5)
                .text('Dias de Semana')
                .style('font-size', '12px')
                .style('fill', '#333');
        });


    legend.selectAll('.legend-weekend').data([0]).join('g')
        .attr('class', 'legend-weekend')
        .attr('transform', 'translate(0, 20)')
        .call(g => {
            g.selectAll('line').data([0]).join('line')
                .attr('x1', 0).attr('x2', 20)
                .attr('y1', 0).attr('y2', 0)
                .attr('stroke', '#A23B72')
                .attr('stroke-width', 3);
            g.selectAll('text').data([0]).join('text')
                .attr('x', 25).attr('y', 5)
                .text('Fim de Semana')
                .style('font-size', '12px')
                .style('fill', '#333');
        });
}


async function loadTipByHourChart(data, margins) {
    const svg = d3.select('#barChart');
    if (!svg.node()) return;

    const width = +svg.node().clientWidth - margins.left - margins.right;
    const height = +svg.node().clientHeight - margins.top - margins.bottom;


    const hourlyTips = [];
    
    for (let hour = 0; hour < 24; hour++) {
        const hourData = data.filter(d => {
            const pickupDate = new Date(d.lpep_pickup_datetime);
            return pickupDate.getHours() === hour && d.tip_amount >= 0 && d.tip_amount <= 50;
        });
        
        if (hourData.length > 0) {
            const avgTip = d3.mean(hourData, d => d.tip_amount);
            const count = hourData.length;
            
            hourlyTips.push({
                hour: hour,
                avgTip: avgTip || 0,
                count: count,
                formattedHour: `${hour}h`
            });
        }
    }


    const xScale = d3.scaleBand()
        .domain(hourlyTips.map(d => d.formattedHour))
        .range([0, width])
        .padding(0.1);

    const maxTip = d3.max(hourlyTips, d => d.avgTip) * 1.1;
    const yScale = d3.scaleLinear()
        .domain([0, maxTip])
        .range([height, 0]);


    const colorScale = d3.scaleSequential(d3.interpolateViridis)
        .domain([0, d3.max(hourlyTips, d => d.avgTip)]);


    const xAxis = d3.axisBottom(xScale);
    const groupX = svg.selectAll('#bar-axisX').data([0]);
    groupX.join('g')
        .attr('id', 'bar-axisX')
        .attr('class', 'x axis')
        .attr('transform', `translate(${margins.left}, ${height + margins.top})`)
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "middle");


    svg.selectAll('.x-label-bar').data([0]).join('text')
        .attr('class', 'x-label-bar')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2 + margins.left)
        .attr('y', height + margins.top + 60)
        .text('Horário do Dia')
        .style('font-size', '14px')
        .style('fill', '#333');

    const yAxis = d3.axisLeft(yScale).tickFormat(d => `$${d.toFixed(1)}`);
    const groupY = svg.selectAll('#bar-axisY').data([0]);
    groupY.join('g')
        .attr('id', 'bar-axisY')
        .attr('class', 'y axis')
        .attr('transform', `translate(${margins.left}, ${margins.top})`)
        .call(yAxis);

    svg.selectAll('.y-label-bar').data([0]).join('text')
        .attr('class', 'y-label-bar')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2 - margins.top)
        .attr('y', margins.left - 50)
        .text('Valor Médio da Gorjeta ($)')
        .style('font-size', '14px')
        .style('fill', '#333');


    svg.selectAll('.chart-title-bar').data([0]).join('text')
        .attr('class', 'chart-title-bar')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2 + margins.left)
        .attr('y', margins.top - 10)
        .text('Relação entre Valor da Gorjeta e Horário das Corridas')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .style('fill', '#333');


    const selection = svg.selectAll('#bar-group').data([0]);
    const bGroup = selection.join('g')
        .attr('id', 'bar-group')
        .attr('transform', `translate(${margins.left}, ${margins.top})`);


    bGroup.selectAll('.bar')
        .data(hourlyTips)
        .join('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.formattedHour))
        .attr('y', d => yScale(d.avgTip))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - yScale(d.avgTip))
        .attr('fill', d => colorScale(d.avgTip))
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)


}


export function clearChart() {

    d3.select('#scatter-group').selectAll('*').remove();
    d3.select('#scatter-axisX').selectAll('*').remove();
    d3.select('#scatter-axisY').selectAll('*').remove();
    

    d3.select('#bar-group').selectAll('*').remove();
    d3.select('#bar-axisX').selectAll('*').remove();
    d3.select('#bar-axisY').selectAll('*').remove();
    

    d3.selectAll('.x-label, .y-label, .x-label-bar, .y-label-bar, .chart-title, .chart-title-bar').remove();
}