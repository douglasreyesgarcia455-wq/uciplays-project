import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRanking, getEventos } from '../services/api';
import { MapPin, Clock, Calendar, Trophy, Zap, ChevronRight, Filter, Search } from 'lucide-react';

const DEPORTES = ["Todos", "Fútbol", "Volleyball", "Baseball", "BasketBall"];
const FACULTADES = ["Todas", "CITI", "FTE", "FEI", "FICI", "FCE"];

const Home = () => {
  const [eventos, setEventos] = useState([]);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [filtros, setFiltros] = useState({ facultad: 'Todas', deporte: 'Todos' });
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [e, r] = await Promise.all([getEventos(), getRanking()]);
      const dataEventos = e || [];
      setEventos(dataEventos);
      setRanking((r || []).slice(0, 3));
      aplicarFiltros(dataEventos, filtros);
    } catch (err) { console.error("Error cargando datos:", err); }
  };

  const aplicarFiltros = (lista, currentFilters) => {
    let resultado = lista;
    if (currentFilters.facultad !== 'Todas') {
      resultado = resultado.filter(ev => ev.enfrentamiento.includes(currentFilters.facultad));
    }
    if (currentFilters.deporte !== 'Todos') {
      resultado = resultado.filter(ev => ev.deporte === currentFilters.deporte);
    }
    setFilteredEventos(resultado);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Actualizar vista filtrada cuando cambian los filtros
  useEffect(() => {
    aplicarFiltros(eventos, filtros);
  }, [filtros, eventos]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
      {/* SECCIÓN DE FILTROS Y HEADER */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">COPA <span className="text-blue-600">MELLA 2025</span></h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
              <Zap size={14} className="text-blue-500 animate-pulse"/> Cartelera Oficial
            </p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
              <Search size={14} className="text-slate-400"/>
              <select 
                className="bg-transparent text-[11px] font-black uppercase outline-none text-slate-600"
                value={filtros.facultad}
                onChange={(e) => setFiltros({...filtros, facultad: e.target.value})}
              >
                {FACULTADES.map(f => <option key={f} value={f}>{f === 'Todas' ? 'Facultades' : f}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
              <Filter size={14} className="text-slate-400"/>
              <select 
                className="bg-transparent text-[11px] font-black uppercase outline-none text-slate-600"
                value={filtros.deporte}
                onChange={(e) => setFiltros({...filtros, deporte: e.target.value})}
              >
                {DEPORTES.map(d => <option key={d} value={d}>{d === 'Todos' ? 'Deportes' : d}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMNA DE EVENTOS FILTRADOS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Resultados encontrados ({filteredEventos.length})</h2>
          </div>

          {filteredEventos.length > 0 ? filteredEventos.map(ev => (
            <div key={ev.id} className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <span className={`px-4 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${ev.estado === 'en vivo' ? 'bg-red-600 text-white animate-pulse' : 'bg-blue-50 text-blue-600'}`}>{ev.estado}</span>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{ev.deporte}</span>
              </div>

              <h3 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter mb-8 leading-none">{ev.enfrentamiento}</h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
                  <Calendar size={16} className="text-blue-600 mb-1"/>
                  <span className="text-[9px] font-black text-slate-400 uppercase">Fecha</span>
                  <span className="text-xs font-bold">{ev.fecha}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
                  <Clock size={16} className="text-blue-600 mb-1"/>
                  <span className="text-[9px] font-black text-slate-400 uppercase">Hora</span>
                  <span className="text-xs font-bold">{ev.hora}</span>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl flex flex-col items-center col-span-2 md:col-span-1">
                  <MapPin size={16} className="text-blue-400 mb-1"/>
                  <span className="text-[9px] font-black text-slate-400 uppercase">Lugar</span>
                  <span className="text-xs font-bold text-white truncate w-full text-center px-1">{ev.lugar}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                <div className="w-1/2">
                  <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 mb-1"><span>Predicción Victoria</span> <span>{ev.probabilidad}%</span></div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all duration-1000" style={{width: `${ev.probabilidad}%`}}></div>
                  </div>
                </div>
                <button onClick={() => navigate(`/evento/${ev.id}`)} className="p-4 bg-slate-100 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                  <ChevronRight size={20}/>
                </button>
              </div>
            </div>
          )) : (
            <div className="p-20 text-center border-4 border-dashed border-slate-100 rounded-[50px] space-y-4">
              <div className="text-slate-200 flex justify-center"><Search size={48}/></div>
              <p className="text-slate-300 font-black uppercase text-xs tracking-widest">No hay encuentros que coincidan con tu búsqueda</p>
              <button 
                onClick={() => setFiltros({ facultad: 'Todas', deporte: 'Todos' })}
                className="text-blue-500 font-bold text-xs underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* LIDERAZGO LATERAL (Sincronizado) */}
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Top 3 Ranking</h2>
          <div className="bg-slate-900 rounded-[45px] p-10 text-white shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            {ranking.map((f, i) => (
              <div key={f.id} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 relative z-10">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${i === 0 ? 'bg-yellow-500 text-yellow-950' : 'bg-white/10'}`}>
                    {i + 1}
                  </span>
                  <span className="font-black text-sm uppercase italic tracking-tighter">{f.nombre}</span>
                </div>
                <span className="bg-blue-600 px-4 py-1 rounded-xl text-[10px] font-black">{f.puntos} PTS</span>
              </div>
            ))}
            <button onClick={() => navigate('/ranking')} className="w-full py-4 bg-white/5 hover:bg-white hover:text-slate-900 rounded-2xl font-black text-[10px] uppercase transition-all tracking-widest border border-white/5 relative z-10">
              Ver Tabla Completa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;