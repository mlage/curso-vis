import { AsyncDuckDB, AsyncDuckDBConnection } from '@duckdb/duckdb-wasm';

import { loadDb } from './config';

export class Taxi {
    private db?: AsyncDuckDB;
    private conn?: AsyncDuckDBConnection;

    private color = "green";
    private table = 'taxi_2023';

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
            files.push({ key: `Y2023M${sId}`, url: `../data/${this.color}/${this.color}_tripdata_2023-${sId}.parquet` });

            const res = await fetch(files[files.length - 1].url);
            await this.db.registerFileBuffer(files[files.length - 1].key, new Uint8Array(await res.arrayBuffer()));
        }

        await this.conn.query(`
            CREATE TABLE ${this.table} AS
                SELECT * 
                FROM read_parquet([${files.map(d => d.key).join(",")}]);
        `);
    }

    async queryTaxi(sql: string) {
        if (!this.db || !this.conn)
            throw new Error('Database not initialized. Please call init() first.');
        
        let result =  await this.conn.query(sql);
        return result.toArray().map(row => row.toJSON());
    }

    async groupByMonth() {
        if (!this.db || !this.conn)
            throw new Error('Database not initialized. Please call init() first.');

        const sql = `
            SELECT    COUNT(*) 
            FROM      ${this.table} 
            GROUP BY  MONTH(lpep_pickup_datetime)
        `
        return (await this.queryTaxi(sql)).map(row => row["count_star()"].toString());
    }

    async test(limit: number | undefined = undefined) {
        if (!this.db || !this.conn)
            throw new Error('Database not initialized. Please call init() first.');
        
        let result = null;
        if(limit) {
            result = await this.conn.query(`
                SELECT * 
                FROM ${this.table}
                LIMIT ${limit}
            `);
        }
        else {
            result = await this.conn.query(`
                SELECT * 
                FROM ${this.table}
            `);
        }

        console.log("Query finished.")
        return result.toArray().map(row => row.toJSON());
    }
}