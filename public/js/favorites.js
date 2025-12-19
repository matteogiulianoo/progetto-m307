import { sql } from '../../database/db-utilities.js';

// -----------------------------------------------------------------
// INSERT QUERY
// -----------------------------------------------------------------
export async function add(idCurrentUser, idThread) {
    return await sql("INSERT INTO favorites_threads (idUser, idThread) VALUE (?,?)", [idCurrentUser, idThread])
        .then(res => {
            return res;
        })
        .catch(e => {
            console.error(e);
            throw e;
    });
}