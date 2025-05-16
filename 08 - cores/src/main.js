import { Taxi } from "./taxi";
import { loadChart, clearChart } from './plot';

function callbacks(data) {
    const loadBtn   = document.querySelector('#loadBtn');
    const clearBtn  = document.querySelector('#clearBtn');
    const colorDrop = document.querySelector('#colorDrop');

    if (!loadBtn || !clearBtn) {
        return;
    }

    loadBtn.addEventListener('click', async () => {
        clearChart();
        await loadChart(data, colorDrop.value);
    });


    colorDrop.addEventListener('change', async () => {
        clearChart();
        await loadChart(data, colorDrop.value);
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
        SELECT
            trip_distance,
            tip_amount,
            total_amount,
            payment_type
        FROM
            taxi_2023
        LIMIT ${100}
    `;

    const data = await taxi.query(sql);
    console.log(data);

    callbacks(data);
};

