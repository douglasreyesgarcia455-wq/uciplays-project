const express = require('express');
const cors = require('cors');
const db = require('./src/config/db');

const resultadosRoutes = require('./src/routes/resultados.routes');
const rankingRoutes = require('./src/routes/ranking.routes');
const eventosRoutes = require('./src/routes/eventos.routes');

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

        // Tabla de Resultados (Medallas y Sanciones)
        await db.query(`
            CREATE TABLE IF NOT EXISTS resultados (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                facultad_id INTEGER, 
                deporte TEXT, 
                posicion_lograda INTEGER, 
                puntuacion_final INTEGER, 
                fecha DATETIME DEFAULT CURRENT_TIMESTAMP
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

app.use('/api/resultados', resultadosRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/eventos', eventosRoutes);

const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 Backend listo en: http://localhost:${PORT}`));