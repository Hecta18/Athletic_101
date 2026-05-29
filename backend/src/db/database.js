const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../../database.sqlite'));

db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id             TEXT PRIMARY KEY,
    nombre         TEXT NOT NULL,
    categoriaId    TEXT NOT NULL,
    estado         TEXT DEFAULT 'pendiente',
    puntuacion     REAL,
    fechaRegistro  TEXT NOT NULL,
    fechaActividad TEXT,
    notas          TEXT DEFAULT '',
    atributos      TEXT DEFAULT '{}',
    activo         INTEGER DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS registros (
    id     TEXT PRIMARY KEY,
    itemId TEXT NOT NULL,
    fecha  TEXT NOT NULL,
    valor  REAL NOT NULL,
    notas  TEXT DEFAULT '',
    FOREIGN KEY (itemId) REFERENCES items(id)
  );
`);

module.exports = db;
