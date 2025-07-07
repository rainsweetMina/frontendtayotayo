import api from '@/api/axiosInstance'


export default {
    getAll: (page = 0, size = 10) => api.get('/', {
        params: { page, size }
    }),
    getOne: (id) => api.get(`/${id}`),
    create: (formData) => api.post('/', formData),
    update: (id, formData) => api.put(`/${id}`, formData),
    remove: (id) => api.delete(`/${id}`),
    downloadFile: (noticeId, fileIndex) => api.get(`/${noticeId}/files/${fileIndex}`, {
        responseType: 'blob'
    }),
    downloadSingleFile: (noticeId) => api.get(`/${noticeId}/download`, {
        responseType: 'blob'
    })
};
