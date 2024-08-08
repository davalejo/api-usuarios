const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a la base de datos
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root', // Cambia esto
    // password: 'tu_contraseña', // Cambia esto
    database: 'usuarios_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

// Rutas CRUD

// Crear usuario
app.post('/usuarios', (req, res) => {
    const { nombre, apellido, documento_identidad } = req.body;
    const sql = 'INSERT INTO usuarios (nombre, apellido, documento_identidad) VALUES (?, ?, ?)';
    db.query(sql, [nombre, apellido, documento_identidad], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId, nombre, apellido, documento_identidad });
    });
});

// Leer todos los usuarios
app.get('/usuarios', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Leer un usuario por ID
app.get('/usuarios/:id', (req, res) => {
    const sql = 'SELECT * FROM usuarios WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(404).send('Usuario no encontrado');
        res.json(result[0]);
    });
});

// Actualizar usuario
app.put('/usuarios/:id', (req, res) => {
    const { nombre, apellido, documento_identidad } = req.body;
    const sql = 'UPDATE usuarios SET nombre = ?, apellido = ?, documento_identidad = ? WHERE id = ?';
    db.query(sql, [nombre, apellido, documento_identidad, req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send('Usuario no encontrado');
        res.json({ id: req.params.id, nombre, apellido, documento_identidad });
    });
});

// Borrar usuario
app.delete('/usuarios/:id', (req, res) => {
    const sql = 'DELETE FROM usuarios WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send('Usuario no encontrado');
        res.status(204).send();
    });
});

app.listen(port, () => {
    console.log(`API corriendo en http://127.0.0.1:${port}`);
});