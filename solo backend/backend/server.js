const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'gestion_cuadernos'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL');
});

// Rutas CRUD
app.get('/tareas', (req, res) => {
  connection.query('SELECT * FROM cuadernos', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/tareas', (req, res) => {
  const { nombre, fabricante } = req.body;
  connection.query('INSERT INTO cuadernos (nombre, fabricante) VALUES (?, ?)', [nombre, fabricante], (err, results) => {
    if (err) throw err;
    res.json({ id: results.insertId, nombre, fabricante });
  });
});

app.put('/tareas/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, fabricante } = req.body;
  connection.query('UPDATE cuadernos SET nombre = ?, fabricante = ? WHERE id = ?', [nombre, fabricante, id], (err) => {
    if (err) throw err;
    res.json({ id, nombre, fabricante });
  });
});

app.delete('/tareas/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM cuadernos WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.json({ id });
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
