import { sql } from '../../database/db-utilities.js';

/**
 * Conta tutte le stelle dell'utente connesso
 * @param {*} idCurrentUser 
 */
export async function getStars(idCurrentUser) {
    return await sql("SELECT stars FROM stars WHERE idUser = ?", [idCurrentUser])
        .then(res => {
            return res;
        })
        .catch(e => {
            console.error(e);
            throw e;
    });
}

/**
 * Aggiunge un determinato numero di stelle
 * @param {*} idCurrentUser 
 * @param {*} count 
 */
export async function addStars(idCurrentUser, count) {
    return await sql("UPDATE stars SET stars = stars + ? WHERE idUser = ?", [count, idCurrentUser])
        .then(res => {
            return res;
        })
        .catch(e => {
            console.error(e);
            throw e;
    });
}

/**
 * Rimuove un determinato numero di stelle
 * @param {*} idCurrentUser 
 * @param {*} count 
 */
export async function removeStars(idCurrentUser, count) {
    return await sql("UPDATE stars SET stars = stars - ? WHERE idUser = ?", [count, idCurrentUser])
        .then(res => {
            return res;
        })
        .catch(e => {
            console.error(e);
            throw e;
    });
}

/**
 * Inizializza per la prima volta le stelle nell'account di un utente
 * @param {*} idUser
 */
export async function initStars(idUser) {
    return await sql("INSERT INTO stars (stars, idUser) VALUE (?,?)", [0, idUser])
        .then(res => {
            return res;
        })
        .catch(e => {
            console.error(e);
            throw e;
    });
}