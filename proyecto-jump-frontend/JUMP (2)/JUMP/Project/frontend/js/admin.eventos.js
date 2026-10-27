// admin.eventos.js — Controlador del CRUD de eventos.
// Delega la tabla de participantes en admin.eventos.participantes.js.
// Delega el paginado en admin.paginado.js.

window.adminEventos = (function () {
    let state = null;
    let paginado = null;

    function init(ctx) {
        state = {
            eventos: ctx.eventos || [],
            deportes: ctx.deportes || [],
            equipos: ctx.equipos || [],
            onRecargar: ctx.onRecargar || (async () => {}),
            onLogin: ctx.onLogin || (() => {})
        };

        // Inicializar módulo de participantes
        window.adminEventosParticipantes.init({ equipos: state.equipos, deportes: state.deportes });

        window.adminEventosParticipantes.poblarDeporte();
        enlazarBotones();
        initPaginado();
        renderLista(state.eventos);
        window.adminEventosParticipantes.agregarFila();
        window.adminEventosParticipantes.agregarFila();
    }

    function actualizar(ctx) {
        if (!state) return;
        state.eventos = ctx.eventos || [];
        state.deportes = ctx.deportes || [];
        state.equipos = ctx.equipos || [];
        window.adminEventosParticipantes.actualizar({ equipos: state.equipos, deportes: state.deportes });
        window.adminEventosParticipantes.poblarDeporte();
        renderLista(state.eventos);

        const $tbody = document.getElementById('evento-participantes-tbody');
        if ($tbody && $tbody.children.length === 0 && state.equipos && state.equipos.length > 0) {
            window.adminEventosParticipantes.agregarFila();
            window.adminEventosParticipantes.agregarFila();
        }
    }

    function initPaginado() {
        if (paginado) return;
        paginado = window.adminPaginado.crear({
            contenedorId: 'eventos-paginado',
            tamanoInicial: 10,
            onRender: (items) => pintarItems(items)
        });
        paginado.init();
    }

    function renderLista(eventos) {
        if (!paginado) initPaginado();
        paginado.setItems(eventos);
        paginado.reset();
        paginado.render();
    }

    function pintarItems(items) {
        const $lista = document.getElementById('eventos-lista');
        if (!$lista) return;
        $lista.innerHTML = '';
        if (items.length === 0) {
            $lista.innerHTML = '<p style="padding:1rem;">No hay eventos registrados.</p>';
            return;
        }
        items.forEach(ev => {
            const participantes = ev.participantes || [];
            const equiposTxt = participantes.map(p => `${p.facultad} (${p.puntos || 0}pts)`).join(' vs ');
            const art = document.createElement('article');
            art.className = 'admin-item';
            const btnIniciar = ev.estado === 'pendiente'
                ? `<button class="admin-btn admin-btn--primario admin-btn--sm" data-id="${ev.id}" data-iniciar>Iniciar</button>`
                : '';
            art.innerHTML = `
                <div class="admin-item__info">
                    <div class="admin-item__encabezado">
                        <span class="admin-item__deporte">${ev.deporte || ''}</span>
                        <span class="admin-item__estado admin-item__estado--${ev.estado === 'en curso' ? 'curso' : ev.estado === 'finalizado' ? 'programado' : 'pendiente'}">${ev.estado || ''}</span>
                    </div>
                    <h3 class="admin-item__equipos">${equiposTxt || '—'}</h3>
                    <p class="admin-item__detalles">${ev.fecha || ''} • ${ev.hora || ''} • ${ev.lugar || ''}</p>
                </div>
                <div class="admin-item__acciones">
                    ${btnIniciar}
                    <button class="admin-btn-icono admin-btn-icono--editar" data-id="${ev.id}" aria-label="Editar">
                        <svg class="admin-icono-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="admin-btn-icono admin-btn-icono--eliminar" data-id="${ev.id}" aria-label="Eliminar">
                        <svg class="admin-icono-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            `;
            $lista.appendChild(art);
        });

        $lista.querySelectorAll('.admin-btn-icono--eliminar').forEach(btn => {
            btn.addEventListener('click', () => borrar(parseInt(btn.dataset.id)));
        });
        $lista.querySelectorAll('.admin-btn-icono--editar').forEach(btn => {
            btn.addEventListener('click', () => editar(parseInt(btn.dataset.id)));
        });
        $lista.querySelectorAll('[data-iniciar]').forEach(btn => {
            btn.addEventListener('click', () => iniciar(parseInt(btn.dataset.id)));
        });
    }

    function enlazarBotones() {
        const $dep = document.getElementById('evento-deporte');
        const $fecha = document.getElementById('evento-fecha');
        const $hora = document.getElementById('evento-hora');
        const $lugar = document.getElementById('evento-lugar');
        [$dep, $fecha, $hora, $lugar].forEach(window.adminValidacion.enlazarLimpiar);

        if ($dep && !$dep.dataset.listenerChange) {
            $dep.dataset.listenerChange = '1';
            $dep.addEventListener('change', () => {
                const $tbody = document.getElementById('evento-participantes-tbody');
                if (!$tbody) return;
                if ($tbody.children.length === 0) {
                    window.adminEventosParticipantes.agregarFila();
                    window.adminEventosParticipantes.agregarFila();
                } else {
                    window.adminEventosParticipantes.actualizarOpciones();
                }
            });
        }

        const $btn = document.getElementById('btn-crear-evento');
        if ($btn && !$btn.dataset.listener) {
            $btn.dataset.listener = '1';
            $btn.addEventListener('click', crear);
        }
    }

    function validar() {
        const $dep = document.getElementById('evento-deporte');
        const $fecha = document.getElementById('evento-fecha');
        const $hora = document.getElementById('evento-hora');
        const $lugar = document.getElementById('evento-lugar');
        [$dep, $fecha, $hora, $lugar].forEach(window.adminValidacion.limpiarError);

        let ok = true;
        if (!$dep || !$dep.value) { window.adminValidacion.marcarError($dep, 'Selecciona un deporte'); ok = false; }
        if (!$fecha || !$fecha.value) { window.adminValidacion.marcarError($fecha, 'Ingresa la fecha'); ok = false; }
        if (!$hora || !$hora.value) { window.adminValidacion.marcarError($hora, 'Ingresa la hora'); ok = false; }
        if (!$lugar || $lugar.value.trim().length < 3) { window.adminValidacion.marcarError($lugar, 'El lugar debe tener al menos 3 caracteres'); ok = false; }

        const ids = window.adminEventosParticipantes.leerIds();
        if (ids.length < 2) {
            window.adminToast.mostrar('Se requieren al menos 2 equipos', 'error');
            ok = false;
        }
        const setIds = new Set(ids);
        if (setIds.size !== ids.length) {
            window.adminToast.mostrar('No se puede repetir el mismo equipo', 'error');
            ok = false;
        }
        return ok;
    }

    async function crear() {
        if (!validar()) return;
        const ids = window.adminEventosParticipantes.leerIds();
        const payload = {
            deporte_id: parseInt(document.getElementById('evento-deporte').value),
            fecha: document.getElementById('evento-fecha').value,
            hora: document.getElementById('evento-hora').value,
            lugar: document.getElementById('evento-lugar').value.trim(),
            estado: 'pendiente',
            participantes: ids.map(id => ({ equipo_id: id }))
        };
        try {
            await window.apiClient.post('/eventos', payload);
            window.adminToast.mostrar('Evento creado correctamente');
            window.adminEventosParticipantes.limpiar();
            await state.onRecargar();
        } catch (e) {
            if (e.status === 401) { state.onLogin(); return; }
            window.adminToast.mostrar('Error al crear evento: ' + (e.data?.error || e.message), 'error');
        }
    }

    async function editar(id) {
        const ev = state.eventos.find(e => e.id === id);
        if (!ev) return;
        const data = await window.adminPrompt.mostrar({
            titulo: 'Editar evento',
            campos: [
                { name: 'fecha', label: 'Fecha (YYYY-MM-DD)', value: ev.fecha || '', type: 'date' },
                { name: 'hora', label: 'Hora (HH:MM)', value: ev.hora || '', type: 'time' },
                { name: 'lugar', label: 'Lugar', value: ev.lugar || '', type: 'text' }
            ],
            textoAceptar: 'Guardar'
        });
        if (!data) return;
        if (!data.fecha || !data.hora || !data.lugar || data.lugar.length < 3) {
            window.adminToast.mostrar('Completa fecha, hora y lugar (mínimo 3 caracteres)', 'error');
            return;
        }
        try {
            const participantes = (ev.participantes || []).map(p => ({ equipo_id: p.equipo_id }));
            await window.apiClient.put('/eventos/' + id, {
                deporte_id: ev.deporte_id || null,
                fecha: data.fecha,
                hora: data.hora,
                lugar: data.lugar,
                estado: ev.estado || 'pendiente',
                participantes
            });
            window.adminToast.mostrar('Evento actualizado correctamente');
            await state.onRecargar();
        } catch (e) {
            if (e.status === 401) { state.onLogin(); return; }
            window.adminToast.mostrar('Error al editar: ' + (e.data?.error || e.message), 'error');
        }
    }

    async function borrar(id) {
        const okBorrar = await window.adminConfirm.mostrar({
            titulo: 'Eliminar evento',
            mensaje: '¿Eliminar este evento? Esta acción no se puede deshacer.',
            textoAceptar: 'Eliminar'
        });
        if (!okBorrar) return;
        try {
            await window.apiClient.delete('/eventos/' + id);
            window.adminToast.mostrar('Evento eliminado correctamente');
            await state.onRecargar();
        } catch (e) {
            if (e.status === 401) { state.onLogin(); return; }
            window.adminToast.mostrar('Error al borrar: ' + (e.data?.error || e.message), 'error');
        }
    }

    async function iniciar(id) {
        const ev = state.eventos.find(e => e.id === id);
        if (!ev) return;
        const okIniciar = await window.adminConfirm.mostrar({
            titulo: 'Iniciar evento',
            mensaje: '¿Iniciar el evento? Pasará a "en curso". Si la fecha/hora es distinta a la actual, se actualizará.',
            textoAceptar: 'Iniciar'
        });
        if (!okIniciar) return;
        try {
            const ahora = new Date();
            const yy = ahora.getFullYear();
            const mm = String(ahora.getMonth() + 1).padStart(2, '0');
            const dd = String(ahora.getDate()).padStart(2, '0');
            const hh = String(ahora.getHours()).padStart(2, '0');
            const mi = String(ahora.getMinutes()).padStart(2, '0');
            const fechaHoy = yy + '-' + mm + '-' + dd;
            const horaAhora = hh + ':' + mi;

            let fechaFinal = ev.fecha;
            let horaFinal = ev.hora;
            let fechaActualizada = false;
            if (ev.fecha !== fechaHoy) {
                fechaFinal = fechaHoy;
                horaFinal = horaAhora;
                fechaActualizada = true;
            }

            const participantes = (ev.participantes || []).map(p => ({ equipo_id: p.equipo_id }));
            await window.apiClient.put('/eventos/' + id, {
                deporte_id: ev.deporte_id || null,
                fecha: fechaFinal,
                hora: horaFinal,
                lugar: ev.lugar,
                estado: 'en curso',
                participantes
            });
            if (fechaActualizada) {
                window.adminToast.mostrar('Evento iniciado. Fecha/hora actualizadas a hoy (' + fechaHoy + ' ' + horaAhora + ')');
            } else {
                window.adminToast.mostrar('Evento iniciado');
            }
            await state.onRecargar();
        } catch (e) {
            if (e.status === 401) { state.onLogin(); return; }
            window.adminToast.mostrar('Error al iniciar: ' + (e.data?.error || e.message), 'error');
        }
    }

    function obtenerEventos() {
        return state ? state.eventos : [];
    }

    return { init, actualizar, obtenerEventos };
})();
