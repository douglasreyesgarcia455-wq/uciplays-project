// auth.api.js — Módulo de autenticación.
window.authApi = {
    login: (username, password) => window.apiClient.post('/auth/login', { username, password }),
    logout: async () => {
        try { await window.apiClient.post('/auth/logout', {}); } catch (e) {}
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    getToken: () => localStorage.getItem('token'),
    getUser: () => { try { return JSON.parse(localStorage.getItem('user')); } catch (e) { return null; } },
    setSession: (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },
    isLoggedIn: () => !!localStorage.getItem('token')
};

// Inyectar el tokenProvider en la fachada HTTP (bajo acoplamiento).
if (window.apiClient && typeof window.apiClient.setTokenProvider === 'function') {
    window.apiClient.setTokenProvider(() => localStorage.getItem('token'));
}
