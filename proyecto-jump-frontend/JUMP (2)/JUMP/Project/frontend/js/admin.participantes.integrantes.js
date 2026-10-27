// admin.participantes.integrantes.js — CRUD de integrantes (tab Participantes).
// Expone window.adminParticipantesIntegrantes con render(), crear(), editar(), borrar().

window.adminParticipantesIntegrantes = (function () {
    let state = { integrantes: [], equipoActual: null, onRecargar: async () => {} };

    function init(opciones) {
        state.onRecargar = (opciones && opciones.onRecargar) || (async () => {});
        enlazar();
    }

    function actualizar(integrantes, equipoActual) {
        state.integrantes = integrantes || [];
        state.equipoActual = equipoActual || null;
        render();
    }

    function enlazar() {
        const $btn = document.getElementById('btn-crear-integrante');
        if ($btn && !$btn.dataset.listener) {
            $btn.dataset.listener = '1';
            $btn.addEventListener('click', crear);
        }
    }

    function render() {
        const $tbody = document.getElementById('integrantes-tbody');
        if (!$tbody) return;
        const lista = state.equipoActual
            ? state.integrantes.filter(i => i.equipo_id === state.equipoActual.id)
            : [];
        $tbody.innerHTML = '';
        if (lista.length === 0) {
            $tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:1rem;">Sin integrantes.</td></tr>';
            return;
        }
        lista.forEach((i, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${idx + 1}</td>
                <td>${i.nombre}</td>
                <td>${i.ci}</td>
                <td>${i.matricula}</td>
                <td><button class="admin-btn-icono admin-btn-icono--editar" data-edit-int="${i.id}" aria-label="Editar">
                    <svg class="admin-icono-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button></td>
                <td><button class="admin-btn-icono admin-btn-icono--eliminar" data-int-id="${i.id}" aria-label="Eliminar">
                    <svg class="admin-icono-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button></td>
            `;
            $tbody.appendChild(tr);
        });
        $tbody.querySelectorAll('[data-edit-int]').forEach(btn => {
            btn.addEventListener('click', () => editar(parseInt(btn.dataset.editInt)));
        });
        $tbody.querySelectorAll('[data-int-id]').forEach(btn => {
            btn.addEventListener('click', () => borrar(parseInt(btn.dataset.intId)));
        });
    }

    async function crear() {
        if (!state.equipoActual) { window.adminToast.mostrar('Selecciona un equipo primero', 'error'); return; }
        const $nom = document.getElementById('integrante-nombre');
        const $ci = document.getElementById('integrante-ci');
        const $mat = document.getElementById('integrante-matricula');
        if (!$nom || !$ci || !$mat) return;
        [$nom, $ci, $mat].forEach(window.adminValidacion.limpiarError);
        let ok = true;
        if (!$nom.value.trim() || $nom.value.trim().length < 2) { window.adminValidacion.marcarError($nom, 'Nombre inválido'); ok = false; }
        if (!$ci.value.trim()) { window.adminValidacion.marcarError($ci, 'CI requerida'); ok = false; }
        if (!$mat.value.trim()) { window.adminValidacion.marcarError($mat, 'Matrícula requerida'); ok = false; }
        if (!ok) return;
        try {
            await window.apiClient.post('/integrantes', {
                nombre: $nom.value.trim(),
                ci: $ci.value.trim(),
                matricula: $mat.value.trim(),
                equipo_id: state.equipoActual.id
            });
            window.adminToast.mostrar('Integrante registrado');
            $nom.value = ''; $ci.value = ''; $mat.value = '';
            await state.onRecargar();
        } catch (e) {
            if (e.status === 401) return;
            window.adminToast.mostrar('Error: ' + (e.data?.error || e.message), 'error');
        }
    }

    async function editar(id) {
        const i = state.integrantes.find(x => x.id === id);
        if (!i) return;
        const data = await window.adminPrompt.mostrar({
            titulo: 'Editar integrante',
            campos: [
                { name: 'nombre', label: 'Nombre', value: i.nombre },
                { name: 'ci', label: 'CI', value: i.ci },
                { name: 'matricula', label: 'Matrícula', value: i.matricula }
            ],
            textoAceptar: 'Guardar'
        });
        if (!data) return;
        try {
            await window.apiClient.put('/integrantes/' + id, {
                nombre: data.nombre,
                ci: data.ci,
                matricula: data.matricula,
                equipo_id: i.equipo_id
            });
            window.adminToast.mostrar('Integrante actualizado');
            await state.onRecargar();
        } catch (e) {
            if (e.status === 401) return;
            window.adminToast.mostrar('Error: ' + (e.data?.error || e.message), 'error');
        }
    }

    async function borrar(id) {
        const ok = await window.adminConfirm.mostrar({
            titulo: 'Borrar integrante',
            mensaje: '¿Borrar este integrante?',
            textoAceptar: 'Borrar'
        });
        if (!ok) return;
        try {
            await window.apiClient.delete('/integrantes/' + id);
            window.adminToast.mostrar('Integrante eliminado');
            await state.onRecargar();
        } catch (e) {
            if (e.status === 401) return;
            window.adminToast.mostrar('Error: ' + (e.data?.error || e.message), 'error');
        }
    }

    return { init, actualizar, render };
})();
