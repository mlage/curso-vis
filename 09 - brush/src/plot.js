import * as d3 from 'd3';


export async function loadChart(data, margens = { left: 50, right: 25, top: 25, bottom: 60 }) {
    const svg = d3.select('svg');

    if (!svg) {
        return;
    }

    const width = parseInt(svg.node().getBoundingClientRect().width) - margens.left - margens.right;
    const height = parseInt(svg.node().getBoundingClientRect().height) - margens.top - margens.bottom;

    // ---- Escalas
    const distExtent = d3.extent(data, d => d.trip_distance);
    const mapX = d3.scaleLinear().domain(distExtent).range([0, width]);

    const tipExtent = d3.extent(data, d => d.tip_amount);
    const mapY = d3.scaleLinear().domain(tipExtent).range([height, 0]);

    // ---- Eixos
    const xAxis = d3.axisBottom(mapX);
    svg.selectAll('#axisX')
        .data([0])
        .join('g')
        .attr('id', 'axisX')
        .attr('class', 'x axis')
        .attr('transform', `translate(${margens.left}, ${+svg.node().getBoundingClientRect().height - margens.bottom})`)
        .call(xAxis);

    const yAxis = d3.axisLeft(mapY);
    svg.selectAll('#axisY')
        .data([0])
        .join('g')
        .attr('id', 'axisY')
        .attr('class', 'y axis')
        .attr('transform', `translate(${margens.left}, ${margens.top})`)
        .call(yAxis);


    // ---- Círculos
    const selection = svg.selectAll('#group').data([0]);
    const cGroup = selection.join('g')
        .attr('id', 'group');

    const circles = cGroup.selectAll('circle')
        .data(data);

    circles.enter()
        .append('circle')
        .attr('cx', d => mapX(d.trip_distance))
        .attr('cy', d => mapY(d.tip_amount))
        .attr('r', 6)
        .style('fill', 'gray');

    circles.exit()
        .remove();

    circles
        .attr('cx', d => mapX(d.trip_distance))
        .attr('cy', d => mapY(d.tip_amount))
        .attr('r', 6)
        .style('fill', 'gray');

    d3.select('#group')
        .attr('transform', `translate(${margens.left}, ${margens.top})`);

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
    d3.select('#group')
        .selectAll('circle')
        .remove();

    d3.select('#axisX')
        .selectAll('*')
        .remove();

    d3.select('#axisY')
        .selectAll('*')
        .remove();

    d3.select('#brushGroup').remove();
}

// Function that is triggered when brushing is performed
function brushed({ selection }) {
    if (selection !== null) {
        console.log("Brushing...", selection);

        d3.select("#group")
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