import { sql } from '../../database/db-utilities.js';
import { currentUser } from './utilities.js';

// -----------------------------------------------------------------
// SELECT QUERY
// -----------------------------------------------------------------
/**
 * Prende il nome, il cognome e li unisce assieme
 * @param {*} idCurrentUser 
 */
export async function getFullName(idCurrentUser) {
    return await sql("SELECT CONCAT(name, ' ', surname) FROM users WHERE idUser = ?", [idCurrentUser])
        .then(res => {
            return res;
        })
        .catch(e => {
            console.error(e);
            throw e;
    });
}

/**
 * Restituisce il cantone di residenza dell'utente connesso
 * @param {*} idCurrentUser 
 */
export async function getCanton(idCurrentUser) {
    return await sql("SELECT canton FROM users WHERE idUser = ?", [idCurrentUser])
        .then(res => {
            return res;
        })
        .catch(e => {
            console.error(e);
            throw e;
    });
}

/**
 * Restituisce lo stato di residenza dell'utente connesso
 * @param {*} idCurrentUser 
 */
export async function getState(idCurrentUser) {
    return await sql("SELECT state FROM users WHERE idUser = ?", [idCurrentUser])
        .then(res => {
            return res;
        })
        .catch(e => {
            console.error(e);
            throw e;
    });
}

/**
 * Restituisce il ruolo (es: 'Developer') dell'utente connesso
 * @param {*} idCurrentUser 
 */
export async function getRole(idCurrentUser) {
    return await sql("SELECT p.namePermission FROM users u JOIN role_permissions rp ON u.idRole = rp.idRole JOIN permissions p ON rp.idPermission = p.idPermission WHERE u.idUser = ?", [idCurrentUser])
        .then(res => {
            return res;
        })
        .catch(e => {
            console.error(e);
            throw e;
    });
}

/**
 * Restituisce tutti i dati dell'utente connesso
 * @param {*} idCurrentUser 
 */
export async function getAllData(idCurrentUser) {
    const fullName = getFullName(idCurrentUser);
    const canton = getCanton(idCurrentUser);
    const state = getState(idCurrentUser);
    const role = getRole(idCurrentUser);

    const data = [
        {fullName: fullName, canton: canton, state: state, role: role}
    ];

    const res = data && data.length > 0 ? data : null;
    return res;
}