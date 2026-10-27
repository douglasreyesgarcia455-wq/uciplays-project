// ranking.controller.js — Controlador de ranking con Promise.allSettled
// Justificación: Promise.allSettled permite que ambas peticiones (ranking y facultades)
// se ejecuten independientemente. Si una falla, la otra sigue.

document.addEventListener("DOMContentLoaded", () => {
    // Verificación de dependencias: rankingApi y facultadesApi son OBJETOS,
    // no funciones. Verificamos que existan y que tengan el método esperado.
    if (!window.rankingApi || typeof window.rankingApi.getRanking !== 'function' ||
        !window.facultadesApi || typeof window.facultadesApi.getFacultades !== 'function') {
        console.warn('[ranking.controller] window.rankingApi o window.facultadesApi no disponibles');
        return;
    }

    Promise.allSettled([
        window.rankingApi.getRanking(),
        window.facultadesApi.getFacultades()
    ]).then(([rankingResult, facultadesResult]) => {
        // Ranking falló: no hay nada que pintar
        if (rankingResult.status !== 'fulfilled') {
            const tbody = document.querySelector('#ranking-table-body');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:20px;">Error al cargar el ranking</td></tr>';
            }
            console.warn('[ranking.controller] /api/ranking falló:', rankingResult.reason);
            return;
        }

        const ranking = rankingResult.value;
        const facultades = facultadesResult.status === 'fulfilled' ? facultadesResult.value : [];

        if (facultadesResult.status !== 'fulfilled') {
            console.warn('[ranking.controller] /api/facultades falló, se usa respaldo.png para todos los logos');
        }

        // Mapa nombre → logo_url
        const logosPorNombre = {};
        facultades.forEach(f => {
            if (f && f.nombre && f.logo_url) {
                logosPorNombre[f.nombre] = f.logo_url;
            }
        });

        // Localizar tbody
        const tbody = document.querySelector('#ranking-table-body');
        if (!tbody) {
            console.error('[ranking.controller] No se encontró <tbody id="ranking-table-body">');
            return;
        }
        tbody.innerHTML = '';

        if (!ranking || ranking.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:20px;">No hay datos de ranking disponibles</td></tr>';
            return;
        }

        // /api/ranking ya ordena por puntos DESC; no re-ordenamos.

        ranking.forEach((estudiante, indice) => {
            const nombre = estudiante.nombre || 'Sin nombre';
            const puntos = estudiante.puntos !== undefined ? estudiante.puntos : 0;
            const oros = estudiante.oros !== undefined ? estudiante.oros : 0;
            const platas = estudiante.platas !== undefined ? estudiante.platas : 0;
            const bronces = estudiante.bronces !== undefined ? estudiante.bronces : 0;
            const cuarto = estudiante.cuarto !== undefined ? estudiante.cuarto : 0;
            const quinto = estudiante.quinto !== undefined ? estudiante.quinto : 0;
            const totalEventos = estudiante.total_eventos !== undefined ? estudiante.total_eventos : 0;

            const logo = logosPorNombre[nombre] || '/assets/Logo/respaldo.png';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${indice + 1}</td>
                <td>
                    <img src="${logo}" alt="${nombre}" class="ranking__logo" width="24" height="24">
                    <span>${nombre}</span>
                </td>
                <td>${oros}</td>
                <td>${platas}</td>
                <td>${bronces}</td>
                <td>${cuarto}</td>
                <td>${quinto}</td>
                <td>${totalEventos}</td>
                <td>${puntos}</td>
            `;
            tbody.appendChild(tr);
        });
    }).catch((error) => {
        console.error('[ranking.controller] Error inesperado:', error);
        const tbody = document.querySelector('#ranking-table-body');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:20px;">Error crítico en el controller</td></tr>';
        }
    });
});
