import * as d3 from 'd3';

const margins = { top: 60, right: 30, bottom: 50, left: 60 };

export const statusColors = d3.scaleOrdinal()
    .domain(["Dropout", "Graduate", "Enrolled"])
    .range(["#dc3545", "#28a745", "#ffc107"]);

export const scholarshipColors = d3.scaleOrdinal()
    .domain([0, 1])
    .range(['#6c757d', '#17a2b8']);

function createColorLegend(svg, colorScale, textMap = null) {
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${margins.left}, 0)`); 

    const legendItems = legend.selectAll(".legend-item")
        .data(colorScale.domain())
        .join("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(${i * 110}, 10)`);

    legendItems.append("rect")
        .attr("x", 0).attr("y", 0).attr("width", 12).attr("height", 12)
        .attr("fill", d => colorScale(d));
    
    legendItems.append("text")
        .attr("x", 18).attr("y", 10)
        .text(d => textMap ? textMap[d] : d)
        .style("font-size", "12px").style("fill", "#333");
}

function createLineStyleLegend(svg, width) {
    const legend = svg.append("g")
        .attr("class", "legend-linestyle")
        .attr("transform", `translate(${margins.left}, 30)`); // Posição Y = 30 (mais abaixo)

    legend.append("line").attr("x1", 0).attr("x2", 20).attr("y1", 10).attr("y2", 10).attr("stroke", "black").attr("stroke-width", 2);
    legend.append("text").attr("x", 25).attr("y", 10).attr("alignment-baseline", "middle").text("1º Semestre").style("font-size", "12px");

    legend.append("line").attr("x1", 110).attr("x2", 130).attr("y1", 10).attr("y2", 10).attr("stroke", "black").attr("stroke-width", 2).style("stroke-dasharray", "3,3");
    legend.append("text").attr("x", 135).attr("y", 10).attr("alignment-baseline", "middle").text("2º Semestre").style("font-size", "12px");
}

//GRAFICO 1
export function createDonutChart(svgId, data, onSliceClick, selectedTarget, targetMap) {
    const svg = d3.select(svgId);
    svg.selectAll("*").remove();

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;
    const radius = Math.min(width, height) / 3;

    const g = svg.append("g").attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie().value(d => d.value).sort(null);
    const arc = d3.arc().innerRadius(radius * 0.6).outerRadius(radius);
    
    const data_ready = d3.rollups(data, v => v.length, d => d.target)
        .map(([key, value]) => ({ key, value }));

    g.selectAll('path')
        .data(pie(data_ready))
        .join('path')
        .attr('d', arc)
        .attr('fill', d => statusColors(d.data.key))
        .attr('stroke', 'white')
        .style('stroke-width', '2px')
        .style('cursor', 'pointer')
        .style('opacity', d => !selectedTarget || d.data.key === selectedTarget ? 1 : 0.5)
        .on('click', (event, d) => onSliceClick(d.data.key));
    
    g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .text(selectedTarget ? targetMap[selectedTarget] : "Todos Alunos")
        .style("font-size", "1.2em")
        .style("font-weight", "bold");

    createColorLegend(svg, statusColors, targetMap);
}

//GRAFICO 2
export function createComparativeDensityPlot(svgId, data, targetMap) {
    const svg = d3.select(svgId);
    svg.selectAll("*").remove();

    const width = svg.node().getBoundingClientRect().width - margins.left - margins.right;
    const height = svg.node().getBoundingClientRect().height - margins.top - margins.bottom;
    const g = svg.append("g").attr("transform", `translate(${margins.left},${margins.top})`);
    
    const x = d3.scaleLinear().domain([0, 20]).range([0, width]);
    g.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x));

    const y = d3.scaleLinear().range([height, 0]);
    const yAxis = g.append("g");
    
    const tooltip = d3.select("#tooltip");

    function kernelDensityEstimator(kernel, X) {
        return V => X.map(x => [x, d3.mean(V, v => kernel(x - v))]);
    }
    function kernelEpanechnikov(k) {
        return v => Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    }
    const kde = kernelDensityEstimator(kernelEpanechnikov(1.5), x.ticks(80));
    
    const allDensities = [];
    statusColors.domain().forEach(group => {
        const groupData = data.filter(d => d.target === group);
        if (groupData.length > 0) {
            const density1 = kde(groupData.map(d => d.Curricular_units_1st_sem__grade_));
            allDensities.push({key: group, semester: 1, density: density1});
            const density2 = kde(groupData.map(d => d.Curricular_units_2nd_sem__grade_));
            allDensities.push({key: group, semester: 2, density: density2});
        }
    });

    const maxDensity = d3.max(allDensities, d => d3.max(d.density, item => item[1]));
    y.domain([0, maxDensity]).nice();
    yAxis.call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".2f")));

    g.selectAll(".density-line")
      .data(allDensities)
      .join("path")
        .attr("class", "density-line")
        .attr("d", d => d3.line().curve(d3.curveBasis).x(p => x(p[0])).y(p => y(p[1]))(d.density))
        .attr("fill", "none")
        .attr("stroke", d => statusColors(d.key))
        .attr("stroke-width", 2.5)
        .attr("stroke-linejoin", "round")
        .style("stroke-dasharray", d => d.semester === 2 ? "3,3" : "none")
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke-width", 4);
            tooltip.style("opacity", 1)
                   .html(`${targetMap[d.key]} - ${d.semester}º Semestre`);
        })
        .on("mousemove", event => tooltip.style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 28) + "px"))
        .on("mouseleave", function() {
            d3.select(this).attr("stroke-width", 2.5);
            tooltip.style("opacity", 0);
        });
        
    createColorLegend(svg, statusColors, targetMap);
    createLineStyleLegend(svg, width);
}

//GRAFICO 3
export function createGroupedBarChart(svgId, data, scholarshipMap, targetMap) {
    const svg = d3.select(svgId);
    svg.selectAll("*").remove();

    const width = svg.node().getBoundingClientRect().width - margins.left - margins.right;
    const height = svg.node().getBoundingClientRect().height - margins.top - margins.bottom;
    const g = svg.append("g").attr("transform", `translate(${margins.left},${margins.top})`);
    
    const tooltip = d3.select("#tooltip");
    
    const counts = d3.rollup(data, v => v.length, d => d.target, d => d.Scholarship_holder);
    const totals = d3.rollup(data, v => v.length, d => d.target);
    
    let data_ready = [];
    counts.forEach((value, key) => {
        data_ready.push({ target: key, scholarship: 0, percentage: (value.get(0) || 0) / totals.get(key) });
        data_ready.push({ target: key, scholarship: 1, percentage: (value.get(1) || 0) / totals.get(key) });
    });
    
    const subgroups = [0, 1];
    const groups = ["Dropout", "Graduate", "Enrolled"];

    const x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
    const y = d3.scaleLinear().domain([0, 1]).range([height, 0]);
    
    g.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x).tickFormat(d => targetMap[d]));
    g.append("g").call(d3.axisLeft(y).tickFormat(d3.format(".0%")));

    const stackedData = d3.stack().keys(subgroups)(
        groups.map(grp => {
            let obj = { group: grp };
            subgroups.forEach(sub => {
                const item = data_ready.find(d => d.target === grp && d.scholarship === sub);
                obj[sub] = item ? item.percentage : 0;
            });
            return obj;
        })
    );

    g.append("g").selectAll("g")
        .data(stackedData).enter().append("g")
        .attr("fill", d => scholarshipColors(d.key))
        .selectAll("rect")
        .data(d => d).enter().append("rect")
        .attr("x", d => x(d.data.group))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
        .on("mouseover", (event, d) => {
            const percentage = d[1] - d[0];
            const scholarshipStatus = scholarshipMap[event.target.parentElement.__data__.key];
            tooltip.style("opacity", 1).html(`${scholarshipStatus}:<br>${d3.format(".1%")(percentage)}`);
        })
        .on("mousemove", event => tooltip.style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 28) + "px"))
        .on("mouseleave", () => tooltip.style("opacity", 0));
        
    createColorLegend(svg, scholarshipColors, scholarshipMap);
}

//GRAFICO 4
export function createScatterPlot(svgId, data, targetMap) {
    const svg = d3.select(svgId);
    svg.selectAll("*").remove();
    
    const width = svg.node().getBoundingClientRect().width - margins.left - margins.right;
    const height = svg.node().getBoundingClientRect().height - margins.top - margins.bottom;
    const g = svg.append("g").attr("transform", `translate(${margins.left},${margins.top})`);

    const x = d3.scaleLinear().domain(d3.extent(data, d => d.Previous_qualification__grade_)).nice().range([0, width]);
    const y = d3.scaleLinear().domain(d3.extent(data, d => d.Admission_grade)).nice().range([height, 0]);
    
    g.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x));
    g.append("g").call(d3.axisLeft(y));

    const tooltip = d3.select("#tooltip");

    g.selectAll("circle").data(data).join("circle")
        .attr("cx", d => x(d.Previous_qualification__grade_))
        .attr("cy", d => y(d.Admission_grade))
        .attr("r", 4)
        .attr("fill", d => statusColors(d.target))
        .style("opacity", 0.6)
        .on("mouseover", (event, d) => {
            tooltip.style("opacity", 1).html(`Status: ${targetMap[d.target]}<br>Nota Admissão: ${d.Admission_grade}<br>Nota Anterior: ${d.Previous_qualification__grade_}`);
        })
        .on("mousemove", event => tooltip.style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 28) + "px"))
        .on("mouseleave", () => tooltip.style("opacity", 0));
        
    createColorLegend(svg, statusColors, targetMap);
}