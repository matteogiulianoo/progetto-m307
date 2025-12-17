import express from 'express';
import path from 'path';
import methodOverride from 'method-override';
import expressLayouts from 'express-ejs-layouts';
import multer from 'multer';

// dirname = nome directory
const __dirname = import.meta.dirname;
const app = express();

// views = cartella con .ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => { res.render('home') })

app.listen(3000);