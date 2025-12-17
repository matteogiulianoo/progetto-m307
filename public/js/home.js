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

/**
 * Questa funzione restituisce gli ultimi 5 threads inviati da un'utente
 * @param {*} idCurrentUser 
 */
async function personalThreads(idCurrentUser) {
    return await sql("SELECT u.name AS owner, t.title, CASE WHEN CHAR_LENGTH(t.description) > 100 THEN CONCAT(LEFT(t.description, 50), '...' ELSE t.description END AS short_desc FROM threads t JOIN users u ON u.idUser = t.owner WHERE t.owner = ? LIMIT 5", [idCurrentUser])
        .then(res => {
            return res;
        })
        .catch(e => {
            console.error(e);
            throw e;
        })
}