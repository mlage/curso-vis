class D3jsDados {
  constructor(config) {
    this.circles = [];
    this.squares = [];

    this.svg = null;
    this.createSvg(config.id, config.x, config.y, config.w, config.h);
  }

  createSvg(id, x, y, w, h) {
    let node = d3.select(id)
      .append("svg")
      .attr('x', x)
      .attr('y', y)
      .attr('width', w)
      .attr('height', h);
    
    this.svg = node;
  }

  createCircles() {
    const t = this.svg.transition()
        .duration(1500);

    let circles = this.svg.selectAll('circle')
      .data(this.circles);

    circles.enter()
      .append('circle')
        .attr('cx', d => d.cx)
        .attr('cy', d => d.cy)
        .attr('r' , d => d.r)
        .style('fill', 'RoyalBlue');

    circles
      .attr('cx', d => d.cx)
      .attr('cy', d => d.cy)
      .attr('r' , d => d.r)
      .style('fill', 'SeaGreen');

    circles.exit()
      .style('fill', 'IndianRed')
      .call(
        ex => ex.transition(t)
        .remove()
      )
  }

  createSquares() {
    const t = this.svg.transition()
        .duration(1500);

    this.svg.selectAll('rect')
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
    
    this.createCircles();
    this.createSquares();
  }
}

window.onload = () => {
  const configs = [
    {id: '#chart01', x: 0, y: 0, w: 500, h: 500},
    {id: '#chart02', x: 0, y: 0, w: 500, h: 500}
  ];

  const apps = [
    new D3jsDados(configs[0]), 
    new D3jsDados(configs[1])
  ];

  function update() {

    for(let i=0; i<2; i++) {
      let nc = Math.floor(Math.random() * 50);
      let ns = Math.floor(Math.random() * 50);
      
      const circles = []
      for (let c=0; c<nc; c++) {
        const circle = {
          cx: Math.random() * (configs[i].w - 60) + 30,
          cy: Math.random() * (configs[i].h - 60) + 30,
          r : Math.random() * 20 + 10
        }
        circles.push(circle);
      }
    
      const squares = []
      for (let s=0; s<ns; s++) {
        const square = {
          x: Math.random() * (configs[i].w - 30),
          y: Math.random() * (configs[i].h - 30),
          l : Math.random() * 20 + 10
        }
        squares.push(square);
      }
    
      apps[i].run(circles, squares);  
    }
    
    console.log('chart updated...')
  }

  setInterval(update, 3000);  
}