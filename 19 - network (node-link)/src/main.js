import { Taxi } from "./taxi";
import { loadChart, clearChart } from './plot';

function callbacks(nodes, links) {
    const loadBtn  = document.querySelector('#loadBtn');
    const clearBtn = document.querySelector('#clearBtn');

    if (!loadBtn || !clearBtn) {
        return;
    }

    loadBtn.addEventListener('click', async () => {
        clearChart();
        await loadChart(nodes, links);
    });

    clearBtn.addEventListener('click', async () => {
        clearChart();
    });
}

window.onload = async () => {
    const taxi = new Taxi();

    await taxi.init();
    await taxi.loadTaxi();

    const response = await fetch('taxi-zones.json');
    const data = await response.json();
    const nodes = data.features.map(n => {
        return {
            id: n.id
        }
    });

    const sql = `
        SELECT PULocationID::INTEGER as source, DOLocationID::INTEGER as target, count(*)::INTEGER as count
        FROM taxi_2023
        GROUP BY source, target;
    `

    const links = await taxi.query(sql);
    console.log(nodes, links);

    callbacks(nodes, links);
};

