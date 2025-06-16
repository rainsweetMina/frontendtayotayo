import axios from 'axios';

// axios 기본 설정
axios.defaults.baseURL = 'https://localhost:8081';
axios.defaults.withCredentials = true;

// 요청 인터셉터
axios.interceptors.request.use(
    config => {
        // 여기에 토큰 등을 추가할 수 있습니다
        // console.log('요청 URL:', config.url);
        // console.log('요청 메소드:', config.method);
        return config;
    },
    error => {
        console.error('요청 인터셉터 오류:', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터
axios.interceptors.response.use(
    response => {
        // ✅ API 요청인데 로그인 페이지 HTML이 응답된 경우 감지
        const isApiRequest = response.config?.url?.startsWith('/api/');
        const isHtml = response.headers['content-type']?.includes('text/html');
        const isLoginPage = typeof response.data === 'string' && response.data.includes('로그인');

        if (isApiRequest && isHtml && isLoginPage) {
            const url = response.config?.url;
            const path = window.location.pathname;
            const isLoginRequest = url?.includes('/auth/login');
            const isAdminPage = path.startsWith('/admin');
            const isPublicPage = path.startsWith('/bus/map') || path.startsWith('/bus/search');

            if (isLoginRequest) {
                console.log('[SKIP] 로그인 요청에 대한 HTML 응답 → 무시');
                return response;
            }

            console.error('🔒 로그인 페이지가 API 응답으로 반환됨');

            // ✅ 관리자 페이지는 리다이렉트 없이 에러 처리
            if (isAdminPage) {
                return Promise.reject(new Error('Authentication required'));
            }

            // ✅ 지도/검색 페이지도 리다이렉트 금지
            if (isPublicPage) {
                console.warn('[SKIP] 비로그인 허용 페이지에서의 API HTML 응답 → 무시');
                return Promise.reject(new Error('Authentication required')); // 기능만 실패시키고 이동은 안 함
            }

            // ❌ 나머지는 로그인 페이지로 이동
            window.location.href = '/login';
            return Promise.reject(new Error('Authentication required'));
        }

        return response;
    },
    error => {
        console.error('Axios 오류:', error.message);

        if (error.response) {
            console.error('오류 상태:', error.response.status);
            console.error('오류 데이터:', error.response.data);
            console.error('오류 헤더:', error.response.headers);
        } else if (error.request) {
            console.error('요청은 만들어졌으나 응답을 받지 못했습니다:', error.request);
        } else {
            console.error('오류 설정:', error.config);
        }

        const status = error.response?.status;

        if (status === 401) {
            console.log('🔐 401 Unauthorized');

            if (window.location.pathname.includes('/admin')) {
                return Promise.reject(new Error('Authentication required'));
            }

            // window.location.href = '/login';
        } else if (status === 403) {
            console.log('🚫 403 Forbidden');
            // alert('권한이 없습니다.');
        }

        return Promise.reject(error);
    }
);

export default axios;