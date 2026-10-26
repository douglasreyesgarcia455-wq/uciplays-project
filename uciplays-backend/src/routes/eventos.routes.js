const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const eventos = await db.query('SELECT * FROM eventos ORDER BY id DESC');
        res.json(eventos);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get('/:id', async (req, res) => {
    try {
        const evento = await db.query('SELECT * FROM eventos WHERE id = ?', [req.params.id]);
        res.json(evento[0]);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/', async (req, res) => {
    const { deporte, enfrentamiento, fecha, hora, lugar, estado, detalles, probabilidad } = req.body;
    try {
        await db.query(
            'INSERT INTO eventos (deporte, enfrentamiento, fecha, hora, lugar, estado, detalles, probabilidad) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [deporte, enfrentamiento, fecha, hora, lugar, estado || 'proximo', detalles || '', parseInt(probabilidad) || 50]
        );
        res.status(201).json({ message: "Creado" });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { deporte, enfrentamiento, fecha, hora, lugar, estado, detalles, probabilidad } = req.body;
    try {
        await db.query(
            `UPDATE eventos SET deporte=?, enfrentamiento=?, fecha=?, hora=?, lugar=?, estado=?, detalles=?, probabilidad=? WHERE id=?`,
            [deporte, enfrentamiento, fecha, hora, lugar, estado, detalles, parseInt(probabilidad), id]
        );
        res.json({ message: "Actualizado" });
    } catch (error) { 
        console.error("Error en PUT:", error);
        res.status(500).json({ error: error.message }); 
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM eventos WHERE id = ?', [req.params.id]);
        res.json({ message: "Eliminado" });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;