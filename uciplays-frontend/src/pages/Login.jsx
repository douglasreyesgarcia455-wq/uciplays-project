import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck, AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  
  // Estado para capturar lo que el usuario escribe
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  
  // Estado para mostrar errores si se equivoca
  const [error, setError] = useState('');

  // ESTA ES LA FUNCIÓN QUE TE FALTABA
  const handleLogin = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    
    // Validación manual de las credenciales
    if (credentials.username === 'admin' && credentials.password === 'uci2025') {
      localStorage.setItem('isAuth', 'true'); // Guardamos el permiso en el navegador
      navigate('/admin'); // Saltamos al panel de administrador
    } else {
      setError('Usuario o contraseña incorrectos'); // Mostramos el error en rojo
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="bg-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Panel de Control</h1>
          <p className="text-slate-500 font-medium">Solo personal autorizado</p>
        </div>

        {/* El "onSubmit" conecta el formulario con nuestra función */}
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold flex items-center gap-2 border border-red-100">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 uppercase">Usuario</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
              placeholder="Ej: admin"
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 uppercase">Contraseña</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
              placeholder="••••••••"
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-900 text-white py-4 rounded-xl font-black text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <LogIn size={20} /> Acceder al Sistema
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;