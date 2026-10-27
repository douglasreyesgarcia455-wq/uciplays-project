// api-client.js — Fachada sobre fetch (única fuente de verdad para HTTP).
// Envía Authorization: Bearer <token> si hay token en localStorage.

const API_BASE = '/api';

function getHeaders(extra) {
    const headers = Object.assign({ 'Accept': 'application/json' }, extra || {});
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = 'Bearer ' + token;
    return headers;
}

async function get(path) {
    const response = await fetch(API_BASE + path, { headers: getHeaders() });
    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
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
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
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
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
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
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        const err = new Error('HTTP ' + response.status + ' requesting ' + path);
        err.status = response.status;
        throw err;
    }
    return response.json();
}

window.apiClient = { get, post, put, delete: del };
