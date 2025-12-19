import { sql } from '../../database/db-utilities.js';

/**
 * Popola la pagina con tutte le utenze presenti nel sistema
 */
export async function populate() {
    return await sql("SELECT name, surname, canton, state, photo_path FROM users")
        .then(res => {
            return res;
        })
        .catch(e => {
            console.error(e);
            throw e;
    });
}