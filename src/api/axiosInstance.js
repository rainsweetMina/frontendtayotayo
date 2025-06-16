// src/api/axiosInstance.js
import axios from 'axios'

const api = axios.create({
    baseURL: '/',
    withCredentials: true
})

// 여기에 인터셉터 명시적으로 붙이기 -> (/bus/map에 필요)
api.interceptors.response.use(
    response => {
        const contentType = response.headers['content-type']
        const isHtml = contentType?.includes('text/html')
        const isLoginHtml = typeof response.data === 'string' && response.data.includes('로그인')

        const path = window.location.pathname
        const isAdmin = path.includes('/admin')
        const isPublic = path.startsWith('/bus/map') || path.startsWith('/bus/search')
        const isLoginPage = path === '/login'

        if (isHtml && isLoginHtml && !isAdmin && !isPublic && !isLoginPage) {
            window.location.href = '/login'
            return Promise.reject(new Error('Authentication required'))
        }

        return response
    },
    error => {
        const status = error?.response?.status
        const path = window.location.pathname
        const isAdmin = path.includes('/admin')
        const isPublic = path.startsWith('/bus/map') || path.startsWith('/bus/search')
        const isLoginPage = path === '/login'

        if (status === 401 && !isAdmin && !isPublic && !isLoginPage) {
            window.location.href = '/login'
        }

        return Promise.reject(error)
    }
)


export default api
