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
    return await sql("UPDATE threads SET title = ?, description = ?, lastModified = ? WHERE idThread = ? AND owner = ?", [title, description, new Date().toISOString().slice(0, 19).replace('T', ' '), idThread, idCurrentUser])
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
    // Verifica se l'utente è il proprietario del thread
    const isOwner = await sql("SELECT 1 FROM threads WHERE owner = ? AND idThread = ?", [idCurrentUser, idThread]);
    if (isOwner.length > 0) {
        // L'utente è il proprietario, cancella il thread
        return await sql("DELETE FROM threads WHERE owner = ? AND idThread = ?", [idCurrentUser, idThread])
            .then(res => res)
            .catch(e => {
                console.error(e);
                throw e;
            });
    }

    // Se non è il proprietario, verifica se è admin
    const admin = 1;
    const idPUser = await sql("SELECT idPermission FROM users WHERE idUser = ?", [idCurrentUser]);
    if (idPUser[0].idPermission === admin) {
        // L'utente è admin, cancella il thread
        return await sql("DELETE FROM threads WHERE idThread = ?", [idThread])
            .then(res => res)
            .catch(e => {
                console.error(e);
                throw e;
            });
    }

    throw new Error('Unauthorized to delete this thread');
}


// -----------------------------------------------------------------
// SELECT QUERY
// -----------------------------------------------------------------
/**
 * Questa funzione restituisce tutti i threads
 */
export async function allThreads() {
    return await sql("SELECT u.name AS owner, u.photo_path AS owner_photo, t.idThread, t.title, CASE WHEN CHAR_LENGTH(t.description) > 100 THEN CONCAT(LEFT(t.description, 100), '...') ELSE t.description END AS short_desc FROM threads t JOIN users u ON u.idUser = t.owner")
        .then(res => {
            return res;
        })
        .catch(e => {
            console.error(e);
            throw e;
    });
}

export async function allFavThreads(idUser) {
    return await sql("SELECT u.name AS owner, u.photo_path AS owner_photo, t.idThread, t.title, CASE WHEN CHAR_LENGTH(t.description) > 100 THEN CONCAT(LEFT(t.description, 100), '...') ELSE t.description END AS short_desc FROM threads  LIMIT 3")
}

/**
 * Questa funzione restituisce un'unico thread
 * @param {*} idThread 
 */
export async function loadThread(idThread) {
    return await sql("SELECT u.name AS owner, t.idThread, t.title, t.description FROM threads t JOIN users u ON u.idUser = t.owner WHERE t.idThread = ?", [idThread])
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
    return await sql("SELECT u.name AS owner, u.photo_path AS owner_photo, t.idThread, t.title, CASE WHEN CHAR_LENGTH(t.description) > 100 THEN CONCAT(LEFT(t.description, 50), '...') ELSE t.description END AS short_desc FROM threads t JOIN users u ON u.idUser = t.owner WHERE t.owner = ? LIMIT 5", [idCurrentUser])
        .then(res => {
            return res;
        })
        .catch(e => {
            console.error(e);
            throw e;
    });
}