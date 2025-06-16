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
        const url = response.config?.url

        const isAdmin = path.startsWith('/admin')
        const isPublic = path.startsWith('/bus/map') || path.startsWith('/bus/search')
        const isLoginRequest =
            url?.includes('/auth/login') || url?.includes('auth/login') || url?.endsWith('/auth/login')

        // ✅ 여기에 예외 URL 리스트 정의
        const EXCLUDE_REDIRECT_URLS = [
            '/api/user/info',
            '/api/mypage/favorite/bus-stop'
        ]
        const shouldSkipLoginRedirect = EXCLUDE_REDIRECT_URLS.some(ex => url?.includes(ex))

        console.warn('[axiosInstance.js] 응답 URL:', url)
        console.warn('[axiosInstance.js] path:', path)
        console.warn('[axiosInstance.js] isAdmin:', isAdmin)
        console.warn('[axiosInstance.js] isPublic:', isPublic)
        console.warn('[axiosInstance.js] isLoginRequest:', isLoginRequest)
        console.warn('[axiosInstance.js] contentType:', contentType)
        console.warn('[axiosInstance.js] data:', response.data?.slice?.(0, 100))

        // ✅ 핵심 조건: 로그인 페이지 응답인데 제외 URL이 아니면 → 리다이렉트
        if (isHtml && isLoginHtml && !isAdmin && !isPublic && !isLoginRequest && !shouldSkipLoginRedirect) {
            console.warn('[axiosInstance.js] 로그인 페이지 감지 → /login 이동')
            window.location.href = '/login'
            return Promise.reject(new Error('Authentication required'))
        }

        return response
    },
    error => {
        const status = error?.response?.status
        const path = window.location.pathname
        const isAdmin = path.startsWith('/admin')
        const isPublic = path.startsWith('/bus/map') || path.startsWith('/bus/search')

        if (status === 401 && !isAdmin && !isPublic) {
            console.warn('[axiosInstance.js] 401 응답 → /login 이동')
            window.location.href = '/login'
        }

        return Promise.reject(error)
    }
)


export default api
