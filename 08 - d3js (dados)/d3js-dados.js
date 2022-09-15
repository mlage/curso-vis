class D3jsDados {
  constructor() {
    this.circles = [];
    this.squares = [];

    this.createSvg();
  }

  createSvg() {
    let node = d3.select("#main")
      .append("svg")
      .attr('x', 10)
      .attr('y', 10)
      .attr('width', 800)
      .attr('height', 600);
    
    return node;
  }

  createCircles(svg) {
    const t = svg.transition()
        .duration(1500);

    let circles = svg.selectAll('circle')
      .data(this.circles);

    circles.enter()
      .append('circle')
        .attr('cx', d => d.cx_)
        .attr('cy', d => d.cy_)
        .attr('r' , d => d.r_)
        .style('fill', 'RoyalBlue');

    circles.exit()
      .style('fill', 'IndianRed')
      .call(
        ex => ex.transition(t)
        .remove()
      )

    circles
      .attr('cx', d => d.cx_)
      .attr('cy', d => d.cy_)
      .attr('r' , d => d.r_)
      .style('fill', 'SeaGreen');
  }

  createSquares(svg) {
    const t = svg.transition()
        .duration(1500);

    svg.selectAll('rect')
      .data(this.squares)
      .join(
        // enter
        en => en.append('rect')
        .style('fill', 'RoyalBlue'),
        
        // update
        up => up.style('fill', 'SeaGreen'),
        
        // exit
        ex => ex.style("fill", "IndianRed")
        .call(ex => ex.transition(t)
          .remove()
        )
      )
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width' , d => d.l)
      .attr('height', d => d.l)
  }

  run(circles, squares) {
    this.circles = circles;
    this.squares = squares;

    let svg = d3.select("svg")
    
    this.createCircles(svg);
    this.createSquares(svg);
  }
}

window.onload = () => {
  let app = new D3jsDados();
  
  setInterval(() => { 
    let nc = Math.floor(Math.random() * 50);
    let ns = Math.floor(Math.random() * 50);
    
    const circles = []
    for (let c=0; c<nc; c++) {
      const circle = {
        cx_: Math.random()*800,
        cy_: Math.random()*600,
        r_ : Math.random()*20 + 10
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
  }, 3000);
  
}