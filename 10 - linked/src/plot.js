import * as d3 from 'd3';

const selected = {
    'chart01': [],
    'chart02': []
}

export async function loadChart(id, data, cols, margens = { left: 50, right: 25, top: 25, bottom: 30 }) {
    const svg = d3.select(id);

    if (!svg) {
        return;
    }

    const width = +svg.node().getBoundingClientRect().width - margens.left - margens.right;
    const height = +svg.node().getBoundingClientRect().height - margens.top - margens.bottom;

    // ---- Escalas
    const col0Extent = d3.extent(data, d => d[cols[0]]);
    const mapX = d3.scaleLinear().domain(col0Extent).range([0, width]);

    const col1Extent = d3.extent(data, d => d[cols[1]]);
    const mapY = d3.scaleLinear().domain(col1Extent).range([height, 0]);

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


    // ---- Círculos
    const selection = svg.selectAll('#group').data([0]);
    const cGroup = selection.join('g')
        .attr('id', 'group');

    const circles = cGroup.selectAll('circle')
        .data(data);

    circles.enter()
        .append('circle')
        .attr('cx', d => { console.log(d); return mapX(+d[cols[0]]); })
        .attr('cy', d => mapY(+d[cols[1]]))
        .attr('r', 6)
        .style('fill', 'lightgray');

    circles.exit()
        .remove();

    circles
        .attr('cx', d => mapX(+d[cols[0]]))
        .attr('cy', d => mapY(+d[cols[1]]))
        .attr('r', 6)
        .style('fill', 'lightgray');

    svg.select('#group')
        .attr('transform', `translate(${margens.left}, ${margens.top})`);

    const brush = d3.brush()
        .filter(event => (event.metaKey || event.target.__data__.type !== "overlay"))
        .extent([[0, 0], [width, height]])
        .on("start brush end", brushed(id));

    svg.select('#group')
        .append("g")
        .attr("class", "brush")
        .call(brush)
        .call(g => g.select(".overlay").style("cursor", "default"));
}

export function clearChart(id) {
    d3.select(id).select('#group')
        .selectAll('circle')
        .remove();

    d3.select(id).select('#axisX')
        .selectAll('*')
        .remove();

    d3.select(id).select('#axisY')
        .selectAll('*')
        .remove();
}

// Function that is triggered when brushing is performed
function brushed(chartId) {
    const sId = chartId.split('#')[1];

    return ({ selection }) => {
        if (selection !== null) {
            selected[sId] = [];

            d3.select(chartId)
                .selectAll("circle")
                .each(function (d, id) {
                    const cx = d3.select(this).attr("cx");
                    const cy = d3.select(this).attr("cy");

                    const isBrushed = selection[0][0] <= cx && selection[1][0] >= cx && selection[0][1] <= cy && selection[1][1] >= cy;
                    if (isBrushed) {
                        selected[sId].push(id);
                    }
                });

            d3.select("#chart01")
                .selectAll("circle")
                .style("fill", (d, id) => {
                    if (selected['chart01'].includes(id) && selected['chart02'].includes(id)) {
                        return "red";
                    } else if (selected['chart01'].includes(id)) {
                        return "blue";
                    }
                    else if (selected['chart02'].includes(id)) {
                        return "green";
                    }
                    else {
                        return "lightgray";
                    }
                });

            d3.select("#chart02")
                .selectAll("circle")
                .style("fill", (d, id) => {
                    if (selected['chart01'].includes(id) && selected['chart02'].includes(id)) {
                        return "red";
                    } else if (selected['chart01'].includes(id)) {
                        return "blue";
                    }
                    else if (selected['chart02'].includes(id)) {
                        return "green";
                    }
                    else {
                        return "lightgray";
                    }
                });
        }
    }
}