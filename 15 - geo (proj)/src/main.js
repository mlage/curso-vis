import { loadMap, clearMap, initTaxi, getRegions } from './map';

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
    await initTaxi();
    const neighs = await getRegions();

    console.log('Loaded neighborhoods:', neighs);

    callbacks(neighs);
};

