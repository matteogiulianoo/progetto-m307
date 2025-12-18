import { sql } from '../../database/db-utilities.js';
import bcrypt from 'bcrypt';

const saltRounds = 10;

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

// -----------------------------------------------------------------
// LOGIN & REGISTER QUERY
// -----------------------------------------------------------------
/**
 * Questa funzione serve per eseguire l'accesso nel sistema
 * @param {*} email 
 * @param {*} password 
 */
export async function login(email, password) {
    if (email == '' || password == '') return;
    if (validateEmail(email)) {
        const pswd = protect(password);
        return await sql("SELECT idUser FROM users WHERE email = ? AND pswd = ?", [email, pswd])
            .then(res => {
                return res;
            })
            .catch(e => {
                console.error(e);
                throw e;
        });
    }
}

/**
 * Questa funzione serve per registrare un nuovo utente nel database
 * @param {*} name 
 * @param {*} surname 
 * @param {*} email 
 * @param {*} password 
 * @param {*} canton 
 * @param {*} state 
 */
export async function register(name, surname, email, password, canton, state) {
    if (name == '' || surname == '' || email == '' || password == '' || canton == '' || state == '') return;
    if (validateEmail(email)) {
        const pswd = protect(password);
        return await sql("INSERT INTO users (name, surname, email, password, canton, state) VALUE (?,?,?,?,?,?)", [name, surname, email, pswd, canton, state])
            .then(res => {
                return res;
            })
            .catch(e => {
                console.error(e);
                throw e;
        });
    }
}

/**
 * Variabile (lambda) per controllare se l'e-mail inserita è valida
 */
const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

/**
 * Funzione per crittografare un testo
 */
async function protect(text) {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(text, salt);
}