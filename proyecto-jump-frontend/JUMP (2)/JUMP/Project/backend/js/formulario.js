document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos los elementos
    const btnAbrirAdmin = document.querySelector('.header__admin-link');
    const modalAdmin = document.getElementById('modal-admin');
    const btnCerrarAdmin = document.getElementById('btn-cerrar-admin');

    // Si los elementos existen en la página actual, activamos la lógica
    if (btnAbrirAdmin && modalAdmin) {
        
        // 1. Abrir el modal
        btnAbrirAdmin.addEventListener('click', (e) => {
            e.preventDefault(); // Evita ir a 'acceso-administracion.html'
            modalAdmin.classList.add('modal-admin--activo');
        });

        // 2. Cerrar el modal desde la 'X'
        if(btnCerrarAdmin) {
            btnCerrarAdmin.addEventListener('click', () => {
                modalAdmin.classList.remove('modal-admin--activo');
            });
        }

        // 3. Cerrar el modal al hacer clic en el fondo difuminado
        modalAdmin.addEventListener('click', (e) => {
            if (e.target === modalAdmin) {
                modalAdmin.classList.remove('modal-admin--activo');
            }
        });

        // 4. (Opcional pero recomendado) Cerrar con la tecla "Escape"
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalAdmin.classList.contains('modal-admin--activo')) {
                modalAdmin.classList.remove('modal-admin--activo');
            }
        });
    }
});