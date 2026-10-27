// admin.participantes.js — Orquestador del tab Participantes.
// Delega en adminParticipantesFacultades / Equipos / Integrantes.

window.adminParticipantes = (function () {
    let state = {
        facultades: [], equipos: [], deportes: [], integrantes: [],
        facultadActual: null, equipoActual: null
    };

    function init() {
        enlazar();
        window.adminParticipantesFacultades.init({ onRecargar: recargar });
        window.adminParticipantesEquipos.init({ onRecargar: recargar });
        window.adminParticipantesIntegrantes.init({ onRecargar: recargar });
        recargar();
    }

    function enlazar() {
        const $btnFac = document.getElementById('btn-vista-facultades');
        const $btnEq = document.getElementById('btn-vista-equipos');
        if ($btnFac) $btnFac.addEventListener('click', () => cambiarVista('facultades'));
        if ($btnEq) $btnEq.addEventListener('click', () => cambiarVista('equipos'));
        const $volver = document.getElementById('btn-volver-equipos');
        if ($volver) $volver.addEventListener('click', () => cambiarVista('equipos'));

        const $filtro = document.getElementById('filtro-facultad-equipos');
        if ($filtro) $filtro.addEventListener('change', renderEquiposFiltrados);

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
            window.adminParticipantesFacultades.actualizar(state.facultades);
            window.adminParticipantesEquipos.actualizar(state.equipos, state.facultadActual);
            window.adminParticipantesIntegrantes.actualizar(state.integrantes, state.equipoActual);
            poblarSelects();
        } catch (e) {
            if (e.status === 401) return;
            console.error('Error cargando participantes:', e);
        }
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

    function renderEquiposFiltrados() {
        const $filtro = document.getElementById('filtro-facultad-equipos');
        const filtro = $filtro ? $filtro.value : '';
        window.adminParticipantesEquipos.actualizar(state.equipos, filtro ? { nombre: filtro } : null);
    }

    function verEquiposDeFacultad(facultadId) {
        state.facultadActual = state.facultades.find(f => f.id === facultadId) || null;
        const $titulo = document.getElementById('equipos-facultad-titulo');
        if ($titulo) $titulo.textContent = 'Equipos de ' + (state.facultadActual ? state.facultadActual.nombre : '');
        window.adminParticipantesEquipos.actualizar(state.equipos, state.facultadActual);
        cambiarVista('equipos');
    }

    function verIntegrantes(equipoId) {
        state.equipoActual = state.equipos.find(e => e.id === equipoId) || null;
        const $titulo = document.getElementById('integrantes-equipo-titulo');
        if ($titulo) $titulo.textContent = 'Integrantes de ' + (state.equipoActual ? state.equipoActual.nombre : '');
        window.adminParticipantesIntegrantes.actualizar(state.integrantes, state.equipoActual);
        cambiarVista('integrantes');
    }

    return { init, recargar, verEquiposDeFacultad, verIntegrantes, cambiarVista };
})();
