const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verificarToken } = require('../middleware/authMiddleware');
const { registrarAuditoria } = require('../middleware/auditoriaHelper');

router.get('/', async (req, res) => {
    try {
        const integrantes = await db.query(`
            SELECT i.id, i.nombre, i.ci, i.matricula,
                   e.nombre AS equipo_nombre, f.nombre AS facultad_nombre, d.nombre AS deporte, i.equipo_id
            FROM integrantes i
            JOIN equipos e ON e.id = i.equipo_id
            JOIN facultades f ON f.id = e.facultad_id
            JOIN deportes d ON d.id = e.deporte_id
            ORDER BY f.nombre, e.nombre, i.nombre
        `);
        res.json(integrantes);
    } catch (error) {
        console.error('Error GET /integrantes:', error);
        res.status(500).json({ error: 'Error al obtener integrantes' });
    }
});

router.get('/:equipo_id', async (req, res) => {
    try {
        const integrantes = await db.query(`
            SELECT i.id, i.nombre, i.ci, i.matricula,
                   e.nombre AS equipo_nombre, f.nombre AS facultad_nombre, d.nombre AS deporte, i.equipo_id
            FROM integrantes i
            JOIN equipos e ON e.id = i.equipo_id
            JOIN facultades f ON f.id = e.facultad_id
            JOIN deportes d ON d.id = e.deporte_id
            WHERE i.equipo_id = ?
            ORDER BY i.nombre
        `, [req.params.equipo_id]);
        res.json(integrantes);
    } catch (error) {
        console.error('Error GET /integrantes/:equipo_id:', error);
        res.status(500).json({ error: 'Error al obtener integrantes del equipo' });
    }
});

router.post('/', verificarToken, async (req, res) => {
    try {
        const body = req.body || {};
        const nombre = String(body.nombre || '').trim();
        const ci = String(body.ci || '').trim();
        const matricula = String(body.matricula || '').trim();
        const equipoId = parseInt(body.equipo_id);
        if (!nombre || nombre.length < 2) return res.status(400).json({ error: 'Nombre inválido' });
        if (!ci) return res.status(400).json({ error: 'CI requerido' });
        if (!matricula) return res.status(400).json({ error: 'Matrícula requerida' });
        if (!equipoId) return res.status(400).json({ error: 'equipo_id requerido' });

        const existeCI = await db.query('SELECT id FROM integrantes WHERE ci = ?', [ci]);
        if (existeCI && existeCI.length > 0) return res.status(409).json({ error: 'Ya existe un integrante con esa CI' });
        const existeMat = await db.query('SELECT id FROM integrantes WHERE matricula = ?', [matricula]);
        if (existeMat && existeMat.length > 0) return res.status(409).json({ error: 'Ya existe un integrante con esa matrícula' });

        await db.query('INSERT INTO integrantes (nombre, ci, matricula, equipo_id) VALUES (?, ?, ?, ?)',
            [nombre, ci, matricula, equipoId]);
        const idRows = await db.query('SELECT last_insert_rowid() AS id');
        await registrarAuditoria(req, 'crear', 'integrante', idRows[0].id, { nombre, equipoId });
        res.status(201).json({ message: 'Creado', id: idRows[0].id });
    } catch (error) {
        console.error('Error POST /integrantes:', error);
        res.status(500).json({ error: 'Error al crear integrante' });
    }
});

router.put('/:id', verificarToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const body = req.body || {};
        const nombre = String(body.nombre || '').trim();
        const ci = String(body.ci || '').trim();
        const matricula = String(body.matricula || '').trim();
        if (!nombre || nombre.length < 2) return res.status(400).json({ error: 'Nombre inválido' });
        if (!ci) return res.status(400).json({ error: 'CI requerida' });
        if (!matricula) return res.status(400).json({ error: 'Matrícula requerida' });

        const existeCI = await db.query('SELECT id FROM integrantes WHERE ci = ? AND id != ?', [ci, id]);
        if (existeCI && existeCI.length > 0) return res.status(409).json({ error: 'CI ya registrada en otro integrante' });
        const existeMat = await db.query('SELECT id FROM integrantes WHERE matricula = ? AND id != ?', [matricula, id]);
        if (existeMat && existeMat.length > 0) return res.status(409).json({ error: 'Matrícula ya registrada en otro integrante' });

        await db.query('UPDATE integrantes SET nombre = ?, ci = ?, matricula = ? WHERE id = ?', [nombre, ci, matricula, id]);
        await registrarAuditoria(req, 'editar', 'integrante', id, { nombre });
        res.json({ message: 'Actualizado' });
    } catch (error) {
        console.error('Error PUT /integrantes/:id:', error);
        res.status(500).json({ error: 'Error al editar integrante' });
    }
});

router.delete('/:id', verificarToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await db.query('DELETE FROM integrantes WHERE id = ?', [id]);
        await registrarAuditoria(req, 'borrar', 'integrante', id, null);
        res.json({ message: 'Eliminado' });
    } catch (error) {
        console.error('Error DELETE /integrantes/:id:', error);
        res.status(500).json({ error: 'Error al borrar integrante' });
    }
});

module.exports = router;
