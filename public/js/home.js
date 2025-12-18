import { sql } from '../../database/db-utilities.js';

// -----------------------------------------------------------------
// INSERT QUERY
// -----------------------------------------------------------------
/**
 * Questa funzione inserisce un nuovo thread collegandolo ad un'utente
 * @param {*} idCurrentUser 
 * @param {*} title 
 * @param {*} description 
 * @returns 
 */
export async function newThreads(idCurrentUser, title, description) {
    return await sql("INSERT INTO threads (owner, title, description) VALUE (?, ?, ?)", [idCurrentUser, title, description])
        .then(res => {
            return res;
        })
        .catch(e => {
            console.error(e);
            throw e;
    });
}

// -----------------------------------------------------------------
// UPDATE QUERY
// -----------------------------------------------------------------
/**
 * Questa funzione modifica un thread già esistente
 * @param {*} idThread 
 * @param {*} idCurrentUser 
 * @param {*} title 
 * @param {*} description 
 * @returns 
 */
export async function updateThreads(idThread, idCurrentUser, title, description) {
    return await sql("UPDATE threads SET title = ?, description = ?, lastModified = ? WHERE idThread = ? AND owner = ?", [title, description, Date.now(), idThread, idCurrentUser])
        .then(res => {
            return res;
        })
        .catch(e => {
            console.error(e);
            throw e;
    });
}

// -----------------------------------------------------------------
// DELETE QUERY
// -----------------------------------------------------------------
/**
 * Questa funzione permette di eliminare un proprio thread, oppure se si è un amministratore, eliminare i vari threads
 * @param {*} idThread 
 * @param {*} idCurrentUser 
 * @returns 
 */
export async function deleteThreads(idThread, idCurrentUser) {
    // CONTROLLARLO ASSOLUTAMENTE DOMANI
    const admin = 1;
    const idPUser = await sql("SELECT idPermission FROM users WHERE idUser = ?", [idCurrentUser]);
    if (idPUser[0] != admin) return;

    return await sql("DELETE FROM threads WHERE (owner = ? AND idThread = ?) OR (idThread = ? AND idPermission = ?)", [idCurrentUser, idThread, idThread, 1])
        .then(res => {
            return res;
        })
        .catch(e => {
            console.error(e);
            throw e;
    });
}

// -----------------------------------------------------------------
// SELECT QUERY
// -----------------------------------------------------------------
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
export async function personalThreads(idCurrentUser) {
    return await sql("SELECT u.name AS owner, t.title, CASE WHEN CHAR_LENGTH(t.description) > 100 THEN CONCAT(LEFT(t.description, 50), '...') ELSE t.description END AS short_desc FROM threads t JOIN users u ON u.idUser = t.owner WHERE t.owner = ? LIMIT 5", [idCurrentUser])
        .then(res => {
            return res;
        })
        .catch(e => {
            console.error(e);
            throw e;
    });
}