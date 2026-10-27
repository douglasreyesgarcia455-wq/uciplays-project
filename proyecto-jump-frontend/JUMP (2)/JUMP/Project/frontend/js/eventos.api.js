// eventos.api.js — Módulo por recurso.
// Acepta un objeto opcional de filtros: { estado, ... }.

window.eventosApi = {
    getEventos: (filtros) => {
        const params = new URLSearchParams();
        if (filtros) {
            Object.keys(filtros).forEach(k => {
                if (filtros[k] !== undefined && filtros[k] !== null && filtros[k] !== '') {
                    params.append(k, filtros[k]);
                }
            });
        }
        const qs = params.toString();
        return window.apiClient.get('/eventos' + (qs ? '?' + qs : ''));
    }
};
