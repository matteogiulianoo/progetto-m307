import express from 'express';
import path from 'path';
import methodOverride from 'method-override';
import expressLayouts from 'express-ejs-layouts';
import multer from 'multer';
import { sql } from './database/db-utilities.js';

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

app.get('/', async (req, res) => {
    try {
        const threads = await sql("SHOW owner, title, description FROM threads");
        const personalThreads = await sql("SHOW onwer, title, description LIMIT 5");
        res.render('home', { threads, personalThreads });
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Errore DB");
    }
});

app.listen(3000);