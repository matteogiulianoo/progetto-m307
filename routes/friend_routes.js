import express from 'express';

// Funzioni custom
import { isAuthenticated } from '../app.js';
import { add, load, enable, disable } from '../public/js/friends.js';

const __dirname = import.meta.dirname;
const router = express.Router();

// ---------------------------------------------------
// LOGICA
// ---------------------------------------------------
/**
 * Questa è la logica per creare un'amicizia
 */
router.post('/addFriend', isAuthenticated, async (req, res) => {
    const idCurrentUser = req.session.idUser;
    const idFriendTwo = req.body.idfriendtwo;

    try {
        const friend = await add(idCurrentUser, idFriendTwo);
        res.json(friend);
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Errore DB");
    }
});

/**
 * Questa è la logica per caricare i dati di una coppia di amici
 */
router.post('/loadFriend', isAuthenticated, async (req, res) => {
    const idCurrentUser = req.session.idUser;
    const idFriendTwo = req.body.idfriendtwo;

    try {
        const loadFriend = await load(idCurrentUser, idFriendTwo);
        res.json(loadFriend);
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Errore DB");
    }
});

/**
 * Questa è la logica per abilitare un'amicizia
 */
router.patch('/enableFriend', isAuthenticated, async (req, res) => {
    const idCurrentUser = req.session.idUser;
    const idFriendTwo = req.body.idfriendtwo;

    try {
        const enableFriend = await enable(idCurrentUser, idFriendTwo);
        res.json(enableFriend);
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Errore DB");
    }
});

/**
 * Questa è la logica per disabilitare un'amicizia
 */
router.patch('/disableFriend', isAuthenticated, async (req, res) => {
    const idCurrentUser = req.session.idUser;
    const idFriendTwo = req.body.idfriendtwo;

    try {
        const disableFriend = await disable(idCurrentUser, idFriendTwo);
        res.json(disableFriend);
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Errore DB");
    }
});

export {router};