const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./comentarios.db');

app.use(cors());
app.use(express.json());

// Cria a tabela se não existir
db.run(`CREATE TABLE IF NOT EXISTS comentarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  date TEXT NOT NULL
)`);

// Rota para buscar comentários
app.get('/comentarios', (req, res) => {
  db.all('SELECT * FROM comentarios ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Rota para adicionar comentário
app.post('/comentarios', (req, res) => {
  const { name, text, date } = req.body;
  db.run('INSERT INTO comentarios (name, text, date) VALUES (?, ?, ?)', [name, text, date], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, text, date });
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando em https://silvajardim.github.io/100anos/');
});