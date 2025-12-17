import { sql } from '../../database/db-utilities.js';

/**
 * Questa funzione restituisce tutti i threads
 */
export async function allThreads() {
    const threads = await sql("SELECT owner, title, description FROM threads");
    console.log(threads);
}

async function personalThreads(idCurrentUser) {

}