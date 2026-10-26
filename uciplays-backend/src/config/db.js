const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Creamos el archivo en la raíz del backend
const dbPath = path.resolve(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("❌ Error conectando a SQLite:", err.message);
    else console.log("📦 Conectado a la base de datos SQLite.");
});

// ESTA ES LA FUNCIÓN QUE FALTA EN TU ERROR
db.query = function (sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                console.error("❌ Error en SQL:", sql);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

module.exports = db;