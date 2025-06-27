import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:8081/api/notices',
});

// 요청 인터셉터 추가
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 추가
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // 인증 오류 시 로그인 페이지로 리다이렉트
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

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
