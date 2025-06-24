import * as d3 from 'd3';

let node = null;
let link = null;

export async function loadChart(nodes, links, margens = { left: 50, right: 25, top: 25, bottom: 50 }) {
    const svg = d3.select('svg');

    if (!svg) {
        return;
    }

    const width  = +svg.node().getBoundingClientRect().width  - margens.left - margens.right;
    const height = +svg.node().getBoundingClientRect().height - margens.top  - margens.bottom;

    const filteredLinks = links.filter(d => d.source < nodes.length && d.target < nodes.length && d.count > 0);
    console.log("Filtered Links:", filteredLinks);

    const countExtent = d3.extent(filteredLinks, function (d) { return d.count; });
    const mapStroke = d3.scaleLog().domain(countExtent).range([0, 1]);

    // Create a simulation with several forces.
    d3.forceSimulation(nodes)
        .force("link", d3.forceLink(filteredLinks).strength(d => d.count / 10000))
        .force("charge", d3.forceManyBody().distanceMax(200))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

    const selection = svg.selectAll('#group').data([0]);
    const cGroup = selection.join('g')
        .attr('id', 'group');

        // Add a line for each link, and a circle for each node.
    link = cGroup
        .selectAll()
        .data(filteredLinks)
        .join("line")
        .attr("stroke", "#999")
        .attr("stroke-opacity", d => mapStroke(d.count))
        .attr("stroke-width", d => 0.75 * mapStroke(d.count));

    node = cGroup
        .selectAll()
        .data(nodes)
        .join("circle")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .attr("fill", "dodgerblue")
        .attr("r", 5);

    node.append("title")
        .text(d => d.id);

    d3.select('#group')
        .attr('transform', `translate(${margens.left}, ${margens.top})`);
}

export function clearChart() {
    d3.select('#group')
        .selectAll('*')
        .remove();

    d3.select('#axisX')
        .selectAll('*')
        .remove();

    d3.select('#axisY')
        .selectAll('*')
        .remove();
}

  function ticked() {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  }