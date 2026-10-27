// api-client.js — Fachada sobre fetch (única fuente de verdad para HTTP)
// Sin console.log. Sin lógica de negocio.

const API_BASE = '/api';

async function get(path) {
  const response = await fetch(API_BASE + path, {
    headers: { 'Accept': 'application/json' }
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} requesting ${path}`);
  }
  return response.json();
}

async function post(path, body) {
  const response = await fetch(API_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} requesting ${path}`);
  }
  return response.json();
}

window.apiClient = { get, post };
