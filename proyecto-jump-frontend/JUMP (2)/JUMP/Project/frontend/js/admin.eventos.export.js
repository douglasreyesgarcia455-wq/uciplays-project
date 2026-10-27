// admin.eventos.export.js — Exportar eventos a PDF.
// Depende de jsPDF + autotable (CDN) y de window.adminEventos.obtenerEventos().

window.adminEventosExport = (function () {
    function init() {
        const $btn = document.getElementById('btn-export-pdf');
        if ($btn && !$btn.dataset.listener) {
            $btn.dataset.listener = '1';
            $btn.addEventListener('click', exportar);
        }
    }

    function exportar() {
        if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
            window.adminToast.mostrar('jsPDF no cargó (CDN caído)', 'error');
            return;
        }
        if (!window.adminEventos || typeof window.adminEventos.obtenerEventos !== 'function') {
            window.adminToast.mostrar('Los eventos aún no están cargados', 'error');
            return;
        }
        const eventos = window.adminEventos.obtenerEventos();
        if (!eventos || eventos.length === 0) {
            window.adminToast.mostrar('No hay eventos para exportar', 'error');
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        doc.setFontSize(16);
        doc.text('UCI Plays — Eventos', 14, 15);
        doc.setFontSize(10);
        doc.text('Generado: ' + new Date().toLocaleString(), 14, 22);

        const rows = eventos.map(e => {
            const participantes = (e.participantes || []).map(p => p.facultad + (p.posicion ? ' (' + p.posicion + 'º)' : '')).join(' vs ');
            return [e.id, e.deporte || '', e.fecha || '', e.hora || '', e.lugar || '', e.estado || '', participantes];
        });

        doc.autoTable({
            startY: 28,
            head: [['ID', 'Deporte', 'Fecha', 'Hora', 'Lugar', 'Estado', 'Participantes']],
            body: rows,
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [26, 16, 136], textColor: 255 },
            alternateRowStyles: { fillColor: [245, 245, 250] }
        });
        doc.save('uciplays-eventos-' + new Date().toISOString().slice(0, 10) + '.pdf');
        window.adminToast.mostrar('PDF exportado');
    }

    return { init };
})();
