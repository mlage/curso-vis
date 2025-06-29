import { Taxi } from "./taxi";
import { loadChart, clearChart } from './plot';

function callbacks(data) {
    const loadBtn   = document.querySelector('#loadBtn');
    const clearBtn  = document.querySelector('#clearBtn');

    if (!loadBtn || !clearBtn) {
        return;
    }

    loadBtn.addEventListener('click', async () => {
        clearChart('#chart01');
        clearChart('#chart02');

        await loadChart('#chart01', data, ['trip_distance', 'fare_amount']);
        await loadChart('#chart02', data, ['trip_distance', 'tip_amount']);
    });

    clearBtn.addEventListener('click', async () => {
        clearChart('#chart01');
        clearChart('#chart02');
    });
}

window.onload = async () => {
    const taxi = new Taxi();

    await taxi.init();
    await taxi.loadTaxi();

    const sql = `
        SELECT
            trip_distance,
            tip_amount,
            fare_amount
        FROM
            taxi_2023
        LIMIT ${50}
    `;

    const data = await taxi.query(sql);
    callbacks(data);
};

