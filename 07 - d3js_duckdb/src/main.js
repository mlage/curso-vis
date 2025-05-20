import { Taxi } from "./taxi";
import { loadChart, clearChart } from './plot';

// Função que inicializa os callbacks para os botões
function setupEventListeners(data) {
    const loadBtn = document.querySelector('#loadBtn');
    const clearBtn = document.querySelector('#clearBtn');

    if (!loadBtn || !clearBtn) {
        console.error("Botões não encontrados!");
        return;
    }

    loadBtn.addEventListener('click', async () => {
        loadBtn.disabled = true;
        loadBtn.textContent = "Carregando...";
        
        // Limpar os gráficos antes de carregar novos dados
        clearChart();
        
        try {
            await loadChart(data);
            loadBtn.textContent = "Carregar Gráficos";
        } catch (error) {
            console.error("Erro ao carregar os gráficos:", error);
            loadBtn.textContent = "Erro ao Carregar";
        } finally {
            loadBtn.disabled = false;
        }
    });

    clearBtn.addEventListener('click', () => {
        clearChart();
    });
}

// Função principal que é executada quando a página carrega
window.onload = async () => {
    try {
        console.log("Inicializando aplicação...");
        
        // Adicionar mensagem de carregamento temporária
        const mainContainer = document.querySelector('.main-container');
        const loadingMsg = document.createElement('div');
        loadingMsg.style.textAlign = 'center';
        loadingMsg.style.padding = '20px';
        loadingMsg.textContent = 'Carregando dados... Por favor, aguarde.';
        mainContainer.appendChild(loadingMsg);
        
        // Inicializar o objeto Taxi
        const taxi = new Taxi();
        await taxi.init();
        
        console.log("Banco de dados inicializado, carregando dados de táxi...");
        await taxi.loadTaxi(2); // Carregar apenas 2 meses para acelerar
        
        console.log("Executando consulta SQL...");
        
        // Consulta SQL para obter os dados
        const sql = `
            SELECT
                trip_distance,
                tip_amount
            FROM
                taxi_2023
            WHERE
                trip_distance > 0 AND
                trip_distance < 20 AND
                tip_amount >= 0 AND
                tip_amount < 30
            ORDER BY RANDOM()
            LIMIT 200
        `;
        
        // Executar a consulta e obter os dados
        const data = await taxi.query(sql);
        console.log("Dados obtidos:", data.length, "registros");
        
        // Remover mensagem de carregamento
        mainContainer.removeChild(loadingMsg);
        
        // Configurar os eventos dos botões
        setupEventListeners(data);
        
        // Carregar os gráficos automaticamente
        await loadChart(data);
        
    } catch (error) {
        console.error("Erro ao inicializar a aplicação:", error);
        alert("Ocorreu um erro ao carregar os dados. Verifique o console para mais detalhes.");
    }
};