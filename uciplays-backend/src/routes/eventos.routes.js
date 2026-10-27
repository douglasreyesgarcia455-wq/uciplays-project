const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Extrae el .id de la primera fila de un db.query. Devuelve null si no hay filas.
async function obtenerId(query, params) {
    const rows = await db.query(query, params);
    return rows && rows[0] ? rows[0].id : null;
}

// Resuelve deporte_id a partir de deporte_id (si viene) o deporte (texto).
async function resolverDeporteId(body) {
    if (body.deporte_id) return body.deporte_id;
    if (!body.deporte) return null;
    return await obtenerId('SELECT id FROM deportes WHERE nombre = ?', [body.deporte]);
}

// Resuelve equipo_local_id y equipo_visitante_id.
// Prioridad: IDs directos del body > parseo de enfrentamiento "LOCAL vs VISITANTE".
// El parseo busca por facultad + deporte (no por nombre exacto del equipo).
async function resolverEquipos(body, deporteId) {
    let localId = body.equipo_local_id || null;
    let visitanteId = body.equipo_visitante_id || null;

    if (!localId || !visitanteId) {
        if (!body.enfrentamiento) return { localId, visitanteId };
        const partes = String(body.enfrentamiento).split(/\s+vs\s+/i);
        if (partes.length !== 2) return { localId, visitanteId };
        const localNombre = partes[0].trim();
        const visitanteNombre = partes[1].trim();

        if (!localId) {
            localId = await obtenerId(
                'SELECT e.id FROM equipos e JOIN facultades f ON f.id = e.facultad_id WHERE f.nombre = ? AND e.deporte_id = ?',
                [localNombre, deporteId]
            );
        }
        if (!visitanteId) {
            visitanteId = await obtenerId(
                'SELECT e.id FROM equipos e JOIN facultades f ON f.id = e.facultad_id WHERE f.nombre = ? AND e.deporte_id = ?',
                [visitanteNombre, deporteId]
            );
        }
    }
    return { localId, visitanteId };
}

// GET / → lista de eventos con nombres de deporte y equipos
router.get('/', async (req, res) => {
    try {
        const eventos = await db.query(
            `SELECT ev.id, d.nombre AS deporte,
                    el.nombre AS equipo_local_nombre,
                    ev2.nombre AS equipo_visitante_nombre,
                    ev.fecha, ev.hora, ev.lugar, ev.estado, ev.detalles, ev.probabilidad
             FROM eventos ev
             JOIN deportes d ON d.id = ev.deporte_id
             JOIN equipos el ON el.id = ev.equipo_local_id
             JOIN equipos ev2 ON ev2.id = ev.equipo_visitante_id
             ORDER BY ev.fecha ASC`
        );
        res.json(eventos);
    } catch (error) {
        console.error('Error GET /eventos:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /:id → un evento con nombres
router.get('/:id', async (req, res) => {
    try {
        const rows = await db.query(
            `SELECT ev.id, d.nombre AS deporte,
                    el.nombre AS equipo_local_nombre,
                    ev2.nombre AS equipo_visitante_nombre,
                    ev.fecha, ev.hora, ev.lugar, ev.estado, ev.detalles, ev.probabilidad
             FROM eventos ev
             JOIN deportes d ON d.id = ev.deporte_id
             JOIN equipos el ON el.id = ev.equipo_local_id
             JOIN equipos ev2 ON ev2.id = ev.equipo_visitante_id
             WHERE ev.id = ?`, [req.params.id]
        );
        if (!rows || rows.length === 0) return res.status(404).json({ error: 'Evento no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        console.error('Error GET /eventos/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST / → crear evento. Acepta IDs directos o (deporte + enfrentamiento) texto.
router.post('/', async (req, res) => {
    try {
        const body = req.body || {};
        const deporteId = await resolverDeporteId(body);
        if (!deporteId) {
            return res.status(400).json({ error: 'Deporte no encontrado: ' + (body.deporte || '(vacío)') });
        }
        const { localId, visitanteId } = await resolverEquipos(body, deporteId);
        if (!localId) return res.status(400).json({ error: 'Equipo local no encontrado' });
        if (!visitanteId) return res.status(400).json({ error: 'Equipo visitante no encontrado' });

        await db.query(
            `INSERT INTO eventos (deporte_id, equipo_local_id, equipo_visitante_id, fecha, hora, lugar, estado, detalles, probabilidad)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [deporteId, localId, visitanteId, body.fecha || null, body.hora || null, body.lugar || null,
             body.estado || 'proximo', body.detalles || '', parseInt(body.probabilidad) || 50]
        );
        res.status(201).json({ message: 'Creado' });
    } catch (error) {
        console.error('Error POST /eventos:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT /:id → actualizar evento. Mismo parseo que POST.
router.put('/:id', async (req, res) => {
    try {
        const body = req.body || {};
        const deporteId = await resolverDeporteId(body);
        if (!deporteId) {
            return res.status(400).json({ error: 'Deporte no encontrado: ' + (body.deporte || '(vacío)') });
        }
        const { localId, visitanteId } = await resolverEquipos(body, deporteId);
        if (!localId) return res.status(400).json({ error: 'Equipo local no encontrado' });
        if (!visitanteId) return res.status(400).json({ error: 'Equipo visitante no encontrado' });

        await db.query(
            `UPDATE eventos SET deporte_id = ?, equipo_local_id = ?, equipo_visitante_id = ?,
                    fecha = ?, hora = ?, lugar = ?, estado = ?, detalles = ?, probabilidad = ?
             WHERE id = ?`,
            [deporteId, localId, visitanteId, body.fecha || null, body.hora || null, body.lugar || null,
             body.estado || 'proximo', body.detalles || '', parseInt(body.probabilidad) || 50, req.params.id]
        );
        res.json({ message: 'Actualizado' });
    } catch (error) {
        console.error('Error PUT /eventos/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE /:id
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM eventos WHERE id = ?', [req.params.id]);
        res.json({ message: 'Eliminado' });
    } catch (error) {
        console.error('Error DELETE /eventos/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
