import { AsyncDuckDB, AsyncDuckDBConnection } from '@duckdb/duckdb-wasm';

import { Table } from './types';
import { loadDb } from './config';

export class Taxi {
    private db?: AsyncDuckDB;
    private conn?: AsyncDuckDBConnection;

    private tables?: any;

    async init() {
        this.db = await loadDb();
        this.conn = await this.db.connect();
    }

    async loadTaxi(): Promise<any> {
        if (!this.db || !this.conn)
            throw new Error('Database not initialized. Please call init() first.');

        const table = 'TAXI_2023';

        for (let id = 1; id <= 1; id++) {
            const sId = String(id).padStart(2, '0')
            const file = `../data/yellow_tripdata_2023-${sId}.parquet`;

            const res = await fetch(file);
            await this.db.registerFileBuffer(`taxi_2023_${sId}.parquet`, new Uint8Array(await res.arrayBuffer()));

            const result = await this.conn.query(`
                CREATE TABLE test AS
                    SELECT * FROM taxi_2023_${sId}.parquet;
            `);

            const res2 = await this.conn.query(`
                SELECT * FROM test;
            `);

            console.log(res2);
        }

        return;
    }
}

async function main() {
    const taxi = new Taxi();

    await taxi.init();
    await taxi.loadTaxi();
}

main();