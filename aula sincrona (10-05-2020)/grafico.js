const d3 = window.d3;

export class Bar {
  constructor() {
    this.bins = [];

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

  async setData(data) {
    this.bins = data;
    this.y = d3.extent(this.bins);
  }

  render() {
    this.svg.selectAll('rect')
      .data(this.bins)
      .join('rect')
      .attr('x', (d, i) => i * this.w / 10 + 10)
      .attr('y', d => this.h * ( 1 - (d - this.y[0]) / (this.y[1] - this.y[0]) ))
      .attr('width' , () => this.w / 10 - 20)
      .attr('height' , d => this.h - this.h * ( 1 - (d - this.y[0]) / (this.y[1] - this.y[0]) ))
      .style('fill', 'RoyalBlue')
    }
}