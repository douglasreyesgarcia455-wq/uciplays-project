// sancionesController.js — Controlador delgado de sanciones.
const repo = require('../repositories/sancionesRepository');
const { toDTO } = require('../dtos/SancionDTO');
const { registrarAuditoria } = require('../middleware/auditoriaHelper');

async function listar(req, res) {
    try {
        const rows = await repo.obtenerTodas();
        res.json(rows.map(toDTO));
    } catch (error) {
        console.error('Error GET /sanciones:', error);
        res.status(500).json({ error: 'Error al obtener sanciones' });
    }
}

async function crear(req, res) {
    try {
        const body = req.body || {};
        const equipoId = parseInt(body.equipo_id);
        const puntos = parseInt(body.puntos_descontados);
        if (!equipoId) return res.status(400).json({ error: 'equipo_id requerido' });
        if (!puntos || puntos >= 0) return res.status(400).json({ error: 'puntos_descontados debe ser un número negativo' });
        if (!(await repo.existeEquipo(equipoId))) return res.status(404).json({ error: 'Equipo no encontrado' });
        const id = await repo.crear({
            equipo_id: equipoId,
            puntos_descontados: puntos,
            motivo: body.motivo,
            observaciones: body.observaciones
        });
        await registrarAuditoria(req, 'crear', 'sancion', id, { equipoId, puntos });
        res.status(201).json({ message: 'Creado', id });
    } catch (error) {
        console.error('Error POST /sanciones:', error);
        res.status(500).json({ error: 'Error al crear sanción' });
    }
}

async function borrar(req, res) {
    try {
        const id = parseInt(req.params.id);
        await repo.borrar(id);
        await registrarAuditoria(req, 'borrar', 'sancion', id, null);
        res.json({ message: 'Eliminado' });
    } catch (error) {
        console.error('Error DELETE /sanciones/:id:', error);
        res.status(500).json({ error: 'Error al borrar sanción' });
    }
}

module.exports = { listar, crear, borrar };
