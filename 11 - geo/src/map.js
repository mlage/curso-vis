import * as d3 from 'd3';

export async function loadMap(geojson, margens = { left: 50, right: 25, top: 25, bottom: 60 }) {
    const svg = d3.select('svg');

    if (!svg) {
        console.log('SVG element not found');
        return;
    }

    let projection = d3.geoMercator();

    let path = d3.geoPath()
        .projection(projection);

    const selection = svg.selectAll('#group').data([0]);
    selection.selectAll('path')
        .data(geojson.features)
        .join('path')
        .attr('d', path);
}

export function clearMap() {
    d3.select('#group')
        .selectAll('circle')
        .remove();
}