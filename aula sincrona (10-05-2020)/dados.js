const d3 = window.d3;

export class Dados {
  constructor() {
    this.data = [];
    this.bins = [];
  }

  getBins() {
    return this.bins;
  }

  async loadCSV(file) {
    this.data = await d3.csv(file, d => {
      return {
        val: +d.Profit,
      }
    });

    this.data = this.data.slice(0, 1000);
  }
  
  computeBins() {
    console.log(this.data.length)

    let x = d3.extent(this.data, d => {
      return d.val;
    });

    let n = 10;
    let s = (x[1] - x[0]) / (n - 1);

    for (let id=0; id < 10; id++) {
      this.bins.push(0);
    }

    this.data.forEach(d => {
      let pos = Math.floor((d.val - x[0]) / s);
      this.bins[pos] += 1;
    });
  }
}