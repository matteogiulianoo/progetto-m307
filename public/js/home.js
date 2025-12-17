import { sql } from '../../database/db-utilities.js';

/**
 * Questa funzione restituisce tutti i threads
 */
export async function allThreads() {
    return await sql("SELECT u.name AS owner, t.title, CASE WHEN CHAR_LENGTH(t.description) > 100 THEN CONCAT(LEFT(t.description, 100), '...') ELSE t.description END AS short_desc FROM threads t JOIN users u ON u.idUser = t.owner")
        .then(res => {
            return res;
        })
        .catch(e => {
            console.error(e);
            throw e;
    });
}

async function personalThreads(idCurrentUser) {

}