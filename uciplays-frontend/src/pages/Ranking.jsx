import React, { useState, useEffect } from 'react';
import { getRanking } from '../services/api';
import { Trophy, Medal, Star, Target, TrendingUp } from 'lucide-react';

const Ranking = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getRanking();
        setRanking(data);
      } catch (err) {
        console.error("Error al cargar ranking:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const maxPuntos = ranking.length > 0 ? ranking[0].puntos : 1;

  if (loading) return <div className="text-center py-20 font-bold text-slate-400 animate-pulse">CARGANDO POSICIONES...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      {/* HEADER DE SECCIÓN */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
          Tabla de <span className="text-blue-600">Posiciones</span>
        </h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Copa Mella 2025 • Actualizado en tiempo real</p>
      </div>

      {/* PODIO DESTACADO (TOP 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pb-4">
        {ranking.slice(0, 3).map((f, i) => {
          const order = i === 0 ? 'order-2 mb-4' : i === 1 ? 'order-1' : 'order-3';
          const height = i === 0 ? 'h-48' : i === 1 ? 'h-36' : 'h-32';
          const color = i === 0 ? 'bg-blue-600' : 'bg-slate-800';
          const iconColor = i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : 'text-orange-400';

          return (
            <div key={f.id} className={`flex flex-col items-center gap-3 ${order}`}>
              <div className={`w-full ${height} ${color} rounded-3xl shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden group`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-white/10"></div>
                <Trophy className={`${iconColor} mb-2 group-hover:scale-110 transition-transform`} size={i === 0 ? 40 : 32} />
                <span className="font-black text-xl italic">{f.nombre}</span>
                <span className="text-xs font-bold opacity-70">{f.puntos} PTS</span>
              </div>
              <span className="text-[10px] font-black uppercase text-slate-400">{i + 1}º Lugar</span>
            </div>
          );
        })}
      </div>

      {/* TABLA DETALLADA */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Pos</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Facultad</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Rendimiento</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Puntos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ranking.map((f, i) => (
                <tr key={f.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-5">
                    <span className="font-black text-slate-300 group-hover:text-blue-600 transition-colors italic">#{i + 1}</span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
                        <Star size={14} />
                      </div>
                      <span className="font-bold text-slate-700 uppercase text-sm tracking-tight">{f.nombre}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center justify-end gap-3">
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden md:block">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${(f.puntos / maxPuntos) * 100}%` }}
                        ></div>
                      </div>
                      <TrendingUp size={14} className="text-slate-300" />
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <span className="inline-block px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg shadow-sm">
                      {f.puntos}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER DE INFORMACIÓN */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 p-5 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-4">
          <Medal className="text-blue-600" size={24} />
          <div>
            <p className="text-[10px] font-black uppercase text-blue-600 leading-none mb-1">Criterio de Victoria</p>
            <p className="text-xs text-blue-800 font-medium leading-tight">En caso de empate, la facultad con más medallas de oro lidera.</p>
          </div>
        </div>
        <div className="flex-1 p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
          <Target className="text-slate-400" size={24} />
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">Próxima Meta</p>
            <p className="text-xs text-slate-600 font-medium leading-tight">Quedan 12 encuentros oficiales por disputarse.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;