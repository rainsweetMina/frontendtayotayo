// src/api/axiosInstance.js
import axios from 'axios'

// 기본 설정 상수
const BASE_URL = import.meta.env.VITE_BASE_URL || "https://docs.yi.or.kr:8096";
console.log("BASE_URL---->", BASE_URL)
const HTTPS_AGENT = {
    rejectUnauthorized: false
};

// JWT 토큰 관련 함수
const getJwtToken = () => {
    try {
        const token = localStorage.getItem('accessToken');
        console.log('[JWT] getJwtToken called, token:', token ? 'exists' : 'null');
        return token;
    } catch (e) {
        console.warn('[JWT] localStorage 접근 실패 (시크릿 모드일 수 있음):', e);
        return null;
    }
};
const getRefreshToken = () => {
    try {
        const token = localStorage.getItem('refreshToken');
        console.log('[JWT] getRefreshToken called, token:', token ? 'exists' : 'null');
        return token;
    } catch (e) {
        console.warn('[JWT] localStorage 접근 실패 (시크릿 모드일 수 있음):', e);
        return null;
    }
};
const saveTokens = (accessToken, refreshToken) => {
    try {
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
            console.log('[JWT] accessToken saved');
        }
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
            console.log('[JWT] refreshToken saved');
        }
    } catch (e) {
        console.warn('[JWT] localStorage 저장 실패 (시크릿 모드일 수 있음):', e);
    }
};
const removeTokens = () => {
    try {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        console.log('[JWT] tokens removed');
    } catch (e) {
        console.warn('[JWT] localStorage 삭제 실패 (시크릿 모드일 수 있음):', e);
    }
};

// 커스텀 인스턴스 생성 (axios 대신 이것만 사용)
const api = axios.create({
    baseURL: "/",
    withCredentials: true,
    httpsAgent: HTTPS_AGENT,
    timeout: 30000, // 30초 타임아웃 추가
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// 공개 API용 인스턴스 (토큰 없이 호출 가능)
const publicApi = axios.create({
    baseURL: "/",
    withCredentials: true,
    httpsAgent: HTTPS_AGENT,
    timeout: 30000, // 30초 타임아웃 추가
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// publicApi용 인터셉터 (토큰이 있으면 추가, 없어도 에러 없음)
publicApi.interceptors.request.use(
    config => {
        // 요청 URL이 /schedule로 시작하면 토큰 추가하지 않음
        if (config.url && config.url.startsWith('/schedule')) {
            console.log('[publicApi] /schedule 경로, 토큰 없이 호출:', config.url);
            return config;
        }
        // JWT 토큰이 있으면 헤더에 추가 (선택적)
        const accessToken = getJwtToken();
        if (accessToken && accessToken !== 'undefined' && accessToken !== 'null') {
            config.headers.Authorization = `Bearer ${accessToken}`;
            console.log('[publicApi] 토큰이 있어서 헤더에 추가:', config.url);
        } else {
            console.log('[publicApi] 토큰 없이 호출:', config.url);
        }
        // SSL 인증서 검증 비활성화 설정
        if (!config.httpsAgent) {
            config.httpsAgent = HTTPS_AGENT;
        }

        return config;
    },
    error => {
        console.error('publicApi 요청 인터셉터 오류:', error);
        return Promise.reject(error);
    }
);

// publicApi 응답 인터셉터 (에러 처리만, 리다이렉트 없음)
publicApi.interceptors.response.use(
    response => {
        // JWT 토큰이 응답 헤더에 있으면 저장
        const newAccessToken = response.headers['x-access-token'] || response.headers['X-Access-Token'];
        const newRefreshToken = response.headers['x-refresh-token'] || response.headers['X-Refresh-Token'];

        if (newAccessToken || newRefreshToken) {
            saveTokens(newAccessToken, newRefreshToken);
            console.log('[publicApi] ✅ 새로운 토큰이 저장되었습니다.');
        }

        // 로그인 페이지 HTML이 응답된 경우 감지 (리다이렉트 없이 에러만 반환)
        const isHtml = response.headers['content-type']?.includes('text/html');
        const isLoginPage = typeof response.data === 'string' && response.data.includes('로그인');
        
        // 공개 API 경로는 로그인 페이지 HTML 응답을 무시
        const isPublicApi = response.config?.url?.includes('/api/companies') || 
                           response.config?.url?.includes('/api/bus-info/') ||
                           response.config?.url?.includes('/api/bus/fare') ||
                           response.config?.url?.includes('/api/fares') ||
                           response.config?.url?.includes('/api/schedule') ||
                           response.config?.url?.includes('/api/notice') ||
                           response.config?.url?.includes('/api/route-nos') ||
                           response.config?.url?.includes('/api/route-notes') ||
                           response.config?.url?.includes('/api/route-id') ||
                           response.config?.url?.includes('/api/schedule-header') ||
                           response.config?.url?.includes('/api/route-map') ||
                           response.config?.url?.includes('/api/lowbus-scheduls') ||
                           response.config?.url?.includes('/api/auth/login') ||
                           response.config?.url?.includes('/api/auth/refresh') ||
                           response.config?.url?.includes('/api/auth/validate');
        
        if (isHtml && isLoginPage && !isPublicApi) {
            console.warn('[publicApi] 로그인 페이지 HTML이 반환됨 (비로그인 허용 페이지, 리다이렉트 없음)');
            return Promise.reject(new Error('로그인 필요'));
        }

        return response;
    },
    error => {
        // 에러 로깅만 하고 리다이렉트는 하지 않음
        const errorStatus = error.response?.status;
        const requestUrl = error.config?.url;

        if (errorStatus !== 404) {
            console.error('[publicApi] API 호출 실패:', {
                url: requestUrl,
                status: errorStatus,
                message: error.message
            });
        }

        return Promise.reject(error);
    }
);


api.multipartPost = async function({ url, dto, files, dtoKey = 'dto', fileKey = 'images' }) {
    console.log('🟡 url1----->:', url);
    console.log('🟡 dto31----->:', dto);
    console.log('🟡 files31----->:', files);
    console.log('🟡 dtoKey----->:', dtoKey);
    console.log('🟡 fileKey----->:', fileKey);
    
    const formData = new FormData();
    const blob = new Blob([JSON.stringify(dto)], { type: 'application/json' });
    formData.append(dtoKey, blob);
    if (Array.isArray(files)) {
        files.forEach(file => {
            if (file) formData.append(fileKey, file);
        });
    } else if (files) {
        formData.append(fileKey, files);
    }
    
    // FormData 내용 로깅
    console.log('🟡 FormData 내용:');
    for (let [key, value] of formData.entries()) {
        console.log(`🟡 ${key}:`, value);
    }
    
    // accessToken 사용으로 통일
    const token = getJwtToken();
    return api.post(url, formData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// PUT용 멀티파트 업로드 메서드 추가
api.multipartPut = async function({ url, dto, files, dtoKey = 'dto', fileKey = 'images' }) {

    console.log('🟡 url----->:', url);
    console.log('🟡 dto3----->:', dto);
    console.log('🟡 files3----->:', files);
    const formData = new FormData();
    const blob = new Blob([JSON.stringify(dto)], { type: 'application/json' });
    formData.append(dtoKey, blob);
    if (Array.isArray(files)) {
        files.forEach(file => {
            if (file) formData.append(fileKey, file);
        });
    } else if (files) {
        formData.append(fileKey, files);
    }
    console.log('🟡 formData----->:', formData);

    // accessToken 사용으로 통일
    const token = getJwtToken();
    return api.put(url, formData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// api 인스턴스에 대한 인터셉터 설정
// 요청 인터셉터
api.interceptors.request.use(
    config => {
        // 모바일 환경 감지
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        console.log('[api] 요청 시작:', {
            url: config.url,
            method: config.method,
            isMobile: isMobile,
            userAgent: navigator.userAgent.substring(0, 100) + '...'
        });

        // FormData 요청인지 확인
        const isFormData = config.data instanceof FormData;
        console.log('[api] FormData 요청 여부:', isFormData);

        // JWT 토큰을 헤더에 추가 (버스 관련 API는 토큰 없이도 허용)
        const isBusApi = config.url?.includes('/api/bus/');
        const accessToken = getJwtToken();
        
        if (accessToken && accessToken !== 'undefined' && accessToken !== 'null') {
            config.headers.Authorization = `Bearer ${accessToken}`;
            console.log('[JWT] Authorization header added to request:', config.url);
        } else if (isBusApi) {
            console.log('[JWT] Bus API - 토큰 없이 요청 진행:', config.url);
        } else {
            console.log('[JWT] No valid token found for request:', config.url);
        }

        // SSL 인증서 검증 비활성화 설정 재확인
        if (!config.httpsAgent) {
            config.httpsAgent = HTTPS_AGENT;
        }

        // FormData 요청일 때는 Content-Type을 완전히 제거 (브라우저가 자동으로 설정)
        if (isFormData) {
            console.log('[api] FormData 요청 - Content-Type 헤더 제거');
            delete config.headers['Content-Type'];
            delete config.headers['content-type'];
        } else {
            // 모바일 환경에서 추가 헤더 설정 (FormData가 아닌 경우에만)
            if (isMobile) {
                config.headers['User-Agent'] = navigator.userAgent;
                console.log('[api] 모바일 환경 감지, 추가 헤더 설정');
            }
        }

        return config;
    },
    error => {
        console.error('요청 인터셉터 오류:', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터
api.interceptors.response.use(
    response => {
        // JWT 토큰이 응답 헤더에 있으면 저장
        const newAccessToken = response.headers['x-access-token'] || response.headers['X-Access-Token'];
        const newRefreshToken = response.headers['x-refresh-token'] || response.headers['X-Refresh-Token'];

        if (newAccessToken || newRefreshToken) {
            saveTokens(newAccessToken, newRefreshToken);
            console.log('[api] ✅ 새로운 토큰이 저장되었습니다.');
        }

        // ✅ API 요청인데 로그인 페이지 HTML이 응답된 경우 감지
        const isApiRequest = response.config?.url?.startsWith('/api/');
        const isHtml = response.headers['content-type']?.includes('text/html');
        const isLoginPage = typeof response.data === 'string' && response.data.includes('로그인');

        if (isApiRequest && isHtml && isLoginPage) {
            const url = response.config?.url;
            const path = window.location.pathname;
            const isLoginRequest = url?.includes('/login');
            const isAdminPage = path.startsWith('/admin');
            const isPublicPage = path === '/' || path === '/main' || path.startsWith('/bus/map') || path.startsWith('/bus/search');

            if (isLoginRequest) {
                console.log('[api] [SKIP] 로그인 요청에 대한 HTML 응답 → 무시');
                return response;
            }

            console.error('[api] 🔒 로그인 페이지가 API 응답으로 반환됨');

            // ✅ 관리자 페이지는 리다이렉트 없이 에러 처리
            if (isAdminPage) {
                return Promise.reject(new Error('Authentication required'));
            }

            // ✅ 지도/검색 페이지도 리다이렉트 금지
            if (isPublicPage) {
                console.warn('[api] [SKIP] 비로그인 허용 페이지에서의 API HTML 응답 → 무시');
                return Promise.reject(new Error('Authentication required')); // 기능만 실패시키고 이동은 안 함
            }

            // ❌ 나머지는 로그인 페이지로 이동
            window.location.href = '/login';
            return Promise.reject(new Error('Authentication required'));
        }

        return response;
    },
    async error => {
        const errorStatus = error.response?.status;
        const requestUrl = error.config?.url;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        console.error('[api] API 호출 실패:', {
            url: requestUrl,
            status: errorStatus,
            message: error.message,
            isMobile: isMobile,
            code: error.code
        });

        // 모바일 환경에서 특별한 에러 처리
        if (isMobile) {
            if (error.message === 'Network Error') {
                console.error('[api] 모바일 네트워크 에러 - Wi-Fi 연결 확인 필요');
            } else if (error.code === 'ECONNABORTED') {
                console.error('[api] 모바일 타임아웃 에러 - 네트워크 상태 확인 필요');
            } else if (error.response?.status === 0) {
                console.error('[api] 모바일 연결 실패 - 서버에 연결할 수 없음');
            }
        }

        // 토큰 만료 시 갱신 시도
        if (errorStatus === 401) {
            const refreshToken = getRefreshToken();
            if (refreshToken && !error.config._retry) {
                error.config._retry = true;
                try {
                    const { data } = await api.post('/api/auth/refresh', { refreshToken });
                    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data;
                    saveTokens(newAccessToken, newRefreshToken);
                    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(error.config);
                } catch (refreshError) {
                    console.error('토큰 갱신 실패:', refreshError);
                    removeTokens();
                }
            }
        }

        // 401 에러 시 토큰 삭제 및 로그인 페이지로 리다이렉트
        if (errorStatus === 401) {
            console.log('인증 실패, 토큰 삭제 및 로그인 페이지로 이동')
            const path = window.location.pathname
            const isPublicPage = path === '/' || path === '/main' || path.startsWith('/bus/map') || path.startsWith('/bus/search')

            if (path.startsWith('/admin')) {
                if (window.location.pathname !== '/admin/login') {
                    window.location.href = '/admin/login'
                }
            } else if (!isPublicPage) {
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login'
                }
            } else {
                console.log('[api] 공개 페이지에서 401 에러 발생 - 리다이렉트 없이 에러만 처리')
            }
        }

        const status = error.response?.status;
        const originalRequest = error.config;
        const path = window.location.pathname;
        const isAdminPage = path.startsWith('/admin');
        const isPublicPage = path === '/' || path === '/main' || path.startsWith('/bus/map') || path.startsWith('/bus/search');

        // 401 Unauthorized 오류 처리 (토큰 만료)
        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.log('[api] 🔐 401 Unauthorized - 토큰 갱신 시도');

            // refreshToken을 사용하여 새로운 accessToken 요청
            const refreshToken = getRefreshToken();
            if (refreshToken && refreshToken !== 'undefined' && refreshToken !== 'null') {
                try {
                    console.log('[api] 🔄 RefreshToken을 사용하여 새로운 AccessToken 요청 중...');

                    const response = await api.post('/api/auth/refresh', {
                        refreshToken: refreshToken
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        _retry: true // 재시도 플래그 설정
                    });

                    const newAccessToken = response.data.accessToken;
                    const newRefreshToken = response.data.refreshToken;

                    if (newAccessToken) {
                        // 새 토큰 저장
                        saveTokens(newAccessToken, newRefreshToken);
                        console.log('[api] ✅ 새로운 AccessToken이 저장되었습니다.');

                        // 원래 요청을 새로운 토큰으로 재시도
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    console.error('[api] ❌ Token 갱신 실패:', refreshError);

                    // refreshToken도 만료된 경우 localStorage에서 토큰들 제거
                    removeTokens();

                    if (!isAdminPage && !isPublicPage) {
                        console.warn('[api] 401 응답 → /login 이동');
                        window.location.href = '/login';
                    }

                    return Promise.reject(refreshError);
                }
            } else {
                // 리프레시 토큰이 없는 경우
                if (!isAdminPage && !isPublicPage) {
                }
            }
        } else if (status === 403) {
            console.log('[api] 🚫 403 Forbidden - 권한 없음');
        }

        return Promise.reject(error);
    }
);

// api 객체 export
export { api, publicApi };

// 날씨 API 키 가져오기
export const getWeatherApiKey = async () => {
    try {
        const response = await api.get('/api/public/api-key');
        return response.data.apiKey;
    } catch (error) {
        console.error('날씨 API 키 가져오기 실패:', error);
        throw error;
    }
};

// 역지오코딩 API 함수 (좌표 → 주소)
export const reverseGeocode = async (lat, lon) => {
    try {
        // 좌표값을 적절한 소수점 자릿수로 반올림 (6자리)
        const roundedLat = Math.round(lat * 1000000) / 1000000;
        const roundedLon = Math.round(lon * 1000000) / 1000000;
        
        console.log(`역지오코딩 호출: 위도=${roundedLat}, 경도=${roundedLon}`);
        
        // 최대 2번까지 재시도
        let retries = 2;
        let lastError = null;

        while (retries >= 0) {
            try {
                const response = await api.get('/api/reverse-geocode', {
                    params: { lat: roundedLat, lon: roundedLon },
                    timeout: 3000 // 3초 타임아웃 설정
                });
                
                console.log('역지오코딩 성공:', response.data);
                console.log('응답 데이터 타입:', typeof response.data);
                console.log('응답 데이터 키들:', Object.keys(response.data || {}));
                console.log('응답 데이터 전체 내용:', JSON.stringify(response.data, null, 2));
                
                // 응답 데이터 구조 확인
                if (response.data) {
                    if (response.data.address) {
                        console.log('✅ 주소 정보 발견:', response.data.address);
                    } else {
                        console.log('❌ 주소 정보 없음 - address 필드가 없습니다');
                    }
                    
                    if (response.data.roadAddress) {
                        console.log('✅ 도로명 주소 발견:', response.data.roadAddress);
                    } else {
                        console.log('❌ 도로명 주소 없음 - roadAddress 필드가 없습니다');
                    }
                    
                    if (response.data.region1) {
                        console.log('✅ 지역1 발견:', response.data.region1);
                    } else {
                        console.log('❌ 지역1 없음 - region1 필드가 없습니다');
                    }
                } else {
                    console.log('❌ 응답 데이터가 null 또는 undefined입니다');
                }
                
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

        throw lastError || new Error('역지오코딩 API 호출 실패');
    } catch (error) {
        console.error('역지오코딩 API 호출 실패:', error);
        throw error;
    }
};

// 지오코딩 API 함수 (주소 → 좌표)
export const geocode = async (address) => {
    try {
        const response = await api.get('/api/geocode', {
            params: { q: address }, // 'address' 대신 'q' 파라미터 사용
            timeout: 3000
        });
        return response.data;
    } catch (error) {
        console.error('지오코딩 API 호출 실패:', error);
        throw error;
    }
};

// JSONP 방식으로 API 호출하는 함수
export const jsonpRequest = (url) => {
    return new Promise((resolve, reject) => {
        // 콜백 함수 이름 생성 (유니크한 이름)
        const callbackName = 'jsonpCallback_' + Math.round(100000 * Math.random());

        // 전역 콜백 함수 등록
        window[callbackName] = function(data) {
            // 스크립트 태그 제거
            document.body.removeChild(script);
            // 전역 콜백 함수 제거
            delete window[callbackName];
            // 데이터 반환
            resolve(data);
        };

        // 콜백 파라미터 추가
        const jsonpUrl = url + (url.includes('?') ? '&' : '?') + 'callback=' + callbackName;

        // 스크립트 태그 생성 및 추가
        const script = document.createElement('script');
        script.src = jsonpUrl;
        script.onerror = reject;
        document.body.appendChild(script);
    });
};

// 공공 데이터 포털 API 호출 함수 (CORS 우회)
export const callPublicApi = async (baseUrl, path, params, options = {}) => {
    try {
        // 기본 API 키 (이미 인코딩된 형식)
        const defaultApiKey = 'oDPMcPKGx7dsFyVw5YzReqSK07UuJoUrABe2dbwM7zt9yVfOjSlE7SQtdIir%2BEW%2BDWAcIvio0lm1rR2sMnW7iw%3D%3D';
        const apiKey = options.apiKey || defaultApiKey;

        // API 키가 이미 URL 인코딩되어 있는지 확인
        const isEncoded = apiKey.includes('%');

        // 파라미터에 API 키 추가 (이미 인코딩된 경우 그대로 사용)
        const queryParams = { ...params };

        // serviceKey 파라미터 설정 (이미 인코딩된 경우 encodeURIComponent 사용 안 함)
        if (isEncoded) {
            queryParams.serviceKey = apiKey;
        } else {
            queryParams.serviceKey = encodeURIComponent(apiKey);
        }

        // 응답 타입 확인 (기본값은 JSON)
        const responseType = options.responseType || queryParams.returnType || 'json';

        // 쿼리 문자열 생성 (serviceKey 제외)
        const queryString = Object.entries(queryParams)
            .map(([key, value]) => {
                // serviceKey는 이미 처리했으므로 별도 처리
                if (key === 'serviceKey') {
                    return `${key}=${value}`;
                }
                // 나머지 파라미터는 정상적으로 인코딩
                return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            })
            .join('&');

        // 전체 URL 생성
        const url = `${baseUrl}/${path}?${queryString}`;
        // console.log('생성된 원본 URL:', url);

        // CORS 프록시 서버 목록
        const corsProxies = [
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?',
            'https://cors-anywhere.herokuapp.com/',
            'https://thingproxy.freeboard.io/fetch/'
        ];

        // 첫 번째 시도는 직접 호출
        try {
            // console.log('직접 API 호출 시도:', url);
            const response = await fetch(url);
            const text = await response.text();

            // 응답 텍스트가 XML인지 확인
            const isXml = text.trim().startsWith('<');

            if (isXml) {
                console.log('XML 응답 감지됨, XML 처리 모드로 전환');

                // XML 응답인 경우, XML 파싱
                if (responseType.toLowerCase() === 'json') {
                    // XML을 JSON으로 변환 (간단한 변환)
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(text, 'text/xml');

                    // 오류 메시지 확인
                    const errorNode = xmlDoc.querySelector('errMsg');
                    if (errorNode && errorNode.textContent) {
                        console.warn('API 오류:', errorNode.textContent);
                        throw new Error(errorNode.textContent);
                    }

                    // 성공 응답인 경우 목업 데이터 반환
                    console.log('XML 응답을 목업 데이터로 대체');
                    return options.mockData || { items: [] };
                }

                // XML 응답을 그대로 반환
                return { xmlString: text };
            }

            try {
                // JSON 파싱 시도
                return JSON.parse(text);
            } catch (parseError) {
                console.warn('직접 호출 JSON 파싱 실패, 응답 텍스트:', text.substring(0, 100) + '...');
                throw parseError;
            }
        } catch (directError) {
            console.warn('직접 API 호출 실패, 프록시 시도:', directError);

            // 프록시 서버를 통한 호출 시도
            let lastError = directError;
            for (const proxy of corsProxies) {
                try {
                    console.log(`${proxy} 프록시 사용 시도`);

                    // 각 프록시 서버에 맞는 URL 형식 생성
                    let proxyUrl;
                    if (proxy.includes('allorigins')) {
                        // allorigins는 URL을 인코딩해야 함
                        proxyUrl = proxy + encodeURIComponent(url);
                    } else if (proxy.includes('corsproxy.io')) {
                        // corsproxy.io도 URL을 인코딩해야 함
                        proxyUrl = proxy + encodeURIComponent(url);
                    } else if (proxy.includes('cors-anywhere')) {
                        // cors-anywhere는 URL을 그대로 사용
                        proxyUrl = proxy + url;
                    } else {
                        // 기타 프록시(thingproxy 등)는 URL을 그대로 사용
                        proxyUrl = proxy + url;
                    }

                    console.log('프록시 URL:', proxyUrl);
                    const response = await fetch(proxyUrl);
                    const text = await response.text();

                    // 응답 텍스트가 XML인지 확인
                    const isXml = text.trim().startsWith('<');

                    if (isXml) {
                        console.log('XML 응답 감지됨, XML 처리 모드로 전환');

                        // XML 응답인 경우, XML 파싱
                        if (responseType.toLowerCase() === 'json') {
                            // XML을 JSON으로 변환 (간단한 변환)
                            const parser = new DOMParser();
                            const xmlDoc = parser.parseFromString(text, 'text/xml');

                            // 오류 메시지 확인
                            const errorNode = xmlDoc.querySelector('errMsg');
                            if (errorNode && errorNode.textContent) {
                                console.warn('API 오류:', errorNode.textContent);
                                throw new Error(errorNode.textContent);
                            }

                            // 성공 응답인 경우 목업 데이터 반환
                            console.log('XML 응답을 목업 데이터로 대체');
                            return options.mockData || { items: [] };
                        }

                        // XML 응답을 그대로 반환
                        return { xmlString: text };
                    }

                    try {
                        // JSON 파싱 시도
                        return JSON.parse(text);
                    } catch (parseError) {
                        console.warn('JSON 파싱 실패, 응답 텍스트:', text.substring(0, 100) + '...');
                        throw parseError;
                    }
                } catch (proxyError) {
                    console.warn(`${proxy} 프록시 호출 실패:`, proxyError);
                    lastError = proxyError;
                    // 다음 프록시 시도
                    continue;
                }
            }

            // 모든 프록시 시도 실패
            throw lastError;
        }
    } catch (error) {
        console.error('공공 API 호출 실패:', error);
        throw error;
    }
};

// CORS 테스트 함수
export const testCors = async () => {
    try {
        console.log('🔧 CORS 테스트 시작...');
        const response = await publicApi.get('/api/cors-test');
        console.log('🔧 CORS 테스트 성공:', response.data);
        return response.data;
    } catch (error) {
        console.error('🔧 CORS 테스트 실패:', error);
        throw error;
    }
};

// default export도 함께 제공하여 기존 코드와의 호환성 유지
export default api;
