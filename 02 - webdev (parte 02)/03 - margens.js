function mapeamento(dmin, dmax, tmin, tmax) {
    return (value) => {
        const d = (value - dmin) / (dmax - dmin);
        const t = tmin + d * (tmax - tmin);

        return t;
    }
}

function addCircle(item, mapX, mapY) {
    const group = document.querySelector('#group');

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    
    circle.setAttribute('cx', mapX(item.distance));
    circle.setAttribute('cy', mapY(item.tip));
    circle.setAttribute('r' , 20);

    group.appendChild(circle);
    
    return circle;
}

function loadChart(margens = { left: 25, right: 25, top: 25, bottom: 25}) {
    const svg = document.querySelector('svg');

    const data = buildData();

    const minDistance = Math.min(...data.map(item => item.distance));
    const maxDistance = Math.max(...data.map(item => item.distance));
    const mapX = mapeamento(minDistance, maxDistance, 0, svg.clientWidth - margens.left - margens.right);

    const minTip = Math.min(...data.map(item => item.tip));
    const maxTip = Math.max(...data.map(item => item.tip));

    const mapY = mapeamento(minTip, maxTip, svg.clientHeight - margens.top - margens.bottom, 0);

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        addCircle(item, mapX, mapY);
    }

    const group = document.querySelector('#group');
    group.setAttribute('transform', `translate(${margens.left}, ${margens.top})`);
}

function clearChart() {
    const group = document.querySelector('#group');
    group.innerHTML = '';
}

function buildData(size = 50) {
    const data = [];

    for (let i = 0; i < size; i++) {
        const distance = 2 + Math.random() * 100;
        const tip = Math.random() * 20;

        data.push({ distance, tip });
    }

    return data;
}