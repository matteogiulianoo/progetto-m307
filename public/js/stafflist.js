import { sql } from '../../database/db-utilities.js';

/**
 * Popola la pagina con tutte le utenze (administrator & developer) presenti nel sistema
 */
export async function populate() {
    // id permissions
    const admin = 1;
    const dev = 2;

    return await sql("SELECT name, surname, canton, state, photo_path FROM users WHERE idPermission = ? or idPermission = ?", [admin, dev])
        .then(res => {
            return res;
        })
        .catch(e => {
            console.error(e);
            throw e;
    });
}