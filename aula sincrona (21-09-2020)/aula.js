class Aula {
  constructor(config) {
    this.config = config;

    this.svg = null;
    this.margins = null;

    this.squares = []
    this.circles = []

    this.createSvg();
    this.createMargins();
  }

  createSvg() {
    this.svg = d3.select("#main")
      .append("svg")
      .attr('x', 10)
      .attr('y', 10)
      .attr('width', this.config.width)
      .attr('height', this.config.height);
  }

  createMargins() {
    this.margins = this.svg
      .append('g')
      .attr("transform", `translate(${this.config.left},${this.config.top})`)
  }

  createRandomSquares(n) {
    for (let i = 0; i < n; i++) {
      const element = {
        x: (this.config.width - this.config.left - this.config.right) * Math.random(),
        y: (this.config.height - this.config.top - this.config.bottom) * Math.random(),
        l: 30 * Math.random()
      };
      
      this.squares.push(element);
    }
  }

  createRandomCircles(n) {
    for (let i = 0; i < n; i++) {
      const element = {
        cx: (this.config.width - this.config.left - this.config.right) * Math.random(),
        cy: (this.config.height - this.config.top - this.config.bottom) * Math.random(),
        r: 30 * Math.random()
      };
      
      this.circles.push(element);
    }
  }

  renderSquares() {
    this.margins.selectAll('rect')
      .data(this.squares)
      .join('rect')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width' , d => d.l)
      .attr('height', d => d.l);
  }

  renderCircles() {
    this.margins.selectAll('circle')
      .data(this.circles)
      .join('circle')
      .attr('cx', d => d.cx)
      .attr('cy', d => d.cy)
      .attr('r' , d => d.r);
  }
}


let c = {width: 800, height: 600, top: 30, left: 30, bottom: 30, right: 30};
let a = new Aula(c);

// a.createRandomSquares(100);
// a.renderSquares();

a.createRandomCircles(100);
a.renderCircles();
