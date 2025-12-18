import express from 'express';
import path from 'path';
import methodOverride from 'method-override';
import expressLayouts from 'express-ejs-layouts';
import multer from 'multer';
import fs from 'fs';
import session from 'express-session';
import { allThreads, newThreads, personalThreads, loadThread, updateThreads, deleteThreads } from './public/js/home.js';
import { getAllData, login, register } from './public/js/users.js';
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

// Creo uno storage per configurare multer (salvataggio file foto profilo)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/profiles');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

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
    res.locals.isLoggedIn = !!req.session.email;
    next();
});

// Carica la home
app.get('/', isAuthenticated, async (req, res) => {
    try {
        const resAllThreads = await allThreads();
        const pThreads = await personalThreads(req.session.idUser);
        const allData = await getAllData(req.session.idUser);
        res.render('home', { resAllThreads, allData, pThreads });
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Errore DB");
    }
});

// Carica la pagina di registrazione
app.get('/register', async (req, res) => {
    res.render('register', { layout: false });
});

// In questo blocco di codice, le seguenti righe sono state generate con l'aiuto dell'AI:
// upload.single('profilePhoto') & const profilePhotoPath = req.file ? `/images/profiles/${req.file.filename}` : null;
app.post('/register', upload.single('profilePhoto'), async (req, res) => {
    const nome = req.body.nome;
    const cognome = req.body.cognome;
    const email = req.body.email;
    const pswd = req.body.pswd;
    const nazione = req.body.nazione;
    const cantone = req.body.cantone;

    const profilePhotoPath = req.file ? `/images/profiles/${req.file.filename}` : null;
    console.log(profilePhotoPath);

    try {
        const reg = await register(nome, cognome, email, pswd, cantone, nazione, profilePhotoPath);
        if (!reg) return res.redirect('/register'); 
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.redirect('/register');
    }
});

// Carica la pagina di login
app.get('/login', async (req, res) => {
    res.render('login', { layout: false });
});

app.post('/login', async (req, res) => {
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
    const title = req.body.title;
    const desc = req.body.description;

    try {
        const status = await newThreads(req.session.idUser, title, desc);
        if (!status) return;
        res.redirect('/');
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Errore DB");
    }
});

// Carica un thread
app.post('/loadThread', isAuthenticated, async (req, res) => {
    const idThread = req.body.idThread;
    
    try {
        const thread = await loadThread(idThread);
        res.json(thread);
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Errore DB");
    }
})

// Aggiorna un thread
app.patch('/updateThread', isAuthenticated, async (req, res) => {
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
})

// Elimina un thread
app.delete('/deleteThread', isAuthenticated, async (req, res) => {
    const idThread = req.body.idThread;
    const idUser = req.session.idUser;

    try {
        await deleteThreads(idThread, idUser);
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

app.listen(3000);





// Protezione CALL
function isAuthenticated (req, res, next) {
    if (req.session.email == null) {
        res.redirect('/login');
    } else {
        next()
    }
}