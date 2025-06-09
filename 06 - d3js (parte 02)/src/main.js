import { loadChart, clearChart } from './eixos';

function main() {
    const loadBtn  = document.querySelector('#loadBtn');
    const clearBtn = document.querySelector('#clearBtn');

    if (!loadBtn || !clearBtn) {
        return;
    }

    loadBtn.addEventListener('click', async () => {
        clearChart();
        await loadChart();
    });

    clearBtn.addEventListener('click', async () => {
        clearChart();
    });
}

window.onload = () => {
    main();
};

