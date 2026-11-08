document.addEventListener("DOMContentLoaded", () => {
    
    // Configuración global para fuentes de Chart.js
    Chart.defaults.font.family = '"Inter", Arial, sans-serif';
    Chart.defaults.color = '#65647A';

    // 1. Desglose de Puntos por Disciplina (Barras Apiladas)
    const ctxDesglose = document.getElementById('graficoDesglose').getContext('2d');
    new Chart(ctxDesglose, {
        type: 'bar',
        data: {
            labels: ['FEI', 'FTE', 'FICI', 'CITI', 'FCE', 'FTI'],
            datasets: [
                { label: 'Fútbol', data: [15, 20, 5, 10, 0, 0], backgroundColor: '#1a1088' },
                { label: 'Volleyball', data: [31, 15, 7, 2, 1, 0], backgroundColor: '#5A4BFF' },
                { label: 'Béisbol', data: [31, 5, 10, 4, 5, 1], backgroundColor: '#167963' }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { stacked: true },
                y: { stacked: true, beginAtZero: true }
            }
        }
    });

    // 2. Eficiencia en el Podio (Ratio de Oro) (Dona)
    const ctxEficiencia = document.getElementById('graficoEficiencia').getContext('2d');
    new Chart(ctxEficiencia, {
        type: 'doughnut',
        data: {
            labels: ['FEI', 'FTE', 'FICI', 'Resto'],
            datasets: [{
                data: [4, 2, 1, 1], // Cantidad de medallas de oro
                backgroundColor: ['#1a1088', '#5A4BFF', '#167963', '#D0CCFE'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'right' } }
        }
    });

    // 3. Índice de Disciplina (Barras Horizontales Invertidas)
    const ctxDisciplina = document.getElementById('graficoDisciplina').getContext('2d');
    new Chart(ctxDisciplina, {
        type: 'bar',
        data: {
            labels: ['FCE', 'CITI', 'FTE', 'FEI'],
            datasets: [{
                label: 'Puntos Descontados por Sanciones',
                data: [-12, -8, -5, -2], // Valores negativos para ilustrar pérdida
                backgroundColor: '#B8324B', // Color de alerta/peligro
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y', // Convierte el gráfico en horizontal
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { x: { max: 0 } } // Fuerza el eje a mostrar de 0 hacia la izquierda
        }
    });

    // 4. Análisis Frente a Frente (Gráfico de Radar)
    const ctxH2H = document.getElementById('graficoH2H').getContext('2d');
    new Chart(ctxH2H, {
        type: 'radar',
        data: {
            labels: ['Victorias Directas', 'Juego Limpio', 'Efectividad Oro', 'Participación', 'Puntos Totales'],
            datasets: [
                {
                    label: 'FEI',
                    data: [8, 9, 10, 10, 9],
                    backgroundColor: 'rgba(26, 16, 136, 0.2)',
                    borderColor: '#1a1088',
                    pointBackgroundColor: '#1a1088'
                },
                {
                    label: 'FTE',
                    data: [5, 6, 4, 10, 6],
                    backgroundColor: 'rgba(22, 121, 99, 0.2)',
                    borderColor: '#167963',
                    pointBackgroundColor: '#167963'
                }
            ]
        },
        options: {
            responsive: true,
            scales: { r: { min: 0, max: 10 } }
        }
    });

    // 5. Impacto Logístico (Tasa de Suspensión) (Barras Simples)
    const ctxLogistica = document.getElementById('graficoLogistica').getContext('2d');
    new Chart(ctxLogistica, {
        type: 'bar',
        data: {
            labels: ['Béisbol', 'Fútbol', 'Atletismo', 'Volleyball', 'Ajedrez'],
            datasets: [{
                label: 'Partidos Suspendidos',
                data: [4, 2, 1, 0, 0],
                backgroundColor: '#FFC86B', // Color de pendiente/advertencia
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });

});