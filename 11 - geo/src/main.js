import { loadMap, clearMap } from './map';

function callbacks(data) {
    const loadBtn   = document.querySelector('#loadBtn');
    const clearBtn  = document.querySelector('#clearBtn');

    if (!loadBtn || !clearBtn) {
        return;
    }

    loadBtn.addEventListener('click', async () => {
        clearMap();
        await loadMap(data);
    });

    clearBtn.addEventListener('click', async () => {
        clearMap();
    });
}

window.onload = async () => {
    const response = await fetch('../00 - data/nyc-neighs.json');
    const neighs = await response.text();

    console.log({ neighs });

    callbacks(neighs);
};

