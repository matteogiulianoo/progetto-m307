import express from 'express';
import path from 'path';
import methodOverride from 'method-override';
import expressLayouts from 'express-ejs-layouts';
import multer from 'multer';
import fs from 'fs';
import session from 'express-session';
import { allThreads, newThreads } from './public/js/home.js';
import { getAllData } from './public/js/users.js';
import { parseINIString } from './public/js/utilities.js';

// dirname = nome directory
const __dirname = import.meta.dirname;
const app = express();

// views = cartella con .ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Gestore sessioni utente + recupero secret key
const secretKey = fs.readFileSync(__dirname + '/config/data.dat', 'utf-8');
const js_iniSecretKey = parseINIString(secretKey);
app.use(session({
    secret: js_iniSecretKey.Security.secretkey,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 3
    }
}));

// Variabile isLoggedIn
app.use((req, res, next) => {
    res.locals.isLoggedIn = !!req.session.user;
    next();
});

// Carica la home
app.get('/', isAuthenticated, async (req, res) => {
    try {
        const resAllThreads = await allThreads();
        /*
            // recupera tutti i dati di un utente connesso
            const allData = await getAllData();

            si dovrà passare allData dopo resAllThreads in res.render()
        */
        res.render('home', { resAllThreads });
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Errore DB");
    }
});

// Carica la pagina di login
app.get('/login', async (req, res) => {
    // TODO
    // 1. Check nel Database (const login ...)

    if (!login) res.redirect('/login');

    req.session.id = login[0];
    req.session.save(() => {
        res.redirect("/")
    });
});

// Logout
app.get('/logout', isAuthenticated, async (req, res) => {
    req.session.destroy(e => {
        if (e) {
            return res.redirect('/');
        }

        res.clearCookie('connect.sid');
        res.redirect('/login');
    })
});

// Crea un thread
app.post('/createThread', isAuthenticated, async (req, res) => {
    const currentUser = req.body.idUser;
    const title = req.body.title;
    const desc = req.body.description;

    try {
        const status = await newThreads(currentUser, title, desc);
        // ... write code
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Errore DB");
    }
});

// Aggiorna un thread
//app.patch('/')

// Elimina un thread
//app.delete('/')

app.listen(3000);





// Protezione CALL
function isAuthenticated (req, res, next) {
    if (req.session.user == null) {
        res.redirect('/login')
    } else {
        next()
    }
}