import { loadDb } from './config';

export class DataManager {
    /**
     * Inicializa a conexão com o banco de dados.
     * @param {string} tableName - O nome que a tabela terá no DuckDB.
     */
    async init(tableName = 'data_table') {
        this.db = await loadDb();
        this.conn = await this.db.connect();
        this.table = tableName; 
        console.log(`DataManager inicializado. A tabela será chamada: '${this.table}'`);
    }

    /**
     * Carrega um arquivo JSON para o DuckDB.
     * @param {string} jsonFileName - O nome do arquivo JSON a ser carregado (ex: 'analise_alunos.json').
     */
    async loadData(jsonFileName) {
        if (!this.db || !this.conn) {
            throw new Error('Banco de dados não inicializado. Chame init() primeiro.');
        }
        if (!jsonFileName) {
            throw new Error('O nome do arquivo JSON deve ser fornecido.');
        }

        try {
            console.log(`Carregando o arquivo: ${jsonFileName}...`);
            const dataUrl = `data/${jsonFileName}`;
            
            const response = await fetch(dataUrl);
            if (!response.ok) {
                throw new Error(`Falha ao buscar o arquivo: ${response.statusText}`);
            }
            
            await this.db.registerFileBuffer(jsonFileName, new Uint8Array(await response.arrayBuffer()));

            await this.conn.query(`DROP TABLE IF EXISTS ${this.table};`);
            
            await this.conn.query(`
                CREATE TABLE ${this.table} AS SELECT * FROM read_json_auto('${jsonFileName}');
            `);
            
            console.log(`Arquivo '${jsonFileName}' carregado com sucesso na tabela '${this.table}'.`);

        } catch (error) {
            console.error("Erro durante o carregamento dos dados:", error);
            throw error;
        }
    }

    /**
     * Executa uma consulta SQL no banco de dados.
     * @param {string} sql - A consulta SQL a ser executada.
     */
    async query(sql) {
        if (!this.conn) {
            throw new Error('Sem conexão com o banco de dados. Chame init() e loadData() primeiro.');
        }
        let result = await this.conn.query(sql);
        return result.toArray().map(row => row.toJSON());
    }
}