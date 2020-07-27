class JsPuro {
  constructor() {}

  createSvg() {
    let div = document.querySelector('#main');
    console.log(div);

    // Um nó svg é especial!
    let node = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    
    // svg position
    node.setAttribute('x', 10);
    node.setAttribute('y', 10);

    // svg size
    node.setAttribute('width', 800);
    node.setAttribute('height', 600);
    
    div.appendChild(node);
    
    return node;
  }

  createCircle(svg, x, y, r) {
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r' , r);

    svg.appendChild(circle);
    
    return circle;
  }

  getRandomColor() {
    return 'rgb(' + Math.floor(Math.random()*256) + ',' + Math.floor(Math.random()*256) + ',' + Math.floor(Math.random()*256) + ')';
  }

  run() {
    let svg = this.createSvg();
    
    for(let id=0; id<20; id++)
    {
        let x = Math.random()*800;
        let y = Math.random()*600;
        let r = Math.random()*20 + 10;

        let c = this.createCircle(svg, x, y, r);
        
        c.style.fill = this.getRandomColor();
    }
  }
}

window.onload = () => {
  let app = new JsPuro();
  app.run();
}