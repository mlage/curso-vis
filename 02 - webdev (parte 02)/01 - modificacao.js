function addCircle() {
    const svg = document.querySelector('svg');

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    
    circle.setAttribute('cx', Math.random() * svg.clientWidth);
    circle.setAttribute('cy', Math.random() * svg.clientHeight);
    circle.setAttribute('r' , 10 + Math.random() * 30);

    svg.appendChild(circle);
}

function deleteCircle() {
    const svg = document.querySelector('svg');
    const circles = document.querySelectorAll('circle');

    const rId = Math.floor(Math.random() * circles.length);
    const circle = circles[rId];

    if (circle) {
        svg.removeChild(circle);
    }
}
