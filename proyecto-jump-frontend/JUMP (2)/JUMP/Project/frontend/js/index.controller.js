// index.controller.js — Controlador del index (main-event, mini-ranking, tarjetas).
// Consume /api/eventos, /api/ranking, /api/facultades con Promise.allSettled.
// Pinta las 3 secciones del index sin tocar el resto del HTML.

document.addEventListener("DOMContentLoaded", () => {
    if (!window.eventosApi || typeof window.eventosApi.getEventos !== 'function' ||
        !window.rankingApi || typeof window.rankingApi.getRanking !== 'function' ||
        !window.facultadesApi || typeof window.facultadesApi.getFacultades !== 'function') {
        console.warn('[index.controller] Faltan dependencias: eventosApi, rankingApi o facultadesApi');
        return;
    }

    Promise.allSettled([
        window.eventosApi.getEventos(),
        window.rankingApi.getRanking(),
        window.facultadesApi.getFacultades()
    ]).then(([eventosResult, rankingResult, facultadesResult]) => {
        const eventos = eventosResult.status === 'fulfilled' ? eventosResult.value : [];
        const ranking = rankingResult.status === 'fulfilled' ? rankingResult.value : [];
        const facultades = facultadesResult.status === 'fulfilled' ? facultadesResult.value : [];

        if (eventosResult.status !== 'fulfilled') {
            console.warn('[index.controller] /api/eventos falló:', eventosResult.reason);
        }
        if (rankingResult.status !== 'fulfilled') {
            console.warn('[index.controller] /api/ranking falló:', rankingResult.reason);
        }
        if (facultadesResult.status !== 'fulfilled') {
            console.warn('[index.controller] /api/facultades falló:', facultadesResult.reason);
        }

        // Mapa nombre → logo_url
        const logosPorNombre = {};
        facultades.forEach(f => {
            if (f && f.nombre && f.logo_url) {
                logosPorNombre[f.nombre] = f.logo_url;
            }
        });
        const logoDe = (nombre) => logosPorNombre[nombre] || '/assets/Logo/respaldo.png';

        // Helpers de fecha
        const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
        const MESES_LARGOS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
        const parseFecha = (s) => {
            if (!s) return null;
            const d = new Date(s + 'T00:00:00');
            return isNaN(d.getTime()) ? null : d;
        };
        const fmtCorta = (s) => {
            const d = parseFecha(s);
            if (!d) return s || '—';
            return d.getDate() + ' ' + MESES[d.getMonth()];
        };
        const fmtLarga = (s) => {
            const d = parseFecha(s);
            if (!d) return s || '—';
            return d.getDate() + ' de ' + MESES_LARGOS[d.getMonth()] + ', ' + d.getFullYear();
        };
        const hoy = new Date(); hoy.setHours(0,0,0,0);

        // ============================================================
        // MAIN EVENT — el evento más próximo (fecha >= hoy)
        // ============================================================
        const mainEvento = (() => {
            if (!eventos || eventos.length === 0) return null;
            const conFecha = eventos
                .map(e => ({ e, d: parseFecha(e.fecha) }))
                .filter(x => x.d)
                .sort((a, b) => a.d - b.d);
            if (conFecha.length === 0) return eventos[0];
            const futuro = conFecha.find(x => x.d >= hoy);
            return (futuro || conFecha[conFecha.length - 1]).e;
        })();

        const $estado = document.getElementById('main-event-estado');
        const $titulo = document.getElementById('main-event-titulo');
        const $logo1 = document.getElementById('main-event-logo-1');
        const $nombre1 = document.getElementById('main-event-nombre-1');
        const $logo2 = document.getElementById('main-event-logo-2');
        const $nombre2 = document.getElementById('main-event-nombre-2');
        const $info = document.getElementById('main-event-info');

        if (mainEvento) {
            const [eq1, eq2] = String(mainEvento.enfrentamiento || '').split(' vs ');
            const estadoTxt = ({ 'proximo': 'Próximo', 'en vivo': 'En Curso', 'programado': 'Programado' })[mainEvento.estado] || mainEvento.estado || '—';
            if ($estado) {
                $estado.textContent = estadoTxt;
                $estado.className = 'main-event__estado main-event__estado--' + (mainEvento.estado === 'en vivo' ? 'curso' : mainEvento.estado === 'programado' ? 'programado' : 'proximo');
            }
            if ($titulo) $titulo.textContent = (mainEvento.deporte || 'Evento') + ' — ' + (mainEvento.enfrentamiento || '');
            if ($logo1) { $logo1.src = logoDe(eq1); $logo1.alt = 'Logo ' + eq1; }
            if ($nombre1) $nombre1.textContent = eq1 || '—';
            if ($logo2) { $logo2.src = logoDe(eq2); $logo2.alt = 'Logo ' + eq2; }
            if ($nombre2) $nombre2.textContent = eq2 || '—';
            if ($info) $info.textContent = '📅 ' + fmtLarga(mainEvento.fecha) + ' • 🕒 ' + (mainEvento.hora || '—') + ' • 📍 ' + (mainEvento.lugar || '—');
        } else {
            if ($titulo) $titulo.textContent = 'No hay eventos disponibles';
            if ($info) $info.textContent = '—';
        }

        // ============================================================
        // MINI RANKING — primeros 6
        // ============================================================
        const $lista = document.getElementById('mini-ranking-lista');
        if ($lista) {
            $lista.innerHTML = '';
            const top6 = ranking.slice(0, 6);
            if (top6.length === 0) {
                $lista.innerHTML = '<li class="mini-ranking__item">Sin datos de ranking</li>';
            } else {
                top6.forEach((f, i) => {
                    const li = document.createElement('li');
                    li.className = 'mini-ranking__item' + (i === 0 ? ' mini-ranking__item--primero' : '');
                    li.innerHTML =
                        '<span class="mini-ranking__posicion">' + (i + 1) + '</span>' +
                        '<img class="mini-ranking__logo" src="' + logoDe(f.nombre) + '" alt="Logo ' + (f.nombre || '') + '">' +
                        '<span class="mini-ranking__nombre">' + (f.nombre || '—') + '</span>' +
                        '<span class="mini-ranking__puntos">' + (f.puntos !== undefined ? f.puntos : 0) + '</span>';
                    $lista.appendChild(li);
                });
            }
        }

        // ============================================================
        // TARJETAS DE EVENTOS — primeros 3 (orden por fecha ASC)
        // ============================================================
        const tarjetas = [
            { contenedor: 'tarjeta-evento-1' },
            { contenedor: 'tarjeta-evento-2' },
            { contenedor: 'tarjeta-evento-3' }
        ];
        const eventosOrdenados = (eventos || [])
            .map(e => ({ e, d: parseFecha(e.fecha) }))
            .filter(x => x.d)
            .sort((a, b) => a.d - b.d)
            .map(x => x.e);

        tarjetas.forEach((t, i) => {
            const $c = document.getElementById(t.contenedor);
            if (!$c) return;
            const ev = eventosOrdenados[i];
            if (!ev) { $c.innerHTML = ''; return; }
            const [eq1, eq2] = String(ev.enfrentamiento || '').split(' vs ');
            const estadoClase = ev.estado === 'en vivo' ? 'curso' : ev.estado === 'programado' ? 'programado' : 'proximo';
            const estadoTitulo = ({ 'proximo': 'Próximo', 'en vivo': 'En curso', 'programado': 'Programado' })[ev.estado] || ev.estado || '';
            $c.innerHTML =
                '<a href="cartelera.html?fecha=' + (ev.fecha || '') + '" class="tarjeta-evento">' +
                    '<header class="tarjeta-evento__cabecera">' +
                        '<span class="tarjeta-evento__deporte">' + (ev.deporte || '—') + '</span>' +
                        '<span class="tarjeta-evento__estado tarjeta-evento__estado--' + estadoClase + '" title="' + estadoTitulo + '"></span>' +
                    '</header>' +
                    '<div class="tarjeta-evento__cuerpo">' +
                        '<img class="tarjeta-evento__logo" src="' + logoDe(eq1) + '" alt="Logo ' + eq1 + '">' +
                        '<span class="tarjeta-evento__vs">VS</span>' +
                        '<img class="tarjeta-evento__logo" src="' + logoDe(eq2) + '" alt="Logo ' + eq2 + '">' +
                    '</div>' +
                    '<footer class="tarjeta-evento__pie">' +
                        '<span class="tarjeta-evento__fecha">📅 ' + fmtCorta(ev.fecha) + ' • ' + (ev.hora || '—') + '</span>' +
                    '</footer>' +
                '</a>';
        });
    }).catch((error) => {
        console.error('[index.controller] Error inesperado:', error);
    });
});
