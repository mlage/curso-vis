import * as d3 from 'd3';

async function loadData() {
    const data = await fetch('taxi.json');

    if (data) {
        const json = await data.json();
        return json;
    }
}

export async function loadChart(margens = { left: 80, right: 25, top: 25, bottom: 80 }) {
    const svg = d3.select('svg');

    if (!svg) {
        return;
    }

    const data = await loadData();
    console.log(data);

    const distExtent = d3.extent(data, d => 1000*d.trip_distance);
    const newW = svg.node().getBoundingClientRect().width - margens.left - margens.right;
    const mapX = d3.scaleLinear().domain(distExtent).range([0, newW]);

    const tipExtent = d3.extent(data, d => d.tip_amount);
    const newH = svg.node().getBoundingClientRect().height - margens.top - margens.bottom;
    const mapY = d3.scaleLinear().domain(tipExtent).range([newH, 0]);

    const paymentTypes = [...new Set(data.map(d => d.payment_type))];
    const color = d3.scaleOrdinal().domain(paymentTypes).range(d3.schemeTableau10);

    const selection = d3.select('#group')
        .selectAll('circle')
        .data(data);

    selection.enter()
        .append('circle')
        .attr('cx', d => mapX(1000*d.trip_distance))
        .attr('cy', d => mapY(d.tip_amount))
        .attr('r', 8)
        .attr('fill', d => color(d.payment_type));

    selection.exit()
        .remove();

    selection
        .attr('cx', d => mapX(1000*d.trip_distance))
        .attr('cy', d => mapY(d.tip_amount))
        .attr('r', 8)
        .attr('fill', d => color(d.payment_type));

    d3.select('#group')
        .attr('transform', `translate(${margens.left}, ${margens.top})`);

    // ---- Eixos

    const xAxis  = d3.axisBottom(mapX).tickFormat(d3.format(".2s"));
    const groupX = d3.select('#axisX');

    groupX
        .attr('class', 'x axis')
        .attr('transform', `translate(${margens.left}, ${svg.node().getBoundingClientRect().height - margens.bottom})`)
        .call(xAxis);

    const yAxis  = d3.axisLeft(mapY).tickFormat(d3.format(".3s"));
    const groupY = d3.select('#axisY');

    groupY
        .attr('class', 'y axis')
        .attr('transform', `translate(${margens.left}, ${margens.top})`)
        .call(yAxis);

    svg.append('text')
        .attr('class', 'label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -newH / 2)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .text('Gorjeta ($)');

    svg.append('text')
        .attr('class', 'label')
        .attr('x', newW / 2 + margens.left)
        .attr('y', svg.node().getBoundingClientRect().height - 30)
        .attr('text-anchor', 'middle')
        .text('Distância (milhas)');
}

export function clearChart() {
    d3.select('#group')
        .selectAll('circle')
        .remove();

    d3.select('#axisX')
        .selectAll('*')
        .remove();

    d3.select('#axisY')
        .selectAll('*')
        .remove();
    }