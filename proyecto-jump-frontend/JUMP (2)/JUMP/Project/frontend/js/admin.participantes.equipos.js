// admin.participantes.equipos.js — CRUD de equipos (tab Participantes).
// Expone window.adminParticipantesEquipos con render(), crear(), editar(), borrar().

window.adminParticipantesEquipos = (function () {
    let state = { equipos: [], facultadActual: null, onRecargar: async () => {} };

    function init(opciones) {
        state.onRecargar = (opciones && opciones.onRecargar) || (async () => {});
        enlazar();
    }

    function actualizar(equipos, facultadActual) {
        state.equipos = equipos || [];
        state.facultadActual = facultadActual || null;
        render();
    }

    function enlazar() {
        const $btn = document.getElementById('btn-crear-equipo');
        if ($btn && !$btn.dataset.listener) {
            $btn.dataset.listener = '1';
            $btn.addEventListener('click', crear);
        }
    }

    function render() {
        const $tbody = document.getElementById('equipos-tbody');
        if (!$tbody) return;
        $tbody.innerHTML = '';
        const lista = state.facultadActual
            ? state.equipos.filter(e => e.facultad === state.facultadActual.nombre)
            : state.equipos;
        if (lista.length === 0) {
            $tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:1rem;">Sin equipos.</td></tr>';
            return;
        }
        lista.forEach((e, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${i + 1}</td>
                <td>${e.nombre}</td>
                <td>${e.deporte}</td>
                <td>${e.total_eventos || 0}</td>
                <td><button class="admin-btn admin-vista-btn" data-ver-eq="${e.id}" style="padding:0.25rem 0.6rem; font-size:0.85rem;">Integrantes</button></td>
                <td><button class="admin-btn-icono admin-btn-icono--editar" data-edit-eq="${e.id}" aria-label="Editar">
                    <svg class="admin-icono-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button></td>
                <td><button class="admin-btn-icono admin-btn-icono--eliminar" data-eq-id="${e.id}" data-eventos="${e.total_eventos || 0}" aria-label="Eliminar">
                    <svg class="admin-icono-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button></td>
            `;
            $tbody.appendChild(tr);
        });
        $tbody.querySelectorAll('[data-ver-eq]').forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.adminParticipantes) window.adminParticipantes.verIntegrantes(parseInt(btn.dataset.verEq));
            });
        });
        $tbody.querySelectorAll('[data-edit-eq]').forEach(btn => {
            btn.addEventListener('click', () => editar(parseInt(btn.dataset.editEq)));
        });
        $tbody.querySelectorAll('[data-eq-id]').forEach(btn => {
            btn.addEventListener('click', () => borrar(parseInt(btn.dataset.eqId), parseInt(btn.dataset.eventos)));
        });
    }

    async function crear() {
        if (!state.facultadActual) { window.adminToast.mostrar('Selecciona una facultad primero', 'error'); return; }
        const $nom = document.getElementById('equipo-nombre');
        const $dep = document.getElementById('equipo-deporte');
        if (!$nom || !$dep) return;
        window.adminValidacion.limpiarError($nom);
        const nombre = $nom.value.trim();
        if (nombre.length < 2) {
            window.adminValidacion.marcarError($nom, 'Mínimo 2 caracteres');
            return;
        }
        try {
            await window.apiClient.post('/equipos', {
                nombre,
                facultad_id: state.facultadActual.id,
                deporte_id: parseInt($dep.value)
            });
            window.adminToast.mostrar('Equipo registrado');
            $nom.value = '';
            $nom.dataset.autogenerado = 'true';
            await state.onRecargar();
        } catch (e) {
            if (e.status === 401) return;
            window.adminToast.mostrar('Error: ' + (e.data?.error || e.message), 'error');
        }
    }

    async function editar(id) {
        const eq = state.equipos.find(x => x.id === id);
        if (!eq) return;
        const data = await window.adminPrompt.mostrar({
            titulo: 'Editar equipo',
            campos: [{ name: 'nombre', label: 'Nombre', value: eq.nombre }],
            textoAceptar: 'Guardar'
        });
        if (!data) return;
        if (data.nombre.length < 2) { window.adminToast.mostrar('Nombre muy corto', 'error'); return; }
        try {
            await window.apiClient.put('/equipos/' + id, {
                nombre: data.nombre,
                facultad_id: eq.facultad_id,
                deporte_id: eq.deporte_id
            });
            window.adminToast.mostrar('Equipo actualizado');
            await state.onRecargar();
        } catch (e) {
            if (e.status === 401) return;
            window.adminToast.mostrar('Error: ' + (e.data?.error || e.message), 'error');
        }
    }

    async function borrar(id, eventos) {
        if (eventos > 0) {
            window.adminToast.mostrar(`No se puede borrar: ${eventos} eventos asociados`, 'error');
            return;
        }
        const ok = await window.adminConfirm.mostrar({
            titulo: 'Borrar equipo',
            mensaje: '¿Borrar este equipo?',
            textoAceptar: 'Borrar'
        });
        if (!ok) return;
        try {
            await window.apiClient.delete('/equipos/' + id);
            window.adminToast.mostrar('Equipo eliminado');
            await state.onRecargar();
        } catch (e) {
            if (e.status === 401) return;
            window.adminToast.mostrar('Error: ' + (e.data?.error || e.message), 'error');
        }
    }

    return { init, actualizar, render };
})();
