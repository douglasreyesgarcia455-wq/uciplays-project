// admin.controller.js — Controlador delgado del admin.
// Orquesta: login, carga de datos, tabs, módulos por tab.
// No contiene lógica de CRUD (delegada a admin.eventos.js, etc.).

document.addEventListener('DOMContentLoaded', () => {
    // ============================================================
    // LOGIN
    // ============================================================
    const $loginModal = document.getElementById('login-modal');
    const $loginForm = document.getElementById('login-form');
    const $loginError = document.getElementById('login-error');
    const $loginUser = document.getElementById('login-username');
    const $loginPass = document.getElementById('login-password');

    const mostrarLogin = () => {
        if ($loginModal) $loginModal.style.display = 'flex';
        if ($loginError) { $loginError.style.display = 'none'; $loginError.textContent = ''; }
    };
    const ocultarLogin = () => {
        if ($loginModal) $loginModal.style.display = 'none';
    };

    if ($loginForm) {
        $loginForm.addEventListener('submit', async (ev) => {
            ev.preventDefault();
            if ($loginError) { $loginError.style.display = 'none'; $loginError.textContent = ''; }
            try {
                const res = await window.authApi.login($loginUser.value.trim(), $loginPass.value);
                if (res && res.token) {
                    window.authApi.setSession(res.token, res.user);
                    ocultarLogin();
                    await cargarTodo();
                } else {
                    throw new Error('Respuesta inválida');
                }
            } catch (e) {
                if ($loginError) {
                    $loginError.style.display = 'block';
                    $loginError.textContent = (e.data && e.data.error) || 'Credenciales incorrectas';
                }
            }
        });
    }

    // ============================================================
    // CARGA DE DATOS
    // ============================================================
    let ctx = { eventos: [], deportes: [], equipos: [] };

    async function cargarTodo() {
        try {
            const [eventos, deportes, equipos] = await Promise.all([
                window.eventosApi.getEventos(),
                window.deportesApi.getDeportes(),
                window.equiposApi.getEquipos()
            ]);
            ctx = { eventos: eventos || [], deportes: deportes || [], equipos: equipos || [] };
            window.adminEventos.actualizar({
                eventos: ctx.eventos,
                deportes: ctx.deportes,
                equipos: ctx.equipos,
                onRecargar: cargarTodo,
                onLogin: mostrarLogin
            });
            if (window.adminResultados && typeof window.adminResultados.recargar === 'function') {
                window.adminResultados.recargar();
            }
        } catch (e) {
            if (e.status === 401) { mostrarLogin(); }
            else { console.error('Error cargando datos:', e); }
        }
    }

    // ============================================================
    // ARRANQUE
    // ============================================================
    window.adminTabs.init();
    window.adminEventos.init({
        eventos: [],
        deportes: [],
        equipos: [],
        onRecargar: cargarTodo,
        onLogin: mostrarLogin
    });

    window.adminEventosExport.init();

    window.adminResultados.init({
        onRecargar: cargarTodo
    });

    window.adminDisciplinas.init();
    window.adminParticipantes.init();
    window.adminSanciones.init();
    window.adminSistema.init();
    window.adminConfirm.init();
    window.adminPrompt.init();

    if (window.authApi.isLoggedIn()) {
        ocultarLogin();
        cargarTodo();
    } else {
        mostrarLogin();
    }
});
