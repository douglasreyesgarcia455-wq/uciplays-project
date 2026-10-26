const facultadesRepository = require('../repositories/facultadesRepository');
const { toDTO } = require('../dtos/FacultadDTO');

const facultadesController = {
  async listar(req, res) {
    try {
      const rows = await facultadesRepository.obtenerTodas();
      res.status(200).json(rows.map(toDTO));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener facultades' });
    }
  },

  async obtener(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    try {
      const row = await facultadesRepository.obtenerPorId(id);
      if (row === null) {
        return res.status(404).json({ error: 'Facultad no encontrada' });
      }
      res.status(200).json(toDTO(row));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener facultad' });
    }
  }
};

module.exports = facultadesController;