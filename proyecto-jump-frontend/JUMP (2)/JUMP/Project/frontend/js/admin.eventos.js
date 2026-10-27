// admin.eventos.js — Controlador del CRUD de eventos.
// Usa admin.paginado, admin.validacion, admin.toast (Invención Pura).
// Usa eventos.api, deportes.api, equipos.api (Facade).

window.adminEventos = (function () {
    let state = null;
    let paginado = null;
    let participantesTmp = [];  // [{equipo_id}]

    function init(ctx) {
        state = {
            eventos: ctx.eventos || [],
            deportes: ctx.deportes || [],
            equipos: ctx.equipos || [],
            onRecargar: ctx.onRecargar || (async () => {}),
            onLogin: ctx.onLogin || (() => {})
        };

        poblarSelectDeporte();
        enlazarBotones();
        initPaginado();
        renderLista(state.eventos);
        // Las filas se agregan cuando actualizar() recibe equipos
        if (state.equipos && state.equipos.length > 0) {
            agregarFilaParticipante();
            agregarFilaParticipante();
        }
    }

    function actualizar(ctx) {
        if (!state) return;
        state.eventos = ctx.eventos || [];
        state.deportes = ctx.deportes || [];
        state.equipos = ctx.equipos || [];
        poblarSelectDeporte();
        renderLista(state.eventos);
        const $tbody = document.getElementById('evento-participantes-tbody');
        if ($tbody && $tbody.children.length === 0 && state.equipos && state.equipos.length > 0) {
            agregarFilaParticipante();
            agregarFilaParticipante();
        }
    }

    // ============================================================
    // SELECT DE DEPORTE
    // ============================================================
    function poblarSelectDeporte() {
        const $dep = document.getElementById('evento-deporte');
        if (!$dep) return;
        const valorActual = $dep.value;
        $dep.innerHTML = '';
        state.deportes.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d.id;
            opt.textContent = d.nombre;
            $dep.appendChild(opt);
        });
        if (valorActual) $dep.value = valorActual;
        $dep.addEventListener('change', () => {
            actualizarOpcionesEquipos();
        });
    }

    function equiposDelDeporte(deporteId) {
        if (!deporteId) return [];
        return state.equipos.filter(eq => eq.deporte_id === deporteId);
    }

    // ============================================================
    // TABLA DINÁMICA DE PARTICIPANTES
    // ============================================================
    function agregarFilaParticipante(equipoId) {
        const $tbody = document.getElementById('evento-participantes-tbody');
        if (!$tbody) return;
        const $dep = document.getElementById('evento-deporte');
        const deporteId = $dep ? parseInt($dep.value) : null;
        const equipos = equiposDelDeporte(deporteId);
        if (equipos.length === 0) {
            // Aún no se cargaron los equipos o no hay equipos del deporte. No hacer nada.
            return;
        }

        const tr = document.createElement('tr');
        const opts = equipos.map(eq =>
            `<option value="${eq.id}" ${String(eq.id) === String(equipoId) ? 'selected' : ''}>${eq.facultad} ${eq.nombre}</option>`
        ).join('');

        tr.innerHTML = `
            <td>
                <select class="admin-form__input" data-equipo-select>
                    ${opts}
                </select>
            </td>
            <td>
                <button type="button" class="admin-btn-icono admin-btn-icono--eliminar" data-quitar aria-label="Quitar">
                    <svg class="admin-icono-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </td>
        `;
        $tbody.appendChild(tr);

        tr.querySelector('[data-quitar]').addEventListener('click', () => {
            tr.remove();
        });
    }

    function actualizarOpcionesEquipos() {
        const $tbody = document.getElementById('evento-participantes-tbody');
        if (!$tbody) return;
        const $dep = document.getElementById('evento-deporte');
        const deporteId = $dep ? parseInt($dep.value) : null;
        const equipos = equiposDelDeporte(deporteId);

        if (equipos.length === 0) {
            // No hay equipos para este deporte. Vaciar tbody.
            $tbody.innerHTML = '';
            return;
        }

        $tbody.querySelectorAll('tr').forEach(tr => {
            const sel = tr.querySelector('[data-equipo-select]');
            if (!sel) return;
            const valorActual = sel.value;
            sel.innerHTML = equipos.map(eq =>
                `<option value="${eq.id}" ${String(eq.id) === String(valorActual) ? 'selected' : ''}>${eq.facultad} ${eq.nombre}</option>`
            ).join('');
        });
    }

    function leerParticipantesFormulario() {
        const $tbody = document.getElementById('evento-participantes-tbody');
        if (!$tbody) return [];
        const ids = [];
        $tbody.querySelectorAll('[data-equipo-select]').forEach(sel => {
            const id = parseInt(sel.value);
            if (!isNaN(id)) ids.push(id);
        });
        return ids;
    }

    function limpiarFormulario() {
        const $tbody = document.getElementById('evento-participantes-tbody');
        if ($tbody) $tbody.innerHTML = '';
        document.getElementById('evento-fecha').value = '';
        document.getElementById('evento-hora').value = '';
        document.getElementById('evento-lugar').value = '';
        agregarFilaParticipante();
        agregarFilaParticipante();
    }

    // ============================================================
    // PAGINADO Y LISTA
    // ============================================================
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

    // ============================================================
    // BOTONES
    // ============================================================
    function enlazarBotones() {
        const $dep = document.getElementById('evento-deporte');
        const $fecha = document.getElementById('evento-fecha');
        const $hora = document.getElementById('evento-hora');
        const $lugar = document.getElementById('evento-lugar');
        [$dep, $fecha, $hora, $lugar].forEach(window.adminValidacion.enlazarLimpiar);

        // Al cambiar el deporte, repoblar selects y agregar 2 filas si el tbody está vacío
        if ($dep) {
            $dep.addEventListener('change', () => {
                const $tbody = document.getElementById('evento-participantes-tbody');
                if (!$tbody) return;
                if ($tbody.children.length === 0) {
                    agregarFilaParticipante();
                    agregarFilaParticipante();
                } else {
                    actualizarOpcionesEquipos();
                }
            });
        }

        const $btnAgregar = document.getElementById('btn-agregar-participante');
        if ($btnAgregar) {
            $btnAgregar.addEventListener('click', () => agregarFilaParticipante());
        }

        const $btn = document.getElementById('btn-crear-evento');
        if ($btn) $btn.addEventListener('click', crear);
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

        const ids = leerParticipantesFormulario();
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
        const ids = leerParticipantesFormulario();
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
            limpiarFormulario();
            await state.onRecargar();
        } catch (e) {
            if (e.status === 401) { state.onLogin(); return; }
            window.adminToast.mostrar('Error al crear evento: ' + (e.data?.error || e.message), 'error');
        }
    }

    async function editar(id) {
        const ev = state.eventos.find(e => e.id === id);
        if (!ev) return;
        const nuevaFecha = prompt('Nueva fecha (YYYY-MM-DD):', ev.fecha || '');
        if (nuevaFecha === null) return;
        const nuevaHora = prompt('Nueva hora (HH:MM):', ev.hora || '');
        if (nuevaHora === null) return;
        const nuevoLugar = prompt('Nuevo lugar:', ev.lugar || '');
        if (nuevoLugar === null) return;
        try {
            const participantes = (ev.participantes || []).map(p => ({ equipo_id: p.equipo_id }));
            await window.apiClient.put('/eventos/' + id, {
                deporte_id: ev.deporte_id || null,
                fecha: nuevaFecha,
                hora: nuevaHora,
                lugar: nuevoLugar,
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
            // Calcular fecha/hora actual del sistema
            const ahora = new Date();
            const yy = ahora.getFullYear();
            const mm = String(ahora.getMonth() + 1).padStart(2, '0');
            const dd = String(ahora.getDate()).padStart(2, '0');
            const hh = String(ahora.getHours()).padStart(2, '0');
            const mi = String(ahora.getMinutes()).padStart(2, '0');
            const fechaHoy = yy + '-' + mm + '-' + dd;
            const horaAhora = hh + ':' + mi;

            // Determinar si hay que actualizar
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
