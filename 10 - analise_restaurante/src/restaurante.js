import { DataManager } from "./data_manager.js";
import { loadChart, clearAllCharts } from './plot.js';

function setupEventListeners(data) {
    const loadBtn = document.querySelector('#loadBtn');
    const clearBtn = document.querySelector('#clearBtn');

    if (!loadBtn || !clearBtn) {
        return;
    }

    const loadAction = async () => {
        clearAllCharts();

        const chart1Info = {
            id: '#chart01',
            cols: ['distancia_entrega_km', 'valor_total_pedido'],
            labels: { x: 'Distância da Entrega (km)', y: 'Valor Total do Pedido (R$)' }
        };
        const chart2Info = {
            id: '#chart02',
            cols: ['valor_total_pedido', 'gorjeta_entregador'],
            labels: { x: 'Valor Total do Pedido (R$)', y: 'Gorjeta (R$)' }
        };

        await loadChart(chart1Info.id, data, chart1Info.cols, chart1Info.labels);
        await loadChart(chart2Info.id, data, chart2Info.cols, chart2Info.labels);
    };

    loadBtn.addEventListener('click', loadAction);
    clearBtn.addEventListener('click', clearAllCharts);
    
    loadAction();
}

window.onload = async () => {
    const dataManager = new DataManager();

    try {
        await dataManager.init();
        console.log("Banco de dados inicializado.");
        
        await dataManager.loadData();
        console.log("Dados de restaurantes carregados.");

        const sql = `
            SELECT
                RestauranteID,
                horario_pedido,
                distancia_entrega_km,
                valor_total_pedido,
                gorjeta_entregador,
                TipoCozinhaID,
                numero_de_itens
            FROM
                restaurantes
            WHERE
                distancia_entrega_km IS NOT NULL AND
                valor_total_pedido IS NOT NULL AND
                gorjeta_entregador IS NOT NULL AND
                TipoCozinhaID IS NOT NULL AND
                numero_de_itens IS NOT NULL
            LIMIT 500;
        `;

        const rawData = await dataManager.query(sql);

        const data = rawData.map(d => {
            const newRow = {};
            for (const key in d) {
                if (typeof d[key] === 'bigint') {
                    newRow[key] = Number(d[key]);
                } else {
                    newRow[key] = d[key];
                }
            }
            return newRow;
        });

        console.log(`Consulta retornou ${data.length} registros e converteu os tipos.`);
        
        if(data.length > 0){
           setupEventListeners(data);
        } else {
            console.error("Nenhum dado retornado da consulta. Verifique o arquivo JSON e a consulta SQL.");
        }

    } catch (error) {
        console.error("Ocorreu um erro no carregamento da aplicação:", error);
    }
};