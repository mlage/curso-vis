import * as d3 from 'd3';

async function loadData() {
    const data = await fetch('taxi.json');

    if (data) {
        const json = await data.json();
        return json;
    }
}

export async function loadChart(margens = { left: 25, right: 25, top: 25, bottom: 25 }) {
    const svg = d3.select('svg');

    if (!svg) {
        return;
    }

    const data = await loadData();
    console.log(data);

    const distExtent = d3.extent(data, d => d.trip_distance);
    const mapX = d3.scaleLinear().domain(distExtent).range([0, +svg.style("width").split("px")[0] - margens.left - margens.right]);

    const tipExtent = d3.extent(data, d => d.tip_amount);
    const mapY = d3.scaleLinear().domain(tipExtent).range([+svg.style("height").split("px")[0] - margens.bottom - margens.top, 0]);

    const selection = d3.select('#group')
        .selectAll('circle')
        .data(data);

    selection.enter()
        .append('circle')
        .attr('cx', d => mapX(d.trip_distance))
        .attr('cy', d => mapY(d.tip_amount))
        .attr('r', 8);

    selection.exit()
        .remove();

    selection
        .attr('cx', d => mapX(d.trip_distance))
        .attr('cy', d => mapY(d.tip_amount))
        .attr('r', 8);

    d3.select('#group')
        .attr('transform', `translate(${margens.left}, ${margens.top})`);
}

export function clearChart() {
    d3.select('#group')
        .selectAll('circle')
        .remove();
}