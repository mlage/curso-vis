class Canais {
  constructor(config) {
    this.config = config;

    this.svg = null;
    this.margins = null;

    this.xScale = null;
    this.yScale = null;

    this.circles = []

    this.createSvg();
    this.createMargins();
  }

  createSvg() {
    this.svg = d3.select(this.config.div)
      .append("svg")
      .attr('x', 10)
      .attr('y', 10)
      .attr('width', this.config.width + this.config.left)
      .attr('height', this.config.height + this.config.top);
  }

  createMargins() {
    this.margins = this.svg
      .append('g')
      .attr("transform", `translate(${this.config.left},${this.config.top})`)
  }

  async loadCSV(file) {
    this.circles = await d3.csv(file, d => {
      return {
        cx: +d.Sales,
        cy: +d.Profit,
        cl: d.Discount,
        r: 4
      }
    });

    this.circles = this.circles.slice(0, 1000);
  }

  createScales() {
    let xExtent = d3.extent(this.circles, d => {
      return d.cx;
    });
    let yExtent = d3.extent(this.circles, d => {
      return d.cy;
    });
    let cExtent = d3.extent(this.circles, d => {
      return d.cl;
    });

    this.xScale = d3.scaleLinear().domain(xExtent).nice().range([0, this.config.width]);
    this.yScale = d3.scaleLinear().domain(yExtent).nice().range([this.config.height, 0]);
    this.cScale = d3.scaleSequential(d3.interpolateOrRd).domain(cExtent);
  }

  renderCircles() {
    this.margins.selectAll('circle')
      .data(this.circles)
      .join('circle')
      .attr('cx', d => this.xScale(d.cx))
      .attr('cy', d => this.yScale(d.cy))
      .attr('r' , d => d.r)
      .attr('fill', d => this.cScale(d.cl));
  }
}


async function main() {
  let c = {div: '#main', width: 800, height: 600, top: 30, left: 30, bottom: 30, right: 30};
  
  let a = new Canais(c);
  await a.loadCSV('../00 - datasets/superstore.csv');
  
  a.createScales();
  a.renderCircles();
}

main();
