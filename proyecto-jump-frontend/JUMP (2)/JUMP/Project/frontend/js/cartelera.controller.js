// cartelera.controller.js — Controlador de vista.
// Única fuente de filtrado y agrupado de eventos.
// Conecta eventos.api con la lógica de renderizarCalendario() existente.
// NO toca el DOM hasta que lleguen los datos. Manejo de error visible.

document.addEventListener("DOMContentLoaded", () => {
  // Filtrar eventos con año fuera del rango válido [2000-2100]
  function filtrarEventosValidos(eventos) {
    return eventos.filter(e => {
      const anyo = parseInt(e.fecha.split('-')[0]);
      return anyo >= 2000 && anyo <= 2100;
    });
  }

  // Agrupar eventos por fecha YYYY-MM-DD (asumiendo que ya vienen normalizados
  // por el filtro anterior; si no, agrupan igual bajo la clave que sea)
  function agruparPorFecha(eventos) {
    const agrupado = {};
    eventos.forEach((evento) => {
      const fechaKey = evento.fecha; // Ya viene YYYY-MM-DD por el filtro anterior
      if (!agrupado[fechaKey]) {
        agrupado[fechaKey] = [];
      }
      agrupado[fechaKey].push(evento);
    });
    return agrupado;
  }

  window.eventosApi.getEventos()
    .then((eventos) => {
      // --- ÚNICA Fuente de filtrado ---
      const eventosValidos = filtrarEventosValidos(eventos);
      if (eventosValidos.length < eventos.length) {
        console.warn(`[cartelera.controller] Descartados ${eventos.length - eventosValidos.length} eventos con año fuera de rango [2000-2100]`);
      }

      // Agrupar eventos por fecha
      const baseDeDatosEventos = agruparPorFecha(eventosValidos);

      // Poblar la variable de cartelera.js y re-renderizar
      if (typeof window.actualizarEventos === 'function') {
        window.actualizarEventos(baseDeDatosEventos);
      } else {
        // Fallback: mostrar error visible en el DOM si el controller se carga antes
        const grid = document.getElementById("calendario-grid");
        if (grid) {
          grid.innerHTML = `<div class="calendario__error">Error: la fachada de eventos no está disponible.</div>`;
        } else {
          alert("Error: la fachada de eventos no está disponible. Consola para más detalles.");
        }
      }
    })
    .catch((error) => {
      // Manejo de error visible: mostrar mensaje en el contenedor del calendario
      const grid = document.getElementById("calendario-grid");
      if (grid) {
        grid.innerHTML = `<div class="calendario__error">No se pudieron cargar los eventos.</div>`;
      } else {
        alert("No se pudieron cargar los eventos: " + error.message);
      }
    });
});