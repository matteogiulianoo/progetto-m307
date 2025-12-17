import express from 'express';
import path from 'path';
import methodOverride from 'method-override';
import expressLayouts from 'express-ejs-layouts';
import multer from 'multer';
import { allThreads, newThreads } from './public/js/home.js';

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

// Carica la home
app.get('/', async (req, res) => {
    try {
        const resAllThreads = await allThreads();
        res.render('home', { resAllThreads });
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Errore DB");
    }
});

// Crea un thread
app.post('/createThread', async (req, res) => {
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
})

// Aggiorna un thread
app.patch('/')

// Elimina un thread
app.delete('/')

app.listen(3000);