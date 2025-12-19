import express from 'express';

// Funzioni custom
import { isAuthenticated } from '../app.js';
import { newThreads, loadThread, updateThreads, deleteThreads } from '../public/js/home.js';
import { addStars, removeStars } from '../public/js/stars.js';

const __dirname = import.meta.dirname;
const router = express.Router();

// ---------------------------------------------------
// LOGICA
// ---------------------------------------------------
/**
 * Crea un thread all'interno del sistema
 */
router.post('/createThread', isAuthenticated, async (req, res) => {
    const title = req.body.title;
    const desc = req.body.description;

    try {
        const status = await newThreads(req.session.idUser, title, desc);
        if (!status) return;
        const add = await addStars(req.session.idUser, 10);
        if (!add) return;
        res.redirect('/');
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Errore DB");
    }
});

/**
 * Carica un thread all'interno del sistema
 */
router.post('/loadThread', isAuthenticated, async (req, res) => {
    const idThread = req.body.idThread;
    
    try {
        const thread = await loadThread(idThread);
        res.json(thread);
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Errore DB");
    }
});

/**
 * Aggiorna un thread all'interno del sistema
 */
router.patch('/updateThread', isAuthenticated, async (req, res) => {
    const idThread = req.body.idThread;
    const idUser = req.session.idUser;
    const title = req.body.title;
    const description = req.body.description;

    try {
        const thread = await updateThreads(idThread, idUser, title, description);
        res.json(thread);
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Errore DB");
    }
});

/**
 * Elimina un thread dal sistema
 */
router.delete('/deleteThread', isAuthenticated, async (req, res) => {
    const idThread = req.body.idThread;
    const idUser = req.session.idUser;

    try {
        await deleteThreads(idThread, idUser);
        const remove = await removeStars(req.session.idUser, 15);
        if (!remove) return;
        res.json({ success: true });
    } catch (e) {
        if (e.message === 'Unauthorized to delete this thread') {
            res.status(403).json({ error: 'Non autorizzato a eliminare questo thread' });
        } else {
            console.error(e.message);
            res.status(500).json({ error: 'Errore DB' });
        }
    }
});

export {router};