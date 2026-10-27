// deportesController.js — Controlador delgado de deportes.
const repo = require('../repositories/deportesRepository');
const { toDTO } = require('../dtos/DeporteDTO');
const { registrarAuditoria } = require('../middleware/auditoriaHelper');

async function listar(req, res) {
    try {
        const rows = await repo.obtenerTodos();
        res.json(rows.map(toDTO));
    } catch (error) {
        console.error('Error GET /deportes:', error);
        res.status(500).json({ error: 'Error al obtener deportes' });
    }
}

async function crear(req, res) {
    try {
        const nombre = String((req.body || {}).nombre || '').trim();
        if (nombre.length < 2) return res.status(400).json({ error: 'El nombre debe tener al menos 2 caracteres' });
        if (await repo.existeNombre(nombre)) return res.status(409).json({ error: 'Ya existe un deporte con ese nombre' });
        const id = await repo.crear(nombre);
        const totalEquipos = await repo.crearEquiposParaFacultades(id, nombre);
        await registrarAuditoria(req, 'crear', 'deporte', id, { nombre, equipos: totalEquipos });
        res.status(201).json({ message: 'Creado', id, nombre, equipos: totalEquipos });
    } catch (error) {
        console.error('Error POST /deportes:', error);
        res.status(500).json({ error: 'Error al crear deporte' });
    }
}

async function actualizar(req, res) {
    try {
        const id = parseInt(req.params.id);
        const nombre = String((req.body || {}).nombre || '').trim();
        if (nombre.length < 2) return res.status(400).json({ error: 'Nombre inválido' });
        if (await repo.existeNombre(nombre, id)) return res.status(409).json({ error: 'Ya existe otro deporte con ese nombre' });
        await repo.actualizar(id, nombre);
        await registrarAuditoria(req, 'editar', 'deporte', id, { nombre });
        res.json({ message: 'Actualizado' });
    } catch (error) {
        console.error('Error PUT /deportes/:id:', error);
        res.status(500).json({ error: 'Error al editar deporte' });
    }
}

async function borrar(req, res) {
    try {
        const id = parseInt(req.params.id);
        const total = await repo.contarEquipos(id);
        if (total > 0) return res.status(409).json({ error: 'No se puede borrar: hay ' + total + ' equipos asociados' });
        await repo.borrar(id);
        await registrarAuditoria(req, 'borrar', 'deporte', id, null);
        res.json({ message: 'Eliminado' });
    } catch (error) {
        console.error('Error DELETE /deportes/:id:', error);
        res.status(500).json({ error: 'Error al borrar deporte' });
    }
}

module.exports = { listar, crear, actualizar, borrar };
