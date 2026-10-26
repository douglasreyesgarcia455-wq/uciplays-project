import React, { useState, useEffect } from 'react';
import api, { getRanking, getEventos } from '../services/api';
import { 
  LayoutDashboard, Trash2, Edit3, Trophy, Ban, Plus, 
  MapPin, Calendar, Clock, FileText, Activity, Download 
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Deportes definidos anteriormente
const DEPORTES_DEFINIDOS = ["Fútbol", "Volleyball", "Baseball", "BasketBall"];

const Admin = () => {
  const [activeTab, setActiveTab] = useState('eventos');
  const [facultades, setFacultades] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // Estados del formulario
  const [facuA, setFacuA] = useState('');
  const [facuB, setFacuB] = useState('');
  const [eventoForm, setEventoForm] = useState({ 
    deporte: 'Fútbol', 
    fecha: '', 
    hora: '', 
    lugar: '', 
    estado: 'proximo', 
    probabilidad: 50 
  });
  
  const [medallaForm, setMedallaForm] = useState({ facultad_id: '', deporte: 'Fútbol', posicion: 1 });
  const [sancionForm, setSancionForm] = useState({ facultad_id: '', puntos: '', motivo: '' });

  const fetchData = async () => {
    try {
      const [r, e] = await Promise.all([getRanking(), getEventos()]);
      setFacultades(r || []);
      setEventos(e || []);
    } catch (err) { console.error("Error cargando datos:", err); }
  };

  useEffect(() => { fetchData(); }, []);

  const showMsg = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
  };

  const generarReportePDF = () => {
    const doc = new jsPDF();
    const finalizados = eventos.filter(ev => ev.estado === 'finalizado');
    if (finalizados.length === 0) return showMsg('error', 'No hay eventos finalizados');

    doc.setFontSize(18);
    doc.text("REPORTE DE RESULTADOS - COPA MELLA", 14, 20);
    
    const tableRows = finalizados.map(ev => [ev.fecha, ev.deporte, ev.enfrentamiento, ev.lugar]);
    doc.autoTable({
      head: [["Fecha", "Deporte", "Enfrentamiento", "Lugar"]],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }
    });
    doc.save("Reporte_Eventos.pdf");
    showMsg('exito', 'PDF Descargado');
  };

  const handleSaveEvento = async (e) => {
    e.preventDefault();
    if (!facuA || !facuB || facuA === facuB) return showMsg('error', 'Selecciona facultades válidas');
    
    const data = { ...eventoForm, enfrentamiento: `${facuA} vs ${facuB}` };
    try {
      if (editingId) {
        await api.put(`/eventos/${editingId}`, data);
      } else {
        await api.post('/eventos', data);
      }
      resetEventoForm();
      fetchData();
      showMsg('exito', editingId ? 'Evento actualizado' : 'Evento creado');
    } catch (err) { showMsg('error', 'Error en el servidor'); }
  };

  const resetEventoForm = () => {
    setEventoForm({ deporte: 'Fútbol', fecha: '', hora: '', lugar: '', estado: 'proximo', probabilidad: 50 });
    setFacuA(''); setFacuB(''); setEditingId(null);
  };

  const startEdit = (ev) => {
    setEditingId(ev.id);
    const [a, b] = ev.enfrentamiento.split(' vs ');
    setFacuA(a || ''); setFacuB(b || '');
    setEventoForm({ 
      deporte: ev.deporte, 
      fecha: ev.fecha, 
      hora: ev.hora, 
      lugar: ev.lugar, 
      estado: ev.estado, 
      probabilidad: ev.probabilidad 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMedalla = async (e) => {
    e.preventDefault();
    const pts = { 1: 10, 2: 7, 3: 5 };
    try {
      await api.post('/resultados', { ...medallaForm, puntuacion_final: pts[medallaForm.posicion] });
      showMsg('exito', 'Medalla asignada');
      fetchData();
    } catch (err) { showMsg('error', 'Error al asignar medalla'); }
  };

  const handleSancion = async (e) => {
    e.preventDefault();
    try {
      await api.post('/resultados', { 
        facultad_id: sancionForm.facultad_id, 
        deporte: `Sanción: ${sancionForm.motivo}`, 
        puntuacion_final: -Math.abs(sancionForm.puntos) 
      });
      showMsg('exito', 'Sanción aplicada');
      fetchData();
    } catch (err) { showMsg('error', 'Error al sancionar'); }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm gap-4">
        <h1 className="text-xl font-black flex items-center gap-2 tracking-tighter italic">
          <LayoutDashboard className="text-blue-600"/> UCI PLAYS <span className="text-slate-400 font-medium">ADMIN</span>
        </h1>
        <div className="flex gap-2">
          <button onClick={generarReportePDF} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">
            <Download size={16}/> Exportar PDF
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        {['eventos', 'medallas', 'sanciones'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{t}</button>
        ))}
      </div>

      {mensaje.texto && (
        <div className={`p-4 rounded-2xl text-[10px] font-black text-center uppercase tracking-[0.2em] animate-bounce ${mensaje.tipo === 'exito' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {mensaje.texto}
        </div>
      )}

      <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-sm border border-slate-100">
        {activeTab === 'eventos' && (
          <div className="space-y-10">
            <form onSubmit={handleSaveEvento} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Deporte</label>
                  <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all" value={eventoForm.deporte} onChange={e => setEventoForm({...eventoForm, deporte: e.target.value})} required>
                    {DEPORTES_DEFINIDOS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Local</label>
                  <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all" value={facuA} onChange={e => setFacuA(e.target.value)} required>
                    <option value="">Seleccionar...</option>
                    {facultades.map(f => <option key={f.id} value={f.nombre}>{f.nombre}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Visitante</label>
                  <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all" value={facuB} onChange={e => setFacuB(e.target.value)} required>
                    <option value="">Seleccionar...</option>
                    {facultades.map(f => <option key={f.id} value={f.nombre}>{f.nombre}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Fecha</label>
                  <input type="date" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-blue-500 outline-none" value={eventoForm.fecha} onChange={e => setEventoForm({...eventoForm, fecha: e.target.value})} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Hora</label>
                  <input type="time" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-blue-500 outline-none" value={eventoForm.hora} onChange={e => setEventoForm({...eventoForm, hora: e.target.value})} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Lugar</label>
                  <input type="text" placeholder="Ej: Cancha Principal" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-blue-500 outline-none" value={eventoForm.lugar} onChange={e => setEventoForm({...eventoForm, lugar: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Estado del Encuentro</label>
                  <select className="w-full p-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] outline-none" value={eventoForm.estado} onChange={e => setEventoForm({...eventoForm, estado: e.target.value})}>
                    <option value="proximo">Próximo</option>
                    <option value="en vivo">En Vivo</option>
                    <option value="finalizado">Finalizado</option>
                  </select>
                </div>
                <div className="space-y-1.5 p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest text-center">Probabilidad Victoria Local: {eventoForm.probabilidad}%</p>
                  <input type="range" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" value={eventoForm.probabilidad} onChange={e => setEventoForm({...eventoForm, probabilidad: e.target.value})} />
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white p-5 rounded-3xl font-black uppercase text-[11px] tracking-[0.3em] shadow-xl shadow-blue-100 hover:bg-slate-900 transition-all flex items-center justify-center gap-3">
                {editingId ? <><Edit3 size={18}/> Actualizar Evento</> : <><Plus size={18}/> Lanzar a Cartelera</>}
              </button>
            </form>

            {/* LISTA DE EVENTOS */}
            <div className="space-y-4 pt-10 border-t border-slate-100">
              <h3 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.4em] mb-6">Encuentros Registrados</h3>
              {eventos.map(ev => (
                <div key={ev.id} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 flex justify-between items-center group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-white rounded-2xl text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Activity size={20}/>
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-sm uppercase italic tracking-tighter">{ev.enfrentamiento}</h4>
                      <div className="flex flex-wrap gap-4 mt-1.5">
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">{ev.deporte}</span>
                        <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase"><Clock size={12}/> {ev.hora}</span>
                        <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase"><MapPin size={12}/> {ev.lugar}</span>
                        <span className={`text-[9px] font-black uppercase ${ev.estado === 'en vivo' ? 'text-red-500' : 'text-slate-400'}`}>• {ev.estado}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(ev)} className="p-3 text-blue-600 bg-white border border-slate-100 rounded-xl hover:scale-110 transition-transform"><Edit3 size={18}/></button>
                    <button onClick={async () => { if(window.confirm("¿Eliminar?")) { await api.delete(`/eventos/${ev.id}`); fetchData(); } }} className="p-3 text-red-500 bg-white border border-slate-100 rounded-xl hover:scale-110 transition-transform"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'medallas' && (
          <form onSubmit={handleMedalla} className="max-w-md mx-auto py-10 space-y-8">
            <div className="text-center space-y-2">
              <Trophy size={48} className="mx-auto text-yellow-500 animate-pulse"/>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Entrega de Medallas</h2>
            </div>
            <select className="w-full p-5 border-2 border-slate-100 rounded-2xl font-bold outline-none" value={medallaForm.facultad_id} onChange={e => setMedallaForm({...medallaForm, facultad_id: e.target.value})} required>
              <option value="">Seleccionar Facultad...</option>
              {facultades.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
            </select>
            <select className="w-full p-5 border-2 border-slate-100 rounded-2xl font-bold outline-none" value={medallaForm.deporte} onChange={e => setMedallaForm({...medallaForm, deporte: e.target.value})}>
              {DEPORTES_DEFINIDOS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select className="w-full p-5 border-2 border-slate-100 rounded-2xl font-bold bg-yellow-50 outline-none" value={medallaForm.posicion} onChange={e => setMedallaForm({...medallaForm, posicion: parseInt(e.target.value)})}>
              <option value="1">🥇 Primer Lugar (10 pts)</option>
              <option value="2">🥈 Segundo Lugar (7 pts)</option>
              <option value="3">🥉 Tercer Lugar (5 pts)</option>
            </select>
            <button className="w-full bg-slate-900 text-white p-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl">Registrar en Ranking</button>
          </form>
        )}

        {activeTab === 'sanciones' && (
          <form onSubmit={handleSancion} className="max-w-md mx-auto py-10 space-y-8">
            <div className="text-center space-y-2">
              <Ban size={48} className="mx-auto text-red-500"/>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Penalizaciones</h2>
            </div>
            <select className="w-full p-5 border-2 border-slate-100 rounded-2xl font-bold outline-none" value={sancionForm.facultad_id} onChange={e => setSancionForm({...sancionForm, facultad_id: e.target.value})} required>
              <option value="">Seleccionar Facultad...</option>
              {facultades.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
            </select>
            <input type="number" placeholder="Puntos a deducir (Ej: 5)" className="w-full p-5 border-2 border-slate-100 rounded-2xl font-bold outline-none" value={sancionForm.puntos} onChange={e => setSancionForm({...sancionForm, puntos: e.target.value})} required />
            <textarea placeholder="Motivo de la sanción..." className="w-full p-5 border-2 border-slate-100 rounded-2xl font-bold outline-none h-32" value={sancionForm.motivo} onChange={e => setSancionForm({...sancionForm, motivo: e.target.value})} required />
            <button className="w-full bg-red-600 text-white p-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl">Aplicar Sanción</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Admin;