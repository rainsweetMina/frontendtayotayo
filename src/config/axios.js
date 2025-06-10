import axios from 'axios';

// axios 기본 설정
axios.defaults.baseURL = 'https://localhost:8081';
axios.defaults.withCredentials = true;

// 요청 인터셉터
axios.interceptors.request.use(
  config => {
    // 여기에 토큰 등을 추가할 수 있습니다
    console.log('요청 URL:', config.url);
    console.log('요청 메소드:', config.method);
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
    // HTML 로그인 페이지가 반환되는 경우 감지
    if (response.headers['content-type']?.includes('text/html') && 
        response.data.includes('로그인')) {
      console.error('Received login page instead of API response');
      
      // 관리자 페이지인 경우 에러만 반환
      if (window.location.pathname.includes('/admin')) {
        return Promise.reject(new Error('Authentication required'));
      }
      
      // 다른 페이지에서는 로그인 페이지로 리다이렉트
      window.location.href = 'https://localhost:8081/auth/login';
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
    
    if (error.response?.status === 401) {
      // 인증 에러 처리
      console.log('401 Unauthorized');
      
      // 관리자 페이지인 경우 에러만 반환
      if (window.location.pathname.includes('/admin')) {
        return Promise.reject(new Error('Authentication required'));
      }
      
      // 다른 페이지에서는 로그인 페이지로 리다이렉트
      window.location.href = 'https://localhost:8081/auth/login';
    } else if (error.response?.status === 403) {
      // 권한 없음
      console.log('403 Forbidden');
      alert('권한이 없습니다.');
    }
    
    return Promise.reject(error);
  }
);

export default axios; 