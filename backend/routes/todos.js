// routes/todos.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');
const auth = require('../middleware/auth');
const router = express.Router();

// Create Todo
router.post('/', auth, (req, res) => {
    const { title, status } = req.body; // Ensure status is captured
    const id = uuidv4();

    db.run(`INSERT INTO todos (id, userId, title, status) VALUES (?, ?, ?, ?)`, [id, req.user.id, title, status], (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        res.status(201).json({ message: 'Todo created successfully!' });
    });
});

// Get Todos
router.get('/', auth, (req, res) => {
    db.all(`SELECT * FROM todos WHERE userId = ?`, [req.user.id], (err, todos) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        res.json(todos);
    });
});

// Update Todo
router.put('/:id', auth, (req, res) => {
    const { id } = req.params;
    const { title, status } = req.body;

    db.run(`UPDATE todos SET title = ?, status = ? WHERE id = ? AND userId = ?`, [title, status, id, req.user.id], (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        res.json({ message: 'Todo updated successfully!' });
    });
});

// Delete Todo
router.delete('/:id', auth, (req, res) => {
    db.run(`DELETE FROM todos WHERE id = ? AND userId = ?`, [req.params.id, req.user.id], function(err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        if (this.changes === 0) return res.status(404).json({ message: 'Todo not found.' });
        res.json({ message: 'Todo deleted successfully!' });
    });
});

module.exports = router;
