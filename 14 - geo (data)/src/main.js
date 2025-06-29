import { loadMap, clearMap, initTaxi } from './map';

function callbacks(data) {
    const loadBtn   = document.querySelector('#loadBtn');
    const clearBtn  = document.querySelector('#clearBtn');

    if (!loadBtn || !clearBtn) {
        return;
    }

    loadBtn.addEventListener('click', async () => {
        await loadMap(data);
    });

    clearBtn.addEventListener('click', async () => {
        clearMap();
    });
}

window.onload = async () => {
    const response = await fetch('taxi-zones.json');
    const neighs = await response.json();

    callbacks(neighs);
    initTaxi();
};

