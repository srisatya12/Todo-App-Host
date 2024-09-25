const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    // Check if the email already exists
    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (user) {
            return res.status(400).json({ message: 'Already have an account with this email.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = uuidv4();

        db.run(`INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)`, [id, name, email, hashedPassword], (err) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }
            res.status(201).json({ message: 'User created successfully!' });
        });
    });
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err || !user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.json({ token, name: user.name, email: user.email });
    });
});

module.exports = router;
