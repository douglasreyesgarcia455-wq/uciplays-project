import React from 'react';
import { MapPin, Clock, Calendar } from 'lucide-react';

const EventCard = ({ event }) => {
  const statusConfig = {
    'En Vivo': 'bg-red-600 text-white border-red-200 animate-pulse',
    'Pendiente': 'bg-blue-100 text-blue-800 border-blue-200',
    'Finalizado': 'bg-slate-800 text-white border-slate-700'
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-uci-gold hover:shadow-xl transition-all duration-300 group overflow-hidden">
      {/* Cabecera de la Card */}
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <span className="text-xs font-black text-uci-blue uppercase tracking-tighter">
          {event.discipline}
        </span>
        <span className={`text-[10px] px-2.5 py-1 rounded-md font-black uppercase tracking-widest border ${statusConfig[event.status]}`}>
          {event.status}
        </span>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center w-5/12">
            <div className="w-12 h-12 bg-slate-100 rounded-full mx-auto mb-2 flex items-center justify-center font-black text-slate-400">F</div>
            <p className="font-black text-slate-900 text-sm leading-tight">{event.teamA}</p>
          </div>
          
          <div className="w-2/12 flex flex-col items-center">
            <span className="text-uci-gold font-black italic text-lg">VS</span>
          </div>

          <div className="text-center w-5/12">
            <div className="w-12 h-12 bg-slate-100 rounded-full mx-auto mb-2 flex items-center justify-center font-black text-slate-400">F</div>
            <p className="font-black text-slate-900 text-sm leading-tight">{event.teamB}</p>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="flex items-center text-xs font-bold text-slate-500">
            <Calendar size={14} className="mr-2 text-uci-accent" />
            {event.date} • {event.time}
          </div>
          <div className="flex items-center text-xs font-bold text-slate-500">
            <MapPin size={14} className="mr-2 text-uci-accent" />
            {event.location}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;