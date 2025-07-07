import * as d3 from 'd3';

const scaleY = {};
const selections = new Map();

export async function loadChart(data, margens = { left: 50, right: 25, top: 50, bottom: 25 }) {
    const svg = d3.select('svg');

    if (!svg) {
        return;
    }

    const width = +svg.node().getBoundingClientRect().width - margens.left - margens.right;
    const height = +svg.node().getBoundingClientRect().height - margens.top - margens.bottom;

    const dimensions = Object.keys(data[0]).filter(function (d) { return d != "day" })
    console.log("Dimensions:", dimensions);

    for (const i in dimensions) {
        const name = dimensions[i]
        scaleY[name] = d3.scaleLinear()
            .domain(d3.extent(data, function (d) { return +d[name]; }))
            .range([height, 0])
    }

    // Build the X scale -> it find the best position for each Y axis
    const scaleX = d3.scalePoint()
        .range([0, width])
        .padding(1)
        .domain(dimensions);

    function path(data) {
        return d3.line()(dimensions.map(function (dim) { return [scaleX(dim), scaleY[dim](data[dim])]; }));
    }

    // ---- Paths
    const selection = svg.selectAll('#group').data([0]);
    const cGroup = selection.join('g')
        .attr('id', 'group');

    cGroup
        .selectAll(".tripPath")
        .data(data)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "tripPath")
        .style("fill", "none")
        .style("stroke", "#69b3a2")
        .style("opacity", 0.5)

    d3.select('#group')
        .attr('transform', `translate(${margens.left}, ${margens.top})`);

    svg.selectAll(".axisY")
        .data(dimensions)
        .enter()
        .append("g")
        .attr("class", "axisY")
        .attr('transform', function (d) { return `translate(${margens.left + scaleX(d)}, ${margens.top})`; })
        .each(function (d) { d3.select(this).call(d3.axisLeft().scale(scaleY[d])); })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function (d) { return d; })
        .style("fill", "black")

    // Add a brush to each Y axis
    svg.selectAll(".axisY")
        .each(function (key) {
            const brush = d3.brushY()
                .extent([
                    [-10, 0],
                    [10, height]
                ])
                .on("start brush end", function (event) { brushed(event, key); });

            d3.select(this).call(brush);
        });


}

export function clearChart() {
    d3.select('#group')
        .selectAll('.tripPath')
        .remove();

    d3.selectAll('.axisY')
        .remove();
}

function brushed(event, key) {
    const selection = event.selection;
    if (selection === null) {
        selections.delete(key);
    } else {
        // Invert the selection to data domain
        selections.set(key, selection.map(scaleY[key].invert));
    }

    const cGroup = d3.select('#group');

    cGroup.selectAll(".tripPath").each(function (d) {
        const tmp = Array.from(selections);

        const active = tmp.every(([k, [max, min]]) => {
            return d[k] >= min && d[k] <= max;
        });

        d3.select(this).style("stroke", active ? "#69b3a2" : "#ccc");
        if (active) {
            d3.select(this).raise();
            console.log("Active Path:", d);
        }
    });
}