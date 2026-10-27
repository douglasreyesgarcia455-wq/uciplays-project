// estadisticas.graficos.js — Funciones de render de los 5 gráficos de Chart.js.
// Se usan desde estadisticas.controller.js.
// Cada función recibe los datos ya filtrados y destruye el chart anterior si existe.

window.estadisticasGraficos = (function () {
    const COLORES = ['#1a1088', '#5A4BFF', '#167963', '#B8324B', '#E8A33D', '#8E44AD'];
    const charts = { g1: null, g2: null, g3: null, g4: null, g5: null };

    function destruir(key) {
        if (charts[key]) { charts[key].destroy(); charts[key] = null; }
    }

    function renderDesglose(evFiltrados, rankFiltrado) {
        const $g1 = document.getElementById('graficoDesglose');
        if (!$g1) return;
        const deportes = [...new Set(evFiltrados.map(e => e.deporte))];
        const facultadesNombres = rankFiltrado.map(r => r.nombre);
        const matriz = {};
        facultadesNombres.forEach(f => { matriz[f] = {}; deportes.forEach(d => { matriz[f][d] = 0; }); });
        evFiltrados.forEach(e => {
            (e.participantes || []).forEach(p => {
                if (matriz[p.facultad] && matriz[p.facultad][e.deporte] !== undefined) {
                    matriz[p.facultad][e.deporte] += (p.puntos || 0);
                }
            });
        });
        const datasets = deportes.map((d, i) => ({
            label: d,
            data: facultadesNombres.map(f => matriz[f][d] || 0),
            backgroundColor: COLORES[i % COLORES.length]
        }));
        destruir('g1');
        charts.g1 = new Chart($g1.getContext('2d'), {
            type: 'bar',
            data: { labels: facultadesNombres, datasets },
            options: { responsive: true, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } } }
        });
    }

    function renderEficiencia(rankFiltrado) {
        const $g2 = document.getElementById('graficoEficiencia');
        if (!$g2) return;
        const conPuntos = rankFiltrado.filter(r => (r.puntos || 0) > 0).slice(0, 3);
        const labels = conPuntos.map(r => r.nombre);
        const data = conPuntos.map(r => r.puntos || 0);
        if (data.length === 0) { labels.push('Sin puntos positivos'); data.push(1); }
        destruir('g2');
        charts.g2 = new Chart($g2.getContext('2d'), {
            type: 'doughnut',
            data: { labels, datasets: [{ data, backgroundColor: labels.map((_, i) => COLORES[i % COLORES.length]), borderWidth: 0 }] },
            options: { responsive: true, plugins: { legend: { position: 'right' } } }
        });
    }

    function renderDisciplina(sancFiltradas) {
        const $g3 = document.getElementById('graficoDisciplina');
        if (!$g3) return;
        const puntosPorFac = {};
        sancFiltradas.forEach(s => {
            const f = s.facultad_nombre || '—';
            puntosPorFac[f] = (puntosPorFac[f] || 0) + (s.puntos_descontados || 0);
        });
        const entradas = Object.entries(puntosPorFac).sort((a, b) => a[1] - b[1]);
        destruir('g3');
        charts.g3 = new Chart($g3.getContext('2d'), {
            type: 'bar',
            data: { labels: entradas.map(e => e[0]), datasets: [{ label: 'Puntos descontados', data: entradas.map(e => e[1]), backgroundColor: '#B8324B', borderRadius: 4 }] },
            options: { responsive: true, indexAxis: 'y' }
        });
    }

    function renderH2H(rankFiltrado) {
        const $sel1 = document.getElementById('select-h2h-1');
        const $sel2 = document.getElementById('select-h2h-2');
        const $g4 = document.getElementById('graficoH2H');
        if (!$sel1 || !$sel2 || !$g4) return;

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
        if (!f1 || !f2) return;

        const metrics = ['puntos_eventos', 'puntos_sanciones', 'puntos'];
        const labelsM = ['Pts. Eventos', 'Pts. Sanciones', 'Total'];
        const colorPara = (val, colorNormal) => (val === 0 ? '#D0D0D0' : colorNormal);

        destruir('g4');
        charts.g4 = new Chart($g4.getContext('2d'), {
            type: 'bar',
            data: {
                labels: labelsM,
                datasets: [
                    {
                        label: f1.nombre,
                        data: metrics.map(m => f1[m] || 0),
                        backgroundColor: metrics.map(m => colorPara(f1[m] || 0, '#1a1088')),
                        borderColor: metrics.map(m => (f1[m] || 0) === 0 ? '#999' : '#1a1088'),
                        borderWidth: 1
                    },
                    {
                        label: f2.nombre,
                        data: metrics.map(m => f2[m] || 0),
                        backgroundColor: metrics.map(m => colorPara(f2[m] || 0, '#5A4BFF')),
                        borderColor: metrics.map(m => (f2[m] || 0) === 0 ? '#999' : '#5A4BFF'),
                        borderWidth: 1
                    }
                ]
            },
            options: { responsive: true, scales: { y: { beginAtZero: true, minBarLength: 2 } } }
        });
    }

    function renderLogistica(sancFiltradas) {
        const $g5 = document.getElementById('graficoLogistica');
        if (!$g5) return;
        const sancionesPorDeporte = {};
        sancFiltradas.forEach(s => {
            const d = s.deporte || '—';
            sancionesPorDeporte[d] = (sancionesPorDeporte[d] || 0) + 1;
        });
        const entradas = Object.entries(sancionesPorDeporte);
        destruir('g5');
        charts.g5 = new Chart($g5.getContext('2d'), {
            type: 'bar',
            data: { labels: entradas.map(e => e[0]), datasets: [{ label: 'Sanciones por deporte', data: entradas.map(e => e[1]), backgroundColor: '#E8A33D', borderRadius: 4 }] },
            options: { responsive: true, beginAtZero: true }
        });
    }

    function renderTodos(evFiltrados, rankFiltrado, sancFiltradas) {
        renderDesglose(evFiltrados, rankFiltrado);
        renderEficiencia(rankFiltrado);
        renderDisciplina(sancFiltradas);
        renderH2H(rankFiltrado);
        renderLogistica(sancFiltradas);
    }

    return { renderTodos, renderDesglose, renderEficiencia, renderDisciplina, renderH2H, renderLogistica };
})();
