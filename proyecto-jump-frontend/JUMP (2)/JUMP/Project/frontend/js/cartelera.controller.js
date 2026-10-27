// cartelera.controller.js — Controlador de cartelera.
// Consume /api/eventos. Usa evento.participantes (array N:M).

document.addEventListener("DOMContentLoaded", () => {
    if (!window.eventosApi || typeof window.eventosApi.getEventos !== 'function') {
        console.warn('[cartelera.controller] eventosApi no disponible');
        return;
    }

    window.eventosApi.getEventos()
        .then((eventos) => {
            // Agrupar por fecha YYYY-MM-DD
            const baseDeDatosEventos = {};
            (eventos || []).forEach((evento) => {
                const fechaKey = evento.fecha;
                if (!fechaKey) return;
                if (!baseDeDatosEventos[fechaKey]) baseDeDatosEventos[fechaKey] = [];
                baseDeDatosEventos[fechaKey].push(evento);
            });
            if (typeof window.actualizarEventos === 'function') {
                window.actualizarEventos(baseDeDatosEventos);
            } else {
                const grid = document.getElementById('calendario-grid');
                if (grid) grid.innerHTML = '<div class="calendario__error">Error: actualizarEventos no definido.</div>';
            }
        })
        .catch((error) => {
            const grid = document.getElementById('calendario-grid');
            if (grid) grid.innerHTML = '<div class="calendario__error">No se pudieron cargar los eventos.</div>';
            console.warn('[cartelera.controller] Error:', error);
        });
});
