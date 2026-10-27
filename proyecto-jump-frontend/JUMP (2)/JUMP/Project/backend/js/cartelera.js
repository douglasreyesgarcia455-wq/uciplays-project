document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("calendario-grid");
    const mesActualTexto = document.getElementById("mes-actual");
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");

    const modal = document.getElementById("modal-eventos");
    const btnCerrar = document.querySelector(".modal__cerrar");
    const tituloModal = document.getElementById("modal-fecha-titulo");
    const listaModal = document.getElementById("modal-lista");

    // Fecha inicial: Octubre de 2026
    let fechaActual = new Date(2026, 9, 1);

    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    // Datos cargados desde /api/eventos via cartelera.controller.js
    // Se poblarán al llamar window.actualizarEventos(data)
    // 'data' es un objeto {fecha: [eventos]}, ya filtrado y agrupado
    let baseDeDatosEventos = {};

    // Función pública para que el controller poblé los datos y re-renderice
    window.actualizarEventos = (data) => {
        // data ya viene filtrada y agrupada {fecha: [eventos]} por el controller
        baseDeDatosEventos = data;
        renderizarCalendario();
    };

    function renderizarCalendario() {
        // Limpiar el calendario actual
        grid.innerHTML = "";

        const año = fechaActual.getFullYear();
        const mes = fechaActual.getMonth();

        // Actualizar el título (Ej: Octubre 2026)
        mesActualTexto.textContent = `${meses[mes]} ${año}`;

        // Cálculos matemáticos para armar el mes
        const primerDiaDelMes = new Date(año, mes, 1).getDay(); // Día de la semana en que cae el 1 (0-6)
        const diasEnElMes = new Date(año, mes + 1, 0).getDate(); // Total de días del mes actual
        const diasMesAnterior = new Date(año, mes, 0).getDate(); // Total de días del mes previo

        // 1. Rellenar los días inactivos del mes anterior para alinear la cuadrícula
        for (let i = primerDiaDelMes; i > 0; i--) {
            const diaAnterior = diasMesAnterior - i + 1;
            grid.innerHTML += `<div class="calendario__celda calendario__celda--inactiva">${diaAnterior}</div>`;
        }

        // 2. Rellenar los días activos del mes actual
        for (let i = 1; i <= diasEnElMes; i++) {
            // Formatear la fecha en YYYY-MM-DD para buscar en la base de datos
            const mesStr = String(mes + 1).padStart(2, '0');
            const diaStr = String(i).padStart(2, '0');
            const fechaClave = `${año}-${mesStr}-${diaStr}`;

            // Buscar eventos para esta fecha específica
            const eventosDelDia = baseDeDatosEventos[fechaClave] || [];

            // Crear el HTML de las etiquetas (chips) si hay eventos
            let chipsHTML = "";
            eventosDelDia.forEach(evento => {
                chipsHTML += `<div class="calendario__evento-chip">${evento.deporte}: ${evento.enfrentamiento}</div>`;
            });

            // Crear el elemento de la celda
            const celda = document.createElement("div");
            celda.className = "calendario__celda";
            celda.innerHTML = `
                <span class="calendario__numero">${i}</span>
                ${chipsHTML}
            `;

            // Añadir el evento de clic a la celda para abrir el modal
            const fechaTexto = `${i} de ${meses[mes]}, ${año}`;
            celda.addEventListener("click", () => abrirModal(fechaTexto, eventosDelDia));

            grid.appendChild(celda);
        }
    }

    function abrirModal(fechaTexto, eventos) {
        tituloModal.textContent = fechaTexto;
        listaModal.innerHTML = ""; // Limpiar contenido anterior

        if (eventos.length > 0) {
            // Inyectar tarjetas por cada evento del día
            eventos.forEach(evento => {
                listaModal.innerHTML += `
                    <div class="evento-detalle">
                        <h3>${evento.enfrentamiento}</h3>
                        <p><strong>Deporte:</strong> ${evento.deporte}</p>
                        <p><strong>Lugar:</strong> ${evento.lugar}</p>
                        <p><strong>Estado:</strong> ${evento.estado}</p>
                    </div>
                `;
            });
        } else {
            listaModal.innerHTML = "<p>No hay eventos deportivos programados para este día.</p>";
        }

        modal.classList.add("modal--activo");
    }

    // Controles de navegación
    btnPrev.addEventListener("click", () => {
        fechaActual.setMonth(fechaActual.getMonth() - 1);
        renderizarCalendario();
    });

    btnNext.addEventListener("click", () => {
        fechaActual.setMonth(fechaActual.getMonth() + 1);
        renderizarCalendario();
    });

    // Cerrar el modal
    btnCerrar.addEventListener("click", () => modal.classList.remove("modal--activo"));
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("modal--activo");
    });

    // Cargar el calendario por primera vez al entrar a la página
    renderizarCalendario();
});
