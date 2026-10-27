// facultadesController.js — Controlador delgado de facultades.
const repo = require('../repositories/facultadesRepository');
const { toDTO } = require('../dtos/FacultadDTO');
const { registrarAuditoria } = require('../middleware/auditoriaHelper');

async function listar(req, res) {
    try {
        const rows = await repo.obtenerTodas();
        res.json(rows.map(toDTO));
    } catch (error) {
        console.error('Error GET /facultades:', error);
        res.status(500).json({ error: 'Error al obtener facultades' });
    }
}

async function obtener(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (!id) return res.status(400).json({ error: 'ID inválido' });
        const row = await repo.obtenerPorId(id);
        if (!row) return res.status(404).json({ error: 'Facultad no encontrada' });
        res.json(toDTO(row));
    } catch (error) {
        console.error('Error GET /facultades/:id:', error);
        res.status(500).json({ error: 'Error al obtener facultad' });
    }
}

async function crear(req, res) {
    try {
        const body = req.body || {};
        const nombre = String(body.nombre || '').trim();
        if (nombre.length < 2) return res.status(400).json({ error: 'El nombre debe tener al menos 2 caracteres' });
        if (await repo.existeNombre(nombre)) return res.status(409).json({ error: 'Ya existe una facultad con ese nombre' });
        const id = await repo.crear({ nombre, logo_url: body.logo_url });
        await registrarAuditoria(req, 'crear', 'facultad', id, { nombre });
        res.status(201).json({ message: 'Creado', id, nombre });
    } catch (error) {
        console.error('Error POST /facultades:', error);
        res.status(500).json({ error: 'Error al crear facultad' });
    }
}

async function actualizar(req, res) {
    try {
        const id = parseInt(req.params.id);
        const body = req.body || {};
        const nombre = String(body.nombre || '').trim();
        if (nombre.length < 2) return res.status(400).json({ error: 'El nombre debe tener al menos 2 caracteres' });
        if (await repo.existeNombre(nombre, id)) return res.status(409).json({ error: 'Ya existe otra facultad con ese nombre' });
        await repo.actualizar(id, { nombre, logo_url: body.logo_url });
        await registrarAuditoria(req, 'editar', 'facultad', id, { nombre });
        res.json({ message: 'Actualizado' });
    } catch (error) {
        console.error('Error PUT /facultades/:id:', error);
        res.status(500).json({ error: 'Error al editar facultad' });
    }
}

async function borrar(req, res) {
    try {
        const id = parseInt(req.params.id);
        const cascade = req.query.cascade === 'true';
        const total = await repo.contarEquipos(id);
        if (total > 0 && !cascade) {
            return res.status(409).json({ error: 'La facultad tiene ' + total + ' equipos. Usa cascade=true para borrarla con ellos.' });
        }
        if (total > 0 && cascade) {
            await repo.borrarConCascade(id);
        } else {
            await repo.borrar(id);
        }
        await registrarAuditoria(req, 'borrar', 'facultad', id, { cascade });
        res.json({ message: 'Eliminado', cascade });
    } catch (error) {
        console.error('Error DELETE /facultades/:id:', error);
        res.status(500).json({ error: 'Error al borrar facultad' });
    }
}

module.exports = { listar, obtener, crear, actualizar, borrar };
