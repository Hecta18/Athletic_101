const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const db = require('../db/database');

function mapItem(row) {
  return {
    ...row,
    activo: Boolean(row.activo),
    atributos: JSON.parse(row.atributos || '{}'),
  };
}

// GET /api/items — todos los activos
router.get('/', (req, res) => {
  try {
    const rows = db
      .prepare('SELECT * FROM items WHERE activo = 1 ORDER BY fechaRegistro ASC')
      .all();
    res.json(rows.map(mapItem));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/items — crear
router.post('/', (req, res) => {
  const { nombre, categoriaId, estado = 'pendiente', atributos = {} } = req.body;
  if (!nombre || nombre.trim().length < 3) {
    return res.status(400).json({ error: 'Nombre demasiado corto' });
  }
  try {
    const nuevo = {
      id: crypto.randomUUID(),
      nombre: nombre.trim(),
      categoriaId,
      estado,
      puntuacion: null,
      fechaRegistro: new Date().toISOString(),
      fechaActividad: new Date().toISOString(),
      notas: req.body.notas || '',
      atributos: JSON.stringify(atributos),
      activo: 1,
    };
    db.prepare(`
      INSERT INTO items (id, nombre, categoriaId, estado, puntuacion,
        fechaRegistro, fechaActividad, notas, atributos, activo)
      VALUES (@id, @nombre, @categoriaId, @estado, @puntuacion,
        @fechaRegistro, @fechaActividad, @notas, @atributos, @activo)
    `).run(nuevo);
    res.status(201).json({
      ...nuevo,
      activo: true,
      atributos,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/items/:id — actualizar
router.put('/:id', (req, res) => {
  const existente = db
    .prepare('SELECT * FROM items WHERE id = ? AND activo = 1')
    .get(req.params.id);
  if (!existente) {
    return res.status(404).json({ error: 'No encontrado' });
  }
  try {
    const atributos = req.body.atributos
      ? JSON.stringify(req.body.atributos)
      : existente.atributos;
    const actualizado = {
      nombre: req.body.nombre?.trim() || existente.nombre,
      categoriaId: req.body.categoriaId || existente.categoriaId,
      estado: req.body.estado || existente.estado,
      puntuacion: req.body.puntuacion ?? existente.puntuacion,
      notas: req.body.notas ?? existente.notas,
      atributos,
      fechaActividad: new Date().toISOString(),
      id: req.params.id,
    };
    db.prepare(`
      UPDATE items SET
        nombre = @nombre,
        categoriaId = @categoriaId,
        estado = @estado,
        puntuacion = @puntuacion,
        notas = @notas,
        atributos = @atributos,
        fechaActividad = @fechaActividad
      WHERE id = @id
    `).run(actualizado);
    const row = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
    res.json(mapItem(row));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/items/:id — archivar (activo = 0)
router.delete('/:id', (req, res) => {
  const info = db.prepare('UPDATE items SET activo = 0 WHERE id = ?').run(req.params.id);
  if (info.changes === 0) {
    return res.status(404).json({ error: 'No encontrado' });
  }
  res.json({ mensaje: 'Archivado correctamente' });
});

// POST /api/items/:id/registro — crear registro de actividad
router.post('/:id/registro', (req, res) => {
  const item = db
    .prepare('SELECT id FROM items WHERE id = ? AND activo = 1')
    .get(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'No encontrado' });
  }
  const valor = Number(req.body.valor);
  if (Number.isNaN(valor)) {
    return res.status(400).json({ error: 'Valor invalido' });
  }
  try {
    const registro = {
      id: crypto.randomUUID(),
      itemId: req.params.id,
      fecha: req.body.fecha || new Date().toISOString().split('T')[0],
      valor,
      notas: req.body.notas || '',
    };
    db.prepare(`
      INSERT INTO registros (id, itemId, fecha, valor, notas)
      VALUES (@id, @itemId, @fecha, @valor, @notas)
    `).run(registro);
    db.prepare('UPDATE items SET fechaActividad = ? WHERE id = ?').run(
      new Date().toISOString(),
      req.params.id
    );
    res.status(201).json(registro);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
