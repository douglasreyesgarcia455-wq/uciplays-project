const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', async (req, res) => {
    let { facultad_id, deporte, posicion_lograda, puntuacion_final } = req.body;
    
    try {
        // Lógica de seguridad: si el nombre del deporte contiene "SANCIÓN", 
        // nos aseguramos de que el número sea negativo antes de guardarlo.
        if (deporte.includes('SANCIÓN')) {
            puntuacion_final = -Math.abs(puntuacion_final);
        }

        const query = `
            INSERT INTO resultados (facultad_id, deporte, posicion_lograda, puntuacion_final)
            VALUES (?, ?, ?, ?)
        `;
        
        await db.query(query, [facultad_id, deporte, posicion_lograda || 0, puntuacion_final]);
        
        res.status(201).json({ message: "Registro procesado con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al guardar en la base de datos" });
    }
});

module.exports = router;