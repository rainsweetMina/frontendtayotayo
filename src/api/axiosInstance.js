// src/api/axiosInstance.js
import axios from 'axios'

const api = axios.create({
    baseURL: 'https://localhost:8081',
    withCredentials: true // ✅ 세션 인증 유지에 필요
})

// ✅ Request 인터셉터: accessToken을 자동으로 헤더에 추가
api.interceptors.request.use(
    config => {
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

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
            url?.includes('/login') || url?.startsWith('/login')

        // ✅ 여기에 예외 URL 리스트 정의
        const EXCLUDE_REDIRECT_URLS = [
            '/api/user/info',
            '/api/mypage/favorite/bus-stop'
        ]
        const shouldSkipLoginRedirect = EXCLUDE_REDIRECT_URLS.some(ex => url?.includes(ex))

        // console.warn('[axiosInstance.js] 응답 URL:', url)
        // console.warn('[axiosInstance.js] path:', path)
        // console.warn('[axiosInstance.js] isAdmin:', isAdmin)
        // console.warn('[axiosInstance.js] isPublic:', isPublic)
        // console.warn('[axiosInstance.js] isLoginRequest:', isLoginRequest)
        // console.warn('[axiosInstance.js] contentType:', contentType)
        // console.warn('[axiosInstance.js] data:', response.data?.slice?.(0, 100))

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

// 역지오코딩 API 함수 추가 (좌표 → 주소)
export const reverseGeocode = async (lat, lon) => {
    try {
        // 최대 2번까지 재시도
        let retries = 2;
        let lastError = null;
        
        while (retries >= 0) {
            try {
                const response = await api.get('/api/reverse-geocode', {
                    params: { lat, lon },
                    timeout: 3000 // 3초 타임아웃 설정
                });
                return response.data;
            } catch (error) {
                lastError = error;
                console.warn(`역지오코딩 API 호출 실패 (남은 재시도: ${retries}):`, error);
                retries--;
                
                // 서버 오류(5xx)인 경우에만 재시도
                if (!error.response || error.response.status < 500) {
                    break;
                }
                
                // 재시도 전 잠시 대기
                if (retries >= 0) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
        
        // 모든 재시도 실패 시 오류 발생
        throw lastError || new Error('역지오코딩 API 호출 실패');
    } catch (error) {
        console.error('역지오코딩 API 호출 실패:', error);
        
        // 간결한 메시지를 포함한 기본 응답 반환
        return {
            error: true,
            display_name: '주소 정보 없음',
            lat,
            lon,
            address: {
                state: '주소 정보 없음',
                city: ''
            }
        };
    }
};

// 정방향 지오코딩 API 함수 추가 (주소 → 좌표)
export const geocode = async (address) => {
    try {
        const response = await api.get('/api/geocode', {
            params: { q: address, limit: 1 }
        });
        return response.data;
    } catch (error) {
        console.error('정방향 지오코딩 API 호출 실패:', error);
        throw error;
    }
};

export default api
