// CORREÇÃO: Adicione esta linha que estava faltando
import { DataManager } from "./data_manager.js";
import {
    createDonutChart,
    createDensityPlot,
    createGroupedBarChart,
    createScatterPlot
} from './plot.js';

let originalData = [];
const filters = {
    target: null
};

// Mapeamentos para tornar os dados legíveis
const targetMap = { "Dropout": "Evasão", "Graduate": "Formado", "Enrolled": "Matriculado" };
const scholarshipMap = { 0: "Não Bolsista", 1: "Bolsista" };

function applyFiltersAndRedraw() {
    let filteredData = [...originalData];
    if (filters.target) {
        filteredData = originalData.filter(d => d.target === filters.target);
    }

    // Redesenha cada gráfico com os dados filtrados
    createDonutChart("#chart-donut", originalData, handleTargetClick, filters.target, targetMap);
    createDensityPlot("#chart-density", filteredData, targetMap);
    createGroupedBarChart("#chart-bargroup", filteredData, scholarshipMap, targetMap);
    createScatterPlot("#chart-scatter", filteredData, targetMap);
}

function handleTargetClick(target) {
    filters.target = filters.target === target ? null : target;
    applyFiltersAndRedraw();
}

function resetAll() {
    filters.target = null;
    applyFiltersAndRedraw();
}

window.onload = async () => {
    document.getElementById('resetFiltersBtn').addEventListener('click', resetAll);
    const dataManager = new DataManager();

    try {
        const jsonFile = 'analise_alunos.json';
        const tableName = 'students';

        await dataManager.init(tableName);
        await dataManager.loadData(jsonFile); 

        const sql = `SELECT * FROM ${tableName};`;
        const rawData = await dataManager.query(sql);

        // Pré-processamento dos dados
        originalData = rawData.map(d => {
            const newRow = {};
            for (const key in d) {
                // Lógica de limpeza de chaves mais robusta
                const newKey = key.trim().replace(/[^a-zA-Z0-9_]/g, '_');
                if (typeof d[key] === 'bigint') {
                    newRow[newKey] = Number(d[key]);
                } else {
                    newRow[newKey] = d[key];
                }
            }
            return newRow;
        });

        if (originalData.length > 0) {
            resetAll();
        } else {
            console.error("Nenhum dado retornado da consulta. Verifique o arquivo JSON.");
        }

    } catch (error) {
        console.error("Ocorreu um erro no carregamento da aplicação:", error);
        const container = document.querySelector('.dashboard-container');
        if (container) {
            container.innerHTML = `<p style="color: red; text-align: center;">Erro ao carregar os dados. Verifique o console para mais detalhes.</p>`;
        }
    }
};