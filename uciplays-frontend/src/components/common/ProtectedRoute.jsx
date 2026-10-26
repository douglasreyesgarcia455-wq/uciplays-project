import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuth = localStorage.getItem('isAuth') === 'true';
    
    if (!isAuth) {
        // Si no está logueado, lo manda al login
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;