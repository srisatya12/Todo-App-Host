// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const profileRoutes = require('./routes/profile');
const db = require('./db/database');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/profile', profileRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
