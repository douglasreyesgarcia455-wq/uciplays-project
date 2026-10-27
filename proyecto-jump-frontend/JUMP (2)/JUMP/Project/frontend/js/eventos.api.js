// eventos.api.js — Módulo por recurso.
// Sabe solo el endpoint y delega la petición en la fachada (api-client.js).

window.eventosApi = {
  getEventos: () => window.apiClient.get('/eventos')
};
