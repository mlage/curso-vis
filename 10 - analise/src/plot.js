import * as d3 from 'd3';

const margins = { top: 30, right: 30, bottom: 50, left: 60 };

// Escalas de cores que serão usadas pelos gráficos e legendas
export const statusColors = d3.scaleOrdinal()
    .domain(["Dropout", "Graduate", "Enrolled"])
    .range(["#dc3545", "#28a745", "#ffc107"]);

export const scholarshipColors = d3.scaleOrdinal()
    .domain([0, 1]) // 0: Não Bolsista, 1: Bolsista
    .range(['#6c757d', '#17a2b8']);


// --- FUNÇÃO DE LEGENDA (Refatorada para desenhar dentro do SVG) ---
function createLegend(svg, colorScale, title, textMap = null) {
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${margins.left}, 0)`);

    const legendItems = legend.selectAll(".legend-item")
        .data(colorScale.domain())
        .join("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(${i * 110}, 10)`);

    legendItems.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", d => colorScale(d));
    
    legendItems.append("text")
        .attr("x", 18)
        .attr("y", 10)
        .text(d => textMap ? textMap[d] : d)
        .style("font-size", "12px")
        .style("fill", "#333");
}


// --- GRÁFICO 1: DONUT CHART (Sem legenda agora) ---
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

    createLegend(svg, statusColors, "Status do Aluno", targetMap);
}


// --- GRÁFICO 2: NOVO GRÁFICO DE DENSIDADE (Substituindo o Box Plot) ---
export function createDensityPlot(svgId, data, targetMap) {
    const svg = d3.select(svgId);
    svg.selectAll("*").remove();

    const width = svg.node().getBoundingClientRect().width - margins.left - margins.right;
    const height = svg.node().getBoundingClientRect().height - margins.top - margins.bottom;
    const g = svg.append("g").attr("transform", `translate(${margins.left},${margins.top})`);
    
    const x = d3.scaleLinear()
      .domain([0, 20])
      .range([0, width]);
    g.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x));

    const y = d3.scaleLinear()
      .range([height, 0]);
    const yAxis = g.append("g");

    // Função para calcular a densidade (Kernel Density Estimation)
    function kernelDensityEstimator(kernel, X) {
        return function(V) {
            return X.map(x => [x, d3.mean(V, v => kernel(x - v))]);
        };
    }
    function kernelEpanechnikov(k) {
        return function(v) {
            return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
        };
    }
    const kde = kernelDensityEstimator(kernelEpanechnikov(1), x.ticks(60));
    
    // Calcula as densidades para cada grupo de status
    const densities = [];
    statusColors.domain().forEach(group => {
        const groupData = data.filter(d => d.target === group);
        if (groupData.length > 0) {
            const density = kde(groupData.map(d => d.Curricular_units_1st_sem__grade_));
            densities.push({key: group, density: density});
        }
    });

    // Encontra o valor máximo de densidade para ajustar o eixo Y
    const maxDensity = d3.max(densities, d => d3.max(d.density, item => item[1]));
    y.domain([0, maxDensity]).nice();
    yAxis.call(d3.axisLeft(y).ticks(5));

    // Desenha as linhas de densidade
    g.selectAll(".density-line")
      .data(densities)
      .join("path")
        .attr("class", "density-line")
        .datum(d => d.density)
        .attr("fill", "none")
        .attr("stroke", (d, i) => statusColors(densities[i].key))
        .attr("stroke-width", 2.5)
        .attr("stroke-linejoin", "round")
        .attr("d", d3.line().curve(d3.curveBasis).x(d => x(d[0])).y(d => y(d[1])));
        
    // Adiciona a legenda ao gráfico
    createLegend(svg, statusColors, "Status do Aluno", targetMap);
}


// --- GRÁFICO 3: BARRAS COM TOOLTIP E LEGENDA ---
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
        .attr("class", "bar")
        .on("mouseover", (event, d) => {
            const percentage = d[1] - d[0];
            const scholarshipStatus = scholarshipMap[event.target.parentElement.__data__.key];
            tooltip.style("opacity", 1).html(`${scholarshipStatus}:<br>${d3.format(".1%")(percentage)}`);
        })
        .on("mousemove", event => tooltip.style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 28) + "px"))
        .on("mouseleave", () => tooltip.style("opacity", 0));
        
    // Adiciona a legenda
    createLegend(svg, scholarshipColors, "", scholarshipMap);
}


// --- GRÁFICO 4: SCATTER PLOT (Corrigido) ---
export function createScatterPlot(svgId, data, targetMap) {
    const svg = d3.select(svgId);
    svg.selectAll("*").remove();
    
    const width = svg.node().getBoundingClientRect().width - margins.left - margins.right;
    const height = svg.node().getBoundingClientRect().height - margins.top - margins.bottom;
    const g = svg.append("g").attr("transform", `translate(${margins.left},${margins.top})`);

    // CORREÇÃO: Usando a chave correta com DOIS underscores
    const x = d3.scaleLinear().domain(d3.extent(data, d => d.Previous_qualification__grade_)).nice().range([0, width]);
    const y = d3.scaleLinear().domain(d3.extent(data, d => d.Admission_grade)).nice().range([height, 0]);
    
    g.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x));
    g.append("g").call(d3.axisLeft(y));

    const tooltip = d3.select("#tooltip");

    g.selectAll("circle").data(data).join("circle")
        .attr("cx", d => x(d.Previous_qualification__grade_)) // CORREÇÃO AQUI
        .attr("cy", d => y(d.Admission_grade))
        .attr("r", 4)
        .attr("fill", d => statusColors(d.target))
        .style("opacity", 0.6)
        .on("mouseover", (event, d) => {
            tooltip.style("opacity", 1).html(`Status: ${targetMap[d.target]}<br>Nota Admissão: ${d.Admission_grade}<br>Nota Anterior: ${d.Previous_qualification__grade_}`); // CORREÇÃO AQUI
        })
        .on("mousemove", event => tooltip.style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 28) + "px"))
        .on("mouseleave", () => tooltip.style("opacity", 0));
        
    // Adiciona a legenda
    createLegend(svg, statusColors, "", targetMap);
}