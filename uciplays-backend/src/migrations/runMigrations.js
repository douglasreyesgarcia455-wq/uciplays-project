const path = require('path');
const fs = require('fs');
const db = require('../config/db');

const MIGRATIONS_DIR = __dirname;

function cerrarDB() {
  return new Promise((resolve, reject) => {
    db.close(err => (err ? reject(err) : resolve()));
  });
}

function obtenerArchivosMigracion() {
  return fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();
}

async function asegurarTablaSchemaMigrations() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    )
  `);
}

async function yaAplicada(version) {
  const rows = await db.query(`SELECT version FROM schema_migrations WHERE version = ?`, [version]);
  return rows.length > 0;
}

async function registrarMigracion(version) {
  const appliedAt = new Date().toISOString();
  await db.query(`INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)`, [version, appliedAt]);
}

async function columnaExiste(tabla, columna) {
  const rows = await db.query(`PRAGMA table_info(${tabla})`);
  return rows.some(r => r.name === columna);
}

async function ejecutarMigracion(archivo) {
  const version = archivo.replace('.sql', '');

  if (await yaAplicada(version)) {
    console.log(`${version}: ya aplicada previamente, saltando`);
    return;
  }

  const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, archivo), 'utf8');

  // Idempotencia para 001: verificar si la columna ya existe antes de ALTER
  if (version === '001') {
    const existe = await columnaExiste('facultades', 'logo_url');
    if (existe) {
      console.log('001: logo_url ya existe, saltando');
      await registrarMigracion(version);
      return;
    }
  }

  await db.query(sql);
  await registrarMigracion(version);
  console.log(`${version}: aplicada correctamente`);
}

async function main() {
  try {
    await asegurarTablaSchemaMigrations();
    const archivos = obtenerArchivosMigracion();
    for (const archivo of archivos) {
      await ejecutarMigracion(archivo);
    }
    await cerrarDB();
    process.exit(0);
  } catch (err) {
    console.error('Error ejecutando migraciones:', err.message);
    try { await cerrarDB(); } catch (_) {}
    process.exit(1);
  }
}

main();