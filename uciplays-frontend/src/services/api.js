import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000/api',
});

export const getRanking = async () => {
    const response = await api.get('/ranking');
    return response.data;
};

export const getEventos = async () => {
    const response = await api.get('/eventos');
    return response.data;
};

export const createEvento = async (eventoData) => {
    const response = await api.post('/eventos', eventoData);
    return response.data;
};

export default api;