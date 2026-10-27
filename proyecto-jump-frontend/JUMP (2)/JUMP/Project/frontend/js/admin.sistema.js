// admin.sistema.js — Backup + auditoría.

window.adminSistema = (function () {
    function init() {
        enlazar();
        recargarAuditoria();
    }

    function enlazar() {
        const $btn = document.getElementById('btn-backup');
        if ($btn) $btn.addEventListener('click', descargarBackup);
    }

    async function descargarBackup() {
        try {
            const token = window.authApi.getToken();
            const res = await fetch('/api/backup', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'uciplays-backup-' + new Date().toISOString().slice(0, 10) + '.sqlite';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            window.adminToast.mostrar('Backup descargado');
        } catch (e) {
            window.adminToast.mostrar('Error al descargar backup: ' + e.message, 'error');
        }
    }

    async function recargarAuditoria() {
        try {
            const rows = await window.apiClient.get('/auditoria?limite=100');
            renderAuditoria(rows || []);
        } catch (e) {
            if (e.status === 401) return;
            console.error('Error cargando auditoría:', e);
        }
    }

    function renderAuditoria(rows) {
        const $tbody = document.getElementById('auditoria-tbody');
        if (!$tbody) return;
        $tbody.innerHTML = '';
        if (rows.length === 0) {
            $tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:1rem;">Sin registros de auditoría.</td></tr>';
            return;
        }
        rows.forEach((r, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${i + 1}</td>
                <td>${(r.fecha || '').replace('T', ' ').slice(0, 19)}</td>
                <td>${r.username || '—'}</td>
                <td>${r.accion || '—'}</td>
                <td>${r.entidad || '—'}</td>
                <td>${r.entidad_id || '—'}</td>
                <td>${r.ip || '—'}</td>
            `;
            $tbody.appendChild(tr);
        });
    }

    return { init, recargar: recargarAuditoria };
})();
