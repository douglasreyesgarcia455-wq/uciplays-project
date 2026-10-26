import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { X, TrendingUp, Info, Trophy } from 'lucide-react';

const DetalleEvento = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ev, setEv] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/eventos/${id}`);
        setEv(res.data);
      } catch (err) { console.error(err); }
    };
    fetch();
    const interval = setInterval(fetch, 5000); // Auto-actualizar cada 5 seg
    return () => clearInterval(interval);
  }, [id]);

  if (!ev) return <div className="h-screen flex items-center justify-center font-black animate-pulse">CARGANDO...</div>;

  const [facuA, facuB] = ev.enfrentamiento.split(' vs ');

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[50px] overflow-hidden shadow-2xl relative">
        <button onClick={() => navigate(-1)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-red-500 hover:text-white transition-all"><X/></button>
        
        <div className="p-10 text-center space-y-8">
          <div className="space-y-2">
            <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{ev.deporte}</span>
            <div className="flex items-center justify-center gap-6">
              <h2 className="text-4xl font-black italic uppercase text-slate-800">{facuA}</h2>
              <span className="text-xl font-black text-slate-300">VS</span>
              <h2 className="text-4xl font-black italic uppercase text-slate-800">{facuB}</h2>
            </div>
            <p className="text-slate-400 font-bold uppercase text-xs">{ev.lugar} — {ev.estado}</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between font-black text-sm px-2">
              <span className="text-blue-600">{ev.probabilidad}% WIN</span>
              <span className="text-slate-400">PROBABILIDAD</span>
              <span className="text-slate-900">{100 - ev.probabilidad}% WIN</span>
            </div>
            <div className="h-8 w-full bg-slate-100 rounded-2xl overflow-hidden flex border-4 border-slate-50">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000 ease-out" 
                style={{ width: `${ev.probabilidad}%` }}
              />
              <div 
                className="h-full bg-slate-800 transition-all duration-1000 ease-out" 
                style={{ width: `${100 - ev.probabilidad}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-6 rounded-3xl text-left">
              <TrendingUp className="text-blue-600 mb-2" size={20}/>
              <h4 className="text-[10px] font-black text-slate-400 uppercase">Estado actual</h4>
              <p className="font-bold text-slate-700">{ev.detalles || 'Sin incidencias reportadas'}</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl text-left">
              <Info className="text-blue-600 mb-2" size={20}/>
              <h4 className="text-[10px] font-black text-slate-400 uppercase">Impacto Ranking</h4>
              <p className="font-bold text-slate-700">Partida oficial Copa Mella 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleEvento;