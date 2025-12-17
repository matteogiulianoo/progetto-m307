import mysql from 'mysql2/promise';
import fs from 'fs';

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

/**
 * Questa funzione legge un file .ini e lo converte in una stringa
 * @param {*} data 
 */
function parseINIString(data) {
    var regex = {
        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
        param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/
    };

    var value = {};
    var lines = data.split(/[\r\n]+/);
    var section = null;

    lines.forEach(function(line) {
        if (regex.comment.test(line)) {
            return;
        } else if (regex.param.test(line)) {
            var match = line.match(regex.param);
            if (section) {
                value[section][match[1]] = match[2];
            }
        } else if (regex.section.test(line)) {
            var match = line.match(regex.section);
            value[match[1]] = {};
            section = match[1];
        } else if (line.length == 0 && section) {
            section = null;
        };
    });

    return value;
}