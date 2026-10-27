const path = require('path');
const express = require('express');

/**
 * Configura los middlewares de archivos estáticos para servir:
 * - /assets/... → carpetas del proyecto nuevo bajo uciplays-backend/public/assets/
 * - /jump/...   → frontend nuevo desde proyecto-jump-frontend
 *
 * @param {import('express').Express} app - aplicación Express
 */
function configurarEstaticos(app) {
  // /assets/... → logos, favicon, etc. copiados desde el frontend nuevo
  // Resolución relativa a la carpeta del módulo: src/config/static.js
  app.use('/assets', express.static(path.resolve(__dirname, '../../public/assets')));

  // /img/... → logos .jpeg de las facultades (copiados al repo canónico)
  app.use('/img', express.static(path.resolve(__dirname, '../../img')));

  // /jump/... → HTML, CSS, JS del frontend nuevo, para servir bajo /jump
  // Ajuste: desde src/config/ subir 3 niveles hasta la raíz del repo,
  // luego al proyecto-jump-frontend/JUMP (2)/JUMP/Project
  app.use('/jump', express.static(path.resolve(__dirname, '../../../proyecto-jump-frontend/JUMP (2)/JUMP/Project')));
}

module.exports = { configurarEstaticos };
