import { sql } from '../../database/db-utilities.js';

// -----------------------------------------------------------------
// INSERT QUERY
// -----------------------------------------------------------------
/**
 * Aggiungi un nuovo amico
 * @param {*} idFriendOne 
 * @param {*} idFriendTwo 
 */
export async function add(idFriendOne, idFriendTwo) {
    return await sql("INSERT INTO friend (idUserOne, idUserTwo) VALUE (?,?)", [idFriendOne, idFriendTwo])
        .then(res => {
            return res;
        })
        .catch(e => {
            console.error(e);
    });
}

// -----------------------------------------------------------------
// SELECT QUERY
// -----------------------------------------------------------------
/**
 * Carica i dati di una coppia di amici
 * @param {*} idFriendOne 
 * @param {*} idFriendTwo 
 */
export async function load(idFriendOne, idFriendTwo) {
    return await sql("SELECT * FROM friend WHERE (idUserOne = ? AND idUserTwo = ?) OR (idUserOne = ? AND idUserTwo = ?) LIMIT 1", [idFriendOne, idFriendTwo, idFriendTwo, idFriendOne])
        .then(res => {
            return res;
        })
        .catch(e => {
            console.error(e);
    });
}

// -----------------------------------------------------------------
// UPDATE QUERY
// -----------------------------------------------------------------
/**
 * Riabilita l'amicizia con un amico
 * @param {*} idFriendOne 
 * @param {*} idFriendTwo 
 */
export async function enable(idFriendOne, idFriendTwo) {
    const friend = await load(idFriendOne, idFriendTwo);
    if (!friend) return null;

    return await sql("UPDATE friend SET status_friend = 1 WHERE idFriend = ?", [friend])
        .then(res => {
            return res;
        })
        .catch(e => {
            console.error(e);
    });
}

/**
 * Disabilita l'amicizia con un amico
 * @param {*} idFriendOne 
 * @param {*} idFriendTwo 
 */
export async function disable(idFriendOne, idFriendTwo) {
    const friend = await load(idFriendOne, idFriendTwo);

    return await sql("UPDATE friend SET status_friend = 0 WHERE idFriend = ?", [friend])
        .then(res => {
            return res;
        })
        .catch(e => {
            console.error(e);
    });
}