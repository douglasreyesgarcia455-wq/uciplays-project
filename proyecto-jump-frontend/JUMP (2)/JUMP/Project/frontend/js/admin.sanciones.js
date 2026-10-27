// admin.sanciones.js — CRUD de sanciones.

window.adminSanciones = (function () {
    let state = { sanciones: [], equipos: [] };

    function init() {
        enlazar();
        recargar();
    }

    function enlazar() {
        const $btn = document.getElementById('btn-crear-sancion');
        if ($btn) $btn.addEventListener('click', crear);
    }

    async function recargar() {
        try {
            const [sanciones, equipos] = await Promise.all([
                window.sancionesApi.getSanciones(),
                window.equiposApi.getEquipos()
            ]);
            state.sanciones = sanciones || [];
            state.equipos = equipos || [];
            poblarSelectEquipo();
            render();
        } catch (e) {
            if (e.status === 401) return;
            console.error('Error cargando sanciones:', e);
        }
    }

    function poblarSelectEquipo() {
        const $sel = document.getElementById('sancion-equipo');
        if (!$sel) return;
        const v = $sel.value;
        $sel.innerHTML = '';
        state.equipos.forEach(eq => {
            const opt = document.createElement('option');
            opt.value = eq.id;
            opt.textContent = eq.facultad + ' ' + eq.nombre + ' (' + eq.deporte + ')';
            $sel.appendChild(opt);
        });
        if (v) $sel.value = v;
    }

    function render() {
        const $tbody = document.getElementById('sanciones-tbody');
        if (!$tbody) return;
        $tbody.innerHTML = '';
        if (state.sanciones.length === 0) {
            $tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:1rem;">Sin sanciones.</td></tr>';
            return;
        }
        state.sanciones.forEach((s, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${i + 1}</td>
                <td>${s.equipo_nombre}</td>
                <td>${s.facultad_nombre}</td>
                <td>${s.deporte}</td>
                <td><strong>${s.puntos_descontados}</strong></td>
                <td>${s.motivo || ''}</td>
                <td>${s.observaciones || ''}</td>
                <td>${(s.fecha || '').slice(0, 10)}</td>
                <td><button class="admin-btn-icono admin-btn-icono--eliminar" data-id="${s.id}" aria-label="Eliminar">
                    <svg class="admin-icono-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button></td>
            `;
            $tbody.appendChild(tr);
        });
        $tbody.querySelectorAll('[data-id]').forEach(btn => {
            btn.addEventListener('click', () => borrar(parseInt(btn.dataset.id)));
        });
    }

    async function crear() {
        const $eq = document.getElementById('sancion-equipo');
        const $p = document.getElementById('sancion-puntos');
        const $m = document.getElementById('sancion-motivo');
        const $o = document.getElementById('sancion-observaciones');
        [$p, $m].forEach(window.adminValidacion.limpiarError);
        let ok = true;
        const puntos = parseInt($p.value);
        if (!puntos || puntos >= 0) { window.adminValidacion.marcarError($p, 'Debe ser un número negativo'); ok = false; }
        if (!$m.value.trim()) { window.adminValidacion.marcarError($m, 'Motivo requerido'); ok = false; }
        if (!ok) return;
        try {
            await window.apiClient.post('/sanciones', {
                equipo_id: parseInt($eq.value),
                puntos_descontados: puntos,
                motivo: $m.value.trim(),
                observaciones: $o.value.trim()
            });
            window.adminToast.mostrar('Sanción aplicada');
            $p.value = ''; $m.value = ''; $o.value = '';
            await recargar();
        } catch (e) {
            if (e.status === 401) return;
            window.adminToast.mostrar('Error: ' + (e.data?.error || e.message), 'error');
        }
    }

    async function borrar(id) {
        if (!confirm('¿Eliminar esta sanción?')) return;
        try {
            await window.apiClient.delete('/sanciones/' + id);
            window.adminToast.mostrar('Sanción eliminada');
            await recargar();
        } catch (e) {
            if (e.status === 401) return;
            window.adminToast.mostrar('Error: ' + (e.data?.error || e.message), 'error');
        }
    }

    return { init, recargar };
})();
