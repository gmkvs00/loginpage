const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');

const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false })); // Parse form data
app.use(bodyParser.json()); // Parse JSON data

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '7459',
    database: 'user_data'
});

const secretKey = crypto.randomBytes(32).toString('hex'); // Generates a random secret key
console.log('Generated Secret Key:', secretKey);

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL database');
});

// Session setup
app.use(session({
    secret: 'd134feecbd995970fbb947e252368f98874efde1f662b03636d6ad268867f2ee', // Replace with a secure key for session encryption
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to false for development (HTTPS required for secure: true)
}));

// View engine setup
app.set('view engine', 'ejs'); // Corrected to 'view engine'

// Routes
app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => { // Destroy session on logout
        if (err) {
            console.error('Session destruction error:', err);
            return res.status(500).send('Error logging out.');
        }
        res.redirect('/m'); // Redirect to login after logging out
    });
});

app.get('/dashboard', (req, res) => {
    if (!req.session.email) { // Check if user is logged in
        return res.redirect('/'); // Redirect to login if not logged in
    }
    res.render('dashboard.ejs', { email: req.session.email }); // Render dashboard with email from session
});

app.get('/m', (req, res) => {
    res.render('m.ejs');
});

app.post('/m', async (req, res) => {
    console.log('Request Body:', req.body);  // Log request body to debug
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }

    const query = 'SELECT * FROM user_data WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error occurred during login: ' + err.message);
        }

        if (results.length > 0) {
            // User found, verify password
            const validPassword = await bcrypt.compare(password, results[0].password);
            if (validPassword) {
                console.log('Login successful:', results[0]);
                req.session.email = email;  // Store email in session
                return res.redirect('/dashboard'); // Redirect to dashboard
            } else {
                return res.status(401).send('Invalid email or password. Please try again.');
            }
        } else {
            return res.status(401).send('Invalid email or password. Please try again.');
        }
    });
});

app.get('/si.ejs', (req, res) => {
    res.render('si.ejs');
});

app.post('/si', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required for signup.');
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO user_data (email, password) VALUES (?, ?)';
    db.query(query, [email, hashedPassword], (err, result) => {
        if (err) {
            console.error('Database error:', err);  // More detailed error logging
            return res.status(500).send('Error occurred during signup: ' + err.message);
        }
        console.log('User saved successfully');
        return res.send('Signup successful!');
    });
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
