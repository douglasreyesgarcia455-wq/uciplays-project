// admin.paginado.js — Invención Pura: paginado reutilizable para los tabs del admin.
// Uso:
//   const p = window.adminPaginado.crear({ contenedorId, tamanoInicial: 10, onRender: (items, pagina) => {...} });
//   p.setItems(array);
//   p.render();

window.adminPaginado = (function () {
    function crear(opciones) {
        const { contenedorId, tamanoInicial = 10, onRender } = opciones || {};
        const state = { items: [], pagina: 1, tamano: tamanoInicial };

        function getContenedor() { return document.getElementById(contenedorId); }
        function getInfo() { return document.getElementById(contenedorId + '-info'); }
        function getPrev() { return document.getElementById(contenedorId + '-prev'); }
        function getNext() { return document.getElementById(contenedorId + '-next'); }
        function getTamano() { return document.getElementById(contenedorId + '-tamano'); }

        function render() {
            const total = state.items.length;
            const tamano = state.tamano;
            const totalPaginas = Math.max(1, Math.ceil(total / tamano));
            if (state.pagina > totalPaginas) state.pagina = totalPaginas;
            const inicio = (state.pagina - 1) * tamano;
            const fin = inicio + tamano;
            const pagina = state.items.slice(inicio, fin);

            if (typeof onRender === 'function') {
                onRender(pagina, state.pagina, totalPaginas, state);
            }
            const info = getInfo();
            if (info) info.textContent = state.pagina + ' / ' + totalPaginas;
            const prev = getPrev();
            if (prev) prev.disabled = state.pagina <= 1;
            const next = getNext();
            if (next) next.disabled = state.pagina >= totalPaginas;
        }

        function init() {
            const prev = getPrev();
            const next = getNext();
            const tamano = getTamano();
            if (prev) prev.addEventListener('click', () => { if (state.pagina > 1) { state.pagina--; render(); } });
            if (next) next.addEventListener('click', () => { state.pagina++; render(); });
            if (tamano) tamano.addEventListener('change', () => { state.tamano = parseInt(tamano.value) || 10; state.pagina = 1; render(); });
        }

        function setItems(items) { state.items = items || []; }
        function getState() { return state; }
        function reset() { state.pagina = 1; }

        return { init, setItems, render, getState, reset, getContenedor };
    }
    return { crear };
})();
