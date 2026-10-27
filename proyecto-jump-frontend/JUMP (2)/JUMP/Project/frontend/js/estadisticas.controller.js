// estadisticas.controller.js — Controlador de estadísticas con filtros.
// Consume /api/eventos, /api/ranking, /api/facultades, /api/sanciones.
// Pinta 3 cards + 5 gráficos Chart.js. Los filtros (deporte, facultad) re-renderizan todo.

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

    Chart.defaults.font.family = '"Inter", Arial, sans-serif';
    Chart.defaults.color = '#65647A';

    const COLORES = ['#1a1088', '#5A4BFF', '#167963', '#B8324B', '#E8A33D', '#8E44AD'];
    const charts = { g1: null, g2: null, g3: null, g4: null, g5: null };

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

        const filtrarRanking = (ranking, valorFacultad) => {
            if (valorFacultad === 'todas' || !valorFacultad) return ranking;
            if (valorFacultad === 'top3') return ranking.slice(0, 3);
            return ranking.filter(r => r.nombre === valorFacultad);
        };

        const filtrarEventos = (eventos, deporte, valorFacultad) => {
            let result = eventos;
            if (deporte && deporte !== 'todos') result = result.filter(e => e.deporte === deporte);
            if (valorFacultad && valorFacultad !== 'todas' && valorFacultad !== 'top3') {
                result = result.filter(e => e.equipo_local_facultad === valorFacultad || e.equipo_visitante_facultad === valorFacultad);
            } else if (valorFacultad === 'top3') {
                const top3 = ranking.slice(0, 3).map(r => r.nombre);
                result = result.filter(e => top3.includes(e.equipo_local_facultad) || top3.includes(e.equipo_visitante_facultad));
            }
            return result;
        };

        const filtrarSanciones = (sanciones, deporte, valorFacultad) => {
            let result = sanciones;
            if (deporte && deporte !== 'todos') result = result.filter(s => s.deporte === deporte);
            if (valorFacultad && valorFacultad !== 'todas' && valorFacultad !== 'top3') {
                result = result.filter(s => s.facultad_nombre === valorFacultad);
            } else if (valorFacultad === 'top3') {
                const top3 = ranking.slice(0, 3).map(r => r.nombre);
                result = result.filter(s => top3.includes(s.facultad_nombre));
            }
            return result;
        };

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
                const masPart = [...rankFiltrado].sort((a, b) => (b.total_eventos || 0) - (a.total_eventos || 0))[0];
                if (masPart) {
                    $participacion.innerHTML = '<img class="estadisticas__logo" src="' + logoDe(masPart.nombre) + '" alt="Logo ' + masPart.nombre + '" title="' + masPart.nombre + '">';
                } else {
                    $participacion.textContent = '—';
                }
            }

            // GRÁFICO 1: Desglose
            const $g1 = document.getElementById('graficoDesglose');
            if ($g1) {
                const deportes = [...new Set(evFiltrados.map(e => e.deporte))];
                const facultadesNombres = rankFiltrado.map(r => r.nombre);
                const matriz = {};
                facultadesNombres.forEach(f => { matriz[f] = {}; deportes.forEach(d => { matriz[f][d] = 0; }); });
                evFiltrados.forEach(e => {
                    const local = e.equipo_local_facultad;
                    const visitante = e.equipo_visitante_facultad;
                    if (local && matriz[local] && matriz[local][e.deporte] !== undefined) matriz[local][e.deporte]++;
                    if (visitante && matriz[visitante] && matriz[visitante][e.deporte] !== undefined) matriz[visitante][e.deporte]++;
                });
                const datasets = deportes.map((d, i) => ({
                    label: d,
                    data: facultadesNombres.map(f => matriz[f][d] || 0),
                    backgroundColor: COLORES[i % COLORES.length]
                }));
                if (charts.g1) charts.g1.destroy();
                charts.g1 = new Chart($g1.getContext('2d'), {
                    type: 'bar',
                    data: { labels: facultadesNombres, datasets },
                    options: { responsive: true, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } } }
                });
            }

            // GRÁFICO 2: Eficiencia
            const $g2 = document.getElementById('graficoEficiencia');
            if ($g2) {
                const conOros = rankFiltrado.filter(r => (r.oros || 0) > 0);
                const labels = conOros.map(r => r.nombre);
                const data = conOros.map(r => r.oros);
                const otros = rankFiltrado.filter(r => (r.oros || 0) === 0).length;
                if (otros > 0) { labels.push('Resto'); data.push(otros); }
                if (charts.g2) charts.g2.destroy();
                charts.g2 = new Chart($g2.getContext('2d'), {
                    type: 'doughnut',
                    data: { labels, datasets: [{ data, backgroundColor: labels.map((_, i) => COLORES[i % COLORES.length]), borderWidth: 0 }] },
                    options: { responsive: true, plugins: { legend: { position: 'right' } } }
                });
            }

            // GRÁFICO 3: Disciplina
            const $g3 = document.getElementById('graficoDisciplina');
            if ($g3) {
                const puntosPorFac = {};
                sancFiltradas.forEach(s => {
                    const f = s.facultad_nombre || '—';
                    puntosPorFac[f] = (puntosPorFac[f] || 0) + (s.puntos_descontados || 0);
                });
                const entradas = Object.entries(puntosPorFac).sort((a, b) => a[1] - b[1]);
                if (charts.g3) charts.g3.destroy();
                charts.g3 = new Chart($g3.getContext('2d'), {
                    type: 'bar',
                    data: { labels: entradas.map(e => e[0]), datasets: [{ label: 'Puntos descontados', data: entradas.map(e => e[1]), backgroundColor: '#B8324B', borderRadius: 4 }] },
                    options: { responsive: true, indexAxis: 'y' }
                });
            }

            // GRÁFICO 4: H2H
            const $sel1 = document.getElementById('select-h2h-1');
            const $sel2 = document.getElementById('select-h2h-2');
            const $g4 = document.getElementById('graficoH2H');
            if ($sel1 && $sel2 && $g4) {
                const nombres = rankFiltrado.map(r => r.nombre);
                const valorActual1 = $sel1.value;
                const valorActual2 = $sel2.value;
                [$sel1, $sel2].forEach(sel => {
                    sel.innerHTML = '';
                    nombres.forEach(n => {
                        const opt = document.createElement('option');
                        opt.value = n;
                        opt.textContent = n;
                        sel.appendChild(opt);
                    });
                });
                if (nombres.includes(valorActual1)) $sel1.value = valorActual1;
                else if (nombres[0]) $sel1.value = nombres[0];
                if (nombres.includes(valorActual2)) $sel2.value = valorActual2;
                else if (nombres[1]) $sel2.value = nombres[1];

                const f1 = rankFiltrado.find(r => r.nombre === $sel1.value);
                const f2 = rankFiltrado.find(r => r.nombre === $sel2.value);
                if (f1 && f2) {
                    const metrics = ['puntos', 'oros', 'platas', 'bronces', 'total_eventos'];
                    const labelsM = ['Puntos', 'Oros', 'Platas', 'Bronces', 'Total Eventos'];
                    if (charts.g4) charts.g4.destroy();
                    charts.g4 = new Chart($g4.getContext('2d'), {
                        type: 'bar',
                        data: {
                            labels: labelsM,
                            datasets: [
                                { label: f1.nombre, data: metrics.map(m => f1[m] || 0), backgroundColor: '#1a1088' },
                                { label: f2.nombre, data: metrics.map(m => f2[m] || 0), backgroundColor: '#5A4BFF' }
                            ]
                        },
                        options: { responsive: true }
                    });
                }
            }

            // GRÁFICO 5: Logística
            const $g5 = document.getElementById('graficoLogistica');
            if ($g5) {
                const sancionesPorDeporte = {};
                sancFiltradas.forEach(s => {
                    const d = s.deporte || '—';
                    sancionesPorDeporte[d] = (sancionesPorDeporte[d] || 0) + 1;
                });
                const entradas = Object.entries(sancionesPorDeporte);
                if (charts.g5) charts.g5.destroy();
                charts.g5 = new Chart($g5.getContext('2d'), {
                    type: 'bar',
                    data: { labels: entradas.map(e => e[0]), datasets: [{ label: 'Sanciones por deporte', data: entradas.map(e => e[1]), backgroundColor: '#E8A33D', borderRadius: 4 }] },
                    options: { responsive: true, beginAtZero: true }
                });
            }
        };

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
