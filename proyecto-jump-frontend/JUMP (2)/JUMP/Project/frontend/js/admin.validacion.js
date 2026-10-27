// admin.validacion.js — Invención Pura: validación inline reutilizable.
// Uso:
//   window.adminValidacion.marcarError(campo, 'mensaje');
//   window.adminValidacion.limpiarError(campo);
//   window.adminValidacion.limpiarTodos(contenedor);

window.adminValidacion = (function () {
    function limpiarError(campo) {
        if (!campo) return;
        campo.classList.remove('admin-form__input--error');
        const sibling = campo.parentElement.querySelector('.admin-form__error-msg');
        if (sibling) sibling.remove();
    }

    function limpiarTodos(contenedor) {
        if (!contenedor) return;
        contenedor.querySelectorAll('.admin-form__input--error').forEach(c => c.classList.remove('admin-form__input--error'));
        contenedor.querySelectorAll('.admin-form__error-msg').forEach(m => m.remove());
    }

    function marcarError(campo, mensaje) {
        if (!campo) return;
        campo.classList.add('admin-form__input--error');
        const existing = campo.parentElement.querySelector('.admin-form__error-msg');
        if (existing) existing.remove();
        const span = document.createElement('span');
        span.className = 'admin-form__error-msg';
        span.textContent = mensaje;
        campo.parentElement.appendChild(span);
        campo.focus();
    }

    function enlazarLimpiar(campo) {
        if (!campo) return;
        const evt = campo.tagName === 'SELECT' ? 'change' : 'input';
        campo.addEventListener(evt, () => limpiarError(campo));
    }

    return { limpiarError, limpiarTodos, marcarError, enlazarLimpiar };
})();
