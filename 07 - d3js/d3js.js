// class D3js {
//   constructor() {}

//   createSvg() {
//     let node = d3.select("#main")
//       .append("svg")
//       .attr('x', 10)
//       .attr('y', 10)
//       .attr('width', 800)
//       .attr('height', 600);
    
//     return node;
//   }

//   createCircle(svg, x, y, r) {
//     let circle = svg.append('circle')
//         .attr('cx', x)
//         .attr('cy', y)
//         .attr('r' , r);
    
//     return circle;
//   }

//   getRandomColor() {
//     return 'rgb(' + Math.floor(Math.random()*256) + ',' + Math.floor(Math.random()*256) + ',' + Math.floor(Math.random()*256) + ')';
//   }

//   run() {
//     let svg = this.createSvg();
    
//     for(let id=0; id<20; id++)
//     {
//         let x = Math.random()*800;
//         let y = Math.random()*600;
//         let r = Math.random()*20 + 10;

//         let c = this.createCircle(svg, x, y, r);
//         c.style('fill', this.getRandomColor());
//     }
//   }
// }

// window.onload = () => {
//   let app = new D3js();
//   app.run();
// }

let dataset = [4, 6, 3, 2, 1]

let ps = d3.select("#main")
    .selectAll("circle")
    .data(dataset);

    // ps.exit().remove();

    // ps.enter()
    // .append("circle")
    // .attr("cx", (d, i) => (i+1) * 50)
    // .attr("cy", 40)
    // .attr("r", d => 2*d)
    // .attr("fill", "blue");

    // ps.attr("cx", (d, i) => (i+1) * 50)
    // .attr("cy", 40)
    // .attr("r", d => 2*d)
    // .attr("fill", "red");


    // ------


    // ps.join("circle")
    //     .attr("cx", (d, i) => (i+1) * 50)
    //     .attr("cy", 40)
    //     .attr("r", d => 2*d)
    //     .attr("fill", "yellow");


    // ------


    ps.join(
        en => en.append("circle")
        .attr("cx", (d, i) => (i+1) * 50)
        .attr("cy", 40)
        .attr("r", d => 2*d)
        .attr("fill", "blue"),

        up => up.attr("cx", (d, i) => (i+1) * 50)
        .attr("cy", 40)
        .attr("r", d => 2*d)
        .attr("fill", "red"),

        ex => ex.remove()
    );
