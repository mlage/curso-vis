import * as d3 from 'd3';

class D3js {
    constructor() { }

    createSvg() {
        let node = d3.select("#app")
            .append("svg")
            .attr('x', 10)
            .attr('y', 10)
            .attr('width', 800)
            .attr('height', 600);

        return node;
    }

    createCircle(svg, x, y, r) {
        let circle = svg.append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', r);

        return circle;
    }

    getRandomColor() {
        return 'rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';
    }


    run() {
        let svg = this.createSvg();

        for (let id = 0; id < 20; id++) {
            let x = Math.random() * 800;
            let y = Math.random() * 600;
            let r = Math.random() * 20 + 10;

            let c = this.createCircle(svg, x, y, r);

            c.style('fill', this.getRandomColor());
        }
    }
}

window.onload = () => {
    let app = new D3js();
    app.run();
}