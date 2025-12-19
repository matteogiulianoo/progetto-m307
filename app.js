import express from 'express';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';

// Funzioni custom
import { allThreads, personalThreads } from './public/js/home.js';
import { getAllData } from './public/js/users.js';
import { getStars, initStars } from './public/js/stars.js';

import { router as userRouter } from './routes/user_routes.js';
import { router as threadRouter } from './routes/thread_routes.js';
import { router as friendRouter } from './routes/friend_routes.js';

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

// Rende disponibili tutte le route di un router specifico (scrivendo solo "/")
app.use("/", userRouter);
app.use("/", threadRouter);
app.use("/", friendRouter);

// Variabile isLoggedIn
app.use((req, res, next) => {
    res.locals.isLoggedIn = !!req.session.email;
    next();
});

// Carica la home
app.get('/', isAuthenticated, async (req, res) => {
    try {
        const resAllThreads = await allThreads();
        const pThreads = await personalThreads(req.session.idUser);
        const allData = await getAllData(req.session.idUser);
        const checkStarInit = await getStars(req.session.idUser);

        if (checkStarInit.length == 0 || !checkStarInit) await initStars(req.session.idUser);

        const starsCount = await getStars(req.session.idUser);

        res.render('pages/home', { resAllThreads, allData, pThreads, starsCount });
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Errore DB");
    }
});

// ---------------------------------------------------
// ERRORI
// ---------------------------------------------------
// 404 Page
app.use((req, res) => {
    res.render('errors/404', { layout: false });
});

// Protezione CALL
export function isAuthenticated (req, res, next) {
    if (req.session.email == null) {
        res.redirect('/login');
    } else {
        next()
    }
}

// Avvia il server sulla porta 3000
app.listen(3000);