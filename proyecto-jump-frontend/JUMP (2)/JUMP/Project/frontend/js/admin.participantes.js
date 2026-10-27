// admin.participantes.js — Controlador del tab Participantes.
// 2 botones: Facultades / Equipos. Vista Integrantes se abre desde Equipos.

window.adminParticipantes = (function () {
    let state = {
        facultades: [], equipos: [], deportes: [], integrantes: [],
        vista: 'facultades',
        equipoActual: null
    };

    function init() {
        enlazar();
        recargar();
    }

    function enlazar() {
        // Botones de vista
        const $btnFac = document.getElementById('btn-vista-facultades');
        const $btnEq = document.getElementById('btn-vista-equipos');
        if ($btnFac) $btnFac.addEventListener('click', () => cambiarVista('facultades'));
        if ($btnEq) $btnEq.addEventListener('click', () => cambiarVista('equipos'));

        // Botón volver de integrantes
        const $volver = document.getElementById('btn-volver-equipos');
        if ($volver) $volver.addEventListener('click', () => cambiarVista('equipos'));

        // Crear facultad
        const $btnCrearFac = document.getElementById('btn-crear-facultad');
        if ($btnCrearFac) $btnCrearFac.addEventListener('click', crearFacultad);

        // Crear equipo
        const $btnCrearEq = document.getElementById('btn-crear-equipo');
        if ($btnCrearEq) $btnCrearEq.addEventListener('click', crearEquipo);

        // Crear integrante
        const $btnCrearInt = document.getElementById('btn-crear-integrante');
        if ($btnCrearInt) $btnCrearInt.addEventListener('click', crearIntegrante);

        // Filtro de facultad en vista equipos
        const $filtro = document.getElementById('filtro-facultad-equipos');
        if ($filtro) $filtro.addEventListener('change', renderEquipos);

        // Autogenerar nombre de equipo
        const $dep = document.getElementById('equipo-deporte');
        const $fac = document.getElementById('equipo-facultad');
        const autogenerar = () => {
            const $nom = document.getElementById('equipo-nombre');
            if (!$nom || !$dep || !$fac) return;
            const facTxt = $fac.options[$fac.selectedIndex]?.textContent || '';
            const depTxt = $dep.options[$dep.selectedIndex]?.textContent || '';
            if (facTxt && depTxt && (!$nom.value || $nom.dataset.autogenerado === 'true')) {
                $nom.value = facTxt + ' ' + depTxt;
                $nom.dataset.autogenerado = 'true';
            }
        };
        if ($dep) $dep.addEventListener('change', autogenerar);
        if ($fac) $fac.addEventListener('change', autogenerar);
        const $nom = document.getElementById('equipo-nombre');
        if ($nom) $nom.addEventListener('input', () => { $nom.dataset.autogenerado = 'false'; });
    }

    function cambiarVista(vista) {
        state.vista = vista;
        const $fac = document.getElementById('vista-facultades');
        const $eq = document.getElementById('vista-equipos');
        const $int = document.getElementById('vista-integrantes');
        const $btnFac = document.getElementById('btn-vista-facultades');
        const $btnEq = document.getElementById('btn-vista-equipos');
        if ($fac) $fac.style.display = vista === 'facultades' ? 'block' : 'none';
        if ($eq) $eq.style.display = vista === 'equipos' ? 'block' : 'none';
        if ($int) $int.style.display = vista === 'integrantes' ? 'block' : 'none';
        if ($btnFac) $btnFac.classList.toggle('activo', vista === 'facultades');
        if ($btnEq) $btnEq.classList.toggle('activo', vista === 'equipos' || vista === 'integrantes');
    }

    async function recargar() {
        try {
            const [facultades, equipos, deportes, integrantes] = await Promise.all([
                window.apiClient.get('/facultades'),
                window.equiposApi.getEquipos(),
                window.deportesApi.getDeportes(),
                window.apiClient.get('/integrantes')
            ]);
            state.facultades = facultades || [];
            state.equipos = equipos || [];
            state.deportes = deportes || [];
            state.integrantes = integrantes || [];
            renderFacultades();
            renderEquipos();
            renderIntegrantes();
            poblarSelects();
        } catch (e) {
            if (e.status === 401) return;
            console.error('Error cargando participantes:', e);
        }
    }

    function renderFacultades() {
        const $tbody = document.getElementById('facultades-tbody');
        if (!$tbody) return;
        $tbody.innerHTML = '';
        if (state.facultades.length === 0) {
            $tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:1rem;">Sin facultades.</td></tr>';
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
            btn.addEventListener('click', () => verEquiposDeFacultad(parseInt(btn.dataset.verFac)));
        });
        $tbody.querySelectorAll('[data-edit-fac]').forEach(btn => {
            btn.addEventListener('click', () => editarFacultad(parseInt(btn.dataset.editFac)));
        });
        $tbody.querySelectorAll('[data-fac-id]').forEach(btn => {
            btn.addEventListener('click', () => borrarFacultad(parseInt(btn.dataset.facId), parseInt(btn.dataset.total)));
        });
    }

    function renderEquipos() {
        const $tbody = document.getElementById('equipos-tbody');
        if (!$tbody) return;
        const $filtro = document.getElementById('filtro-facultad-equipos');
        const filtro = $filtro ? $filtro.value : '';
        let lista = state.equipos;
        if (filtro) lista = lista.filter(e => e.facultad === filtro);
        $tbody.innerHTML = '';
        if (lista.length === 0) {
            $tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:1rem;">Sin equipos.</td></tr>';
            return;
        }
        lista.forEach((e, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${i + 1}</td>
                <td>${e.nombre}</td>
                <td>${e.facultad}</td>
                <td>${e.deporte}</td>
                <td>${e.total_eventos || 0}</td>
                <td><button class="admin-btn admin-vista-btn" data-ver-eq="${e.id}" style="padding:0.25rem 0.6rem; font-size:0.85rem;" title="Ver integrantes">Integrantes</button></td>
                <td><button class="admin-btn-icono admin-btn-icono--eliminar" data-eq-id="${e.id}" data-eventos="${e.total_eventos || 0}" aria-label="Eliminar">
                    <svg class="admin-icono-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button></td>
            `;
            $tbody.appendChild(tr);
        });
        $tbody.querySelectorAll('[data-ver-eq]').forEach(btn => {
            btn.addEventListener('click', () => verIntegrantes(parseInt(btn.dataset.verEq)));
        });
        $tbody.querySelectorAll('[data-edit-eq]').forEach(btn => {
            btn.addEventListener('click', () => editarEquipo(parseInt(btn.dataset.editEq)));
        });
        $tbody.querySelectorAll('[data-eq-id]').forEach(btn => {
            btn.addEventListener('click', () => borrarEquipo(parseInt(btn.dataset.eqId), parseInt(btn.dataset.eventos)));
        });
    }

    function verIntegrantes(equipoId) {
        state.equipoActual = state.equipos.find(e => e.id === equipoId) || null;
        const $titulo = document.getElementById('integrantes-equipo-titulo');
        if ($titulo) $titulo.textContent = 'Integrantes de ' + (state.equipoActual?.nombre || '');
        renderIntegrantes();
        cambiarVista('integrantes');
    }

    function renderIntegrantes() {
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
            btn.addEventListener('click', () => editarIntegrante(parseInt(btn.dataset.editInt)));
        });
        $tbody.querySelectorAll('[data-int-id]').forEach(btn => {
            btn.addEventListener('click', () => borrarIntegrante(parseInt(btn.dataset.intId)));
        });
    }

    function poblarSelects() {
        const $filtro = document.getElementById('filtro-facultad-equipos');
        if ($filtro) {
            const v = $filtro.value;
            $filtro.innerHTML = '<option value="">Todas las facultades</option>';
            state.facultades.forEach(f => {
                const opt = document.createElement('option');
                opt.value = f.nombre;
                opt.textContent = f.nombre;
                $filtro.appendChild(opt);
            });
            if (v) $filtro.value = v;
        }
        const $fac = document.getElementById('equipo-facultad');
        if ($fac) {
            const v = $fac.value;
            $fac.innerHTML = '';
            state.facultades.forEach(f => {
                const opt = document.createElement('option');
                opt.value = f.id;
                opt.textContent = f.nombre;
                $fac.appendChild(opt);
            });
            if (v) $fac.value = v;
        }
        const $dep = document.getElementById('equipo-deporte');
        if ($dep) {
            const v = $dep.value;
            $dep.innerHTML = '';
            state.deportes.forEach(d => {
                const opt = document.createElement('option');
                opt.value = d.id;
                opt.textContent = d.nombre;
                $dep.appendChild(opt);
            });
            if (v) $dep.value = v;
        }
    }

    async function crearFacultad() {
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
            await recargar();
        } catch (e) {
            if (e.status === 401) return;
            window.adminToast.mostrar('Error: ' + (e.data?.error || e.message), 'error');
        }
    }

    async function editarFacultad(id) {
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
            await recargar();
        } catch (e) {
            if (e.status === 401) return;
            window.adminToast.mostrar('Error: ' + (e.data?.error || e.message), 'error');
        }
    }

    async function editarEquipo(id) {
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
            await recargar();
        } catch (e) {
            if (e.status === 401) return;
            window.adminToast.mostrar('Error: ' + (e.data?.error || e.message), 'error');
        }
    }

    async function editarIntegrante(id) {
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
            await recargar();
        } catch (e) {
            if (e.status === 401) return;
            window.adminToast.mostrar('Error: ' + (e.data?.error || e.message), 'error');
        }
    }

    async function borrarFacultad(id, total) {
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
            await recargar();
        } catch (e) {
            if (e.status === 401) return;
            window.adminToast.mostrar('Error: ' + (e.data?.error || e.message), 'error');
        }
    }

    async function crearEquipo() {
        const $nom = document.getElementById('equipo-nombre');
        const $fac = document.getElementById('equipo-facultad');
        const $dep = document.getElementById('equipo-deporte');
        if (!$nom || !$fac || !$dep) return;
        window.adminValidacion.limpiarError($nom);
        const nombre = $nom.value.trim();
        if (nombre.length < 2) {
            window.adminValidacion.marcarError($nom, 'Mínimo 2 caracteres');
            return;
        }
        try {
            await window.apiClient.post('/equipos', {
                nombre,
                facultad_id: parseInt($fac.value),
                deporte_id: parseInt($dep.value)
            });
            window.adminToast.mostrar('Equipo registrado');
            $nom.value = '';
            $nom.dataset.autogenerado = 'true';
            await recargar();
        } catch (e) {
            if (e.status === 401) return;
            window.adminToast.mostrar('Error: ' + (e.data?.error || e.message), 'error');
        }
    }

    async function borrarEquipo(id, eventos) {
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
            await recargar();
        } catch (e) {
            if (e.status === 401) return;
            window.adminToast.mostrar('Error: ' + (e.data?.error || e.message), 'error');
        }
    }

    async function crearIntegrante() {
        if (!state.equipoActual) return;
        const $nom = document.getElementById('integrante-nombre');
        const $ci = document.getElementById('integrante-ci');
        const $mat = document.getElementById('integrante-matricula');
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
            await recargar();
        } catch (e) {
            if (e.status === 401) return;
            window.adminToast.mostrar('Error: ' + (e.data?.error || e.message), 'error');
        }
    }

    async function borrarIntegrante(id) {
        const ok = await window.adminConfirm.mostrar({
            titulo: 'Borrar integrante',
            mensaje: '¿Borrar este integrante?',
            textoAceptar: 'Borrar'
        });
        if (!ok) return;
        try {
            await window.apiClient.delete('/integrantes/' + id);
            window.adminToast.mostrar('Integrante eliminado');
            await recargar();
        } catch (e) {
            if (e.status === 401) return;
            window.adminToast.mostrar('Error: ' + (e.data?.error || e.message), 'error');
        }
    }

    return { init, recargar };
})();
