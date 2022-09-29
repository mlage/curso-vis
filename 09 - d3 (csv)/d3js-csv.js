class D3jsCsv {
  constructor() {
    this.circles = [];

    this.x = [Infinity, -Infinity],
    this.y = [Infinity, -Infinity],
    this.w = 800;
    this.h = 600;

    this.createSvg();
  }

  createSvg() {
    this.svg = d3.select("#main")
      .append("svg")
      .attr('x', 10)
      .attr('y', 10)
      .attr('width', this.w)
      .attr('height', this.h);
  }

  async loadCSV(file) {
    this.circles = await d3.csv(file, d => {
      return {
        cx: +d.Sales,
        cy: +d.Profit,
        r: 5
      }
    });

    this.x = d3.extent(this.circles, d => {
      return d.cx;
    });
    this.y = d3.extent(this.circles, d => {
      return d.cy;
    });  
  }

  render() {
    this.svg.selectAll('circle')
      .data(this.circles)
      .join('circle')
      .attr('cx', d => this.w * ( (d.cx - this.x[0]) / (this.x[1] - this.x[0]) ))
      .attr('cy', d => this.h * ( 1 - (d.cy - this.y[0]) / (this.y[1] - this.y[0]) ))
      .attr('r' , d => d.r)
      .style('fill', 'RoyalBlue')
    }
}

async function main() {
  let app = new D3jsCsv();
  
  await app.loadCSV('../00 - datasets/superstore.csv');
  app.render();
}

main();