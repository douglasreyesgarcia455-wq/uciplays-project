// equiposController.js — Controlador delgado de equipos.
const repo = require('../repositories/equiposRepository');
const { toDTO } = require('../dtos/EquipoDTO');
const { registrarAuditoria } = require('../middleware/auditoriaHelper');

async function listar(req, res) {
    try {
        const rows = await repo.obtenerTodos();
        res.json(rows.map(toDTO));
    } catch (error) {
        console.error('Error GET /equipos:', error);
        res.status(500).json({ error: 'Error al obtener equipos' });
    }
}

async function crear(req, res) {
    try {
        const body = req.body || {};
        const nombre = String(body.nombre || '').trim();
        const facultadId = parseInt(body.facultad_id);
        const deporteId = parseInt(body.deporte_id);
        if (nombre.length < 2) return res.status(400).json({ error: 'El nombre debe tener al menos 2 caracteres' });
        if (!facultadId || !deporteId) return res.status(400).json({ error: 'facultad_id y deporte_id son requeridos' });
        if (await repo.existeFacultadDeporte(facultadId, deporteId)) {
            return res.status(409).json({ error: 'Ya existe un equipo de esa facultad para ese deporte' });
        }
        const id = await repo.crear({ nombre, facultad_id: facultadId, deporte_id: deporteId });
        await registrarAuditoria(req, 'crear', 'equipo', id, { nombre, facultadId, deporteId });
        res.status(201).json({ message: 'Creado', id });
    } catch (error) {
        console.error('Error POST /equipos:', error);
        res.status(500).json({ error: 'Error al crear equipo' });
    }
}

async function actualizar(req, res) {
    try {
        const id = parseInt(req.params.id);
        const body = req.body || {};
        const nombre = String(body.nombre || '').trim();
        const facultadId = parseInt(body.facultad_id);
        const deporteId = parseInt(body.deporte_id);
        if (nombre.length < 2) return res.status(400).json({ error: 'El nombre debe tener al menos 2 caracteres' });
        if (facultadId && deporteId && await repo.existeFacultadDeporte(facultadId, deporteId, id)) {
            return res.status(409).json({ error: 'Ya existe otro equipo de esa facultad para ese deporte' });
        }
        await repo.actualizar(id, { nombre, facultad_id: facultadId, deporte_id: deporteId });
        await registrarAuditoria(req, 'editar', 'equipo', id, { nombre });
        res.json({ message: 'Actualizado' });
    } catch (error) {
        console.error('Error PUT /equipos/:id:', error);
        res.status(500).json({ error: 'Error al editar equipo' });
    }
}

async function borrar(req, res) {
    try {
        const id = parseInt(req.params.id);
        const total = await repo.contarEventos(id);
        if (total > 0) return res.status(409).json({ error: 'El equipo tiene ' + total + ' eventos asociados' });
        await repo.borrar(id);
        await registrarAuditoria(req, 'borrar', 'equipo', id, null);
        res.json({ message: 'Eliminado' });
    } catch (error) {
        console.error('Error DELETE /equipos/:id:', error);
        res.status(500).json({ error: 'Error al borrar equipo' });
    }
}

module.exports = { listar, crear, actualizar, borrar };
