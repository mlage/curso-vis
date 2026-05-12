import * as d3 from 'd3';


export async function loadChart(data, margens = { left: 50, right: 25, top: 25, bottom: 50 }) {
    const svg = d3.select('svg');

    if (!svg) {
        return;
    }

    // ---- Escalas
    const dayExtent = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']; 
    const mapX = d3.scalePoint().domain(dayExtent).range([0, +svg.style("width").split("px")[0] - margens.left - margens.right]);

    const series = new Array(6);
    const filteredData = data.filter(d => (Number(d.month) <= 6) );

    filteredData.forEach(d => {
        const month = Number(d.month) - 1;
        if (!series[month]) {
            series[month] = [];
        }
        series[month].push({ day: Number(d.day), count: Number(d.count) });
    });

    console.log(series);

    const countExtent = d3.extent(filteredData, d => Number(d.count) );
    const mapY = d3.scaleLinear().domain(countExtent).range([+svg.style("height").split("px")[0] - margens.bottom - margens.top, 0]);

    const cExtent = [0, 1, 2, 3, 4, 5];
    const mapC = d3.scaleOrdinal(d3.schemeTableau10).domain(cExtent);

    // ---- Eixos
    const xAxis = d3.axisBottom(mapX);
    const groupX = svg.selectAll('#axisX').data([0]);

    groupX.join('g')
        .attr('id', 'axisX')
        .attr('class', 'x axis')
        .attr('transform', `translate(${margens.left}, ${+svg.style('height').split('px')[0] - margens.bottom})`)
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
        .data(series);

    paths.join('path')
        .attr("fill", "none")
        .attr("stroke", (d, id) => mapC(id))
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(function (d) { return mapX( dayExtent[d.day] ) })
            .y(function (d) { return mapY( d.count) })
        )
    d3.select('#group')
        .attr('transform', `translate(${margens.left}, ${margens.top})`);
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
}