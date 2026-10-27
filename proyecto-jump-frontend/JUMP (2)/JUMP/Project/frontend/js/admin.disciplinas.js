// admin.disciplinas.js — Controlador del tab Disciplinas (deportes).
// Usa admin.toast, admin.validacion.

window.adminDisciplinas = (function () {
    const state = { disciplinas: [] };

    function init(ctx) {
        enlazar();
        recargar();
    }

    function enlazar() {
        const $btn = document.getElementById('btn-crear-disciplina');
        if ($btn) $btn.addEventListener('click', crear);
        const $input = document.getElementById('disciplina-nombre');
        if ($input) {
            $input.addEventListener('input', () => window.adminValidacion.limpiarError($input));
            $input.addEventListener('keydown', (e) => { if (e.key === 'Enter') crear(); });
        }
    }

    async function recargar() {
        try {
            const deportes = await window.deportesApi.getDeportes();
            state.disciplinas = deportes || [];
            render(state.disciplinas);
        } catch (e) {
            if (e.status === 401) return;
            console.error('Error cargando disciplinas:', e);
        }
    }

    function render(deportes) {
        const $tbody = document.getElementById('disciplinas-tbody');
        if (!$tbody) return;
        $tbody.innerHTML = '';
        if (deportes.length === 0) {
            $tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:1rem;">Sin disciplinas registradas.</td></tr>';
            return;
        }
        deportes.forEach((d, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${i + 1}</td>
                <td>${d.nombre}</td>
                <td>${d.total_equipos || 0}</td>
                <td>
                    <button class="admin-btn-icono admin-btn-icono--editar" data-edit-id="${d.id}" aria-label="Editar">
                        <svg class="admin-icono-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="admin-btn-icono admin-btn-icono--eliminar" data-id="${d.id}" aria-label="Eliminar">
                        <svg class="admin-icono-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </td>
            `;
            $tbody.appendChild(tr);
        });
        $tbody.querySelectorAll('[data-edit-id]').forEach(btn => {
            btn.addEventListener('click', () => editar(parseInt(btn.dataset.editId)));
        });
        $tbody.querySelectorAll('.admin-btn-icono--eliminar').forEach(btn => {
            btn.addEventListener('click', () => borrar(parseInt(btn.dataset.id)));
        });
    }

    async function crear() {
        const $input = document.getElementById('disciplina-nombre');
        if (!$input) return;
        window.adminValidacion.limpiarError($input);
        const nombre = $input.value.trim();
        if (nombre.length < 2) {
            window.adminValidacion.marcarError($input, 'El nombre debe tener al menos 2 caracteres');
            return;
        }
        try {
            await window.apiClient.post('/deportes', { nombre });
            window.adminToast.mostrar('Disciplina creada correctamente');
            $input.value = '';
            await recargar();
        } catch (e) {
            if (e.status === 401) return;
            window.adminToast.mostrar('Error: ' + (e.data?.error || e.message), 'error');
        }
    }

    async function editar(id) {
        const d = state.disciplinas ? state.disciplinas.find(x => x.id === id) : null;
        const actual = d ? d.nombre : '';
        const data = await window.adminPrompt.mostrar({
            titulo: 'Editar disciplina',
            campos: [{ name: 'nombre', label: 'Nombre', value: actual }],
            textoAceptar: 'Guardar'
        });
        if (!data) return;
        if (data.nombre.length < 2) { window.adminToast.mostrar('Nombre muy corto', 'error'); return; }
        try {
            await window.apiClient.put('/deportes/' + id, { nombre: data.nombre });
            window.adminToast.mostrar('Disciplina actualizada');
            await recargar();
        } catch (e) {
            if (e.status === 401) return;
            window.adminToast.mostrar('Error: ' + (e.data?.error || e.message), 'error');
        }
    }

    async function borrar(id) {
        if (!confirm('¿Eliminar esta disciplina? No se puede si tiene equipos asociados.')) return;
        try {
            await window.apiClient.delete('/deportes/' + id);
            window.adminToast.mostrar('Disciplina eliminada');
            await recargar();
        } catch (e) {
            if (e.status === 401) return;
            window.adminToast.mostrar('Error: ' + (e.data?.error || e.message), 'error');
        }
    }

    return { init, recargar };
})();
