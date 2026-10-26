const db = require('../config/db');

const facultadesRepository = {
  async obtenerTodas() {
    try {
      const rows = await db.query('SELECT id, nombre, logo_url FROM facultades ORDER BY nombre ASC');
      return rows || [];
    } catch (err) {
      throw new Error(`FacultadesRepository.obtenerTodas: ${err.message}`);
    }
  },

  async obtenerPorId(id) {
    try {
      const rows = await db.query('SELECT id, nombre, logo_url FROM facultades WHERE id = ?', [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (err) {
      throw new Error(`FacultadesRepository.obtenerPorId(${id}): ${err.message}`);
    }
  }
};

module.exports = facultadesRepository;