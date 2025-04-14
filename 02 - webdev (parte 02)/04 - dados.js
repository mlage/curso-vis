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
    
    circle.setAttribute('cx', mapX(item.trip_distance));
    circle.setAttribute('cy', mapY(item.tip_amount));
    circle.setAttribute('r' , 8);

    group.appendChild(circle);
    
    return circle;
}

async function loadChart(margens = { left: 25, right: 25, top: 25, bottom: 25}) {
    const svg = document.querySelector('svg');

    const data = await loadData();
    console.log(data);

    const minDistance = Math.min(...data.map(item => item.trip_distance));
    const maxDistance = Math.max(...data.map(item => item.trip_distance));
    const mapX = mapeamento(minDistance, maxDistance, 0, svg.clientWidth - margens.left - margens.right);

    const minTip = Math.min(...data.map(item => item.tip_amount));
    const maxTip = Math.max(...data.map(item => item.tip_amount));

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

async function loadData() {
    const data = await fetch('../00 - data/taxi.json');

    if (data) {
        const json = await data.json();
        return json;
    }

    return {};
}