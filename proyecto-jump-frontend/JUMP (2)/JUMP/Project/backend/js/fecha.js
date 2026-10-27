const calendarios = document.querySelectorAll(".main__fecha");

if (calendarios.length === 3) {
    const hoy = new Date();
    
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);

    const fechas = [ayer, hoy, manana];

    calendarios.forEach((calendario, index) => {
        const fechaActual = fechas[index];
        
        const dia = String(fechaActual.getDate());
        const mes = new Intl.DateTimeFormat("es", { month: "short" })
            .format(fechaActual)
            .replace(".", "")
            .toUpperCase();
        const diaSemana = new Intl.DateTimeFormat("es", { weekday: "long" })
            .format(fechaActual)
            .toUpperCase();

        calendario.querySelector(".main__fecha-dia").textContent = dia;
        calendario.querySelector(".main__fecha-mes").textContent = mes;
        calendario.querySelector(".main__fecha-semana").textContent = diaSemana;

        const anioFormateado = fechaActual.getFullYear();
        const mesFormateado = String(fechaActual.getMonth() + 1).padStart(2, "0");
        const diaFormateado = String(fechaActual.getDate()).padStart(2, "0");
        const fechaString = `${anioFormateado}-${mesFormateado}-${diaFormateado}`;

        calendario.setAttribute("datetime", fechaString);

        const enlacePadre = calendario.closest(".main__fecha-enlace");
        if (enlacePadre) {
            enlacePadre.href = `cartelera.html?fecha=${fechaString}#eventos`;
        }
    });
}