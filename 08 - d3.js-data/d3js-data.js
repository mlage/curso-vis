class D3jsData {
  constructor() {
    this.circles = [];
    this.squares = [];

    this.createSvg();
  }

  createSvg() {
    var node = d3.select("#main")
      .append("svg")
      .attr('x', 10)
      .attr('y', 10)
      .attr('width', 800)
      .attr('height', 600);
    
    return node;
  }

  createCircles(svg) {
    var circles = svg.selectAll('circle')
      .data(this.circles);

    circles.enter()
      .append('circle')
        .attr('cx', d => d.cx)
        .attr('cy', d => d.cy)
        .attr('r' , d => d.r)
        .style('fill', 'blue');

    circles
      .attr('cx', d => d.cx)
      .attr('cy', d => d.cy)
      .attr('r' , d => d.r)
      .style('fill', 'green');

    circles.exit().remove();
    
    return circles;
  }

  createSquares(svg) {
    var squares = svg.selectAll('rect')
      .data(this.squares)
      .join(
        e => e.append('rect')
        .style('fill', 'blue'),
        u => u.style('fill', 'green')
      )
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width' , d => d.l)
      .attr('height', d => d.l)

    return squares;
  }

  getRandomColor() {
    return 'rgb(' + Math.floor(Math.random()*256) + ',' + Math.floor(Math.random()*256) + ',' + Math.floor(Math.random()*256) + ')';
  }

  run(circles, squares) {
    this.circles = circles;
    this.squares = squares;

    var svg = d3.select("svg")    
    
    this.createCircles(svg);
    this.createSquares(svg);
  }
}

window.onload = () => {
  let app = new D3jsData();
  
  setInterval(() => { 
    let nc = Math.floor(Math.random() * 50);
    let ns = Math.floor(Math.random() * 50);
    
    const circles = []
    for (let c=0; c<nc; c++) {
      const circle = {
        cx: Math.random()*800,
        cy: Math.random()*600,
        r : Math.random()*20 + 10
      }
      circles.push(circle);
    }

    const squares = []
    for (let s=0; s<ns; s++) {
      const square = {
        x: Math.random()*800,
        y: Math.random()*600,
        l: Math.random()*20 + 10
      }
      squares.push(square);
    }

    app.run(circles, squares);
    
    console.log('chart updated...')
  }, 1500);
  
}