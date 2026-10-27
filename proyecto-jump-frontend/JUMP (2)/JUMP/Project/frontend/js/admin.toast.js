// admin.toast.js — Invención Pura: notificaciones toast.
// Reutilizable por todos los tabs del admin.

window.adminToast = (function () {
    function mostrar(mensaje, tipo) {
        const contenedor = document.getElementById('toast-container');
        if (!contenedor) return;
        const toast = document.createElement('div');
        toast.className = 'toast' + (tipo === 'error' ? ' toast--error' : tipo === 'info' ? ' toast--info' : '');
        toast.textContent = mensaje;
        contenedor.appendChild(toast);
        setTimeout(() => toast.classList.add('toast--visible'), 10);
        setTimeout(() => {
            toast.classList.remove('toast--visible');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    return { mostrar };
})();
