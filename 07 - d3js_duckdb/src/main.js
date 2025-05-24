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
        loadingMsg.style.fontSize = '16px';
        loadingMsg.style.color = '#333';
        loadingMsg.innerHTML = `
            <h3>Carregando dados dos Green Taxis de NYC...</h3>
            <p>Aguarde enquanto processamos os dados para análise.</p>
        `;
        mainContainer.appendChild(loadingMsg);
        
        // Inicializar o objeto Taxi
        const taxi = new Taxi();
        await taxi.init();
        
        console.log("Banco de dados inicializado, carregando dados de táxi...");
        // Carregar 6 primeiros meses de 2023 conforme solicitado no trabalho
        await taxi.loadTaxi(6);
        
        console.log("Executando consulta SQL para análise...");
        
        // Consulta SQL otimizada para responder às perguntas do trabalho
        const sql = `
            SELECT
                lpep_pickup_datetime,
                tip_amount,
                fare_amount,
                total_amount,
                passenger_count,
                trip_distance,
                payment_type
            FROM
                taxi_2023
            WHERE
                lpep_pickup_datetime IS NOT NULL AND
                tip_amount >= 0 AND
                tip_amount <= 50 AND
                fare_amount > 0 AND
                fare_amount <= 200 AND
                trip_distance > 0 AND
                trip_distance <= 50 AND
                passenger_count >= 1 AND
                passenger_count <= 6
            ORDER BY RANDOM()
            LIMIT 5000
        `;
        
        // Executar a consulta e obter os dados
        const data = await taxi.query(sql);
        console.log("Dados obtidos:", data.length, "registros");
        
        // Validar e processar os dados
        const validData = data.filter(d => {
            try {
                const date = new Date(d.lpep_pickup_datetime);
                return !isNaN(date.getTime()) && 
                       date.getFullYear() === 2023 &&
                       typeof d.tip_amount === 'number' && 
                       d.tip_amount >= 0;
            } catch (e) {
                return false;
            }
        });
        
        console.log("Dados válidos:", validData.length, "registros");
        
        if (validData.length === 0) {
            throw new Error("Nenhum dado válido encontrado!");
        }
        
        // Remover mensagem de carregamento
        mainContainer.removeChild(loadingMsg);
        
        // Adicionar informações sobre os dados carregados
        const infoDiv = document.createElement('div');
        infoDiv.style.textAlign = 'center';
        infoDiv.style.padding = '10px';
        infoDiv.style.backgroundColor = '#f8f9fa';
        infoDiv.style.border = '1px solid #dee2e6';
        infoDiv.style.borderRadius = '5px';
        infoDiv.style.marginBottom = '20px';
        infoDiv.innerHTML = `
            <strong>Dados Carregados:</strong> ${validData.length} corridas de táxi | 
            <strong>Período:</strong> Primeiros 6 meses de 2023 | 
            <strong>Fonte:</strong> Green Taxis NYC
        `;
        mainContainer.insertBefore(infoDiv, mainContainer.firstChild);
        
        // Configurar os eventos dos botões
        setupEventListeners(validData);
        
        // Carregar os gráficos automaticamente
        await loadChart(validData);
        
        console.log("Aplicação inicializada com sucesso!");
        
    } catch (error) {
        console.error("Erro ao inicializar a aplicação:", error);
        
        // Remover mensagem de carregamento se ainda existir
        const loadingMsg = document.querySelector('.main-container div');
        if (loadingMsg && loadingMsg.textContent.includes('Carregando dados')) {
            loadingMsg.remove();
        }
        
        // Mostrar mensagem de erro
        const mainContainer = document.querySelector('.main-container');
        const errorDiv = document.createElement('div');
        errorDiv.style.textAlign = 'center';
        errorDiv.style.padding = '20px';
        errorDiv.style.color = '#dc3545';
        errorDiv.style.backgroundColor = '#f8d7da';
        errorDiv.style.border = '1px solid #f5c6cb';
        errorDiv.style.borderRadius = '5px';
        errorDiv.innerHTML = `
            <h3>Erro ao carregar os dados</h3>
            <p>Ocorreu um erro ao processar os dados dos táxis.</p>
            <p><strong>Detalhes:</strong> ${error.message}</p>
            <p>Verifique o console do navegador para mais informações.</p>
        `;
        mainContainer.appendChild(errorDiv);
    }
};