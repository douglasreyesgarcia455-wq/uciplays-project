// admin.js — Panel de administración: login, CRUD de eventos, paginado.

document.addEventListener('DOMContentLoaded', () => {
    // ============================================================
    // ESTADO
    // ============================================================
    const state = {
        eventos: [],
        deportes: [],
        equipos: [],
        pagina: 1,
        tamano: 10
    };

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

    const cargarDatos = async () => {
        try {
            const [eventos, deportes, equipos] = await Promise.all([
                window.eventosApi.getEventos(),
                window.deportesApi.getDeportes(),
                window.equiposApi.getEquipos()
            ]);
            state.eventos = eventos || [];
            state.deportes = deportes || [];
            state.equipos = equipos || [];
            poblarSelects();
            renderEventos();
        } catch (e) {
            if (e.status === 401) { mostrarLogin(); }
            else { console.error('Error cargando datos:', e); }
        }
    };

    if (window.authApi.isLoggedIn()) {
        ocultarLogin();
        cargarDatos();
    } else {
        mostrarLogin();
    }

    if ($loginForm) {
        $loginForm.addEventListener('submit', async (ev) => {
            ev.preventDefault();
            if ($loginError) { $loginError.style.display = 'none'; $loginError.textContent = ''; }
            try {
                const res = await window.authApi.login($loginUser.value.trim(), $loginPass.value);
                if (res && res.token) {
                    window.authApi.setSession(res.token, res.user);
                    ocultarLogin();
                    await cargarDatos();
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
    // SELECTS DEL FORMULARIO DE EVENTOS
    // ============================================================
    function poblarSelects() {
        const $dep = document.getElementById('evento-deporte');
        const $loc = document.getElementById('evento-local');
        const $vis = document.getElementById('evento-visitante');

        if ($dep) {
            $dep.innerHTML = '';
            state.deportes.forEach(d => {
                const opt = document.createElement('option');
                opt.value = d.id;
                opt.textContent = d.nombre;
                $dep.appendChild(opt);
            });
        }

        const llenarEquipos = (sel) => {
            if (!sel) return;
            sel.innerHTML = '';
            state.equipos.forEach(eq => {
                const opt = document.createElement('option');
                opt.value = eq.id;
                opt.textContent = eq.facultad + ' ' + eq.deporte;
                sel.appendChild(opt);
            });
        };
        llenarEquipos($loc);
        llenarEquipos($vis);
        if ($vis && $vis.options.length > 1) $vis.selectedIndex = 1;
    }

    // ============================================================
    // RENDER LISTA DE EVENTOS CON PAGINADO
    // ============================================================
    const $lista = document.getElementById('eventos-lista');
    const $infoPag = document.getElementById('eventos-info-pagina');
    const $prev = document.getElementById('eventos-prev');
    const $next = document.getElementById('eventos-next');
    const $tamano = document.getElementById('eventos-tamano-pagina');

    function renderEventos() {
        if (!$lista) return;
        const total = state.eventos.length;
        const tamano = state.tamano;
        const totalPaginas = Math.max(1, Math.ceil(total / tamano));
        if (state.pagina > totalPaginas) state.pagina = totalPaginas;
        const inicio = (state.pagina - 1) * tamano;
        const fin = inicio + tamano;
        const pagina = state.eventos.slice(inicio, fin);

        $lista.innerHTML = '';
        if (pagina.length === 0) {
            $lista.innerHTML = '<p style="padding:1rem;">No hay eventos registrados.</p>';
        } else {
            pagina.forEach(ev => {
                const art = document.createElement('article');
                art.className = 'admin-item';
                art.innerHTML = `
                    <div class="admin-item__info">
                        <div class="admin-item__encabezado">
                            <span class="admin-item__deporte">${ev.deporte || ''}</span>
                            <span class="admin-item__estado admin-item__estado--pendiente">${ev.estado || ''}</span>
                        </div>
                        <h3 class="admin-item__equipos">${ev.equipo_local_nombre || ''} vs ${ev.equipo_visitante_nombre || ''}</h3>
                        <p class="admin-item__detalles">${ev.fecha || ''} • ${ev.hora || ''} • ${ev.lugar || ''}</p>
                    </div>
                    <div class="admin-item__acciones">
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
        }

        if ($infoPag) $infoPag.textContent = state.pagina + ' / ' + totalPaginas;
        if ($prev) $prev.disabled = state.pagina <= 1;
        if ($next) $next.disabled = state.pagina >= totalPaginas;

        $lista.querySelectorAll('.admin-btn-icono--eliminar').forEach(btn => {
            btn.addEventListener('click', () => borrarEvento(parseInt(btn.dataset.id)));
        });
        $lista.querySelectorAll('.admin-btn-icono--editar').forEach(btn => {
            btn.addEventListener('click', () => editarEvento(parseInt(btn.dataset.id)));
        });
    }

    if ($prev) $prev.addEventListener('click', () => { if (state.pagina > 1) { state.pagina--; renderEventos(); } });
    if ($next) $next.addEventListener('click', () => { state.pagina++; renderEventos(); });
    if ($tamano) $tamano.addEventListener('change', () => { state.tamano = parseInt($tamano.value) || 10; state.pagina = 1; renderEventos(); });

    // ============================================================
    // CREAR EVENTO
    // ============================================================
    const $btnCrear = document.getElementById('btn-crear-evento');
    if ($btnCrear) {
        $btnCrear.addEventListener('click', async () => {
            const payload = {
                deporte_id: parseInt(document.getElementById('evento-deporte').value),
                equipo_local_id: parseInt(document.getElementById('evento-local').value),
                equipo_visitante_id: parseInt(document.getElementById('evento-visitante').value),
                fecha: document.getElementById('evento-fecha').value,
                hora: document.getElementById('evento-hora').value,
                lugar: document.getElementById('evento-lugar').value,
                estado: 'proximo',
                probabilidad: 50
            };
            if (!payload.fecha || !payload.hora || !payload.lugar) {
                alert('Completa fecha, hora y lugar');
                return;
            }
            if (payload.equipo_local_id === payload.equipo_visitante_id) {
                alert('El equipo local y visitante no pueden ser el mismo');
                return;
            }
            try {
                await window.apiClient.post('/eventos', payload);
                await cargarDatos();
                state.pagina = 1;
                renderEventos();
                document.getElementById('evento-fecha').value = '';
                document.getElementById('evento-hora').value = '';
                document.getElementById('evento-lugar').value = '';
            } catch (e) {
                if (e.status === 401) { mostrarLogin(); return; }
                alert('Error al crear evento: ' + (e.data?.error || e.message));
            }
        });
    }

    // ============================================================
    // EDITAR EVENTO
    // ============================================================
    async function editarEvento(id) {
        const ev = state.eventos.find(e => e.id === id);
        if (!ev) return;
        const nuevaFecha = prompt('Nueva fecha (YYYY-MM-DD):', ev.fecha || '');
        if (nuevaFecha === null) return;
        const nuevaHora = prompt('Nueva hora (HH:MM):', ev.hora || '');
        if (nuevaHora === null) return;
        const nuevoLugar = prompt('Nuevo lugar:', ev.lugar || '');
        if (nuevoLugar === null) return;
        try {
            await window.apiClient.put('/eventos/' + id, {
                deporte_id: ev.deporte_id || null,
                equipo_local_id: ev.equipo_local_id || null,
                equipo_visitante_id: ev.equipo_visitante_id || null,
                fecha: nuevaFecha,
                hora: nuevaHora,
                lugar: nuevoLugar,
                estado: ev.estado || 'proximo',
                probabilidad: ev.probabilidad || 50
            });
            await cargarDatos();
        } catch (e) {
            if (e.status === 401) { mostrarLogin(); return; }
            alert('Error al editar: ' + (e.data?.error || e.message));
        }
    }

    // ============================================================
    // BORRAR EVENTO
    // ============================================================
    async function borrarEvento(id) {
        if (!confirm('¿Eliminar este evento?')) return;
        try {
            await window.apiClient.delete('/eventos/' + id);
            await cargarDatos();
        } catch (e) {
            if (e.status === 401) { mostrarLogin(); return; }
            alert('Error al borrar: ' + (e.data?.error || e.message));
        }
    }

    // ============================================================
    // CAMBIO DE TABS (ya existente, se preserva)
    // ============================================================
    const navLinks = document.querySelectorAll('.header__nav-link--admin');
    const tabs = document.querySelectorAll('.admin-tab');
    navLinks.forEach(link => {
        link.addEventListener('click', (evento) => {
            evento.preventDefault();
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
            const targetId = link.getAttribute('data-target');
            tabs.forEach(tab => {
                if (tab.id === targetId) tab.classList.add('active-tab');
                else tab.classList.remove('active-tab');
            });
        });
    });
});
