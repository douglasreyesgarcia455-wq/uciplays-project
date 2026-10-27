document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar todos los enlaces del navbar de administración
    const navLinks = document.querySelectorAll('.header__nav-link--admin');
    
    // Seleccionar todas las secciones (pestañas)
    const tabs = document.querySelectorAll('.admin-tab');

    navLinks.forEach(link => {
        link.addEventListener('click', (evento) => {
            evento.preventDefault(); // Evitar salto en la URL
            
            // 1. Quitar la clase 'active' de todos los enlaces
            navLinks.forEach(nav => nav.classList.remove('active'));
            
            // 2. Añadir la clase 'active' al enlace clicado
            link.classList.add('active');

            // 3. Obtener el nombre del target desde el atributo data-target
            const targetId = link.getAttribute('data-target');

            // 4. Ocultar todas las pestañas y mostrar solo la seleccionada
            tabs.forEach(tab => {
                if (tab.id === targetId) {
                    tab.classList.add('active-tab');
                } else {
                    tab.classList.remove('active-tab');
                }
            });
        });
    });
});