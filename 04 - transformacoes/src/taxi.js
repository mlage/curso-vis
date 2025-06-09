import { AsyncDuckDB, AsyncDuckDBConnection } from '@duckdb/duckdb-wasm';

import { loadDb } from './config';

export class Taxi {

    async init() {
        this.db = await loadDb();
        this.conn = await this.db.connect();

        this.color = "green";
        this.table = 'taxi_2023';
    }

    async loadTaxi(months = 3) {
        if (!this.db || !this.conn)
            throw new Error('Database not initialized. Please call init() first.');

        const files = [];

        for (let id = 1; id <= months; id++) {
            const sId = String(id).padStart(2, '0')
            files.push({ key: `Y2023M${sId}`, url: `${this.color}/${this.color}_tripdata_2023-${sId}.parquet` });

            const res = await fetch(files[files.length - 1].url);
            await this.db.registerFileBuffer(files[files.length - 1].key, new Uint8Array(await res.arrayBuffer()));
        }

        await this.conn.query(`
            CREATE TABLE ${this.table} AS
                SELECT * 
                FROM read_parquet([${files.map(d => d.key).join(",")}]);
        `);
    }

    async query(sql) {
        if (!this.db || !this.conn)
            throw new Error('Database not initialized. Please call init() first.');

        let result = await this.conn.query(sql);
        return result.toArray().map(row => row.toJSON());
    }

    // -------------------
    // Transformation
    // -------------------

    async select(limit = 50) {
        if (!this.db || !this.conn)
            throw new Error('Database not initialized. Please call init() first.');

        const cols = ['trip_distance', 'tip_amount'];

        const sql = `
            SELECT COLUMNS([${cols}]) 
            FROM ${this.table}
            LIMIT ${limit};
        `
        return await this.query(sql);
    }

    async filter(limit = 50) {
        if (!this.db || !this.conn)
            throw new Error('Database not initialized. Please call init() first.');

        const month = 3;
        const year = 2023;

        const sql = `
            SELECT *
            FROM ${this.table}
            WHERE month(lpep_pickup_datetime) = ${month} AND year(lpep_pickup_datetime) = ${year}
            LIMIT ${limit};
        `
        return await this.query(sql);
    }

    async groupBy(limit = 50) {
        if (!this.db || !this.conn)
            throw new Error('Database not initialized. Please call init() first.');

        const month = 3;
        const year = 2023;

        const sql = `
            SELECT day(lpep_pickup_datetime) as day, count(*) as count
            FROM ${this.table}
            WHERE month(lpep_pickup_datetime) = ${month} AND year(lpep_pickup_datetime) = ${year}
            GROUP BY day
            LIMIT ${limit};
        `
        return await this.query(sql);
    }

    async binning(limit = 50) {
        if (!this.db || !this.conn)
            throw new Error('Database not initialized. Please call init() first.');

        const sql = `
            SELECT 
            count(CASE WHEN fare_amount>= 0  AND fare_amount < 10 THEN 1 END) AS '0  - 10',
            count(CASE WHEN fare_amount>= 10 AND fare_amount < 20 THEN 1 END) AS '10 - 20',
            count(CASE WHEN fare_amount>= 20 AND fare_amount < 30 THEN 1 END) AS '20 - 30',
            count(CASE WHEN fare_amount>= 30 AND fare_amount < 40 THEN 1 END) AS '30 - 40',
            count(CASE WHEN fare_amount>= 40 AND fare_amount < 50 THEN 1 END) AS '40 - 50',
            count(CASE WHEN fare_amount>= 50 AND fare_amount < 60 THEN 1 END) AS '50 - 60',
            count(CASE WHEN fare_amount>= 60 AND fare_amount < 70 THEN 1 END) AS '60 - 70',
            count(CASE WHEN fare_amount>= 70 AND fare_amount < 80 THEN 1 END) AS '70 - 80',
            count(CASE WHEN fare_amount>= 80 AND fare_amount < 90 THEN 1 END) AS '80 - 90',
            count(CASE WHEN fare_amount>= 90 AND fare_amount <100 THEN 1 END) AS '90 -100',
            count(CASE WHEN fare_amount>= 100 THEN 1 END) AS '100 - *',
            FROM ${this.table}
            LIMIT ${limit};
        `
        return await this.query(sql);
    }

    async normalize(limit = 50) {
        if (!this.db || !this.conn)
            throw new Error('Database not initialized. Please call init() first.');

        const sql = `
            SELECT *,
                   (fare_amount - t1.min_fare) / (t1.max_fare - t1.min_fare) as normalized
            FROM ${this.table},
                 (
                    SELECT MAX(fare_amount) as max_fare, MIN(fare_amount) as min_fare
                    FROM ${this.table}  
                 ) t1
            LIMIT ${limit};
        `
        return await this.query(sql);
    }

    async derive(limit = 50) {
        if (!this.db || !this.conn)
            throw new Error('Database not initialized. Please call init() first.');

        const sql = `
            SELECT *,
                   fare_amount * 0.2 > tip_amount as suggested_tip
            FROM ${this.table}
            LIMIT ${limit};
        `
        return await this.query(sql);
    }
}