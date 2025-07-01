import * as d3 from 'd3';

export async function loadChart(data, margens = { left: 50, right: 25, top: 25, bottom: 60 }) {
    const svg = d3.select('svg');

    if (!svg) {
        return;
    }

    // ---- Tamanho do Gráfico
    const width  = +svg.node().getBoundingClientRect().width  - margens.left - margens.right;
    const height = +svg.node().getBoundingClientRect().height - margens.top  - margens.bottom;

    // ---- Escalas
    const distExtent = d3.extent(data, d => d[0]);
    const mapX = d3.scaleLinear().domain(distExtent).range([0, width]);

    const tipExtent = d3.extent(data, d => d[1]);
    const mapY = d3.scaleLinear().domain(tipExtent).range([height, 0]);


    // ---- Círculos
    const cGroup = svg.selectAll('#chartGroup')
        .data([0])
        .join('g')
        .attr('id', 'chartGroup')
        .attr('transform', `translate(${margens.left}, ${margens.top})`);

    const circles = cGroup.selectAll('circle')
        .data(data);

    circles.enter()
        .append('circle')
        .attr('cx', d => mapX(d[0]))
        .attr('cy', d => mapY(d[1]))
        .attr('r', 6)
        .style('fill', 'gray');

    circles.exit()
        .remove();

    circles
        .attr('cx', d => mapX(d[0]))
        .attr('cy', d => mapY(d[1]))
        .attr('r', 6)
        .style('fill', 'gray');

    // ---- Brush

    const brush = d3.brush()
        .filter(event => { console.log(event); return (event.metaKey || event.target.__data__.type !== "overlay") })
        .extent([[0, 0], [width, height]])
        .on("start brush end", brushed);

    cGroup.append("g")
        .attr("id", "brushGroup")
        .attr("class", "brush")
        .call(brush)
        .call(g => g.select(".overlay").style("cursor", "default"));
}

export function clearChart() {
    d3.select('#chartGroup')
        .selectAll('circle')
        .remove();

    d3.select('#brushGroup').remove();
}

function brushed(event) {
    const selection = event.selection;

    if (selection !== null) {
        d3.select("#chartGroup")
            .selectAll("circle")
            .each(function (d, id) {
                const cx = d3.select(this).attr("cx");
                const cy = d3.select(this).attr("cy");

                // Check if the circle is within the brushed area
                const isBrushed = selection[0][0] <= cx && selection[1][0] >= cx &&
                                  selection[0][1] <= cy && selection[1][1] >= cy;
                                  
                d3.select(this).style('fill', isBrushed ? 'blue' : 'gray');
            });
    }
}