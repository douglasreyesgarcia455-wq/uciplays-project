function toDTO(row) {
  if (row === null || row === undefined) {
    return null;
  }

  return {
    id: row.id === undefined ? null : row.id,
    nombre: row.nombre === undefined ? null : row.nombre,
    logo_url: row.logo_url === undefined ? null : row.logo_url
  };
}

module.exports = { toDTO };