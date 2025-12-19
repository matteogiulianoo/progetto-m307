import express from 'express';

// Funzioni custom
import { isAuthenticated } from '../app.js';
import { populate } from './../public/js/stafflist.js';


const __dirname = import.meta.dirname;
const router = express.Router();

// ---------------------------------------------------
// PAGINE
// ---------------------------------------------------
router.get("/staff", isAuthenticated, async (req, res) => {
    try {
        const popStaff = await populate();
        if (!popStaff) return;
        res.render('pages/list_staff', { layout: false });
    } catch (e) {
        console
    }
})

export {router};