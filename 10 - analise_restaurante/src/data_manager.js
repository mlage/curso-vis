import { loadDb } from './config';

export class DataManager {
    async init() {
        this.db = await loadDb();
        this.conn = await this.db.connect();
        this.table = 'restaurantes';
    }

    async loadData() {
        if (!this.db || !this.conn)
            throw new Error('Database not initialized. Please call init() first.');
        
        const dataUrl = 'data/restaurante.json';
        const res = await fetch(dataUrl);
        await this.db.registerFileBuffer('restaurante.json', new Uint8Array(await res.arrayBuffer()));

        try {
            await this.conn.query(`DROP TABLE ${this.table};`);
        } catch (e) {
        }
        
        await this.conn.query(`
            CREATE TABLE ${this.table} AS
                SELECT * FROM read_json_auto('restaurante.json');
        `);
    }

    async query(sql) {
        if (!this.db || !this.conn)
            throw new Error('Database not initialized. Please call init() first.');

        let result = await this.conn.query(sql);
        return result.toArray().map(row => row.toJSON());
    }

    async test(limit = 10) {
        if (!this.db || !this.conn)
            throw new Error('Database not initialized. Please call init() first.');

        const sql = `
            SELECT * FROM ${this.table}
            LIMIT ${limit}
        `;
        return await this.query(sql);
    }
}