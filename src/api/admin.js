import axios from '@/api/axiosInstance'

const BASE_URL = import.meta.env.VITE_APP_API_URL || 'https://localhost:8081'

// 일주일간의 응답 시간 데이터 조회
export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/metrics/response-time`)
    return response.data
  } catch (error) {
    console.error('주간 API 응답 데이터 조회 실패:', error)
    throw error
  }
}

// 시간별 응답 시간 데이터 조회
export const getApiResponseTimes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/metrics/response-time/hourly`)
    console.log('API 응답 시간 데이터 응답:', response.data)
    return response.data
  } catch (error) {
    console.error('API 응답 시간 데이터 조회 실패:', error)
    throw error
  }
} 

/**
 * 요청 처리량 데이터를 가져옵니다.
 * @returns {Promise<Array>} 시간별 요청 처리량 데이터
 */
export const getRequestVolume = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/metrics/request-volume/hourly`)
    console.log('요청 처리량 데이터 응답:', response.data)
    return response.data
  } catch (error) {
    console.error('요청 처리량 데이터 조회 실패:', error)
    // 백엔드 API가 아직 없을 경우 샘플 데이터 반환
    return [
      { time: '09:00', count: 120 },
      { time: '10:00', count: 145 },
      { time: '11:00', count: 168 },
      { time: '12:00', count: 132 },
      { time: '13:00', count: 157 },
      { time: '14:00', count: 189 },
      { time: '15:00', count: 201 }
    ]
  }
}

/**
 * 에러 발생 건수 데이터를 가져옵니다.
 * @returns {Promise<Array>} 시간별 에러 발생 건수 데이터
 */
export const getErrorCounts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/metrics/errors/hourly`)
    console.log('에러 발생 건수 데이터 응답:', response.data)
    return response.data
  } catch (error) {
    console.error('에러 발생 건수 데이터 조회 실패:', error)
    // 백엔드 API가 아직 없을 경우 샘플 데이터 반환
    return [
      { time: '09:00', count: 3 },
      { time: '10:00', count: 2 },
      { time: '11:00', count: 5 },
      { time: '12:00', count: 1 },
      { time: '13:00', count: 4 },
      { time: '14:00', count: 2 },
      { time: '15:00', count: 3 }
    ]
  }
}

/**
 * 관리자 대시보드용 게시글 통계를 가져옵니다.
 * @returns {Promise<Object>} 게시글 통계 정보
 */
export async function getPostsStats() {
  try {
    // 먼저 새 경로로 시도
    try {
      const response = await axios.get('/api/admin/stats/posts');
      return response.data;
    } catch (error) {
      // 실패하면 기존 모니터링 경로로 시도
      const response = await axios.get('/api/admin/monitoring/stats/posts');
      return response.data;
    }
  } catch (error) {
    console.error('게시글 통계 조회 중 오류 발생:', error);
    // 오류 발생 시 기본값 반환
    return {
      notices: { today: 0, total: 0 },
      qna: { today: 0, total: 0 },
      advertisements: { today: 0, total: 0 }
    };
  }
}

/**
 * 관리자 대시보드용 회원 통계를 가져옵니다.
 * @returns {Promise<Object>} 회원 통계 정보
 */
export const getUserStats = async () => {
  try {
    const response = await axios.get('/api/admin/stats/users')
    console.log('회원 통계 원본 응답:', JSON.stringify(response.data))
    
    // 증가율이 10%로 고정되어 있는 경우를 처리
    if (response.data.increaseRate === 10 && response.data.newUsersToday === 0) {
      console.log('증가율 10%와 오늘 가입 0명 감지, 증가율을 0으로 수정')
      response.data.increaseRate = 0
    }
    
    console.log('회원 통계 수정 후:', JSON.stringify(response.data))
    return response.data
  } catch (error) {
    console.error('회원 통계 조회 중 오류 발생:', error)
    // 기본 데이터 반환
    return {
      totalUsers: 1000,
      newUsersToday: 0,
      increaseRate: 0,
      usersByType: {
        USER: 850,
        BUS: 120,
        ADMIN: 30
      }
    }
  }
}

// 파일 다운로드 URL 테스트 함수
export const testFileDownloadUrls = async (noticeId) => {
  const testUrls = [
    `/api/admin/notices/${noticeId}/download`,
    `/api/admin/notices/download/${noticeId}`,
    `/api/admin/files/${noticeId}`,
    `/api/admin/notices/${noticeId}/file`,
    `/api/files/notice/${noticeId}`,
  ];
  
  console.log('Testing file download URLs for notice:', noticeId);
  
  for (const url of testUrls) {
    try {
      const response = await axios.head(url); // HEAD 요청으로 확인
      console.log(`✅ URL works: ${url}`, response.status);
      return url;
    } catch (error) {
      console.log(`❌ URL failed: ${url}`, error.response?.status);
    }
  }
  
  return null;
}; 