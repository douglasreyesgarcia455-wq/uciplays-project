import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Home, BarChart2, ShieldCheck, Zap } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Inicio', icon: Home },
    { path: '/ranking', label: 'Ranking', icon: BarChart2 },
    { path: '/login', label: 'Admin', icon: ShieldCheck },
  ];

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-2xl border-b border-white/10">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <Zap size={24} className="text-white fill-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">
            UCI <span className="text-blue-500">Plays</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 font-bold text-sm uppercase tracking-widest transition-colors ${
                  isActive ? 'text-blue-500' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;