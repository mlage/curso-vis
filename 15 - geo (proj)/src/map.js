import * as d3 from 'd3';
import { Taxi } from "./taxi";

const taxi = new Taxi();

export async function initTaxi() {
    console.log('Initializing Taxi...');
    await taxi.init();
    await taxi.loadTaxi();
    
    console.log('Taxi initialized');
}

export async function getRegions() {
    console.log('Loading GeoJSON...');
    await taxi.loadGeojson();
    console.log('GeoJSON loaded');

    const sql = `
        SELECT ST_AsGeoJSON(geom) AS geojson
        FROM taxi_zones;
    `;

    const data = await taxi.query(sql);
    return data.map(d => JSON.parse(d.geojson));
}

export async function loadMap(geojson, margens = { left: 5, right: 5, top: 5, bottom: 5 }) {
    const svg = d3.select('svg');

    if (!svg) {
        console.log('SVG element not found');
        return;
    }

    // ---- Tamanho do Gráfico
    const width = +svg.node().getBoundingClientRect().width - margens.left - margens.right;
    const height = +svg.node().getBoundingClientRect().height - margens.top - margens.bottom;

    // Color Scale
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, 10]);

    let projection = d3.geoMercator().
        fitExtent([[0, 0], [width, height]], geojson);

    let path = d3.geoPath()
        .projection(projection);

    const mGroup = svg.selectAll('#group')
        .data([0])
        .join('g')
        .attr('id', 'group')
        .attr('transform', `translate(${margens.left}, ${margens.top})`);

    mGroup.selectAll('path')
        .data(geojson.features)
        .join('path')
        .attr('d', path)
        .style('fill', colorScale(0))
        .style('stroke', 'black')
        .on('click', handleClick);

    // ---- Zoom e Pan
    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', handleZoom);

    svg.call(zoom);
}

export function clearMap() {
    d3.select('#group')
        .selectAll('path')
        .remove();
}

function handleZoom({ transform }) {
    d3.select('#group')
        .selectAll('path')
        .attr('transform', transform);
}

async function queryTaxiData(origin) {
    const sql = `
        SELECT DOLocationID, COUNT(*) AS count
        FROM
            taxi_2023
        WHERE
            PULocationID = '${origin}'
        GROUP BY
            DOLocationID
    `;

    return await taxi.query(sql);
}

function handleClick(event) {
    if (event.metaKey && event.target.tagName === 'path') {
        const pathData = d3.select(this).datum();

        queryTaxiData(pathData.properties.objectid).then(data => {

            // Query data
            const intData = data.map(d => ({
                DOLocationID: Number(d.DOLocationID),
                count: Number(d.count)
            }));

            // Color Scale
            const domainExtent = d3.extent(intData, d => d.count);
            const colorScale = d3.scaleSequential(d3.interpolateBlues)
                .domain(domainExtent);

            // Update Colors
            d3.selectAll('#group path')
                .style('fill', d => {
                    const id = Number(d.properties.objectid);
                    const count = intData.find(item => item.DOLocationID === id)?.count || 0;

                    return colorScale(count);
                }
            );

            // Highlight Selection
            d3.select(this)
                .style('fill', 'yellow');
        });
    }
}