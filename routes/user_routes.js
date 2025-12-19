import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import session from 'express-session';

// Funzioni custom
import { isAuthenticated } from '../app.js';
import { login, register } from '../public/js/users.js';
import { parseINIString } from '../public/js/utilities.js';

const __dirname = import.meta.dirname;
const router = express.Router();

// Gestore sessioni utente + recupero secret key
const pathSecret = path.join(__dirname, '..', 'config', 'data.dat');
const secretKey = fs.readFileSync(pathSecret, 'utf-8');
const js_iniSecretKey = parseINIString(secretKey);
router.use(session({
    secret: js_iniSecretKey.Security.secretkey,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 3
    }
}));

// Creo uno storage per configurare multer (salvataggio file foto profilo)
const pathStorage = path.join(__dirname, '..','public', 'images', 'profiles');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, pathStorage);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// ---------------------------------------------------
// PAGINE
// ---------------------------------------------------
/**
 * Carica la pagina di accesso utente
 */
router.get('/login', async (req, res) => {
    res.render('pages/login', { layout: false });
});

/**
 * Carica la pagina di registrazione utente
 */
router.get('/register', async (req, res) => {
    res.render('pages/register', { layout: false });
});

// ---------------------------------------------------
// LOGICA
// ---------------------------------------------------
/**
 * La logica per accedere al sistema
 */
router.post('/login', async (req, res) => {
    const email = req.body.email;
    const pswd = req.body.pswd;
    
    try {
        const log = await login(email, pswd);
        if (!log || log.length == 0) return res.redirect('/login');
        req.session.idUser = log.idUser;
        req.session.email = log.email;
        req.session.save(() => { res.redirect('/') });
    } catch (err) {
        console.error(err);
        res.redirect('/login');
    }
});

/**
 * La logica per registrarsi al sistema
 */
/* In questo blocco di codice, le seguenti righe sono state generate con l'aiuto dell'AI:
upload.single('profilePhoto') & const profilePhotoPath = req.file ? `/images/profiles/${req.file.filename}` : null; */
router.post('/register', upload.single('profilePhoto'), async (req, res) => {
    const nome = req.body.nome;
    const cognome = req.body.cognome;
    const email = req.body.email;
    const pswd = req.body.pswd;
    const nazione = req.body.nazione;
    const cantone = req.body.cantone;

    const profilePhotoPath = req.file ? `/images/profiles/${req.file.filename}` : null;

    try {
        const reg = await register(nome, cognome, email, pswd, cantone, nazione, profilePhotoPath);
        if (!reg) return res.redirect('/register'); 
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.redirect('/register');
    }
});

/**
 * La logica per disconnettersi dal sistema
 */
// Logout
router.get('/logout', isAuthenticated, async (req, res) => {
    req.session.destroy(e => {
        if (e) {
            return res.redirect('/');
        }

        res.clearCookie('connect.sid');
        res.redirect('/login');
    })
});

export {router};