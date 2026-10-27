// admin.participantes.facultades.js — CRUD de facultades (tab Participantes).
// Expone window.adminParticipantesFacultades con render(), crear(), editar(), borrar().

window.adminParticipantesFacultades = (function () {
    let state = { facultades: [], onRecargar: async () => {} };

    function init(opciones) {
        state.onRecargar = (opciones && opciones.onRecargar) || (async () => {});
        enlazar();
    }

    function actualizar(facultades) {
        state.facultades = facultades || [];
        render();
    }

    function enlazar() {
        const $btn = document.getElementById('btn-crear-facultad');
        if ($btn && !$btn.dataset.listener) {
            $btn.dataset.listener = '1';
            $btn.addEventListener('click', crear);
        }
    }

    function render() {
        const $tbody = document.getElementById('facultades-tbody');
        if (!$tbody) return;
        $tbody.innerHTML = '';
        if (state.facultades.length === 0) {
            $tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:1rem;">Sin facultades.</td></tr>';
            return;
        }
        state.facultades.forEach((f, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${i + 1}</td>
                <td>${f.nombre}</td>
                <td>${f.total_equipos || 0}</td>
                <td><button class="admin-btn admin-vista-btn" data-ver-fac="${f.id}" style="padding:0.25rem 0.6rem; font-size:0.85rem;">Ver equipos</button></td>
                <td><button class="admin-btn-icono admin-btn-icono--editar" data-edit-fac="${f.id}" aria-label="Editar">
                    <svg class="admin-icono-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button></td>
                <td><button class="admin-btn-icono admin-btn-icono--eliminar" data-fac-id="${f.id}" data-total="${f.total_equipos || 0}" aria-label="Eliminar">
                    <svg class="admin-icono-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button></td>
            `;
            $tbody.appendChild(tr);
        });
        $tbody.querySelectorAll('[data-ver-fac]').forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.adminParticipantes) window.adminParticipantes.verEquiposDeFacultad(parseInt(btn.dataset.verFac));
            });
        });
        $tbody.querySelectorAll('[data-edit-fac]').forEach(btn => {
            btn.addEventListener('click', () => editar(parseInt(btn.dataset.editFac)));
        });
        $tbody.querySelectorAll('[data-fac-id]').forEach(btn => {
            btn.addEventListener('click', () => borrar(parseInt(btn.dataset.facId), parseInt(btn.dataset.total)));
        });
    }

    async function crear() {
        const $nom = document.getElementById('facultad-nombre');
        const $logo = document.getElementById('facultad-logo');
        if (!$nom) return;
        window.adminValidacion.limpiarError($nom);
        const nombre = $nom.value.trim();
        if (nombre.length < 2) {
            window.adminValidacion.marcarError($nom, 'Mínimo 2 caracteres');
            return;
        }
        try {
            await window.apiClient.post('/facultades', { nombre, logo_url: $logo ? $logo.value.trim() : null });
            window.adminToast.mostrar('Facultad registrada');
            $nom.value = '';
            if ($logo) $logo.value = '';
            await state.onRecargar();
        } catch (e) {
            if (e.status === 401) return;
            window.adminToast.mostrar('Error: ' + (e.data?.error || e.message), 'error');
        }
    }

    async function editar(id) {
        const f = state.facultades.find(x => x.id === id);
        if (!f) return;
        const data = await window.adminPrompt.mostrar({
            titulo: 'Editar facultad',
            campos: [
                { name: 'nombre', label: 'Nombre', value: f.nombre },
                { name: 'logo_url', label: 'URL del logo (opcional)', value: f.logo_url || '' }
            ],
            textoAceptar: 'Guardar'
        });
        if (!data) return;
        if (data.nombre.length < 2) { window.adminToast.mostrar('Nombre muy corto', 'error'); return; }
        try {
            await window.apiClient.put('/facultades/' + id, { nombre: data.nombre, logo_url: data.logo_url || null });
            window.adminToast.mostrar('Facultad actualizada');
            await state.onRecargar();
        } catch (e) {
            if (e.status === 401) return;
            window.adminToast.mostrar('Error: ' + (e.data?.error || e.message), 'error');
        }
    }

    async function borrar(id, total) {
        let cascade = false;
        if (total > 0) {
            const ok = await window.adminConfirm.mostrar({
                titulo: 'Borrar facultad',
                mensaje: `La facultad tiene ${total} equipos. ¿Borrar facultad Y equipos?`,
                textoAceptar: 'Borrar todo'
            });
            if (!ok) return;
            cascade = true;
        } else {
            const ok = await window.adminConfirm.mostrar({
                titulo: 'Borrar facultad',
                mensaje: '¿Borrar esta facultad?',
                textoAceptar: 'Borrar'
            });
            if (!ok) return;
        }
        try {
            await window.apiClient.delete('/facultades/' + id + (cascade ? '?cascade=true' : ''));
            window.adminToast.mostrar('Facultad eliminada');
            await state.onRecargar();
        } catch (e) {
            if (e.status === 401) return;
            window.adminToast.mostrar('Error: ' + (e.data?.error || e.message), 'error');
        }
    }

    return { init, actualizar, render };
})();
