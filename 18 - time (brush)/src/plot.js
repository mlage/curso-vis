import * as d3 from 'd3';

let mapX = null

export async function loadChart(data, margens = { left: 50, right: 25, top: 25, bottom: 50 }) {
    const svg = d3.select('svg');

    if (!svg) {
        return;
    }

    const width  = +svg.node().getBoundingClientRect().width  - margens.left - margens.right;
    const height = +svg.node().getBoundingClientRect().height - margens.top  - margens.bottom;

    // ---- Escalas
    const filteredData = data.filter(d => (new Date(d.day)).getFullYear() === 2023).sort((a, b) => new Date(a.day) - new Date(b.day));

    console.log("Filtered Data:", filteredData);

    const distExtent = d3.extent(filteredData, function (d) { return d.day; });
    mapX = d3.scaleTime().domain(distExtent).range([0,  width]);

    const tipExtent = d3.extent(filteredData, d => Number(d.count) );
    const mapY = d3.scaleLinear().domain(tipExtent).range([height, 0]);

    // ---- Eixos
    const xAxis = d3.axisBottom(mapX);
    const groupX = svg.selectAll('#axisX').data([0]);

    groupX.join('g')
        .attr('id', 'axisX')
        .attr('class', 'x axis')
        .attr('transform', `translate(${margens.left}, ${+svg.node().getBoundingClientRect().height - margens.bottom})`)
        .call(xAxis);

    const yAxis = d3.axisLeft(mapY);
    const groupY = svg.selectAll('#axisY').data([0]);

    groupY.join('g')
        .attr('id', 'axisY')
        .attr('class', 'y axis')
        .attr('transform', `translate(${margens.left}, ${margens.top})`)
        .call(yAxis);


    // ---- Paths
    const selection = svg.selectAll('#group').data([0]);
    const cGroup = selection.join('g')
        .attr('id', 'group');

    const paths = cGroup.selectAll('path')
        .data([filteredData]);

    paths.join('path')
        .datum(d => d)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function (d) { return mapX( d.day ) })
            .y(function (d) { return mapY( Number(d.count) ) })
        )
    d3.select('#group')
        .attr('transform', `translate(${margens.left}, ${margens.top})`);

    // Add brushing
    const brush = d3.brushX()
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
    d3.select('#group')
        .selectAll('path')
        .remove();

    d3.select('#axisX')
        .selectAll('*')
        .remove();

    d3.select('#axisY')
        .selectAll('*')
        .remove();

    d3.select('#brushGroup').remove();
}

function brushed(event) {
    const selection = event.selection;

    if (selection !== null) {
        const start = mapX.invert(selection[0]);
        const end = mapX.invert(selection[1]);
        console.log("Brushed selection:", start, end);
    }
}