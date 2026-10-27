// admin.eventos.participantes.js — Tabla dinámica de participantes del evento.
// Se usa desde admin.eventos.js. Necesita acceso al state del orquestador
// (state.equipos) mediante el objeto que se pasa en init().

window.adminEventosParticipantes = (function () {
    let state = { equipos: [] };

    function init(ctx) {
        state = ctx || { equipos: [] };
        enlazar();
    }

    function actualizar(ctx) {
        if (!ctx) return;
        state.equipos = ctx.equipos || [];
    }

    function enlazar() {
        const $btnAgregar = document.getElementById('btn-agregar-participante');
        if ($btnAgregar && !$btnAgregar.dataset.listener) {
            $btnAgregar.dataset.listener = '1';
            $btnAgregar.addEventListener('click', () => agregarFila());
        }
    }

    function equiposDelDeporte(deporteId) {
        if (!deporteId) return [];
        return (state.equipos || []).filter(eq => eq.deporte_id === deporteId);
    }

    function agregarFila(equipoId) {
        const $tbody = document.getElementById('evento-participantes-tbody');
        if (!$tbody) return;
        const $dep = document.getElementById('evento-deporte');
        const deporteId = $dep ? parseInt($dep.value) : null;
        const equipos = equiposDelDeporte(deporteId);
        if (equipos.length === 0) return;

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

        tr.querySelector('[data-quitar]').addEventListener('click', () => tr.remove());
    }

    function actualizarOpciones() {
        const $tbody = document.getElementById('evento-participantes-tbody');
        if (!$tbody) return;
        const $dep = document.getElementById('evento-deporte');
        const deporteId = $dep ? parseInt($dep.value) : null;
        const equipos = equiposDelDeporte(deporteId);

        if (equipos.length === 0) {
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

    function leerIds() {
        const $tbody = document.getElementById('evento-participantes-tbody');
        if (!$tbody) return [];
        const ids = [];
        $tbody.querySelectorAll('[data-equipo-select]').forEach(sel => {
            const id = parseInt(sel.value);
            if (!isNaN(id)) ids.push(id);
        });
        return ids;
    }

    function limpiar() {
        const $tbody = document.getElementById('evento-participantes-tbody');
        if ($tbody) $tbody.innerHTML = '';
        const $fecha = document.getElementById('evento-fecha');
        const $hora = document.getElementById('evento-hora');
        const $lugar = document.getElementById('evento-lugar');
        if ($fecha) $fecha.value = '';
        if ($hora) $hora.value = '';
        if ($lugar) $lugar.value = '';
        agregarFila();
        agregarFila();
    }

    function poblarDeporte() {
        const $dep = document.getElementById('evento-deporte');
        if (!$dep) return;
        const valorActual = $dep.value;
        $dep.innerHTML = '';
        (state.deportes || []).forEach(d => {
            const opt = document.createElement('option');
            opt.value = d.id;
            opt.textContent = d.nombre;
            $dep.appendChild(opt);
        });
        if (valorActual) $dep.value = valorActual;
    }

    return {
        init,
        actualizar,
        enlazar,
        agregarFila,
        actualizarOpciones,
        leerIds,
        limpiar,
        poblarDeporte,
        equiposDelDeporte
    };
})();
