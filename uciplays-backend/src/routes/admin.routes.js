const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener todos los deportes (para el desplegable del formulario)
router.get('/deportes', async (req, res) => {
    try {
        const rows = await db.query("SELECT * FROM deportes");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear un nuevo evento
router.post('/eventos', async (req, res) => {
    const { deporte_id, titulo, lugar } = req.body;
    try {
        await db.query(
            "INSERT INTO eventos (deporte_id, titulo, lugar) VALUES (?, ?, ?)",
            [deporte_id, titulo, lugar]
        );
        res.json({ message: "Evento creado con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Registrar un resultado (Medalla)
router.post('/resultados', async (req, res) => {
    const { evento_id, facultad_id, posicion_lograda } = req.body;
    try {
        await db.query(
            "INSERT INTO resultados (evento_id, facultad_id, posicion_lograda) VALUES (?, ?, ?)",
            [evento_id, facultad_id, posicion_lograda]
        );
        res.json({ message: "Resultado registrado. Puntos calculados por la BD." });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar: ¿Ya existe un resultado para esta facultad en este evento?" });
    }
});

module.exports = router;