// eventosController.js — Controlador delgado de eventos (GRASP).
// Orquesta: repository + DTO + auditoría + respuesta HTTP.

const eventosRepository = require('../repositories/eventosRepository');
const { toDTO } = require('../dtos/EventoDTO');
const { registrarAuditoria } = require('../middleware/auditoriaHelper');

async function listar(req, res) {
    try {
        const eventos = await eventosRepository.obtenerTodos({ estado: req.query.estado });
        res.json(eventos.map(toDTO));
    } catch (error) {
        console.error('Error GET /eventos:', error);
        res.status(500).json({ error: error.message });
    }
}

async function obtener(req, res) {
    try {
        const evento = await eventosRepository.obtenerPorId(req.params.id);
        if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
        res.json(toDTO(evento));
    } catch (error) {
        console.error('Error GET /eventos/:id:', error);
        res.status(500).json({ error: error.message });
    }
}

async function crear(req, res) {
    try {
        const body = req.body || {};
        if (!body.deporte_id) return res.status(400).json({ error: 'deporte_id requerido' });
        const participantes = Array.isArray(body.participantes) ? body.participantes : [];
        if (participantes.length < 2) return res.status(400).json({ error: 'Se requieren al menos 2 participantes' });

        const eventoId = await eventosRepository.crear({
            deporte_id: body.deporte_id,
            fecha: body.fecha,
            hora: body.hora,
            lugar: body.lugar,
            estado: body.estado || 'pendiente',
            detalles: body.detalles || '',
            participantes
        });
        await registrarAuditoria(req, 'crear', 'evento', eventoId, { deporte_id: body.deporte_id, participantes: participantes.length });
        res.status(201).json({ message: 'Creado', id: eventoId });
    } catch (error) {
        console.error('Error POST /eventos:', error);
        res.status(500).json({ error: error.message });
    }
}

async function actualizar(req, res) {
    try {
        const body = req.body || {};
        const id = req.params.id;
        const participantes = Array.isArray(body.participantes) ? body.participantes : [];
        await eventosRepository.actualizar(id, {
            deporte_id: body.deporte_id,
            fecha: body.fecha,
            hora: body.hora,
            lugar: body.lugar,
            estado: body.estado || 'pendiente',
            detalles: body.detalles || '',
            participantes
        });
        await registrarAuditoria(req, 'editar', 'evento', parseInt(id), { deporte_id: body.deporte_id });
        res.json({ message: 'Actualizado' });
    } catch (error) {
        console.error('Error PUT /eventos/:id:', error);
        res.status(500).json({ error: error.message });
    }
}

async function borrar(req, res) {
    try {
        const id = req.params.id;
        await eventosRepository.borrar(id);
        await registrarAuditoria(req, 'borrar', 'evento', parseInt(id), null);
        res.json({ message: 'Eliminado' });
    } catch (error) {
        console.error('Error DELETE /eventos/:id:', error);
        res.status(500).json({ error: error.message });
    }
}

async function iniciar(req, res) {
    try {
        const id = req.params.id;
        const body = req.body || {};
        await eventosRepository.iniciar(id, body.fecha, body.hora);
        await registrarAuditoria(req, 'iniciar', 'evento', parseInt(id), { fecha: body.fecha, hora: body.hora });
        res.json({ message: 'Evento iniciado' });
    } catch (error) {
        console.error('Error POST /eventos/:id/iniciar:', error);
        res.status(500).json({ error: error.message });
    }
}

async function registrarResultado(req, res) {
    try {
        const id = req.params.id;
        const body = req.body || {};
        const resultados = Array.isArray(body.resultados) ? body.resultados : [];
        if (resultados.length === 0) return res.status(400).json({ error: 'Se requiere al menos un resultado' });

        const posiciones = resultados.map(r => r.posicion).filter(p => p != null);
        const setPos = new Set(posiciones);
        if (setPos.size !== posiciones.length) {
            return res.status(400).json({ error: 'Las posiciones no pueden repetirse' });
        }

        await eventosRepository.registrarResultado(id, resultados);
        await registrarAuditoria(req, 'finalizar', 'evento', parseInt(id), { resultados: resultados.length });
        res.json({ message: 'Resultado guardado y evento finalizado' });
    } catch (error) {
        console.error('Error POST /eventos/:id/resultado:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = { listar, obtener, crear, actualizar, borrar, iniciar, registrarResultado };
