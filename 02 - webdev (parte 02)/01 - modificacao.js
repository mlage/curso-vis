function addCircle() {
    const telaDeDesenho = document.querySelector('svg');

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    
    circle.setAttribute('cx', Math.random() * telaDeDesenho.clientWidth);
    circle.setAttribute('cy', Math.random() * telaDeDesenho.clientHeight);
    circle.setAttribute('r' , 10 + Math.random() * 30);

    telaDeDesenho.appendChild(circle);
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
