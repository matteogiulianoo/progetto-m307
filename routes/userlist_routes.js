import express from 'express';

// Funzioni custom
import { isAuthenticated } from '../app.js';
import { populate } from './../public/js/userlist.js';

const __dirname = import.meta.dirname;
const router = express.Router();

// ---------------------------------------------------
// PAGINE
// ---------------------------------------------------
router.get("/user", isAuthenticated, async (req, res) => {
    try {
        const popUser = await populate();
        if (!popUser) return;
        res.render('pages/list_users', { layout: false });
    } catch (e) {
        console
    }
})

export {router};