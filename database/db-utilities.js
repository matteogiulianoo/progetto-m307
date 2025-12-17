import { connect } from './db-connection.js';

/**
 * Esegue una sql e chiude la connessione
 * @param {*} query 
 */
export async function sql(query, params = []) {
    const pool = connect();

    try {
        const [rows] = await pool.query(query, params);
        return rows;
    } catch (err) {
        throw err;
    }
}