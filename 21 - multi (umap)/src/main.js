import { Taxi } from "./taxi";
import { loadChart, clearChart } from './plot';

import { UMAP } from 'umap-js';

function callbacks(data) {
    const loadBtn = document.querySelector('#loadBtn');
    const clearBtn = document.querySelector('#clearBtn');

    if (!loadBtn || !clearBtn) {
        return;
    }

    loadBtn.addEventListener('click', async () => {
        clearChart();
        await loadChart(data);
    });

    clearBtn.addEventListener('click', async () => {
        clearChart();
    });
}

window.onload = async () => {
    const taxi = new Taxi();

    await taxi.init();
    await taxi.loadTaxi();

    const sql = `
        SELECT date_trunc('day', lpep_pickup_datetime) as day, AVG(trip_distance) as avg_trip_distance, AVG(fare_amount) as avg_fare_amount, AVG(tip_amount) as avg_tip_amount, AVG(total_amount) as avg_total_amount
        FROM taxi_2023
        GROUP BY day;
    `

    const data = await taxi.query(sql);

    const umap = new UMAP();
    const embedding = umap.fit(data);
    console.log("UMAP Embedding:", embedding);

    callbacks(embedding);
};

