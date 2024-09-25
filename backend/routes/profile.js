// routes/profile.js
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db/database');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Middleware to verify token

// Update User Profile
router.put('/update', authMiddleware, async (req, res) => {
    const { name, email, password, newPassword } = req.body; // Get new details from the request
    const userId = req.user.id; // Get the user ID from the JWT token

    // Check if the email already exists in the database
    db.get(`SELECT * FROM users WHERE email = ? AND id != ?`, [email, userId], async (err, user) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        if (user) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        // Verify the current password
        db.get(`SELECT * FROM users WHERE id = ?`, [userId], async (err, user) => {
            if (err || !user) {
                return res.status(400).json({ message: 'User not found.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Incorrect password.' });

            // Update user details
            const hashedPassword = newPassword ? await bcrypt.hash(newPassword, 10) : user.password; // Hash new password if provided
            db.run(`UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`, [name, email, hashedPassword, userId], function(err) {
                if (err) {
                    return res.status(400).json({ message: err.message });
                }
                res.status(200).json({ message: 'Profile updated successfully!' });
            });
        });
    });
});

// Delete User Account
router.delete('/delete', authMiddleware, (req, res) => {
    const userId = req.user.id; // Get the user ID from the JWT token

    db.run(`DELETE FROM users WHERE id = ?`, [userId], function(err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        res.status(200).json({ message: 'Account deleted successfully!' });
    });
});

module.exports = router;
