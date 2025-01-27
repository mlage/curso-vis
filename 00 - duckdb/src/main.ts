import { AsyncDuckDB, AsyncDuckDBConnection } from '@duckdb/duckdb-wasm';

import { loadDb } from './config';

export class Taxi {
    private db?: AsyncDuckDB;
    private conn?: AsyncDuckDBConnection;

    private table = 'TAXI_2023';

    async init() {
        this.db = await loadDb();
        this.conn = await this.db.connect();
    }

    async loadTaxi(months: number = 3) {
        if (!this.db || !this.conn)
            throw new Error('Database not initialized. Please call init() first.');

        const files = [];

        for (let id = 1; id <= months; id++) {
            const sId = String(id).padStart(2, '0')
            files.push({ key: `Y2023M${sId}`, url: `../data/yellow_tripdata_2023-${sId}.parquet` });

            const res = await fetch(files[files.length - 1].url);
            await this.db.registerFileBuffer(files[files.length - 1].key, new Uint8Array(await res.arrayBuffer()));
        }

        await this.conn.query(`
            CREATE TABLE ${this.table} AS
                SELECT * 
                FROM read_parquet([${files.map(d => d.key).join(",")}]);
        `);
    }

    async test(limit: number = 100) {
        if (!this.db || !this.conn)
            throw new Error('Database not initialized. Please call init() first.');

        const res = await this.conn.query(`
            SELECT * 
            FROM ${this.table}
            LIMIT ${limit};
        `);

        console.log(res);
    }
}

async function main() {
    const taxi = new Taxi();

    await taxi.init();
    await taxi.loadTaxi(1);
    await taxi.test(1);
}

main();