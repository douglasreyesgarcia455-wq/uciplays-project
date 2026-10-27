// api-client.js — Fachada HTTP (única fuente de verdad).
// Bajo acoplamiento: no lee localStorage directamente; el token se inyecta
// desde auth.api.js mediante setTokenProvider.

const API_BASE = '/api';

let _tokenProvider = () => null;
function setTokenProvider(fn) { if (typeof fn === 'function') _tokenProvider = fn; }

function getHeaders(extra) {
    const headers = Object.assign({ 'Accept': 'application/json' }, extra || {});
    const token = _tokenProvider();
    if (token) headers['Authorization'] = 'Bearer ' + token;
    return headers;
}

function manejar401(response) {
    if (response.status === 401) {
        try { localStorage.removeItem('token'); localStorage.removeItem('user'); } catch (e) {}
    }
}

async function get(path) {
    const response = await fetch(API_BASE + path, { headers: getHeaders() });
    if (!response.ok) {
        manejar401(response);
        const err = new Error('HTTP ' + response.status + ' requesting ' + path);
        err.status = response.status;
        throw err;
    }
    return response.json();
}

async function post(path, body) {
    const response = await fetch(API_BASE + path, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(body || {})
    });
    if (!response.ok) {
        manejar401(response);
        const err = new Error('HTTP ' + response.status + ' requesting ' + path);
        err.status = response.status;
        try { err.data = await response.json(); } catch (e) {}
        throw err;
    }
    return response.json();
}

async function put(path, body) {
    const response = await fetch(API_BASE + path, {
        method: 'PUT',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(body || {})
    });
    if (!response.ok) {
        manejar401(response);
        const err = new Error('HTTP ' + response.status + ' requesting ' + path);
        err.status = response.status;
        try { err.data = await response.json(); } catch (e) {}
        throw err;
    }
    return response.json();
}

async function del(path) {
    const response = await fetch(API_BASE + path, { method: 'DELETE', headers: getHeaders() });
    if (!response.ok) {
        manejar401(response);
        const err = new Error('HTTP ' + response.status + ' requesting ' + path);
        err.status = response.status;
        throw err;
    }
    return response.json();
}

window.apiClient = { get, post, put, delete: del, setTokenProvider };
