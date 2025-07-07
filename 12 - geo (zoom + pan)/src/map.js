import * as d3 from 'd3';

export async function loadMap(geojson, margens = { left: 5, right: 5, top: 5, bottom: 5 }) {
    const svg = d3.select('svg');

    if (!svg) {
        console.log('SVG element not found');
        return;
    }

    // ---- Tamanho do Gráfico
    const width = +svg.node().getBoundingClientRect().width - margens.left - margens.right;
    const height = +svg.node().getBoundingClientRect().height - margens.top - margens.bottom;

    let projection = d3.geoMercator().
        fitExtent([[0, 0], [width, height]], geojson);

    let pathBuilder = d3.geoPath()
        .projection(projection);

    const mGroup = svg.selectAll('#group')
        .data([''])
        .join('g')
        .attr('id', 'group')
        .attr('transform', `translate(${margens.left}, ${margens.top})`);

    mGroup.selectAll('path')
        .data(geojson.features)
        .join('path')
        .attr('d', pathBuilder)
        .style('fill', 'lightgray')
        .style('stroke', 'black');

    // ---- Zoom e Pan
    const zoom = d3.zoom()
        .scaleExtent([1, 10])
        .on('zoom', handleZoom);
    svg.call(zoom);
}

export function clearMap() {
    d3.select('#group')
        .selectAll('path')
        .remove();
}

function handleZoom(event) {
    const transform = event.transform;
    console.log(event);

    d3.select('#group')
        .selectAll('path')
        .attr('transform', transform);
}
