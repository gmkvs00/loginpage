const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');

const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '7459',
    database: 'user_data'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL database');
});

// Session setup
app.use(session({
    secret: 'your_secure_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));


app.set('view engine', 'ejs'); 

// Routes
app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => { 
        if (err) {
            console.error('Session destruction error:', err);
            return res.status(500).send('Error logging out.');
        }
        res.redirect('/m'); 
    });
});

app.get('/dashboard', (req, res) => {
    if (!req.session.email) {
        return res.redirect('/m');
    }
    res.render('dashboard.ejs', { email: req.session.email });
});

app.get('/list', (req, res) => {
    const userID = req.session.userID; 
    console.log('User ID stored in session:', req.session.userID);

    if (!userID) {
        return res.redirect('/m'); 
    }

    const query = 'SELECT * FROM user_d WHERE id1 = ?'; 
    db.query(query, [userID], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).send('Error found');
        }
        res.render('list.ejs', { user_d: results });
    });
});

app.get('/add', (req, res) => {
    const userID = req.session.userID;
    if (!userID) {
        return res.redirect('/m');
    }
    res.render('add.ejs');
});

app.post('/add', (req, res) => {
    const {
        name,
        adress,
        email,
        gender,
        cmt,
        Subject,
        range,
        fl,
        v1,
        v2,
        v3,
        color,
        birthday,
        djoin,
        fw,
        phon
    } = req.body;
    
    console.log("Received Data:", { name, adress, email,gender, cmt, Subject, range, fl, v1, v2, v3, color, birthday, djoin, fw, phon });
    
    const userID = req.session.userID;
    if (!userID) {
        return res.status(403).send('User is not logged in.'); 
    }
    const bike = v1 ? true : false;
    const car = v2 ? true : false;
    const both = v3 ? true : false;

    const check = 'SELECT * FROM user_data WHERE email = ? AND id1 = ?';
    db.query(check, [email, userID], (err, results) => {
        if (err) {
            console.error('Email error', err);
            return res.status(500).send(`Email response: ${err.message}`);
        }
        if (results.length > 0) {
            return res.status(500).send('Email already exists');
        }

        const id1 = userID; 
        const checkExist = 'SELECT * FROM user_d WHERE email = ? AND id1 = ?';

        db.query(checkExist, [email, id1], (err, results) => {
            if (err) {
                console.error("Error", err);
                return res.status(500).send("Error: " + err.message);
            }

           
            const query = `INSERT INTO user_d 
                (NAME, ADRESS, EMAIL,id1, gender, comment, subject, capacity, programing_language, bike, car, h_both, fav_color, birthday, month_ofJoin, Quantity_ofC, phon_number) 
                VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            db.query(query, [name, adress, email,userID, gender, cmt, Subject, range, fl, bike, car, both, color, birthday, djoin, fw, phon], (err, results) => {
                if (err) {
                    console.error("Error found", err);
                    return res.status(500).send(`Error found adding the data: ${err.message}`);
                }
                res.redirect('/list');
            });
        });
    });
});

app.post('/delete/:id', (req, res) => {
    const userID = req.params.id;
    const query = 'DELETE FROM user_d WHERE id = ?';
    db.query(query, [userID], (err, result) => {
        if (err) {
            console.error('Cannot delete', err);
            return res.status(500).send('Error deleting data');
        }
        res.redirect('/list');
    });
});

app.get('/edit/:id', (req, res) => {
    const userID = req.params.id;
    
});

app.get('/m', (req, res) => {
    res.render('m.ejs');
});

app.post('/m', async (req, res) => {
    console.log('Request Body:', req.body);  
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
                req.session.email = email;  
                req.session.userID = results[0].id1;
                return res.redirect('/dashboard'); 
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
            console.error('Database error:', err); 
            return res.status(500).send('Error occurred during signup: ' + err.message);
        }
        console.log('User saved successfully');
        return res.redirect('/m');
    });
});

// Start the server
app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
