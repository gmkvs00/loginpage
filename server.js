const urlencoded = require('body-parser/lib/types/urlencoded')
const express=require('express')
const bcrypt=require('bcrypt')
const mysql=require('mysql')
const bodyParser = require('body-parser');
const path = require('path');
const app=express()

const user=[]
const db=mysql.createConnection({
      host:'localhost',
      user:'root',
      password:'7459',
      database:'user_data'
});
db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log('connected to mysqldatabase');
})
app.set('view-engine','ejs')
app.use(express.urlencoded({extended:false}))
app.get('/',(req,res)=>{
    res.render('index.ejs')
    
})
app.get('/logout',(req,res)=>{
    res.render('logout.ejs');
    
})
app.get('/m',(req,res)=>{
    res.render('m.ejs')
})
app.post('/m',(req,res)=>{

    const { email, password } = req.body; 

    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }

  
    const query = 'SELECT * FROM user_data WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error occurred during login: ' + err.message);
        }

        if (results.length > 0) {
            // User found, login successful
            console.log('Login successful:', results[0]);
            return res.redirect('/logout');
        } else {
            // User not found, invalid credentials
            return res.status(401).send('Invalid email or password. Please try again.');
        }
    });
})

app.get('/si.ejs',(req,res)=>{
    res.render('si.ejs')
})
app.post('/si', (req,res)=>{

    const { email, password } = req.body;
    const query = 'INSERT INTO user_data (email, password) VALUES (?, ?)';
    db.query(query, [email, password], (err, result) => {
        if (err) {
            console.error('Database error:', err);  // More detailed error logging
            return res.status(500).send('Error occurred during signup: ' + err.message);
        }
        console.log('User saved successfully');
        res.send('Signup successful!');
    });

})

app.listen(3000);
