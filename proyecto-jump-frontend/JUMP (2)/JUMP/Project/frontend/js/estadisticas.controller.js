// estadisticas.controller.js — Orquestador de estadísticas.
// Carga datos, pinta cards, filtra y delega los 5 gráficos en estadisticas.graficos.js.

document.addEventListener("DOMContentLoaded", () => {
    if (!window.eventosApi || typeof window.eventosApi.getEventos !== 'function' ||
        !window.rankingApi || typeof window.rankingApi.getRanking !== 'function' ||
        !window.facultadesApi || typeof window.facultadesApi.getFacultades !== 'function' ||
        !window.sancionesApi || typeof window.sancionesApi.getSanciones !== 'function') {
        console.warn('[estadisticas.controller] Faltan dependencias');
        return;
    }
    if (typeof Chart === 'undefined') {
        console.warn('[estadisticas.controller] Chart.js no cargó');
        return;
    }
    if (!window.estadisticasGraficos) {
        console.warn('[estadisticas.controller] estadisticas.graficos.js no cargó');
        return;
    }

    Chart.defaults.font.family = '"Inter", Arial, sans-serif';
    Chart.defaults.color = '#65647A';

    Promise.allSettled([
        window.eventosApi.getEventos(),
        window.rankingApi.getRanking(),
        window.facultadesApi.getFacultades(),
        window.sancionesApi.getSanciones()
    ]).then(([eventosRes, rankingRes, facultadesRes, sancionesRes]) => {
        const eventos = eventosRes.status === 'fulfilled' ? eventosRes.value : [];
        const ranking = rankingRes.status === 'fulfilled' ? rankingRes.value : [];
        const facultades = facultadesRes.status === 'fulfilled' ? facultadesRes.value : [];
        const sanciones = sancionesRes.status === 'fulfilled' ? sancionesRes.value : [];

        const logosPorNombre = {};
        facultades.forEach(f => { if (f && f.nombre && f.logo_url) logosPorNombre[f.nombre] = f.logo_url; });
        const logoDe = (fac) => logosPorNombre[fac] || '/assets/Logo/respaldo.png';

        // Poblar filtro-deporte
        const $filtroDeporte = document.getElementById('filtro-deporte');
        const deportesUnicos = [...new Set(eventos.map(e => e.deporte).filter(Boolean))].sort();
        if ($filtroDeporte) {
            $filtroDeporte.innerHTML = '';
            const optTodos = document.createElement('option');
            optTodos.value = 'todos';
            optTodos.textContent = 'Todos los deportes';
            $filtroDeporte.appendChild(optTodos);
            deportesUnicos.forEach(d => {
                const opt = document.createElement('option');
                opt.value = d;
                opt.textContent = d;
                $filtroDeporte.appendChild(opt);
            });
        }

        // Poblar filtro-facultad
        const $filtroFacultad = document.getElementById('filtro-facultad');
        if ($filtroFacultad) {
            $filtroFacultad.innerHTML = '';
            const optTodas = document.createElement('option');
            optTodas.value = 'todas';
            optTodas.textContent = 'Todas las facultades';
            $filtroFacultad.appendChild(optTodas);
            const optTop3 = document.createElement('option');
            optTop3.value = 'top3';
            optTop3.textContent = 'Top 3 del Ranking';
            $filtroFacultad.appendChild(optTop3);
            ranking.forEach(r => {
                const opt = document.createElement('option');
                opt.value = r.nombre;
                opt.textContent = r.nombre;
                $filtroFacultad.appendChild(opt);
            });
        }

        // ============================================================
        // FILTROS
        // ============================================================
        const filtrarRanking = (r, v) => {
            if (v === 'todas' || !v) return r;
            if (v === 'top3') return r.slice(0, 3);
            return r.filter(x => x.nombre === v);
        };

        const filtrarEventos = (evs, deporte, valorFacultad) => {
            let result = evs;
            if (deporte && deporte !== 'todos') result = result.filter(e => e.deporte === deporte);
            if (valorFacultad && valorFacultad !== 'todas' && valorFacultad !== 'top3') {
                result = result.filter(e => (e.participantes || []).some(p => p.facultad === valorFacultad));
            } else if (valorFacultad === 'top3') {
                const top3 = ranking.slice(0, 3).map(r => r.nombre);
                result = result.filter(e => (e.participantes || []).some(p => top3.includes(p.facultad)));
            }
            return result;
        };

        const filtrarSanciones = (sancs, deporte, valorFacultad) => {
            let result = sancs;
            if (deporte && deporte !== 'todos') result = result.filter(s => s.deporte === deporte);
            if (valorFacultad && valorFacultad !== 'todas' && valorFacultad !== 'top3') {
                result = result.filter(s => s.facultad_nombre === valorFacultad);
            } else if (valorFacultad === 'top3') {
                const top3 = ranking.slice(0, 3).map(r => r.nombre);
                result = result.filter(s => top3.includes(s.facultad_nombre));
            }
            return result;
        };

        // ============================================================
        // RENDER
        // ============================================================
        const render = () => {
            const deporte = $filtroDeporte ? $filtroDeporte.value : 'todos';
            const valorFacultad = $filtroFacultad ? $filtroFacultad.value : 'todas';

            const evFiltrados = filtrarEventos(eventos, deporte, valorFacultad);
            const rankFiltrado = filtrarRanking(ranking, valorFacultad);
            const sancFiltradas = filtrarSanciones(sanciones, deporte, valorFacultad);

            // 3 CARDS
            const $total = document.getElementById('card-total-partidos');
            if ($total) $total.textContent = evFiltrados.length;

            const $lider = document.getElementById('card-lider');
            if ($lider) {
                const lider = rankFiltrado[0];
                if (lider) {
                    $lider.innerHTML = '<img class="estadisticas__logo" src="' + logoDe(lider.nombre) + '" alt="Logo ' + lider.nombre + '" title="' + lider.nombre + '">';
                } else {
                    $lider.textContent = '—';
                }
            }

            const $participacion = document.getElementById('card-participacion');
            if ($participacion) {
                const masPart = [...rankFiltrado].sort((a, b) => (b.puntos || 0) - (a.puntos || 0))[0];
                if (masPart) {
                    $participacion.innerHTML = '<img class="estadisticas__logo" src="' + logoDe(masPart.nombre) + '" alt="Logo ' + masPart.nombre + '" title="' + masPart.nombre + '">';
                } else {
                    $participacion.textContent = '—';
                }
            }

            // 5 GRÁFICOS (delegados)
            window.estadisticasGraficos.renderTodos(evFiltrados, rankFiltrado, sancFiltradas);
        };

        // Listeners
        if ($filtroDeporte) $filtroDeporte.addEventListener('change', render);
        if ($filtroFacultad) $filtroFacultad.addEventListener('change', render);
        const $sel1 = document.getElementById('select-h2h-1');
        const $sel2 = document.getElementById('select-h2h-2');
        if ($sel1) $sel1.addEventListener('change', render);
        if ($sel2) $sel2.addEventListener('change', render);

        render();
    }).catch((error) => {
        console.error('[estadisticas.controller] Error inesperado:', error);
    });
});
