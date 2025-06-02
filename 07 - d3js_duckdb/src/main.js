import { Taxi } from "./taxi";
import { loadChart, clearChart } from './plot';


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

            loadBtn.textContent = "Erro ao Carregar";
        } finally {
            loadBtn.disabled = false;
        }
    });

    clearBtn.addEventListener('click', () => {
        clearChart();
    });
}


window.onload = async () => {
    try {

        
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
        

        await taxi.loadTaxi(6);
        

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
            LIMIT 5000
        `;
        

        const data = await taxi.query(sql);

        

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
        

        
        if (validData.length === 0) {
            throw new Error("Nenhum dado válido encontrado!");
        }
        

        mainContainer.removeChild(loadingMsg);
        

        const infoDiv = document.createElement('div');
        infoDiv.style.textAlign = 'center';
        infoDiv.style.padding = '10px';
        infoDiv.style.backgroundColor = '#f8f9fa';
        infoDiv.style.border = '1px solid #dee2e6';
        infoDiv.style.borderRadius = '5px';
        infoDiv.style.marginBottom = '20px';
        infoDiv.innerHTML = `
            <strong>Dados Carregados:</strong> ${validData.length} corridas de táxi | 
            <strong>Período:</strong> Primeiros 6 meses de 2023
        `;
        mainContainer.insertBefore(infoDiv, mainContainer.firstChild);
        
        setupEventListeners(validData);
        
        await loadChart(validData);
        

        
    } catch (error) {

        

        const loadingMsg = document.querySelector('.main-container div');
        if (loadingMsg && loadingMsg.textContent.includes('Carregando dados')) {
            loadingMsg.remove();
        }
        
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