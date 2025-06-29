import { loadMap, clearMap } from './map';

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
    const response = await fetch('nyc-neighs.json');
    const neighs = await response.json();

    callbacks(neighs);
};

