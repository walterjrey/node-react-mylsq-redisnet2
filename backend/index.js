require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

app.use(cors());
app.use(express.json());

// Configuración de MySQL
console.log(process.env)
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Crear tabla si no existe
const createTableQuery = `
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('Bug', 'Feature', 'Epic') NOT NULL
);
`;
db.query(createTableQuery, err => {
    if (err) console.error('Error creating table:', err);
});

// Rutas
app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.post('/tasks', (req, res) => {
    const { name, type } = req.body;
    if (!name || !['Bug', 'Feature', 'Epic'].includes(type)) {
        return res.status(400).json({ error: 'Invalid input' });
    }
    db.query('INSERT INTO tasks (name, type) VALUES (?, ?)', [name, type], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: result.insertId, name, type });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});