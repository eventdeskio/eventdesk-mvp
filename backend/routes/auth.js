const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db'); 
const jwt = require('jsonwebtoken');

const router = express.Router();
const {
  userSignupCounter,
} = require("../monitoring");

router.post('/signup', async (req, res) => {
  const { email, password, full_name, role } = req.body;

  try {

    const userCheck = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4) RETURNING id, email, role`,
      [email, hashedPassword, full_name, role]
    );
    try{
      console.log("Incrementing userSignupCounter");
      userSignupCounter.inc(); 
    }catch(e){
      console.log(e , "------monitoring error")
    }
    res.status(201).json({
      message: 'User created successfully',
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {

      const user = await pool.query('SELECT * FROM users WHERE email = $1', [
        email,
      ]);
      if (user.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const dbUser = user.rows[0];
  
      
      const isMatch = await bcrypt.compare(password, dbUser.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const token = jwt.sign(
        { id: dbUser.id, role: dbUser.role },
        'eventdeskjwtkey',
        { expiresIn: '1h' }
      );
  
      res.json({
        message: 'Login successful',
        token,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
module.exports = router;
  