// ranking.api.js — Módulo por recurso.
// Sabe solo el endpoint y delega la petición en la fachada (api-client.js).

window.rankingApi = {
    getRanking: () => window.apiClient.get('/ranking')
};
