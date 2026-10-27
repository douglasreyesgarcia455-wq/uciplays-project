require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./src/config/db');

const rankingRoutes = require('./src/routes/ranking.routes');
const facultadesRoutes = require('./src/routes/facultades.routes');
const eventosRoutes = require('./src/routes/eventos.routes');
const sancionesRoutes = require('./src/routes/sanciones.routes');
const integrantesRoutes = require('./src/routes/integrantes.routes');
const authRoutes = require('./src/routes/auth.routes');
const deportesRoutes = require('./src/routes/deportes.routes');
const equiposRoutes = require('./src/routes/equipos.routes');
const { configurarEstaticos } = require('./src/config/static');

const app = express();
app.use(cors());
app.use(express.json());

const inicializarDB = async () => {
    try {
        console.log("🛠️ Sincronizando Base de Datos...");
        
        // Tabla de Eventos con logística completa
        await db.query(`
            CREATE TABLE IF NOT EXISTS eventos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                deporte TEXT,
                enfrentamiento TEXT,
                fecha TEXT,
                hora TEXT,
                lugar TEXT,
                estado TEXT DEFAULT 'proximo',
                detalles TEXT DEFAULT '',
                probabilidad INTEGER DEFAULT 50
            )
        `);

        // Tabla de Facultades
        await db.query(`CREATE TABLE IF NOT EXISTS facultades (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT UNIQUE)`);
        
        const f = await db.query(`SELECT COUNT(*) as total FROM facultades`);
        if (f[0].total === 0) {
            const facs = ['CITI', 'FTE', 'FEI', 'FICI', 'FCE'];
            for (const n of facs) await db.query(`INSERT INTO facultades (nombre) VALUES (?)`, [n]);
            console.log("🌱 Facultades inicializadas.");
        }
        console.log("✅ Servidor UCI Plays conectado correctamente.");
    } catch (err) { 
        console.error("❌ Error inicializando DB:", err); 
    }
};

inicializarDB();
configurarEstaticos(app);

app.use('/api/ranking', rankingRoutes);
app.use('/api/facultades', facultadesRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/sanciones', sancionesRoutes);
app.use('/api/integrantes', integrantesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/deportes', deportesRoutes);
app.use('/api/equipos', equiposRoutes);


// ===== Rutas inline de auditoría y backup =====
const { verificarToken, verificarRol } = require('./src/middleware/authMiddleware');
const path = require('path');
const fs = require('fs');

app.get('/api/auditoria', verificarToken, verificarRol(['admin']), async (req, res) => {
    try {
        const { limite } = req.query;
        const n = parseInt(limite) || 100;
        const rows = await db.query('SELECT * FROM auditoria ORDER BY fecha DESC LIMIT ?', [n]);
        res.json(rows);
    } catch (e) {
        console.error('Error GET /auditoria:', e);
        res.status(500).json({ error: 'Error al obtener auditoría' });
    }
});

app.get('/api/backup', verificarToken, verificarRol(['admin']), (req, res) => {
    try {
        const dbPath = path.resolve(__dirname, 'database.sqlite');
        if (!fs.existsSync(dbPath)) return res.status(404).json({ error: 'No hay BD para respaldar' });
        res.download(dbPath, 'uciplays-backup-' + new Date().toISOString().slice(0, 10) + '.sqlite');
    } catch (e) {
        console.error('Error GET /backup:', e);
        res.status(500).json({ error: 'Error al generar backup' });
    }
});
// ===== Fin rutas inline =====

const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 Backend listo en: http://localhost:${PORT}`));