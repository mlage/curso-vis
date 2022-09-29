class D3jsBins {
  constructor() {
    this.data = [];
    this.bins = []

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
    this.data = await d3.csv(
      file,
      d => {
        return {
          val: +d.Profit,
        }
      });

    this.x = d3.extent(this.data, d => {
      return d.val;
    });
  }


  computeBins() {
    let n = 10;
    let s = (this.x[1] - this.x[0]) / (n - 1);

    for (let id=0; id < n; id++) {
      this.bins.push(0);
    }

    this.data.forEach(d => {
      let pos = Math.floor((d.val - this.x[0]) / s);
      this.bins[pos] += 1;
    });

    this.y = d3.extent(this.bins);
    console.log(this.bins);
  }

  render() {
    this.svg.selectAll('rect')
      .data(this.bins)
      .join('rect')
      .attr('x', (d, i) => i * this.w / 10 + 10)
      .attr('y', d => this.h * ( 1 - (d - this.y[0]) / (this.y[1] - this.y[0]) ))
      .attr('width' , () => this.w / 10 - 10)
      .attr('height' , d => this.h - this.h * ( 1 - (d - this.y[0]) / (this.y[1] - this.y[0]) ))
      .style('fill', 'RoyalBlue');
    }
}

async function main() {
  let app = new D3jsBins();
  
  await app.loadCSV('../00 - datasets/superstore.csv');
  app.computeBins();
  app.render()
}

main();