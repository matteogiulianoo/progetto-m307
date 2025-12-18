import mysql from 'mysql2/promise';
import fs from 'fs';
import { parseINIString } from './../public/js/utilities.js';

const __dirname = import.meta.dirname;

let pool;

/**
 * Questa funzione permette la connessione al database
 */
export function connect() {
    if (pool) return pool;

    const data = fs.readFileSync(__dirname + '/data.dat', 'utf-8');
    const js_ini = parseINIString(data);

    pool = mysql.createPool({
        host: js_ini.Database.host,
        user: js_ini.Database.user,
        password: js_ini.Database.password,
        database: js_ini.Database.database,
        waitForConnections: true,
        connectionLimit: 10
    });

    return pool;
}