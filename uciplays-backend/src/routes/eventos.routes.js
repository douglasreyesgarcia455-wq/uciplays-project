const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verificarToken } = require('../middleware/authMiddleware');
const { registrarAuditoria } = require('../middleware/auditoriaHelper');

// Puntos por posición: 1º→3, 2º→2, 3º→1, 4º+→0
function puntosPorPosicion(posicion) {
    if (posicion === 1) return 3;
    if (posicion === 2) return 2;
    if (posicion === 3) return 1;
    return 0;
}

// GET /eventos?estado=en%20curso
router.get('/', async (req, res) => {
    try {
        const { estado } = req.query;
        let sql = `SELECT ev.id, d.nombre AS deporte, ev.fecha, ev.hora, ev.lugar, ev.estado, ev.detalles
                   FROM eventos ev
                   JOIN deportes d ON d.id = ev.deporte_id`;
        const params = [];
        if (estado) { sql += ' WHERE ev.estado = ?'; params.push(estado); }
        sql += ' ORDER BY ev.fecha ASC, ev.hora ASC';

        const eventos = await db.query(sql, params);
        // Adjuntar participantes a cada evento
        for (const ev of eventos) {
            ev.participantes = await db.query(
                `SELECT ep.id, ep.equipo_id, eq.nombre AS equipo_nombre, f.nombre AS facultad, d.nombre AS deporte,
                        ep.posicion, ep.puntos
                 FROM evento_participantes ep
                 JOIN equipos eq ON eq.id = ep.equipo_id
                 JOIN facultades f ON f.id = eq.facultad_id
                 JOIN deportes d ON d.id = eq.deporte_id
                 WHERE ep.evento_id = ?
                 ORDER BY COALESCE(ep.posicion, 999), eq.nombre`, [ev.id]
            );
        }
        res.json(eventos);
    } catch (error) {
        console.error('Error GET /eventos:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const rows = await db.query(
            `SELECT ev.id, d.nombre AS deporte, ev.fecha, ev.hora, ev.lugar, ev.estado, ev.detalles
             FROM eventos ev JOIN deportes d ON d.id = ev.deporte_id WHERE ev.id = ?`, [req.params.id]
        );
        if (!rows || rows.length === 0) return res.status(404).json({ error: 'Evento no encontrado' });
        const ev = rows[0];
        ev.participantes = await db.query(
            `SELECT ep.id, ep.equipo_id, eq.nombre AS equipo_nombre, f.nombre AS facultad, d.nombre AS deporte,
                    ep.posicion, ep.puntos
             FROM evento_participantes ep
             JOIN equipos eq ON eq.id = ep.equipo_id
             JOIN facultades f ON f.id = eq.facultad_id
             JOIN deportes d ON d.id = eq.deporte_id
             WHERE ep.evento_id = ?
             ORDER BY COALESCE(ep.posicion, 999), eq.nombre`, [ev.id]
        );
        res.json(ev);
    } catch (error) {
        console.error('Error GET /eventos/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/', verificarToken, async (req, res) => {
    try {
        const body = req.body || {};
        if (!body.deporte_id) return res.status(400).json({ error: 'deporte_id requerido' });
        const participantes = Array.isArray(body.participantes) ? body.participantes : [];
        if (participantes.length < 2) return res.status(400).json({ error: 'Se requieren al menos 2 participantes' });

        await db.query(
            `INSERT INTO eventos (deporte_id, fecha, hora, lugar, estado, detalles) VALUES (?, ?, ?, ?, ?, ?)`,
            [body.deporte_id, body.fecha || null, body.hora || null, body.lugar || null,
             body.estado || 'pendiente', body.detalles || '']
        );
        const idRows = await db.query('SELECT last_insert_rowid() AS id');
        const eventoId = idRows[0].id;

        for (const p of participantes) {
            if (!p.equipo_id) continue;
            await db.query(
                'INSERT INTO evento_participantes (evento_id, equipo_id, posicion, puntos) VALUES (?, ?, ?, ?)',
                [eventoId, p.equipo_id, null, 0]
            );
        }
        await registrarAuditoria(req, 'crear', 'evento', eventoId, { deporte_id: body.deporte_id, participantes: participantes.length });
        res.status(201).json({ message: 'Creado', id: eventoId });
    } catch (error) {
        console.error('Error POST /eventos:', error);
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', verificarToken, async (req, res) => {
    try {
        const body = req.body || {};
        const id = req.params.id;
        await db.query(
            `UPDATE eventos SET deporte_id = ?, fecha = ?, hora = ?, lugar = ?, estado = ?, detalles = ? WHERE id = ?`,
            [body.deporte_id, body.fecha || null, body.hora || null, body.lugar || null,
             body.estado || 'pendiente', body.detalles || '', id]
        );
        // Actualizar participantes: borrar los que ya no están, dejar los existentes, insertar nuevos
        const participantes = Array.isArray(body.participantes) ? body.participantes : [];
        await db.query('DELETE FROM evento_participantes WHERE evento_id = ?', [id]);
        for (const p of participantes) {
            if (!p.equipo_id) continue;
            await db.query(
                'INSERT INTO evento_participantes (evento_id, equipo_id, posicion, puntos) VALUES (?, ?, ?, ?)',
                [id, p.equipo_id, p.posicion || null, 0]
            );
        }
        await registrarAuditoria(req, 'editar', 'evento', parseInt(id), { deporte_id: body.deporte_id });
        res.json({ message: 'Actualizado' });
    } catch (error) {
        console.error('Error PUT /eventos/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /eventos/:id/resultado — asignar posiciones y finalizar
router.post('/:id/resultado', verificarToken, async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body || {};
        const resultados = Array.isArray(body.resultados) ? body.resultados : [];
        if (resultados.length === 0) return res.status(400).json({ error: 'Se requiere al menos un resultado' });

        // Validar posiciones únicas
        const posiciones = resultados.map(r => r.posicion).filter(p => p != null);
        const setPos = new Set(posiciones);
        if (setPos.size !== posiciones.length) {
            return res.status(400).json({ error: 'Las posiciones no pueden repetirse' });
        }

        // Actualizar cada participante
        for (const r of resultados) {
            const pos = r.posicion || null;
            const pts = puntosPorPosicion(pos);
            await db.query(
                'UPDATE evento_participantes SET posicion = ?, puntos = ? WHERE evento_id = ? AND equipo_id = ?',
                [pos, pts, id, r.equipo_id]
            );
        }
        // Marcar evento como finalizado
        await db.query("UPDATE eventos SET estado = 'finalizado' WHERE id = ?", [id]);
        await registrarAuditoria(req, 'finalizar', 'evento', parseInt(id), { resultados: resultados.length });
        res.json({ message: 'Resultado guardado y evento finalizado' });
    } catch (error) {
        console.error('Error POST /eventos/:id/resultado:', error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', verificarToken, async (req, res) => {
    try {
        const id = req.params.id;
        await db.query('DELETE FROM evento_participantes WHERE evento_id = ?', [id]);
        await db.query('DELETE FROM eventos WHERE id = ?', [id]);
        await registrarAuditoria(req, 'borrar', 'evento', parseInt(id), null);
        res.json({ message: 'Eliminado' });
    } catch (error) {
        console.error('Error DELETE /eventos/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
