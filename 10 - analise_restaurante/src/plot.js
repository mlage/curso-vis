import * as d3 from 'd3';

const selected = {
    '#chart01': [],
    '#chart02': []
};

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
const radiusScale = d3.scaleSqrt().range([3, 15]);

export async function loadChart(id, data, cols, labels, margins = { top: 30, right: 30, bottom: 50, left: 60 }) {
    const svg = d3.select(id);
    if (svg.empty()) return;

    svg.selectAll("*").remove();

    const width = +svg.node().getBoundingClientRect().width - margins.left - margins.right;
    const height = +svg.node().getBoundingClientRect().height - margins.top - margins.bottom;

    radiusScale.domain(d3.extent(data, d => d.numero_de_itens));
    colorScale.domain([...new Set(data.map(d => d.TipoCozinhaID))].sort((a,b) => a-b));
    
    const mapX = d3.scaleLinear()
        .domain(d3.extent(data, d => d[cols[0]])).nice()
        .range([0, width]);

    const mapY = d3.scaleLinear()
        .domain(d3.extent(data, d => d[cols[1]])).nice()
        .range([height, 0]);

    const tooltip = d3.select("#tooltip");

    const mouseover = (event, d) => {
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(
            `<strong>Pedido</strong><br>
             Valor Total: R$ ${d.valor_total_pedido.toFixed(2)}<br>
             Distância: ${d.distancia_entrega_km.toFixed(1)} km<br>
             Gorjeta: R$ ${d.gorjeta_entregador.toFixed(2)}<br>
             Itens: ${d.numero_de_itens}<br>
             Cozinha ID: ${d.TipoCozinhaID}`
        )
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 28) + "px");
        
        d3.select(event.currentTarget)
          .style("stroke", "black")
          .style("stroke-width", 2);
    };
    
    const mousemove = (event, d) => {
        tooltip
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 28) + "px");
    };

    const mouseleave = (event, d) => {
        tooltip.transition().duration(500).style("opacity", 0);
         d3.select(event.currentTarget)
           .style("stroke", "none"); 
    };

    const g = svg.append("g").attr("transform", `translate(${margins.left},${margins.top})`);
    
    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(mapX))
        .append("text")
        .attr("y", margins.bottom - 10)
        .attr("x", width / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text(labels.x);

    g.append("g")
        .call(d3.axisLeft(mapY))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margins.left + 15)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text(labels.y);

    const brush = d3.brush()
        .extent([[0, 0], [width, height]])
        .on("start brush end", event => brushed(event, id, g.selectAll("#circle-group circle")));

    g.append("g")
        .attr("class", "brush")
        .call(brush);
        
    const circles = g.append('g')
        .attr("id", "circle-group")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => mapX(d[cols[0]]))
        .attr("cy", d => mapY(d[cols[1]]))
        .attr("r", d => radiusScale(d.numero_de_itens))
        .style("fill", d => colorScale(d.TipoCozinhaID))
        .style("fill-opacity", 0.7)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
        
    drawLegend(colorScale);
}

function brushed(event, chartId, allCircles) {
    const selection = event.selection;
    
    if (selection === null) {
        selected[chartId] = [];
    } else {
        const [[x0, y0], [x1, y1]] = selection;
        const brushedData = allCircles
            .filter(function() {
                const cx = +d3.select(this).attr("cx");
                const cy = +d3.select(this).attr("cy");
                return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
            })
            .data();
        selected[chartId] = brushedData.map(d => d.RestauranteID + '_' + d.horario_pedido);
    }
    updateSelection();
}

function updateSelection() {
    const chart1Selected = new Set(selected['#chart01']);
    const chart2Selected = new Set(selected['#chart02']);
    const hasSelection = chart1Selected.size > 0 || chart2Selected.size > 0;

    d3.selectAll("#chart01 circle, #chart02 circle").style("fill", d => {
        const uniqueId = d.RestauranteID + '_' + d.horario_pedido;
        const inChart1 = chart1Selected.has(uniqueId);
        const inChart2 = chart2Selected.has(uniqueId);
        if (inChart1 && inChart2) return "#f1c40f";
        if (inChart1 || inChart2) return "#e74c3c";
        return colorScale(d.TipoCozinhaID);
    }).style("fill-opacity", d => {
        const uniqueId = d.RestauranteID + '_' + d.horario_pedido;
        if (hasSelection && !chart1Selected.has(uniqueId) && !chart2Selected.has(uniqueId)) {
            return 0.2;
        }
        return 0.7;
    });
}

function drawLegend(colorScale) {
    const legendSvg = d3.select("#legend");
    legendSvg.selectAll("*").remove(); 
    
    const domain = colorScale.domain();
    const legendItemSize = 20;
    const legendSpacing = 5;

    const legend = legendSvg.selectAll(".legend-item")
        .data(domain)
        .join("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(20, ${i * (legendItemSize + legendSpacing)})`);

    legend.append("rect")
        .attr("width", legendItemSize)
        .attr("height", legendItemSize)
        .style("fill", colorScale);

    legend.append("text")
        .attr("x", legendItemSize + legendSpacing)
        .attr("y", legendItemSize / 2)
        .attr("dy", "0.35em")
        .text(d => `Cozinha Tipo ${d}`);
}

export function clearAllCharts() {
    selected['#chart01'] = [];
    selected['#chart02'] = [];
    d3.select("#chart01").selectAll("*").remove();
    d3.select("#chart02").selectAll("*").remove();
    d3.select("#legend").selectAll("*").remove();
    updateSelection();
}