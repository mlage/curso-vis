
let main = d3.select("#main")
    .append("svg")
    .attr('x', 10)
    .attr('y', 10)
    .attr('width', '100%')
    .attr('height', 800);

setInterval(() => {
  let width  = document.getElementById("main").clientWidth;
  let height = document.getElementById("main").clientHeight;
  
  let circle = {cx: Math.random() * width, cy: Math.random() * height, r: 10};
  
  let t = d3.transition()
  .duration(1500)
  .ease(d3.easeLinear);
  
  main.selectAll('circle')
  .data([circle])
  .join('circle')  
  .transition(t)
  .attr('cx', d => d.cx)
  .attr('cy', d => d.cy)
  .attr('r' , 10 + Math.random() * 100);
}, 3000);
