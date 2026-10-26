const express = require('express');
const router = express.Router();

// Ruta de login simple
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Credenciales fijas para el proyecto
    if (username === 'admin' && password === 'uci2025') {
        res.json({ success: true, message: "Autenticación exitosa" });
    } else {
        res.status(401).json({ success: false, message: "Usuario o contraseña incorrectos" });
    }
});

module.exports = router;