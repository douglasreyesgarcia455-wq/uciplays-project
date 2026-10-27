// rankingController.js — Controlador delgado del ranking.
const repo = require('../repositories/rankingRepository');
const { toDTO } = require('../dtos/RankingDTO');

async function listar(req, res) {
    try {
        const rows = await repo.obtenerRanking();
        res.json(rows.map(toDTO));
    } catch (error) {
        console.error('Error GET /ranking:', error);
        res.status(500).json({ error: 'Error al obtener ranking' });
    }
}

module.exports = { listar };
