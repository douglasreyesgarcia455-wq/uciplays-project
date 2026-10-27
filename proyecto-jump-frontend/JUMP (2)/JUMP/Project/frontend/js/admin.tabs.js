// admin.tabs.js — Controlador: cambio de pestañas del admin.
// Reutilizable por todos los tabs.

window.adminTabs = (function () {
    function init() {
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
    }
    return { init };
})();
