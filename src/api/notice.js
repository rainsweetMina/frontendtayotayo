import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:8081/api/notice',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
});

export default {
    getAll: () => api.get('/'),
    getOne: (id) => api.get(`/${id}`),
    create: (formData) => api.post('/', formData),
    update: (id, formData) => api.put(`/${id}`, formData),
    remove: (id) => api.delete(`/${id}`),
};
