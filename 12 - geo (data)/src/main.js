import * as shp from 'shapefile';
import { loadMap, clearMap } from './map';

function callbacks(data) {
    const loadBtn = document.querySelector('#loadBtn');
    const clearBtn = document.querySelector('#clearBtn');

    if (!loadBtn || !clearBtn) {
        return;
    }

    loadBtn.addEventListener('click', async () => {
        clearMap();

        const mnt = data.filter(d => d.properties.borough === 'Manhattan');
        data.features = mnt;

        console.log(data);

        await loadMap(data);
    });

    clearBtn.addEventListener('click', async () => {
        clearMap();
    });
}

window.onload = async () => {
    const response = await shp.open('taxi_zones/taxi_zones.shp');
    const data = { done: false, value: [] };

    while (data.done === false) {
        const result = await response.read();

        if (result.done) {
            data.done = true;
            break;
        }

        data.value.push(result.value);
    }

    callbacks(data.value);
};

