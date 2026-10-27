// admin.confirm.js — Modal de confirmación reutilizable (Promise).
// Uso: const ok = await window.adminConfirm.mostrar({ titulo, mensaje, textoAceptar, textoCancelar });

window.adminConfirm = (function () {
    let resolverActual = null;

    function init() {
        const $modal = document.getElementById('confirm-modal');
        const $aceptar = document.getElementById('confirm-aceptar');
        const $cancelar = document.getElementById('confirm-cancelar');
        if (!$modal || !$aceptar || !$cancelar) return;

        $aceptar.addEventListener('click', () => cerrar(true));
        $cancelar.addEventListener('click', () => cerrar(false));
        $modal.addEventListener('click', (e) => {
            if (e.target === $modal) cerrar(false);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && $modal.style.display !== 'none') cerrar(false);
        });
    }

    function cerrar(resultado) {
        const $modal = document.getElementById('confirm-modal');
        if ($modal) $modal.style.display = 'none';
        if (typeof resolverActual === 'function') {
            const r = resolverActual;
            resolverActual = null;
            r(resultado);
        }
    }

    function mostrar(opciones) {
        const opt = opciones || {};
        const $modal = document.getElementById('confirm-modal');
        const $titulo = document.getElementById('confirm-titulo');
        const $mensaje = document.getElementById('confirm-mensaje');
        const $aceptar = document.getElementById('confirm-aceptar');
        const $cancelar = document.getElementById('confirm-cancelar');
        if (!$modal) return Promise.resolve(false);

        if ($titulo) $titulo.textContent = opt.titulo || '¿Confirmar acción?';
        if ($mensaje) $mensaje.textContent = opt.mensaje || '—';
        if ($aceptar) $aceptar.textContent = opt.textoAceptar || 'Aceptar';
        if ($cancelar) $cancelar.textContent = opt.textoCancelar || 'Cancelar';

        $modal.style.display = 'flex';
        return new Promise((resolve) => {
            resolverActual = resolve;
        });
    }

    return { init, mostrar };
})();
