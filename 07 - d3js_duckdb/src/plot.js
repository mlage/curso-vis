import * as d3 from 'd3';

// Tooltip para exibir detalhes ao passar o mouse
const tooltip = d3.select('#tooltip');

// Função para carregar os gráficos
export async function loadChart(data, margins = { left: 60, right: 30, top: 30, bottom: 60 }) {
    // Carregar ambos os gráficos
    await loadScatterPlot(data, margins);
    await loadBarChart(data, margins);
}

// Função para carregar o gráfico de dispersão
async function loadScatterPlot(data, margins) {
    const svg = d3.select('#scatterPlot');
    if (!svg.node()) return;

    const width = +svg.node().clientWidth - margins.left - margins.right;
    const height = +svg.node().clientHeight - margins.top - margins.bottom;

    // --- Escalas
    const distExtent = d3.extent(data, d => d.trip_distance);
    const mapX = d3.scaleLinear()
        .domain([0, distExtent[1] * 1.1]) // Adicionar 10% de espaço
        .range([0, width]);

    const tipExtent = d3.extent(data, d => d.tip_amount);
    const mapY = d3.scaleLinear()
        .domain([0, tipExtent[1] * 1.1]) // Adicionar 10% de espaço
        .range([height, 0]);

    // --- Eixos
    const xAxis = d3.axisBottom(mapX).ticks(7);
    const groupX = svg.selectAll('#scatter-axisX').data([0]);

    groupX.join('g')
        .attr('id', 'scatter-axisX')
        .attr('class', 'x axis')
        .attr('transform', `translate(${margins.left}, ${height + margins.top})`)
        .call(xAxis);

    // Rótulo do eixo X
    svg.selectAll('.x-label').data([0]).join('text')
        .attr('class', 'x-label')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2 + margins.left)
        .attr('y', height + margins.top + 40)
        .text('Distância da Viagem (milhas)')
        .style('font-size', '12px')
        .style('fill', '#555');

    const yAxis = d3.axisLeft(mapY).ticks(7);
    const groupY = svg.selectAll('#scatter-axisY').data([0]);

    groupY.join('g')
        .attr('id', 'scatter-axisY')
        .attr('class', 'y axis')
        .attr('transform', `translate(${margins.left}, ${margins.top})`)
        .call(yAxis);

    // Rótulo do eixo Y
    svg.selectAll('.y-label').data([0]).join('text')
        .attr('class', 'y-label')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2 - margins.top)
        .attr('y', margins.left - 40)
        .text('Valor da Gorjeta ($)')
        .style('font-size', '12px')
        .style('fill', '#555');

    // --- Gráfico de dispersão
    const selection = svg.selectAll('#scatter-group').data([0]);
    const cGroup = selection.join('g')
        .attr('id', 'scatter-group')
        .attr('transform', `translate(${margins.left}, ${margins.top})`);

    // Adicionar linha de tendência
    if (data.length > 1) {
        const regressionData = data.map(d => [d.trip_distance, d.tip_amount]);
        const regression = linearRegression(regressionData);
        
        const x1 = 0;
        const y1 = regression.intercept;
        const x2 = distExtent[1];
        const y2 = regression.intercept + regression.slope * distExtent[1];
        
        cGroup.selectAll('.regression-line').data([0]).join('line')
            .attr('class', 'regression-line')
            .attr('x1', mapX(x1))
            .attr('y1', mapY(y1))
            .attr('x2', mapX(x2))
            .attr('y2', mapY(y2))
            .attr('stroke', '#e74c3c')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5')
            .attr('opacity', 0.7);
    }

    // Adicionar círculos
    cGroup.selectAll('.dot')
        .data(data)
        .join('circle')
        .attr('class', 'dot')
        .attr('cx', d => mapX(d.trip_distance))
        .attr('cy', d => mapY(d.tip_amount))
        .attr('r', 5)
        .on('mouseover', function(event, d) {
            d3.select(this)
                .attr('r', 7)
                .style('fill', '#e74c3c');
                
            tooltip.style('opacity', 1)
                .html(`<strong>Distância:</strong> ${d.trip_distance.toFixed(2)} milhas<br>
                       <strong>Gorjeta:</strong> $${d.tip_amount.toFixed(2)}`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this)
                .attr('r', 5)
                .style('fill', '#27ae60');
                
            tooltip.style('opacity', 0);
        });
}

// Função para carregar o gráfico de barras
async function loadBarChart(data, margins) {
    const svg = d3.select('#barChart');
    if (!svg.node()) return;

    const width = +svg.node().clientWidth - margins.left - margins.right;
    const height = +svg.node().clientHeight - margins.top - margins.bottom;

    // Processamento dos dados para o gráfico de barras
    // Agrupar por faixas de distância
    const distanceBins = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
    const binLabels = distanceBins.slice(0, -1).map((d, i) => `${d}-${distanceBins[i+1]}`);
    
    // Calcular média de gorjeta por faixa de distância
    const binData = binLabels.map((label, i) => {
        const min = distanceBins[i];
        const max = distanceBins[i+1];
        const filteredData = data.filter(d => d.trip_distance >= min && d.trip_distance < max);
        
        if (filteredData.length === 0) return { 
            bin: label, 
            avgTip: 0, 
            count: 0,
            minDist: min,
            maxDist: max
        };
        
        const avgTip = d3.mean(filteredData, d => d.tip_amount);
        return { 
            bin: label, 
            avgTip: avgTip || 0, 
            count: filteredData.length,
            minDist: min,
            maxDist: max
        };
    }).filter(d => d.count > 0); // Remove faixas sem dados

    // --- Escalas
    const xScale = d3.scaleBand()
        .domain(binData.map(d => d.bin))
        .range([0, width])
        .padding(0.2);

    const tipMax = d3.max(binData, d => d.avgTip) * 1.1;
    const yScale = d3.scaleLinear()
        .domain([0, tipMax])
        .range([height, 0]);

    // --- Eixos
    const xAxis = d3.axisBottom(xScale);
    const groupX = svg.selectAll('#bar-axisX').data([0]);

    groupX.join('g')
        .attr('id', 'bar-axisX')
        .attr('class', 'x axis')
        .attr('transform', `translate(${margins.left}, ${height + margins.top})`)
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    // Rótulo do eixo X
    svg.selectAll('.x-label-bar').data([0]).join('text')
        .attr('class', 'x-label-bar')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2 + margins.left)
        .attr('y', height + margins.top + 50)
        .text('Faixa de Distância (milhas)')
        .style('font-size', '12px')
        .style('fill', '#555');

    const yAxis = d3.axisLeft(yScale).ticks(7);
    const groupY = svg.selectAll('#bar-axisY').data([0]);

    groupY.join('g')
        .attr('id', 'bar-axisY')
        .attr('class', 'y axis')
        .attr('transform', `translate(${margins.left}, ${margins.top})`)
        .call(yAxis);

    // Rótulo do eixo Y
    svg.selectAll('.y-label-bar').data([0]).join('text')
        .attr('class', 'y-label-bar')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2 - margins.top)
        .attr('y', margins.left - 40)
        .text('Média de Gorjeta ($)')
        .style('font-size', '12px')
        .style('fill', '#555');

    // --- Gráfico de barras
    const selection = svg.selectAll('#bar-group').data([0]);
    const bGroup = selection.join('g')
        .attr('id', 'bar-group')
        .attr('transform', `translate(${margins.left}, ${margins.top})`);

    // Adicionar barras
    bGroup.selectAll('.bar')
        .data(binData)
        .join('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.bin))
        .attr('y', d => yScale(d.avgTip))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - yScale(d.avgTip))
        .on('mouseover', function(event, d) {
            d3.select(this)
                .style('fill', '#2c3e50');
                
            tooltip.style('opacity', 1)
                .html(`<strong>Faixa:</strong> ${d.minDist}-${d.maxDist} milhas<br>
                       <strong>Média Gorjeta:</strong> $${d.avgTip.toFixed(2)}<br>
                       <strong>Quantidade:</strong> ${d.count} viagens`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this)
                .style('fill', '#3498db');
                
            tooltip.style('opacity', 0);
        });

    // Adicionar valores acima das barras
    bGroup.selectAll('.bar-value')
        .data(binData)
        .join('text')
        .attr('class', 'bar-value')
        .attr('x', d => xScale(d.bin) + xScale.bandwidth() / 2)
        .attr('y', d => yScale(d.avgTip) - 5)
        .attr('text-anchor', 'middle')
        .text(d => `$${d.avgTip.toFixed(1)}`)
        .style('font-size', '10px')
        .style('fill', '#555');
}

// Função para limpar os gráficos
export function clearChart() {
    // Limpar gráfico de dispersão
    d3.select('#scatter-group').selectAll('*').remove();
    d3.select('#scatter-axisX').selectAll('*').remove();
    d3.select('#scatter-axisY').selectAll('*').remove();
    
    // Limpar gráfico de barras
    d3.select('#bar-group').selectAll('*').remove();
    d3.select('#bar-axisX').selectAll('*').remove();
    d3.select('#bar-axisY').selectAll('*').remove();
    
    // Limpar legendas
    d3.selectAll('.x-label, .y-label, .x-label-bar, .y-label-bar').remove();
}

// Função auxiliar para calcular regressão linear
function linearRegression(data) {
    const n = data.length;
    
    // Calcular médias
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
    for (let i = 0; i < n; i++) {
        sumX += data[i][0];
        sumY += data[i][1];
        sumXY += data[i][0] * data[i][1];
        sumX2 += data[i][0] * data[i][0];
    }
    
    const xMean = sumX / n;
    const yMean = sumY / n;
    
    // Calcular coeficientes
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = yMean - slope * xMean;
    
    return { slope, intercept };
}