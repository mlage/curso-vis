import * as d3 from 'd3';

class D3jsDados {
    circles = [];
    squares = [];

    constructor() {
        this.circles = [];
        this.squares = [];

        this.createSvg();
    }

    createSvg() {
        let node = d3.select("#app")
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
            .attr('cx', d => d.val01)
            .attr('cy', d => d.val02)
            .attr('r',  d => d.val03)
            .style('fill', 'RoyalBlue');

        circles.exit()
            .style('fill', 'IndianRed')
            .call(
                ex => ex.transition(t)
                    .remove()
            )

        circles
            .attr('cx', d => d.val01)
            .attr('cy', d => d.val02)
            .attr('r',  d => d.val03)
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
            .attr('x', d => d.val01)
            .attr('y', d => d.val02)
            .attr('width',  d => d.val03)
            .attr('height', d => d.val04)
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

        const circles = [];

        for (let c = 0; c < nc; c++) {
            const circle = {
                val01: Math.random() * 800,
                val02: Math.random() * 600,
                val03: Math.random() * 20 + 10
            }
            circles.push(circle);
        }

        const squares = [];

        for (let s = 0; s < ns; s++) {
            const square = {
                val01: Math.random() * 800,
                val02: Math.random() * 600,
                val03: Math.random() * 20 + 10
            }
            squares.push(square);
        }

        app.run(circles, squares);

        console.log('chart updated...')
    }, 3000);

}