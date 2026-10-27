// integrantesController.js — Controlador delgado de integrantes.
const repo = require('../repositories/integrantesRepository');
const { toDTO } = require('../dtos/IntegranteDTO');
const { registrarAuditoria } = require('../middleware/auditoriaHelper');

async function listar(req, res) {
    try {
        const rows = await repo.obtenerTodos();
        res.json(rows.map(toDTO));
    } catch (error) {
        console.error('Error GET /integrantes:', error);
        res.status(500).json({ error: 'Error al obtener integrantes' });
    }
}

async function porEquipo(req, res) {
    try {
        const rows = await repo.obtenerPorEquipo(req.params.equipo_id);
        res.json(rows.map(toDTO));
    } catch (error) {
        console.error('Error GET /integrantes/:equipo_id:', error);
        res.status(500).json({ error: 'Error al obtener integrantes del equipo' });
    }
}

async function crear(req, res) {
    try {
        const body = req.body || {};
        const nombre = String(body.nombre || '').trim();
        const ci = String(body.ci || '').trim();
        const matricula = String(body.matricula || '').trim();
        const equipoId = parseInt(body.equipo_id);
        if (nombre.length < 2) return res.status(400).json({ error: 'Nombre inválido' });
        if (!ci) return res.status(400).json({ error: 'CI requerida' });
        if (!matricula) return res.status(400).json({ error: 'Matrícula requerida' });
        if (!equipoId) return res.status(400).json({ error: 'equipo_id requerido' });
        if (await repo.existeCI(ci)) return res.status(409).json({ error: 'Ya existe un integrante con esa CI' });
        if (await repo.existeMatricula(matricula)) return res.status(409).json({ error: 'Ya existe un integrante con esa matrícula' });
        const id = await repo.crear({ nombre, ci, matricula, equipo_id: equipoId });
        await registrarAuditoria(req, 'crear', 'integrante', id, { nombre, equipoId });
        res.status(201).json({ message: 'Creado', id });
    } catch (error) {
        console.error('Error POST /integrantes:', error);
        res.status(500).json({ error: 'Error al crear integrante' });
    }
}

async function actualizar(req, res) {
    try {
        const id = parseInt(req.params.id);
        const body = req.body || {};
        const nombre = String(body.nombre || '').trim();
        const ci = String(body.ci || '').trim();
        const matricula = String(body.matricula || '').trim();
        if (nombre.length < 2) return res.status(400).json({ error: 'Nombre inválido' });
        if (!ci) return res.status(400).json({ error: 'CI requerida' });
        if (!matricula) return res.status(400).json({ error: 'Matrícula requerida' });
        if (await repo.existeCI(ci, id)) return res.status(409).json({ error: 'CI ya registrada en otro integrante' });
        if (await repo.existeMatricula(matricula, id)) return res.status(409).json({ error: 'Matrícula ya registrada en otro integrante' });
        await repo.actualizar(id, { nombre, ci, matricula });
        await registrarAuditoria(req, 'editar', 'integrante', id, { nombre });
        res.json({ message: 'Actualizado' });
    } catch (error) {
        console.error('Error PUT /integrantes/:id:', error);
        res.status(500).json({ error: 'Error al editar integrante' });
    }
}

async function borrar(req, res) {
    try {
        const id = parseInt(req.params.id);
        await repo.borrar(id);
        await registrarAuditoria(req, 'borrar', 'integrante', id, null);
        res.json({ message: 'Eliminado' });
    } catch (error) {
        console.error('Error DELETE /integrantes/:id:', error);
        res.status(500).json({ error: 'Error al borrar integrante' });
    }
}

module.exports = { listar, porEquipo, crear, actualizar, borrar };
